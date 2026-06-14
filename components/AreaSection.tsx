"use client";

import { useState } from "react";
import { Pin, CheckCircle } from "./Icons";

const CORRIDOR_TOWNS = [
  "Buffalo", "Amherst", "Clarence", "Williamsville", "Cheektowaga", "West Seneca",
  "Hamburg", "East Aurora", "Lancaster", "Lockport", "Lewiston", "Medina", "Albion",
  "Batavia", "Le Roy", "Brockport", "Spencerport", "Hilton", "Henrietta", "Fairport", "Rochester",
];

function CorridorMap() {
  const [active, setActive] = useState<string | null>(null);
  const towns = [
    { n: "Buffalo", x: 110, y: 210 }, { n: "Amherst", x: 150, y: 168 }, { n: "Lockport", x: 205, y: 132 },
    { n: "Lewiston", x: 150, y: 96 }, { n: "Medina", x: 300, y: 120 }, { n: "Batavia", x: 360, y: 178 },
    { n: "Le Roy", x: 430, y: 175 }, { n: "Brockport", x: 520, y: 118 }, { n: "Henrietta", x: 615, y: 168 },
    { n: "Rochester", x: 650, y: 120 }, { n: "Hamburg", x: 95, y: 268 }, { n: "East Aurora", x: 165, y: 270 },
  ];
  return (
    <svg viewBox="0 0 760 340" className="corridor" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Service area map: Buffalo to Rochester corridor">
      <path d="M0 250 Q120 300 60 340 L0 340 Z" fill="#cdd9d6" />
      <text x="36" y="320" className="cm-lake">Lake Erie</text>
      <path d="M120 70 Q360 20 760 50 L760 0 L120 0 Z" fill="#cdd9d6" />
      <text x="400" y="34" className="cm-lake">Lake Ontario</text>
      <path d="M110 210 C 220 150, 360 200, 470 175 S 620 120, 650 120" fill="none" stroke="var(--copper)" strokeWidth="4" strokeDasharray="2 9" strokeLinecap="round" opacity="0.85" />
      {towns.map((t) => {
        const big = t.n === "Buffalo" || t.n === "Rochester";
        const on = active === t.n;
        return (
          <g
            key={t.n}
            onMouseEnter={() => setActive(t.n)}
            onMouseLeave={() => setActive(null)}
            style={{ cursor: "default" }}
          >
            {big && <circle cx={t.x} cy={t.y} r="13" fill="var(--copper)" opacity="0.18" />}
            <circle cx={t.x} cy={t.y} r={big ? 6.5 : 4.5} fill={big ? "var(--copper)" : "var(--slate)"} stroke="#fff" strokeWidth="1.5" />
            <text x={t.x} y={t.y - 11} className={"cm-town" + (big ? " big" : "") + (on ? " on" : "")} textAnchor="middle">
              {t.n}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function AreaSection({ onBook }: { onBook: () => void }) {
  const [q, setQ] = useState("");
  const [match, setMatch] = useState<{ found: boolean; town?: string } | null>(null);

  function check(e: React.FormEvent) {
    e.preventDefault();
    const v = q.trim().toLowerCase();
    if (!v) return;
    const hit = CORRIDOR_TOWNS.find(
      (t) => t.toLowerCase().includes(v) || v.includes(t.toLowerCase())
    );
    setMatch(hit ? { found: true, town: hit } : { found: false });
  }

  return (
    <section className="section area" id="area">
      <div className="wrap">
        <div className="area-head">
          <div className="eyebrow">We&apos;re in your neighborhood</div>
          <h2 className="h-lg">From the Canadian border<br />all the way to Rochester.</h2>
          <p className="lead">
            One local crew, the whole corridor. If you can see a Roofalo yard sign from your street,
            we cover your roof.
          </p>
        </div>

        <div className="area-map card">
          <CorridorMap />
        </div>

        <form className="area-check" onSubmit={check}>
          <div className="area-inputrow">
            <span><Pin size={20} /></span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Type your town…"
              aria-label="Your town or ZIP code"
            />
            <button className="btn btn-primary" type="submit">Check</button>
          </div>
          {match && (
            <div className={"area-result reveal" + (match.found ? "" : " outside")} role="status" aria-live="polite">
              <CheckCircle size={22} />
              <div>
                <b>
                  {match.found
                    ? match.town
                      ? `Yes — we work in ${match.town} all the time.`
                      : "Yes — you're in our corridor."
                    : "Not in our area yet — but we're expanding."}
                </b>
                <span>
                  {match.found
                    ? "We've got recent jobs near you. Want us to take a look at yours?"
                    : "Leave your info and we'll reach out when we're in your area."}
                </span>
              </div>
              {match.found && (
                <button className="btn btn-primary area-result-cta" onClick={onBook} type="button">
                  Book free inspection
                </button>
              )}
            </div>
          )}
        </form>

        <div className="area-towns" aria-label="Towns we serve">
          {CORRIDOR_TOWNS.map((t) => (
            <span key={t} className="area-town">{t}</span>
          ))}
          <span className="area-town area-town-more">+ everywhere between</span>
        </div>
      </div>
    </section>
  );
}
