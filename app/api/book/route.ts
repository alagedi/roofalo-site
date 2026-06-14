import { NextRequest, NextResponse } from "next/server";

interface BookingPayload {
  name: string;
  phone: string;
  address: string;
  when: string;
  note?: string;
  source?: string;
  photos?: string[];
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
  if (!apiKey || !from || !ownerPhone) return;

  const text = `New Roofalo booking!\n${data.name} · ${data.phone}\n${data.address}\n${data.when}`;
  try {
    await fetch("https://api.telnyx.com/v2/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: ownerPhone, text }),
    });
  } catch {
    // Non-blocking
  }
}

export async function POST(req: NextRequest) {
  try {
    const data: BookingPayload = await req.json();

    if (!data.name || !data.phone || !data.address) {
      return NextResponse.json({ error: "name, phone, address required" }, { status: 400 });
    }

    // Fire lead pipeline — all parallel, all non-blocking
    await Promise.allSettled([
      persistLead(data),
      notifyOwner(data),
      sendSMSNotification(data),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
