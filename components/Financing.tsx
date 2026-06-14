"use client";

import { CheckCircle, Wallet, Calendar } from "./Icons";

export function Financing({ onBook }: { onBook: () => void }) {
  return (
    <section className="section financing" id="financing">
      <div className="wrap fin-grid">
        <div className="fin-main">
          <div className="eyebrow">Affordability</div>
          <h2 className="h-lg">A new roof shouldn&apos;t<br />keep you up at night.</h2>
          <p className="lead">
            Most homeowners finance — and we keep it simple and pressure-free.
            See a monthly number you&apos;re comfortable with, then decide.
            The inspection is always free.
          </p>
          <ul className="fin-points">
            <li><CheckCircle size={18} /> Plans with $0 down available</li>
            <li><CheckCircle size={18} /> Quick, soft-pull pre-qualification</li>
            <li><CheckCircle size={18} /> No prepayment penalties</li>
          </ul>
          <button className="btn btn-primary btn-lg" onClick={onBook}>
            <Calendar size={19} /> See my options — free
          </button>
          <p className="placeholder-note fin-note">
            ▸ Financing partner &amp; live rates plug in here. Figures shown are illustrative.
          </p>
        </div>

        <div className="fin-card card">
          <div className="fin-card-top">
            <span className="fin-tag">Example</span>
            <div className="fin-amt">
              <span>from</span>
              <b>$189</b>
              <span>/mo</span>
            </div>
            <div className="fin-sub">on a full roof replacement*</div>
          </div>
          <div className="fin-bar">
            <div className="fin-bar-fill" />
          </div>
          <div className="fin-row"><span>Estimated project</span><b>$14,200</b></div>
          <div className="fin-row"><span>Term</span><b>120 months</b></div>
          <div className="fin-row"><span>Down payment</span><b>$0</b></div>
          <div className="fin-foot">
            <Wallet size={16} />
            Your real number comes from your free inspection — in writing, no surprises.
          </div>
        </div>
      </div>
    </section>
  );
}
