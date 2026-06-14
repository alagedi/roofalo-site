import { Logo } from "./Logo";
import { Phone, Clock } from "./Icons";

const TEL = "+17162000707";
const PHONE = "(716) 200-0707";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Logo size={38} tone="light" badge="copper" />
          <p>Roofing built for Western New York winters — from Buffalo to Rochester. Licensed, insured, and local.</p>
          <a href={"tel:" + TEL} className="footer-phone" aria-label={`Call ${PHONE}`}>
            <Phone size={18} /> {PHONE}
          </a>
          <span className="footer-hours">
            <Clock size={15} /> Answered 24/7 — a real person whenever you want one.
          </span>
        </div>

        <div className="footer-col">
          <h4>Services</h4>
          <a href="#services">Roof replacement</a>
          <a href="#services">Roof repair</a>
          <a href="#services">Storm &amp; insurance</a>
          <a href="#services">Inspections</a>
          <a href="#services">Gutters</a>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <a href="#work">Our work</a>
          <a href="#reviews">Reviews</a>
          <a href="#area">Service area</a>
          <a href="#financing">Financing</a>
          <a href="#faq">FAQ</a>
        </div>

        <div className="footer-col">
          <h4>Service area</h4>
          <p className="footer-area">
            Buffalo · Amherst · Clarence · Hamburg · East Aurora · Lockport · Lewiston · Medina ·
            Batavia · Brockport · Henrietta · Rochester — and everywhere between.
          </p>
        </div>
      </div>

      <div className="wrap footer-bottom">
        <span>
          © 2026 Roofalo. Licensed &amp; insured.{" "}
          <span className="placeholder-note">License #, certifications &amp; address — add these.</span>
        </span>
        <span>Built like a Buffalo.</span>
      </div>
    </footer>
  );
}
