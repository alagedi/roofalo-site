"use client";

import { useEffect, useState } from "react";
import { Phone, Calendar } from "./Icons";

const TEL = "+17162000707";

export function StickyBar({ onBook }: { onBook?: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const f = () => setShow(window.scrollY > 520);
    window.addEventListener("scroll", f, { passive: true });
    f();
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <div className={"sticky " + (show ? "on" : "")} aria-hidden={!show}>
      <a className="sticky-call" href={"tel:" + TEL} aria-label="Call or text Roofalo">
        <Phone size={20} />
        <span>Call / Text</span>
      </a>
      {onBook ? (
        <button className="sticky-book" onClick={onBook} aria-label="Book a free inspection">
          <Calendar size={20} /> Free Inspection
        </button>
      ) : (
        <a className="sticky-book" href="/" aria-label="Book a free inspection">
          <Calendar size={20} /> Free Inspection
        </a>
      )}
    </div>
  );
}
