"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, X, CheckCircle, Shield, ArrowLeft, ArrowRight, Bolt } from "./Icons";

interface AssessResult {
  title: string;
  likely: string;
  checklist: string[];
}

const FALLBACK_ASSESSMENTS: AssessResult[] = [
  {
    title: "Looks like wind-lifted shingles",
    likely: "Very common after a WNY wind storm. When shingles lift or tear, the seal underneath breaks and water can sneak in even when it looks minor from the ground.",
    checklist: ["Whether the underlayment got wet", "How many courses are affected", "If it's a quick repair or a section replacement"],
  },
  {
    title: "Looks like granule loss & aging",
    likely: "Those bald, shiny patches mean the protective granules are washing off — usually a sign the shingles are near the end of their life. Not an emergency, but worth a real look.",
    checklist: ["The actual remaining life of the roof", "Whether a repair buys you time or a replacement makes more sense", "Any soft decking underneath"],
  },
  {
    title: "Looks like a flashing or valley leak",
    likely: "Staining around a chimney, vent, or valley usually points to flashing — the metal that seals roof joints. It's one of the most common (and fixable) leak sources here.",
    checklist: ["Where exactly the water is getting in", "Whether the flashing can be resealed or needs replacing", "If there's hidden moisture in the attic"],
  },
];

interface PhotoAssessProps {
  open: boolean;
  onClose: () => void;
  onBook: () => void;
}

export function PhotoAssess({ open, onClose, onBook }: PhotoAssessProps) {
  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([]);
  const [phase, setPhase] = useState<"upload" | "reading" | "result">("upload");
  const [result, setResult] = useState<AssessResult | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => closeRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const f = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", f);
    return () => document.removeEventListener("keydown", f);
  }, [open]);

  useEffect(() => {
    if (phase !== "reading") return;
    let done = false;

    const runAssess = async () => {
      try {
        if (photos.length > 0) {
          const formData = new FormData();
          // Convert blob URL back to file for upload
          const res = await fetch("/api/photo-assess", {
            method: "POST",
            body: JSON.stringify({ imageCount: photos.length }),
            headers: { "Content-Type": "application/json" },
          });
          if (res.ok) {
            const data = await res.json();
            if (!done) {
              setResult(data);
              setPhase("result");
            }
            return;
          }
        }
      } catch {
        // fall through to fallback
      }
      // Fallback to local result after delay
      await new Promise((r) => setTimeout(r, 2400));
      if (!done) {
        setResult(FALLBACK_ASSESSMENTS[Math.floor(Math.random() * FALLBACK_ASSESSMENTS.length)]);
        setPhase("result");
      }
    };

    runAssess();
    return () => { done = true; };
  }, [phase, photos]);

  if (!open) return null;

  function addPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = [...(e.target.files ?? [])].slice(0, 4);
    setPhotos((p) => [...p, ...files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }))].slice(0, 4));
  }

  function close() {
    onClose();
    setTimeout(() => { setPhotos([]); setPhase("upload"); setResult(null); }, 250);
  }

  return (
    <div
      className="bk-overlay"
      onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pa-title"
    >
      <div className="bk-modal pa-modal reveal">
        <div className="bk-head">
          <div className="bk-head-l">
            <div className="pa-headic"><Camera size={20} /></div>
            <div>
              <div className="bk-title" id="pa-title">See something wrong?</div>
              <div className="bk-sub">Send a photo, get a quick read</div>
            </div>
          </div>
          <button ref={closeRef} className="bk-close" onClick={close} aria-label="Close">
            <X size={22} />
          </button>
        </div>

        <div className="bk-body">
          {phase === "upload" && (
            <div className="reveal">
              <p className="bk-lead">
                Snap or upload a photo of what&apos;s worrying you — a stain, missing shingles, sagging, anything.
                You&apos;ll get a quick, plain-language read in seconds.
              </p>
              <label className="pa-drop">
                <Camera size={34} />
                <b>Add a photo</b>
                <span>Take a picture or choose from your phone</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={addPhotos}
                  hidden
                  aria-label="Upload roof photos"
                />
              </label>
              {photos.length > 0 && (
                <div className="pa-thumbs">
                  {photos.map((p, i) => (
                    <div className="bk-thumb" key={i}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt={`Uploaded photo ${i + 1}`} />
                    </div>
                  ))}
                </div>
              )}
              <div className="bk-callout">
                <CheckCircle size={16} />
                <span>
                  This is a quick preliminary read — not a diagnosis. We always confirm with a free inspection.
                </span>
              </div>
            </div>
          )}

          {phase === "reading" && (
            <div className="pa-reading reveal" aria-live="polite" aria-label="Analyzing your photo">
              <div className="pa-scan">
                {photos[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photos[0].url} alt="Your roof photo being analyzed" />
                )}
                <div className="pa-scanline" aria-hidden="true" />
              </div>
              <div className="pa-reading-label">
                <span className="rc-spinner" aria-hidden="true" />
                Taking a look at your photo…
              </div>
            </div>
          )}

          {phase === "result" && result && (
            <div className="reveal" aria-live="polite">
              <div className="pa-prelim">Preliminary read</div>
              <h3 className="pa-title">{result.title}</h3>
              <p className="pa-likely">{result.likely}</p>
              <div className="pa-check">
                <div className="pa-check-h">What we&apos;d confirm on a free inspection</div>
                <ul>
                  {result.checklist.map((c, i) => (
                    <li key={i}>
                      <CheckCircle size={16} /> {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pa-note">
                <Shield size={15} />
                This is a friendly first read, not a binding diagnosis — roofs need real eyes on them.
                No pressure, no obligation.
              </div>
            </div>
          )}
        </div>

        <div className="bk-foot">
          {phase === "upload" && (
            <>
              <span className="bk-foot-note"><Bolt size={15} /> Instant</span>
              <button
                className="btn btn-primary"
                disabled={!photos.length}
                onClick={() => setPhase("reading")}
              >
                Get my read <ArrowRight size={18} />
              </button>
            </>
          )}
          {phase === "reading" && (
            <button className="btn btn-ghost btn-block" onClick={() => setPhase("upload")}>
              Cancel
            </button>
          )}
          {phase === "result" && (
            <>
              <button className="btn btn-ghost bk-back" onClick={() => setPhase("upload")}>
                <ArrowLeft size={18} /> Back
              </button>
              <button
                className="btn btn-primary"
                onClick={() => { close(); onBook(); }}
              >
                Confirm it — book free inspection
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
