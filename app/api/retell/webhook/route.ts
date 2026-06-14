import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

// Retell AI webhook handler
// Handles: post-call events, function calls (book_inspection, check_availability, transfer_to_human)

const RETELL_API_KEY = process.env.RETELL_API_KEY ?? "";

function verifyRetell(req: NextRequest, body: string): boolean {
  if (!RETELL_API_KEY) return true; // skip in dev without key
  const sig = req.headers.get("x-retell-signature");
  if (!sig) return false;
  // Retell signs with HMAC-SHA256 using the API key
  const expected = createHmac("sha256", RETELL_API_KEY).update(body).digest("hex");
  return sig === expected;
}

async function handleBookInspection(args: {
  name: string;
  phone: string;
  address: string;
  when: string;
  note?: string;
}) {
  try {
    await fetch(`${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...args, source: "retell-voice" }),
    });
    return { success: true, message: `Got it. I've booked a free inspection for ${args.name} at ${args.address} on ${args.when}. You'll get a text confirmation shortly.` };
  } catch {
    return { success: false, message: "I wasn't able to complete that booking. Let me get a person on the line to help you." };
  }
}

async function handleCheckAvailability() {
  // In production: fetch from Cal.com API
  // For now return a helpful placeholder response
  const nextDays = [];
  const now = new Date();
  for (let i = 1; nextDays.length < 5; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    if (d.getDay() === 0) continue;
    nextDays.push(d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }));
  }
  return {
    available: nextDays,
    message: `We have openings on ${nextDays.slice(0, 3).join(", ")}. Morning or afternoon tends to work best — what's your preference?`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    if (!verifyRetell(req, body)) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const event = JSON.parse(body);
    const { event: eventType, call } = event;

    // Function call from Retell agent
    if (eventType === "function_call") {
      const { name: fnName, arguments: fnArgs } = event.function_call ?? {};

      if (fnName === "book_inspection") {
        const result = await handleBookInspection(fnArgs);
        return NextResponse.json({ result: JSON.stringify(result) });
      }

      if (fnName === "check_availability") {
        const result = await handleCheckAvailability();
        return NextResponse.json({ result: JSON.stringify(result) });
      }

      if (fnName === "transfer_to_human") {
        return NextResponse.json({
          result: JSON.stringify({ action: "transfer", message: "Transferring you now." }),
        });
      }
    }

    // Post-call event
    if (eventType === "call_ended" && call) {
      // Extract lead if captured during call
      const transcript = call.transcript ?? "";
      const callSid = call.call_id;

      // Log call for follow-up
      console.log(`Retell call ended: ${callSid}`);

      // If booking was made during call, it's already persisted via function_call handler
      // Otherwise, log as a lead for manual follow-up
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
