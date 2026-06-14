"use client";

import { BuffaloSilhouette } from "./Logo";
import { RoofCheck } from "./RoofCheck";
import { Star, Shield, Pin, CheckCircle, Camera, Spark } from "./Icons";

const PHONE = "(716) 200-0707";
const TEL = "+17162000707";

interface HeroProps {
  onBook: (addr?: string) => void;
  onPhoto: () => void;
}

export function Hero({ onBook, onPhoto }: HeroProps) {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-clouds" />
        <div className="hero-buffalo">
          <BuffaloSilhouette size={620} color="rgba(243,238,228,0.04)" />
        </div>
        <div className="hero-roofline" />
      </div>

      <div className="wrap hero-grid">
        <div className="hero-main">
          <div className="eyebrow on-dark">Buffalo&nbsp;→&nbsp;Rochester · Roofing for WNY winters</div>
          <h1 className="hero-h">Built like<br />a Buffalo.</h1>
          <p className="hero-lead">
            A roof that weathers anything — from lake-effect snow to summer storms.
            Honest answers, fair prices, and a crew that actually shows up.
          </p>

          <div className="hero-rc">
            <div className="hero-rc-label">
              <Spark size={16} /> Curious about your roof? See it from above — free.
            </div>
            <RoofCheck onBook={(addr) => onBook(addr)} />
            <button className="hero-photo-link" onClick={onPhoto}>
              <Camera size={18} />
              See something wrong? <u>Send us a photo instead</u>
            </button>
          </div>

          <ul className="hero-trust">
            <li>
              <span className="stars" aria-label="5 stars">
                {[0,1,2,3,4].map((i) => <Star key={i} size={15} />)}
              </span>
              <b>Real</b> WNY reviews
            </li>
            <li><Shield size={15} /> Licensed &amp; insured</li>
            <li><Pin size={15} /> Local, Buffalo→Rochester</li>
            <li><CheckCircle size={15} /> Workmanship warranty</li>
          </ul>
        </div>

        <div className="hero-aside">
          <div
            className="photo-slot"
            style={{ height: "100%", borderRadius: 20 }}
            role="img"
            aria-label="Real WNY home and crew — photo coming soon"
          >
            <span className="photo-slot-tag">▸ real photo</span>
            <span style={{ fontSize: 13, color: "var(--muted-2)", zIndex: 1 }}>Real WNY home + crew</span>
          </div>
          <div className="hero-float">
            <span className="stars" aria-label="5 stars">
              {[0,1,2,3,4].map((i) => <Star key={i} size={14} />)}
            </span>
            <p>"They answered at 9pm during a storm. Tarped my roof the next morning. Real people."</p>
            <small>— Dana M., Hamburg</small>
          </div>
        </div>
      </div>

      <a href="#area" className="hero-scroll" style={{ display: "none" }}>
        Do you cover my town? ↓
      </a>
    </section>
  );
}
