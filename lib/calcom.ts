// Cal.com API helpers (v2, api-version 2024-08-13)

const CAL_API_VERSION = "2024-08-13";
const CAL_BASE = "https://api.cal.com/v2";

function calHeaders() {
  return {
    Authorization: `Bearer ${process.env.CALCOM_API_KEY ?? ""}`,
    "cal-api-version": CAL_API_VERSION,
    "Content-Type": "application/json",
  };
}

export interface CalSlot {
  slot_id: string;   // ISO UTC time — pass back to bookSlot()
  label: string;     // Human-readable: "Monday Jun 16 at 10:00 AM ET"
}

// Determine ET offset for a given date (handles DST correctly).
function etOffset(dateStr: string): string {
  const test = new Date(`${dateStr}T12:00:00Z`);
  const ny = new Date(test.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const utc = new Date(test.toLocaleString("en-US", { timeZone: "UTC" }));
  const diffMin = Math.round((utc.getTime() - ny.getTime()) / 60000);
  const h = Math.floor(Math.abs(diffMin) / 60);
  const sign = diffMin >= 0 ? "+" : "-";
  return `${sign}${String(h).padStart(2, "0")}:00`;
}

// Convert "2026-06-15T13:00:00.000Z" → "Monday Jun 15 at 9:00 AM ET"
function fmtSlot(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "long", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  }) + " ET";
}

// Parse "tomorrow", "Monday", or "YYYY-MM-DD" to a YYYY-MM-DD string.
export function parseDay(input: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lower = (input ?? "").toLowerCase().trim();
  if (!lower || lower === "any") {
    today.setDate(today.getDate() + 1);
    if (today.getDay() === 0) today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  }
  if (lower === "tomorrow") {
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(lower)) return lower;

  const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const idx = days.findIndex((d) => lower.startsWith(d));
  if (idx >= 0) {
    const target = new Date(today);
    const diff = ((idx - today.getDay() + 7) % 7) || 7;
    target.setDate(today.getDate() + diff);
    return target.toISOString().split("T")[0];
  }
  // fallback: tomorrow
  today.setDate(today.getDate() + 1);
  return today.toISOString().split("T")[0];
}

// Fetch available Cal.com slots for a date, filtered by time_window.
export async function getSlots(
  dateStr: string,
  timeWindow: "morning" | "afternoon" | "any" = "any",
  limit = 5
): Promise<CalSlot[]> {
  const key = process.env.CALCOM_API_KEY;
  const eventTypeId = process.env.CALCOM_EVENT_TYPE_ID;
  if (!key || !eventTypeId) return [];

  const start = `${dateStr}T00:00:00Z`;
  const end = `${dateStr}T23:59:59Z`;

  try {
    const res = await fetch(
      `${CAL_BASE}/slots/available?eventTypeId=${eventTypeId}&startTime=${start}&endTime=${end}`,
      { headers: calHeaders() }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const rawSlots: string[] = (data?.data?.slots?.[dateStr] ?? []).map(
      (s: { time: string }) => s.time
    );

    // Filter by time window using ET hours
    const filtered = rawSlots.filter((iso) => {
      const etHour = parseInt(
        new Date(iso).toLocaleString("en-US", { timeZone: "America/New_York", hour: "numeric", hour12: false })
      );
      if (timeWindow === "morning") return etHour < 12;
      if (timeWindow === "afternoon") return etHour >= 12;
      return true;
    });

    return filtered.slice(0, limit).map((iso) => ({
      slot_id: iso,
      label: fmtSlot(iso),
    }));
  } catch {
    return [];
  }
}

// Convert a website-picker slot ("1:00 PM") + date (YYYY-MM-DD) to an ET offset ISO.
export function pickerSlotToISO(dateStr: string, slotLabel: string): string {
  const [timePart, period] = slotLabel.trim().split(" ");
  const [hStr, mStr] = timePart.split(":");
  let h = parseInt(hStr);
  const m = parseInt(mStr || "0");
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  const offset = etOffset(dateStr);
  return `${dateStr}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00${offset}`;
}

export interface BookResult {
  success: boolean;
  bookingId?: number;
  meetingUrl?: string;
}

// Create a Cal.com booking. email is required; generate one from phone if needed.
export async function bookSlot(args: {
  slotISO: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  metadata?: Record<string, string>;
}): Promise<BookResult> {
  const key = process.env.CALCOM_API_KEY;
  const eventTypeId = parseInt(process.env.CALCOM_EVENT_TYPE_ID ?? "0");
  if (!key || !eventTypeId) return { success: false };

  const email = args.email ?? `${args.phone.replace(/\D/g, "")}@roofalo.com`;

  try {
    const res = await fetch(`${CAL_BASE}/bookings`, {
      method: "POST",
      headers: calHeaders(),
      body: JSON.stringify({
        eventTypeId,
        start: args.slotISO,
        attendee: {
          name: args.name,
          email,
          timeZone: "America/New_York",
          language: "en",
        },
        metadata: { phone: args.phone, ...args.metadata },
        bookingFieldsResponses: { notes: args.notes ?? "" },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Cal.com] booking failed:", res.status, err);
      return { success: false };
    }

    const data = await res.json();
    return {
      success: true,
      bookingId: data?.data?.id,
      meetingUrl: data?.data?.meetingUrl,
    };
  } catch (e) {
    console.error("[Cal.com] exception:", e);
    return { success: false };
  }
}
