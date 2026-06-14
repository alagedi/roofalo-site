import { NextRequest, NextResponse } from "next/server";
import { bookSlot } from "@/lib/calcom";

interface BookingPayload {
  name: string;
  phone: string;
  address: string;
  when: string;
  isoStart?: string;  // ISO datetime passed from booking form
  note?: string;
  source?: string;
  photos?: string[];
  turnstileToken?: string;
}

async function persistLead(data: BookingPayload) {
  const airtableKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE ?? "Leads";
  if (!airtableKey || !baseId) return null;

  try {
    const res = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${airtableKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Name: data.name,
          Phone: data.phone,
          Address: data.address,
          "Requested Time": data.when,
          Notes: data.note ?? "",
          Source: data.source ?? "web",
          "Created At": new Date().toISOString(),
        },
      }),
    });
    return await res.json();
  } catch {
    return null;
  }
}

async function notifyOwner(data: BookingPayload) {
  const resendKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_NOTIFY_EMAIL;
  if (!resendKey || !ownerEmail) return;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Roofalo <noreply@roofalo.com>",
        to: [ownerEmail],
        subject: `New booking: ${data.name} · ${data.when}`,
        html: `
          <h2>New Free Inspection Request</h2>
          <table>
            <tr><td><b>Name:</b></td><td>${data.name}</td></tr>
            <tr><td><b>Phone:</b></td><td>${data.phone}</td></tr>
            <tr><td><b>Address:</b></td><td>${data.address}</td></tr>
            <tr><td><b>When:</b></td><td>${data.when}</td></tr>
            <tr><td><b>Source:</b></td><td>${data.source ?? "web"}</td></tr>
            ${data.note ? `<tr><td><b>Notes:</b></td><td>${data.note}</td></tr>` : ""}
          </table>
          <p><a href="tel:${data.phone}">Call ${data.phone}</a></p>
        `,
      }),
    });
  } catch {
    // Non-blocking
  }
}

async function sendSMSNotification(data: BookingPayload) {
  const apiKey = process.env.TELNYX_API_KEY;
  const from = process.env.TELNYX_FROM;
  const ownerPhone = process.env.OWNER_NOTIFY_PHONE;
  const messagingProfileId = process.env.TELNYX_MESSAGING_PROFILE_ID;
  if (!apiKey || !from || !ownerPhone) return;

  const text = `New Roofalo booking!\n${data.name} · ${data.phone}\n${data.address}\n${data.when}`;
  const body: Record<string, string> = { from, to: ownerPhone, text };
  if (messagingProfileId) body.messaging_profile_id = messagingProfileId;

  try {
    const res = await fetch("https://api.telnyx.com/v2/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("[Telnyx SMS] failed", res.status, err);
    }
  } catch (e) {
    console.error("[Telnyx SMS] exception", e);
  }
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // skip if not configured
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const data: BookingPayload = await req.json();

    if (!data.name || !data.phone || !data.address) {
      return NextResponse.json({ error: "name, phone, address required" }, { status: 400 });
    }

    // Verify Turnstile only when token is present (widget loaded successfully)
    if (process.env.TURNSTILE_SECRET_KEY && data.turnstileToken) {
      const ok = await verifyTurnstile(data.turnstileToken);
      if (!ok) return NextResponse.json({ error: "bot check failed" }, { status: 403 });
    }

    // Fire lead pipeline — all parallel, all non-blocking
    await Promise.allSettled([
      persistLead(data),
      notifyOwner(data),
      sendSMSNotification(data),
      data.isoStart
        ? bookSlot({
            slotISO: data.isoStart,
            name: data.name,
            phone: data.phone,
            notes: [data.note, data.address].filter(Boolean).join(" | "),
            metadata: { source: data.source ?? "web" },
          })
        : Promise.resolve(),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
