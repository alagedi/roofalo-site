"use client";

import { useState, useRef } from "react";
import { Plus, Minus, Phone } from "./Icons";

const TEL = "+17162000707";
const PHONE = "(716) 200-0707";

const faqs = [
  ["How much does a new roof cost?", "Most full replacements in WNY land between $8,000 and $20,000+ depending on size, pitch, and materials. The Instant Roof Check up top gives you a ballpark in seconds — and your free inspection gives you the exact number, in writing."],
  ["Is the inspection really free — and will you pressure me?", "Yes, genuinely free, and no. We'll come out, take a look, and give you an honest answer. If your roof has years left, we'll tell you that. You decide on your own timeline. We never push."],
  ["Are you licensed and insured?", "Fully licensed and insured, with both liability and workers' comp. We'll hand you the certificates before any work starts — ask and you'll have them same day."],
  ["Will you wreck my landscaping or leave nails everywhere?", "No. We tarp your plants and siding, and every job ends with a magnetic nail sweep across the lawn and driveway. We leave it cleaner than we found it."],
  ["What about my insurance claim?", "Storm or hail damage is our specialty. We document everything, meet your adjuster on-site, and walk the claim through with you so you're not fighting it alone."],
  ["What if it leaks or there's a problem later?", "You're covered by our workmanship warranty, and we actually answer. Call or text and you'll get an answer in seconds, any time — and a real person whenever you ask. No ticket queue, no runaround."],
  ["How fast can you come out?", "Usually within a day or two for inspections. Active leak right now? Call or text (716) 200-0707 — we answer in seconds and can often tarp it same-day."],
  ["My house is from 1912 — can you handle an old roof?", "Absolutely. WNY is full of century homes and we work on them constantly — tricky pitches, slate transitions, old decking and all."],
];

function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className={"faq-item " + (open ? "open" : "")}>
      <button
        className="faq-q"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`faq-a-${q.slice(0, 20)}`}
      >
        <span>{q}</span>
        <span className="faq-icon" aria-hidden="true">
          {open ? <Minus size={20} /> : <Plus size={20} />}
        </span>
      </button>
      <div
        id={`faq-a-${q.slice(0, 20)}`}
        className="faq-a"
        style={{ maxHeight: open ? (ref.current ? ref.current.scrollHeight + 4 : 400) : 0 }}
      >
        <div ref={ref} className="faq-a-inner">{a}</div>
      </div>
    </div>
  );
}

export function FAQ({ onBook }: { onBook: () => void }) {
  const [open, setOpen] = useState(0);

  return (
    <section className="section faq" id="faq">
      <div className="wrap faq-grid">
        <div className="faq-intro">
          <div className="eyebrow">Straight answers</div>
          <h2 className="h-lg">The questions everyone&apos;s really asking.</h2>
          <p className="lead">No dodging. If you&apos;re wondering it, here&apos;s the honest answer.</p>
          <div className="faq-still card">
            <b>Still wondering something?</b>
            <span>Call or text — you&apos;ll get an answer in seconds, day or night, and a real person whenever you ask.</span>
            <a className="btn btn-ghost" href={"tel:" + TEL}>
              <Phone size={18} /> {PHONE}
            </a>
          </div>
        </div>
        <div className="faq-list" role="list">
          {faqs.map(([q, a], i) => (
            <FAQItem
              key={i}
              q={q}
              a={a}
              open={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
