import { NextRequest, NextResponse } from "next/server";

// Proxies a Google Static Maps satellite image so the API key never reaches the browser.
export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lng = req.nextUrl.searchParams.get("lng");
  const zoom = req.nextUrl.searchParams.get("zoom") ?? "20";
  const key = process.env.GOOGLE_MAPS_API_KEY;

  if (!lat || !lng || !key) return new NextResponse(null, { status: 404 });

  const url =
    `https://maps.googleapis.com/maps/api/staticmap` +
    `?center=${lat},${lng}&zoom=${zoom}&size=640x480&scale=2&maptype=satellite&key=${key}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return new NextResponse(null, { status: 502 });
    const buf = await res.arrayBuffer();
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
