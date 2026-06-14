"use client";

import { Home, Wrench, Drop, Search, Gutter, Phone, Bolt, ArrowRight } from "./Icons";

const TEL = "+17162000707";
const PHONE = "(716) 200-0707";

const svcs = [
  { Icon: Home, h: "Roof Replacement", p: "A new roof built for WNY weather, installed in 1–2 days and backed by warranty.", feat: false },
  { Icon: Wrench, h: "Roof Repair", p: "Leaks, missing shingles, flashing, storm damage — fixed fast and done right.", feat: false },
  { Icon: Drop, h: "Storm & Insurance Claims", p: "Hail or wind damage? We document it, meet your adjuster, and handle the claim with you.", feat: true },
  { Icon: Search, h: "Roof Inspections", p: "A free, honest look at what's really going on up there — with photos you can keep.", feat: false },
  { Icon: Gutter, h: "Gutters & Guards", p: "Seamless gutters and guards that handle ice dams and lake-effect runoff.", feat: false },
];

export function Services({ onBook }: { onBook: () => void }) {
  return (
    <section className="section services" id="services">
      <div className="wrap">
        <div className="sec-head">
          <div className="eyebrow">What we do</div>
          <h2 className="h-lg">Whatever&apos;s wrong up there,<br />we&apos;ve handled it before.</h2>
        </div>
        <div className="svc-grid">
          {svcs.map(({ Icon, h, p, feat }) => (
            <article className={"svc-card " + (feat ? "svc-feat" : "")} key={h}>
              {feat && (
                <span className="svc-flag">
                  <Bolt size={13} /> Most homeowners start here
                </span>
              )}
              <div className="svc-ic">
                <Icon size={26} />
              </div>
              <h3 className="svc-h">{h}</h3>
              <p className="svc-p">{p}</p>
              <button className="svc-link" onClick={onBook}>
                {feat ? "Get claim help" : "Learn more"} <ArrowRight size={16} />
              </button>
            </article>
          ))}
          <article className="svc-card svc-call">
            <div className="svc-ic svc-ic-amber">
              <Phone size={26} />
            </div>
            <h3 className="svc-h">Not sure what you need?</h3>
            <p className="svc-p">
              Call or text and get a straight answer in seconds, any time — and a real person whenever you ask.
            </p>
            <a className="svc-link" href={"tel:" + TEL}>
              Call {PHONE} <ArrowRight size={16} />
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
