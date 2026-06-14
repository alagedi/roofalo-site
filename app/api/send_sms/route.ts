import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { phone, when, address } = await req.json();
    if (!phone) return NextResponse.json({ ok: false });

    const apiKey = process.env.TELNYX_API_KEY;
    const from = process.env.TELNYX_FROM;
    const profileId = process.env.TELNYX_MESSAGING_PROFILE_ID;
    if (!apiKey || !from) return NextResponse.json({ ok: true }); // silent skip

    const text = `Roofalo confirmed your free inspection!\n📅 ${when ?? "TBD"}${address ? `\n📍 ${address}` : ""}\nQuestions? Call or text (716) 200-0707`;

    const body: Record<string, string> = { from, to: phone, text };
    if (profileId) body.messaging_profile_id = profileId;

    const res = await fetch("https://api.telnyx.com/v2/messages", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[send_sms] Telnyx error:", res.status, err);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[send_sms] exception:", e);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
