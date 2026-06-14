"use client";

import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { Phone, Menu, X } from "./Icons";

const PHONE = "(716) 200-0707";
const TEL = "+17162000707";

const LINKS = [
  ["Services", "#services"],
  ["Our work", "#work"],
  ["Service area", "#area"],
  ["Reviews", "#reviews"],
  ["Financing", "#financing"],
];

export function Header({ onBook }: { onBook?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", f, { passive: true });
    f();
    return () => window.removeEventListener("scroll", f);
  }, []);

  // Close sheet on Escape
  useEffect(() => {
    if (!open) return;
    const f = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", f);
    return () => document.removeEventListener("keydown", f);
  }, [open]);

  return (
    <header className={"hdr " + (scrolled ? "hdr-on" : "")}>
      <div className="wrap hdr-row">
        <a href="#top" className="hdr-logo" aria-label="Roofalo — home">
          <Logo size={34} tone={scrolled ? "ink" : "light"} badge={scrolled ? "dark" : "copper"} />
        </a>
        <nav className="hdr-nav" aria-label="Main navigation">
          {LINKS.map(([t, h]) => (
            <a key={h} href={h}>{t}</a>
          ))}
        </nav>
        <div className="hdr-actions">
          <a href={"tel:" + TEL} className="hdr-phone" aria-label={`Call ${PHONE}`}>
            <Phone size={17} />
            <span>{PHONE}</span>
          </a>
          {onBook ? (
            <button className="btn btn-primary hdr-cta" onClick={onBook}>
              Free inspection
            </button>
          ) : (
            <a href="/" className="btn btn-primary hdr-cta">
              Free inspection
            </a>
          )}
          <button
            className="hdr-burger"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {open && (
        <div
          className="hdr-sheet"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="hdr-sheet-inner" onClick={(e) => e.stopPropagation()}>
            <button className="hdr-sheet-x" onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={24} />
            </button>
            {LINKS.map(([t, h]) => (
              <a key={h} href={h} onClick={() => setOpen(false)}>{t}</a>
            ))}
            <a href={"tel:" + TEL} className="hdr-sheet-phone">
              <Phone size={18} /> {PHONE}
            </a>
            {onBook ? (
              <button
                className="btn btn-primary btn-block"
                onClick={() => { setOpen(false); onBook(); }}
              >
                Get my free inspection
              </button>
            ) : (
              <a href="/" className="btn btn-primary btn-block">
                Get my free inspection
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
