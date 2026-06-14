"use client";

import { useState, useEffect, useRef } from "react";
import { BuffaloBadge } from "./Logo";
import { X, Calendar, Clock, CheckCircle, Shield, ArrowRight, ArrowLeft, Bolt, Camera, Pin } from "./Icons";

const TEL = "+17162000707";
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const SLOTS = ["8:00 AM", "10:30 AM", "1:00 PM", "3:30 PM", "5:30 PM"];

function fmtPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function nextDays(n: number): Date[] {
  const out: Date[] = [];
  const now = new Date();
  for (let i = 1; out.length < n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    if (d.getDay() === 0) continue;
    out.push(d);
  }
  return out;
}

interface BookingModalProps {
  open: boolean;
  prefillAddress: string;
  onClose: () => void;
}

export function BookingModal({ open, prefillAddress, onClose }: BookingModalProps) {
  const [step, setStep] = useState(0);
  const [day, setDay] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState(prefillAddress || "");
  const [note, setNote] = useState("");
  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const days = nextDays(6);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { if (open) setAddr(prefillAddress || ""); }, [open, prefillAddress]);
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => closeRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const f = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", f);
    return () => document.removeEventListener("keydown", f);
  }, [open]);

  if (!open) return null;

  const phoneOk = phone.replace(/\D/g, "").length === 10;
  const canContinue =
    step === 0 ? day !== null && slot !== null :
    step === 1 ? name.trim() && phoneOk && addr.trim() :
    true;

  function addPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = [...(e.target.files ?? [])].slice(0, 4);
    setPhotos((p) => [...p, ...files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }))].slice(0, 4));
  }

  function close() {
    onClose();
    setTimeout(() => {
      setStep(0); setDay(null); setSlot(null);
      setName(""); setPhone(""); setNote(""); setPhotos([]);
      setSubmitting(false);
    }, 250);
  }

  async function confirmBooking() {
    setSubmitting(true);
    const chosenDay = day !== null ? days[day] : null;
    try {
      await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone, address: addr, note,
          when: chosenDay ? `${DOW[chosenDay.getDay()]}, ${MON[chosenDay.getMonth()]} ${chosenDay.getDate()} · ${slot}` : "",
          source: "web",
        }),
      });
    } catch {
      // proceed to confirmation even if request fails (lead is best-effort on frontend)
    }
    setStep(2);
    setSubmitting(false);
  }

  const chosenDay = day !== null ? days[day] : null;

  return (
    <div
      className="bk-overlay"
      onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bk-title"
    >
      <div className="bk-modal reveal">
        <div className="bk-head">
          <div className="bk-head-l">
            <BuffaloBadge size={34} variant="dark" />
            <div>
              <div className="bk-title" id="bk-title">
                {step === 2 ? "You're booked" : "Free roof inspection"}
              </div>
              <div className="bk-sub">
                {step === 2 ? "We'll be in touch shortly" : "No pressure. No obligation. You decide."}
              </div>
            </div>
          </div>
          <button ref={closeRef} className="bk-close" onClick={close} aria-label="Close">
            <X size={22} />
          </button>
        </div>

        {step < 2 && (
          <div className="bk-steps" aria-label="Booking steps">
            <span className={"bk-step " + (step >= 0 ? "on" : "")}><i>1</i> When</span>
            <span className="bk-stepbar" />
            <span className={"bk-step " + (step >= 1 ? "on" : "")}><i>2</i> Your details</span>
          </div>
        )}

        <div className="bk-body">
          {step === 0 && (
            <div className="reveal">
              <p className="bk-lead">Pick a time that works. We'll come out, take a look, and give you an honest answer — free.</p>
              <div className="bk-daygrid" role="group" aria-label="Select a day">
                {days.map((d, i) => (
                  <button
                    key={i}
                    className={"bk-day " + (day === i ? "sel" : "")}
                    onClick={() => { setDay(i); setSlot(null); }}
                    aria-pressed={day === i}
                    aria-label={`${DOW[d.getDay()]} ${MON[d.getMonth()]} ${d.getDate()}`}
                  >
                    <span className="bk-day-dow">{DOW[d.getDay()]}</span>
                    <span className="bk-day-num">{d.getDate()}</span>
                    <span className="bk-day-mon">{MON[d.getMonth()]}</span>
                  </button>
                ))}
              </div>
              {day !== null && (
                <div className="bk-slots reveal">
                  <div className="bk-slots-lbl">
                    <Clock size={15} />
                    {chosenDay && `${DOW[chosenDay.getDay()]}, ${MON[chosenDay.getMonth()]} ${chosenDay.getDate()}`}
                  </div>
                  <div className="bk-slotgrid" role="group" aria-label="Select a time">
                    {SLOTS.map((s) => (
                      <button
                        key={s}
                        className={"bk-slot " + (slot === s ? "sel" : "")}
                        onClick={() => setSlot(s)}
                        aria-pressed={slot === s}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="bk-arrival">
                    <CheckCircle size={14} />
                    You don&apos;t need to be home for the inspection.
                  </div>
                </div>
              )}
              <div className="bk-callout">
                <Bolt size={16} />
                <span>
                  Got a leak right now?{" "}
                  <a href={"tel:" + TEL}>Call or text (716) 200-0707</a> — we answer in seconds.
                </span>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="reveal">
              <p className="bk-lead">Just the basics — that&apos;s all we need to get you on the schedule.</p>
              <label className="bk-field">
                <span>Your name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="First & last"
                  autoComplete="name"
                  required
                />
              </label>
              <label className="bk-field">
                <span>Mobile number</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(fmtPhone(e.target.value))}
                  placeholder="(716) 000-0000"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                />
                <small>So we can text a confirmation. We never share it.</small>
              </label>
              <label className="bk-field">
                <span>Property address</span>
                <input
                  value={addr}
                  onChange={(e) => setAddr(e.target.value)}
                  placeholder="Street, city"
                  autoComplete="street-address"
                  required
                />
              </label>
              <label className="bk-field">
                <span>What&apos;s going on? <em>optional</em></span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="Leak, missing shingles, just getting quotes…"
                />
              </label>
              <div className="bk-field">
                <span>Add photos <em>optional</em></span>
                <div className="bk-photos">
                  {photos.map((p, i) => (
                    <div key={i} className="bk-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt="" />
                    </div>
                  ))}
                  {photos.length < 4 && (
                    <label className="bk-addphoto" tabIndex={0}>
                      <Camera size={20} />
                      <span>Add</span>
                      <input type="file" accept="image/*" multiple onChange={addPhotos} hidden />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bk-confirm reveal">
              <div className="bk-confirm-ring" aria-hidden="true">
                <CheckCircle size={46} />
              </div>
              <h3 className="bk-confirm-h">
                You&apos;re on the schedule, {name.split(" ")[0] || "neighbor"}.
              </h3>
              <p className="bk-confirm-p">
                We&apos;ll confirm within minutes — by text or a quick call. No phone tag.
              </p>
              <div className="bk-summary" role="list" aria-label="Booking summary">
                <div role="listitem">
                  <span><Calendar size={17} /></span>
                  <div>
                    <b>{chosenDay && `${DOW[chosenDay.getDay()]}, ${MON[chosenDay.getMonth()]} ${chosenDay.getDate()}`} · {slot}</b>
                    <small>Free inspection</small>
                  </div>
                </div>
                <div role="listitem">
                  <span><Pin size={17} /></span>
                  <div>
                    <b>{addr}</b>
                    <small>{photos.length ? `${photos.length} photo${photos.length > 1 ? "s" : ""} attached` : "No photos attached"}</small>
                  </div>
                </div>
              </div>
              <div className="bk-expect">
                <div className="bk-expect-h">What happens next</div>
                <ol>
                  <li>A quick confirmation call or text — no phone tag.</li>
                  <li>We inspect the roof (you don&apos;t need to be home).</li>
                  <li>You get an honest assessment + a clear quote in writing. You decide. No pressure.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        <div className="bk-foot">
          {step === 0 && (
            <>
              <span className="bk-foot-note"><Shield size={15} /> Always free</span>
              <button
                className="btn btn-primary"
                disabled={!canContinue}
                onClick={() => setStep(1)}
              >
                Continue <ArrowRight size={18} />
              </button>
            </>
          )}
          {step === 1 && (
            <>
              <button className="btn btn-ghost bk-back" onClick={() => setStep(0)}>
                <ArrowLeft size={18} /> Back
              </button>
              <button
                className={"btn btn-primary" + (submitting ? " bk-submitting" : "")}
                disabled={!canContinue || submitting}
                onClick={confirmBooking}
              >
                {submitting ? "Confirming…" : "Confirm my inspection"}
              </button>
            </>
          )}
          {step === 2 && (
            <button className="btn btn-primary btn-block" onClick={close}>Done</button>
          )}
        </div>
      </div>
    </div>
  );
}
