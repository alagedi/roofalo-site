import { NextRequest, NextResponse } from "next/server";

// Handles inbound SMS to +17162000707 via Telnyx messaging webhook.
// When someone texts the Roofalo number, they get an instant reply
// and you get an SMS notification so you can follow up.

const FROM = process.env.TELNYX_FROM ?? "";
const OWNER_PHONE = process.env.OWNER_NOTIFY_PHONE ?? "";
const TELNYX_KEY = process.env.TELNYX_API_KEY ?? "";
const PROFILE_ID = process.env.TELNYX_MESSAGING_PROFILE_ID ?? "";

async function sendSMS(to: string, text: string) {
  if (!TELNYX_KEY || !FROM) return;
  const body: Record<string, string> = { from: FROM, to, text };
  if (PROFILE_ID) body.messaging_profile_id = PROFILE_ID;
  try {
    await fetch("https://api.telnyx.com/v2/messages", {
      method: "POST",
      headers: { Authorization: `Bearer ${TELNYX_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // non-blocking
  }
}

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    const type = event?.data?.event_type;

    // Only handle inbound messages
    if (type !== "message.received") {
      return NextResponse.json({ ok: true });
    }

    const msg = event.data.payload;
    const from: string = msg?.from?.phone_number ?? "";
    const text: string = (msg?.text ?? "").trim();

    if (!from) return NextResponse.json({ ok: true });

    // Auto-reply to the person who texted in
    const reply =
      `Hi! Thanks for reaching out to Roofalo. 🏠\n\n` +
      `To book your free roof inspection, visit roofalo.com or call/text us at (716) 200-0707 ` +
      `and we'll get you on the schedule right away.\n\n` +
      `A team member will follow up with you shortly!`;

    // Notify owner with the inbound message
    const ownerAlert =
      `📱 Inbound text to Roofalo:\nFrom: ${from}\nMessage: "${text.slice(0, 120)}"\n\nReply to them at: ${from}`;

    await Promise.allSettled([
      sendSMS(from, reply),
      OWNER_PHONE ? sendSMS(OWNER_PHONE, ownerAlert) : Promise.resolve(),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[Telnyx webhook]", e);
    return NextResponse.json({ ok: true }); // always 200 to Telnyx
  }
}
