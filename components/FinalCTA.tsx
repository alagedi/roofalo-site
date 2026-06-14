"use client";

import { BuffaloSilhouette } from "./Logo";
import { Calendar, Phone } from "./Icons";

const TEL = "+17162000707";
const PHONE = "(716) 200-0707";

export function FinalCTA({ onBook }: { onBook: () => void }) {
  return (
    <section className="section final" id="book">
      <div className="final-bg" aria-hidden="true">
        <BuffaloSilhouette size={520} color="rgba(243,238,228,0.05)" />
      </div>
      <div className="wrap final-inner">
        <div className="eyebrow on-dark">Let&apos;s take a look</div>
        <h2 className="final-h">
          Free inspection.<br />Honest answer.<br /><span>No pressure.</span>
        </h2>
        <p className="final-p">
          Find out exactly what&apos;s going on with your roof — and what it&apos;ll cost — before you commit to anything.
          That&apos;s the whole offer.
        </p>
        <div className="final-actions">
          <button className="btn btn-primary btn-lg" onClick={onBook}>
            <Calendar size={20} /> Get my free inspection
          </button>
          <a className="btn btn-ghost on-dark btn-lg" href={"tel:" + TEL}>
            <Phone size={20} /> Or call/text {PHONE}
          </a>
        </div>
        <p className="final-note">
          We answer in seconds, day or night — and a real person is always one ask away.
        </p>
      </div>
    </section>
  );
}
