import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 3) return NextResponse.json([]);

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return NextResponse.json([]);

  try {
    const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
    url.searchParams.set("input", q);
    url.searchParams.set("key", key);
    url.searchParams.set("components", "country:us");
    url.searchParams.set("types", "address");

    const res = await fetch(url.toString());
    const data = await res.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      return NextResponse.json([]);
    }

    const suggestions = (data.predictions ?? []).slice(0, 5).map((p: { description: string; place_id: string }) => ({
      label: p.description,
      placeId: p.place_id,
    }));

    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json([]);
  }
}
