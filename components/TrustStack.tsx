import { Shield, Doc, Pin, CheckCircle, Phone } from "./Icons";

const stats = [
  { n: "100s", l: "of roofs our crew has put on" },
  { n: "WNY", l: "born & based — not a franchise" },
  { n: "Free", l: "honest inspections, no pressure" },
  { n: "Seconds", l: "to an answer — day or night" },
];

const badges = [
  { ic: "shield", t: "Licensed & Insured" },
  { ic: "doc", t: "Workmanship Warranty" },
  { ic: "pin", t: "Western New York born" },
  { ic: "check", t: "Free, no-pressure inspections" },
  { ic: "phone", t: "Real person whenever you ask" },
];

const iconMap: Record<string, React.ReactNode> = {
  shield: <Shield size={16} />,
  doc: <Doc size={16} />,
  pin: <Pin size={16} />,
  check: <CheckCircle size={16} />,
  phone: <Phone size={16} />,
};

const crew = [
  ["crew-1", "Mike R.", "Owner · Master roofer"],
  ["crew-2", "Sara L.", "Project lead"],
  ["crew-3", "Tomás V.", "Crew foreman"],
  ["crew-4", "Dee K.", "Insurance specialist"],
];

export function TrustStack() {
  return (
    <section className="section trust" id="trust">
      <div className="wrap">
        <div className="trust-stats" role="list" aria-label="Key facts">
          {stats.map((s, i) => (
            <div className="trust-stat" key={i} role="listitem">
              <div className="trust-stat-n">{s.n}</div>
              <div className="trust-stat-l">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="trust-badges" role="list" aria-label="Trust badges">
          {badges.map(({ ic, t }) => (
            <span className="chip trust-badge" key={t} role="listitem">
              {iconMap[ic]} {t}
            </span>
          ))}
        </div>

        <div className="trust-crew">
          <div className="trust-crew-head">
            <div className="eyebrow">New name. Seasoned hands.</div>
            <h2 className="h-md">The crew you&apos;ll actually meet.</h2>
            <p className="lead">
              We&apos;re new as a name — but the hands on your roof have put on hundreds across Western New York.
              No call centers, no faceless subcontractors: the same local team inspects, quotes, and does the work,
              and we&apos;ll tell you their names before they knock.
            </p>
          </div>
          <div className="trust-crew-grid">
            {crew.map(([id, name, role]) => (
              <figure className="trust-card" key={id}>
                <div
                  className="photo-slot"
                  style={{ height: 180, borderRadius: 16 }}
                  role="img"
                  aria-label={`${name} — ${role}`}
                >
                  <span className="photo-slot-tag">▸ real photo</span>
                  <span style={{ fontSize: 12, color: "var(--muted-2)", zIndex: 1 }}>{name}</span>
                </div>
                <figcaption>
                  <b>{name}</b>
                  <span>{role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="placeholder-note trust-foot">
            * Credential badges show only what&apos;s true today. Add manufacturer certs and Google Guaranteed here as you earn them.
          </p>
        </div>
      </div>
    </section>
  );
}
