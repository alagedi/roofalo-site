import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, address, town, type, summary, urgency, reason } = await req.json();

    const airtableKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const table = process.env.AIRTABLE_TABLE ?? "Leads";

    if (airtableKey && baseId) {
      const fullAddress = [address, town].filter(Boolean).join(", ");
      const notes = [summary, reason, urgency ? `Urgency: ${urgency}` : "", type ? `Type: ${type}` : ""].filter(Boolean).join(" | ");
      await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${airtableKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            Name: name ?? "Unknown",
            Phone: phone ?? "",
            Address: fullAddress,
            Notes: notes,
            Source: `retell-voice-${type ?? "lead"}`,
            "Created At": new Date().toISOString(),
          },
        }),
      });
    }

    // Notify owner for urgent or callback leads
    const apiKey = process.env.TELNYX_API_KEY;
    const from = process.env.TELNYX_FROM;
    const ownerPhone = process.env.OWNER_NOTIFY_PHONE;
    const profileId = process.env.TELNYX_MESSAGING_PROFILE_ID;
    if (apiKey && from && ownerPhone && (type === "emergency" || type === "callback")) {
      const smsBody: Record<string, string> = {
        from, to: ownerPhone,
        text: `Roofalo ${type} lead!\n${name ?? "Unknown"} · ${phone ?? "?"}\n${summary ?? ""}`,
      };
      if (profileId) smsBody.messaging_profile_id = profileId;
      fetch("https://api.telnyx.com/v2/messages", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(smsBody),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
