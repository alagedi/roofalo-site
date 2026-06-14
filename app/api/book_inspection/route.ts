import { NextRequest, NextResponse } from "next/server";
import { bookSlot } from "@/lib/calcom";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, slot_id, address, town, service_type, urgency, notes } = body;

    if (!name || !phone || !slot_id) {
      return NextResponse.json({ booking_status: "failed", message: "Missing name, phone, or slot." });
    }

    const fullAddress = [address, town].filter(Boolean).join(", ");
    const noteText = [
      notes,
      service_type ? `Service: ${service_type}` : "",
      urgency ? `Urgency: ${urgency}` : "",
    ].filter(Boolean).join(" | ");

    const result = await bookSlot({
      slotISO: slot_id,
      name,
      phone,
      notes: noteText,
      metadata: { address: fullAddress, source: "retell-voice" },
    });

    if (!result.success) {
      return NextResponse.json({
        booking_status: "failed",
        message: "I wasn't able to lock that slot in — let me get someone to follow up with you.",
      });
    }

    // Save to Airtable and notify owner in background
    void persistAndNotify({ name, phone, address: fullAddress, slot_id, noteText });

    return NextResponse.json({
      booking_status: "booked",
      booking_id: result.bookingId,
      message: `Perfect — you're booked! We'll see you at ${fullAddress}. You'll get a text confirmation shortly.`,
    });
  } catch {
    return NextResponse.json({ booking_status: "failed", message: "Something went wrong on our end." }, { status: 200 });
  }
}

async function persistAndNotify(data: {
  name: string; phone: string; address: string; slot_id: string; noteText: string;
}) {
  const when = new Date(data.slot_id).toLocaleString("en-US", {
    timeZone: "America/New_York", weekday: "short", month: "short",
    day: "numeric", hour: "numeric", minute: "2-digit",
  }) + " ET";

  const airtableKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE ?? "Leads";
  if (airtableKey && baseId) {
    fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${airtableKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          Name: data.name, Phone: data.phone, Address: data.address,
          "Requested Time": when, Notes: data.noteText,
          Source: "retell-voice", "Created At": new Date().toISOString(),
        },
      }),
    }).catch(() => {});
  }

  // SMS owner
  const apiKey = process.env.TELNYX_API_KEY;
  const from = process.env.TELNYX_FROM;
  const ownerPhone = process.env.OWNER_NOTIFY_PHONE;
  const profileId = process.env.TELNYX_MESSAGING_PROFILE_ID;
  if (apiKey && from && ownerPhone) {
    const smsBody: Record<string, string> = {
      from, to: ownerPhone,
      text: `New Roofalo booking (via call)!\n${data.name} · ${data.phone}\n${data.address}\n${when}`,
    };
    if (profileId) smsBody.messaging_profile_id = profileId;
    fetch("https://api.telnyx.com/v2/messages", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(smsBody),
    }).catch(() => {});
  }
}
