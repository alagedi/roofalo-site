"use client";

import { Calendar, Home, Doc, Shield, ArrowRight } from "./Icons";

const steps = [
  { Icon: Calendar, h: "Book or send a photo", p: "Pick a time online, or snap a photo of the problem. Takes about a minute — no account, no long forms." },
  { Icon: Home, h: "We come take a look", p: "A real person inspects your roof. You don't even need to be home. No high-pressure pitch — ever." },
  { Icon: Doc, h: "Honest assessment + clear quote", p: "We tell you what's actually going on and put a fair price in writing. If it can wait, we'll say so." },
  { Icon: Shield, h: "We do the work, you're covered", p: "Most roofs done in 1–2 days, cleaned up spotless, and backed by our workmanship warranty." },
];

export function HowItWorks({ onBook }: { onBook: () => void }) {
  return (
    <section className="section how dark-bg" id="how">
      <div className="wrap">
        <div className="how-head">
          <div className="eyebrow on-dark">How it works</div>
          <h2 className="h-lg">Four simple steps.<br />Zero pressure.</h2>
        </div>
        <ol className="how-grid">
          {steps.map(({ Icon, h, p }, i) => (
            <li className="how-step" key={i}>
              <span className="how-num" aria-hidden="true">{i + 1}</span>
              <div className="how-ic" aria-hidden="true"><Icon size={26} /></div>
              <h3 className="how-h">{h}</h3>
              <p className="how-p">{p}</p>
            </li>
          ))}
        </ol>
        <div className="how-cta">
          <button className="btn btn-primary btn-lg" onClick={onBook}>
            <Calendar size={20} /> Get my free inspection
          </button>
          <span className="how-cta-note">Free · no obligation · you decide</span>
        </div>
      </div>
    </section>
  );
}
