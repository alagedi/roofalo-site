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
  squares: number;
  center: GeocodingResult | null;
}

const SQ_FT_PER_M2 = 10.7639;

interface RoofSegment {
  pitchDegrees?: number;
  stats?: { areaMeters2?: number };
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
  const url = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${GOOGLE_MAPS_API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    const sp = data.solarPotential;
    const segments: RoofSegment[] = sp?.roofSegmentStats ?? [];
    if (!segments.length) return null;

    // Filter out noise segments smaller than ~2 m² (≈21 ft²)
    const real = segments.filter((s) => (s.stats?.areaMeters2 ?? 0) >= 2);
    const usable = real.length ? real : segments;

    // Roof area: prefer Google's authoritative whole-roof total (actual sloped
    // surface, accounting for pitch). Fall back to summing segment areas.
    const wholeAreaM2: number = sp?.wholeRoofStats?.areaMeters2
      ?? usable.reduce((sum, s) => sum + (s.stats?.areaMeters2 ?? 0), 0);
    const areaSqFt = Math.round(wholeAreaM2 * SQ_FT_PER_M2);

    // Pitch: area-weighted average across real segments (more accurate than a
    // plain mean, which lets tiny flat segments skew the result).
    const weightTotal = usable.reduce((sum, s) => sum + (s.stats?.areaMeters2 ?? 0), 0);
    const weightedPitch = weightTotal
      ? usable.reduce((sum, s) => sum + (s.pitchDegrees ?? 0) * (s.stats?.areaMeters2 ?? 0), 0) / weightTotal
      : 25;
    const rise = Math.round(Math.tan((weightedPitch * Math.PI) / 180) * 12);
    const pitch = `${Math.max(1, Math.min(rise, 12))}:12`;

    // Building center (more accurate than the geocoded street point for imagery).
    const center: GeocodingResult | null = data.center
      ? { lat: data.center.latitude, lng: data.center.longitude }
      : null;

    return {
      areaSqFt,
      facets: usable.length,
      pitch,
      squares: Math.round((areaSqFt / 100) * 10) / 10, // roofing "squares" (100 ft² each)
      center,
    };
  } catch {
    return null;
  }
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

    const solar = await getSolarInsights(geo.lat, geo.lng);

    // Center imagery on the building footprint when Solar gives us one;
    // otherwise on the geocoded street point. Image is served via our proxy
    // so the API key is never exposed to the browser.
    const imgCenter = solar?.center ?? geo;
    const imageUrl = `/api/roof-image?lat=${imgCenter.lat}&lng=${imgCenter.lng}`;

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
      squares: solar.squares,
      low,
      high,
      imageUrl,
      lat: imgCenter.lat,
      lng: imgCenter.lng,
    });
  } catch {
    return NextResponse.json({ measured: false });
  }
}
