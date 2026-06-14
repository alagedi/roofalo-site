import { NextRequest, NextResponse } from "next/server";
import { getSlots, parseDay } from "@/lib/calcom";

export async function POST(req: NextRequest) {
  try {
    const { preferred_day, time_window, preferred_time } = await req.json();

    // Try requested day first; if no slots, try next 3 working days
    const requestedDate = parseDay(preferred_day ?? "");
    let slots = await getSlots(requestedDate, time_window ?? "any", 4);

    if (!slots.length) {
      // Check next 3 days
      const base = new Date(requestedDate + "T12:00:00Z");
      for (let i = 1; i <= 3 && !slots.length; i++) {
        const next = new Date(base);
        next.setDate(base.getDate() + i);
        if (next.getDay() === 0) continue; // skip Sunday
        const dateStr = next.toISOString().split("T")[0];
        slots = await getSlots(dateStr, time_window ?? "any", 4);
      }
    }

    if (!slots.length) {
      return NextResponse.json({
        available: false,
        slots: [],
        message: "I'm not seeing open slots in the next few days. Let me have someone call you back to lock in a time — what's the best number?",
      });
    }

    // If a specific time was requested, put the closest slot first
    if (preferred_time) {
      const prefHour = parseInt(preferred_time.replace(/[^\d]/g, "")) || 0;
      slots.sort((a, b) => {
        const aH = new Date(a.slot_id).getUTCHours();
        const bH = new Date(b.slot_id).getUTCHours();
        return Math.abs(aH - prefHour) - Math.abs(bH - prefHour);
      });
    }

    const options = slots.map((s) => s.label).join(", ");
    return NextResponse.json({
      available: true,
      slots,
      message: `I've got openings on ${options}. Which one works for you?`,
    });
  } catch {
    return NextResponse.json({ available: false, slots: [], message: "I had trouble pulling the schedule. Can I get someone to call you back?" }, { status: 200 });
  }
}
