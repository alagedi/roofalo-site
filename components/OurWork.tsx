"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Pin } from "./Icons";

interface BeforeAfterProps {
  idA: string;
  idB: string;
  town: string;
  job: string;
}

function BeforeAfter({ idA, idB, town, job }: BeforeAfterProps) {
  const [v, setV] = useState(50);

  return (
    <figure className="ba">
      <div className="ba-stage">
        <div className="ba-after">
          <div
            className="photo-slot"
            style={{ width: "100%", height: "100%", borderRadius: 0 }}
            role="img"
            aria-label={`After — ${town} · ${job}`}
          >
            <span className="photo-slot-tag">▸ after</span>
          </div>
        </div>
        <div className="ba-before" style={{ width: v + "%" }}>
          <div
            className="photo-slot"
            style={{ width: "var(--ba-w, 100%)", height: "100%", borderRadius: 0 }}
            role="img"
            aria-label={`Before — ${town} · ${job}`}
          >
            <span className="photo-slot-tag">▸ before</span>
          </div>
        </div>
        <div className="ba-handle" style={{ left: v + "%" }} aria-hidden="true">
          <span><ArrowLeft size={14} /><ArrowRight size={14} /></span>
        </div>
        <span className="ba-tag ba-tag-b">Before</span>
        <span className="ba-tag ba-tag-a">After</span>
        <input
          className="ba-range"
          type="range"
          min="0"
          max="100"
          value={v}
          onChange={(e) => setV(+e.target.value)}
          aria-label={`Reveal before and after for ${job} in ${town}`}
        />
      </div>
      <figcaption className="ba-cap">
        <b>{job}</b>
        <span><Pin size={14} /> {town}</span>
      </figcaption>
    </figure>
  );
}

const JOBS = [
  { idA: "ba1a", idB: "ba1b", town: "Hamburg", job: "Full shingle replacement" },
  { idA: "ba2a", idB: "ba2b", town: "Brockport", job: "Wind & storm repair" },
  { idA: "ba3a", idB: "ba3b", town: "Clarence", job: "Architectural shingle upgrade" },
];

export function OurWork() {
  return (
    <section className="section work" id="work">
      <div className="wrap">
        <div className="sec-head">
          <div className="eyebrow">Our work</div>
          <h2 className="h-lg">Real roofs. Real streets<br />you&apos;ll recognize.</h2>
          <p className="lead">
            Drag the slider on any job to see the before &amp; after.
            Every one is a real home in the corridor — tagged by town.
          </p>
        </div>
        <div className="ba-rail hscroll">
          {JOBS.map((j) => (
            <BeforeAfter key={j.idA} {...j} />
          ))}
        </div>
        <p className="placeholder-note work-foot">
          ▸ Drop your real before/after photos into any slot — they swap in instantly.
        </p>
      </div>
    </section>
  );
}
