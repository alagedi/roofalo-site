import { NextRequest, NextResponse } from "next/server";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const LOW_RATE = parseFloat(process.env.ROOF_PRICE_LOW_PER_SQFT ?? "4.6");
const HIGH_RATE = parseFloat(process.env.ROOF_PRICE_HIGH_PER_SQFT ?? "7.2");

interface GeocodingResult {
  lat: number;
  lng: number;
}

interface SolarInsights {
  areaSqFt: number;
  facets: number;
  pitch: string;
}

async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  if (!GOOGLE_MAPS_API_KEY) return null;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status !== "OK" || !data.results[0]) return null;
    return data.results[0].geometry.location;
  } catch {
    return null;
  }
}

async function getSolarInsights(lat: number, lng: number): Promise<SolarInsights | null> {
  if (!GOOGLE_MAPS_API_KEY) return null;
  const url = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=MEDIUM&key=${GOOGLE_MAPS_API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    const roofSegments = data.solarPotential?.roofSegmentStats ?? [];
    if (!roofSegments.length) return null;

    const totalAreaM2: number = roofSegments.reduce((sum: number, seg: { stats?: { areaMeters2?: number } }) => {
      return sum + (seg.stats?.areaMeters2 ?? 0);
    }, 0);
    const areaSqFt = Math.round(totalAreaM2 * 10.764);

    const pitchValues: number[] = roofSegments
      .map((seg: { pitchDegrees?: number }) => seg.pitchDegrees ?? 0)
      .filter((p: number) => p > 0);
    const avgPitchDeg = pitchValues.length
      ? pitchValues.reduce((a: number, b: number) => a + b, 0) / pitchValues.length
      : 30;
    const rise = Math.round(Math.tan((avgPitchDeg * Math.PI) / 180) * 12);
    const pitch = `${Math.max(2, Math.min(rise, 12))}:12`;

    return { areaSqFt, facets: roofSegments.length, pitch };
  } catch {
    return null;
  }
}

async function getStaticMapUrl(lat: number, lng: number): Promise<string | null> {
  if (!GOOGLE_MAPS_API_KEY) return null;
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=19&size=600x450&maptype=satellite&key=${GOOGLE_MAPS_API_KEY}`;
}

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    if (!address || typeof address !== "string") {
      return NextResponse.json({ error: "address required" }, { status: 400 });
    }

    const geo = await geocodeAddress(address);
    if (!geo) {
      return NextResponse.json({ measured: false });
    }

    const [solar, imageUrl] = await Promise.all([
      getSolarInsights(geo.lat, geo.lng),
      getStaticMapUrl(geo.lat, geo.lng),
    ]);

    if (!solar) {
      return NextResponse.json({ measured: false, imageUrl, lat: geo.lat, lng: geo.lng });
    }

    const low = Math.round((solar.areaSqFt * LOW_RATE) / 100) * 100;
    const high = Math.round((solar.areaSqFt * HIGH_RATE) / 100) * 100;

    return NextResponse.json({
      measured: true,
      areaSqFt: solar.areaSqFt,
      facets: solar.facets,
      pitch: solar.pitch,
      low,
      high,
      imageUrl,
      lat: geo.lat,
      lng: geo.lng,
    });
  } catch {
    return NextResponse.json({ measured: false });
  }
}
