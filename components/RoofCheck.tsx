"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Pin, Bolt, ArrowRight, Calendar, Wallet, CheckCircle, Search } from "./Icons";

function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function FauxSatellite({ address, phase }: { address: string; phase: "scanning" | "result" }) {
  const data = useMemo(() => {
    const rnd = mulberry32(hashStr(address || "default") || 1);
    const r = (a: number, b: number) => a + (b - a) * rnd();
    const hip = rnd() > 0.5;
    const cx = 300 + r(-18, 18), cy = 300 + r(-14, 14);
    const w = r(120, 165), h = r(95, 130);
    const rot = r(-10, 12);
    const houses = [];
    for (let i = 0; i < 7; i++) {
      const ang = (i / 7) * Math.PI * 2 + r(-0.3, 0.3);
      const dist = r(180, 270);
      const hx = 300 + Math.cos(ang) * dist, hy = 300 + Math.sin(ang) * dist * 0.9;
      if (hx < 40 || hx > 560 || hy < 40 || hy > 560) continue;
      houses.push({ x: hx, y: hy, w: r(55, 95), h: r(45, 80), rot: r(-15, 15), tone: ["#7b6f63", "#6d6258", "#857a6d", "#5f574e"][i % 4] });
    }
    const trees = [];
    for (let i = 0; i < 26; i++) {
      const tx = r(20, 580), ty = r(20, 580);
      if (Math.hypot(tx - cx, ty - cy) < 95) continue;
      trees.push({ x: tx, y: ty, r: r(9, 20) });
    }
    return { hip, cx, cy, w, h, rot, houses, trees };
  }, [address]);

  const { cx, cy, w, h, rot, hip, houses, trees } = data;
  const hw = w / 2, hh = h / 2;
  const ridge = hh * 0.34;
  const gable = [
    `${cx - hw},${cy - hh} ${cx + hw},${cy - hh} ${cx + hw},${cy} ${cx - hw},${cy}`,
    `${cx - hw},${cy} ${cx + hw},${cy} ${cx + hw},${cy + hh} ${cx - hw},${cy + hh}`,
  ];
  const hipFacets = [
    `${cx},${cy - ridge} ${cx + hw},${cy - hh} ${cx - hw},${cy - hh}`,
    `${cx},${cy - ridge} ${cx + hw},${cy - hh} ${cx + hw},${cy + hh} ${cx},${cy + ridge}`,
    `${cx},${cy + ridge} ${cx + hw},${cy + hh} ${cx - hw},${cy + hh}`,
    `${cx},${cy - ridge} ${cx - hw},${cy - hh} ${cx - hw},${cy + hh} ${cx},${cy + ridge}`,
  ];
  const outline = `${cx - hw},${cy - hh} ${cx + hw},${cy - hh} ${cx + hw},${cy + hh} ${cx - hw},${cy + hh}`;
  const facetPolys = hip ? hipFacets : gable;

  return (
    <svg
      viewBox="0 0 600 600"
      style={{ width: "100%", height: "100%", display: "block" }}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
        </filter>
        <radialGradient id="vign" cx="50%" cy="45%" r="75%">
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.38" />
        </radialGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c8456" />
          <stop offset="50%" stopColor="#6f7a4c" />
          <stop offset="100%" stopColor="#5f6b42" />
        </linearGradient>
        {phase === "scanning" && (
          <linearGradient id="sweepG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e08b3a" stopOpacity="0" />
            <stop offset="100%" stopColor="#e08b3a" stopOpacity="0.28" />
          </linearGradient>
        )}
      </defs>
      <rect width="600" height="600" fill="url(#ground)" />
      <g opacity="0.95">
        <rect x="-40" y="250" width="700" height="48" rx="2" fill="#52514d" transform="rotate(-6 300 300)" />
        <rect x="330" y="-40" width="44" height="700" rx="2" fill="#56554f" transform="rotate(-6 300 300)" />
        <rect x="-40" y="272" width="700" height="3" fill="#cabf7a" opacity="0.5" transform="rotate(-6 300 300)" />
      </g>
      {trees.map((t, i) => (
        <g key={i}>
          <circle cx={t.x + 2} cy={t.y + 3} r={t.r} fill="#2f3a22" opacity="0.5" />
          <circle cx={t.x} cy={t.y} r={t.r} fill="#3c4a28" />
          <circle cx={t.x - t.r * 0.3} cy={t.y - t.r * 0.3} r={t.r * 0.55} fill="#4a5a32" />
        </g>
      ))}
      {houses.map((hs, i) => (
        <g key={i} transform={`rotate(${hs.rot} ${hs.x} ${hs.y})`}>
          <rect x={hs.x - hs.w / 2 + 4} y={hs.y - hs.h / 2 + 5} width={hs.w} height={hs.h} rx="2" fill="#000" opacity="0.22" />
          <rect x={hs.x - hs.w / 2} y={hs.y - hs.h / 2} width={hs.w} height={hs.h} rx="2" fill={hs.tone} />
          <line x1={hs.x - hs.w / 2} y1={hs.y} x2={hs.x + hs.w / 2} y2={hs.y} stroke="#000" strokeOpacity="0.18" strokeWidth="2" />
        </g>
      ))}
      <g transform={`rotate(${rot} ${cx} ${cy})`}>
        <polygon points={outline} fill="#000" opacity="0.28" transform="translate(5 7)" />
        {facetPolys.map((p, i) => (
          <polygon key={i} points={p} fill={i % 2 ? "#6b5f54" : "#776a5d"} stroke="#3a332c" strokeWidth="1.5" />
        ))}
        {phase === "result" && (
          <g>
            <polygon
              points={outline}
              fill="#e08b3a"
              fillOpacity="0.16"
              stroke="#e08b3a"
              strokeWidth="4.5"
              strokeLinejoin="round"
              style={{ strokeDasharray: 1400, strokeDashoffset: 1400, animation: "roofTrace 1.3s ease forwards" }}
            />
            {facetPolys.map((p, i) => (
              <polygon
                key={i}
                points={p}
                fill="none"
                stroke="#fff"
                strokeOpacity="0.7"
                strokeWidth="1.6"
                strokeDasharray="5 6"
                style={{ opacity: 0, animation: `facetFade .5s ease forwards ${1 + i * 0.12}s` }}
              />
            ))}
          </g>
        )}
      </g>
      <rect width="600" height="600" filter="url(#grain)" opacity="0.7" style={{ mixBlendMode: "overlay" }} />
      <rect width="600" height="600" fill="url(#vign)" />
      {phase === "scanning" && (
        <g>
          <rect width="600" height="600" fill="#0b1a24" opacity="0.42" />
          <g style={{ animation: "sweep 1.8s linear infinite" }}>
            <rect x="0" y="-120" width="600" height="120" fill="url(#sweepG)" />
            <line x1="0" y1="0" x2="600" y2="0" stroke="#e08b3a" strokeWidth="2.5" opacity="0.9" />
          </g>
          <g stroke="#e08b3a" strokeWidth="2" fill="none" opacity="0.85">
            <line x1="300" y1="250" x2="300" y2="270" /><line x1="300" y1="330" x2="300" y2="350" />
            <line x1="250" y1="300" x2="270" y2="300" /><line x1="330" y1="300" x2="350" y2="300" />
            <circle cx="300" cy="300" r="46" strokeDasharray="6 8" style={{ animation: "spin 5s linear infinite", transformOrigin: "300px 300px" }} />
          </g>
        </g>
      )}
    </svg>
  );
}

const STEPS = ["Locating your roof…", "Tracing the roof outline…", "Measuring facets & pitch…", "Crunching the numbers…"];

type Phase = "idle" | "scanning" | "result";

interface RoofCheckResult {
  measured: boolean;
  sqft?: number;
  facets?: number;
  pitch?: string;
  low?: number;
  high?: number;
  imageUrl?: string;
}

interface Suggestion { label: string; placeId: string }

export function RoofCheck({ onBook }: { onBook: (addr: string) => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [addr, setAddr] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [dropOpen, setDropOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [showPrice, setShowPrice] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [sqft, setSqft] = useState(0);
  const [result, setResult] = useState<RoofCheckResult | null>(null);

  const localData = useMemo(() => {
    const rnd = mulberry32(hashStr(submitted || "x") || 1);
    const sf = Math.round(((rnd() * 1500 + 1700) / 50)) * 50;
    return {
      sqft: sf,
      facets: rnd() > 0.5 ? 4 : 2,
      pitch: ["4:12", "6:12", "7:12", "8:12"][Math.floor(rnd() * 4)],
    };
  }, [submitted]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchSuggestions = useCallback((val: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.length < 3) { setSuggestions([]); setDropOpen(false); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/places?q=${encodeURIComponent(val)}`);
        const data: Suggestion[] = await res.json();
        setSuggestions(data);
        setDropOpen(data.length > 0);
        setActiveIdx(-1);
      } catch { /* silent */ }
    }, 280);
  }, []);

  function pickSuggestion(label: string) {
    setAddr(label);
    setSuggestions([]);
    setDropOpen(false);
    setActiveIdx(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!dropOpen || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      pickSuggestion(suggestions[activeIdx].label);
    } else if (e.key === "Escape") {
      setDropOpen(false);
    }
  }

  const fetchRoofData = useCallback(async (address: string) => {
    try {
      const res = await fetch("/api/roof-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      if (!res.ok) return null;
      return await res.json() as RoofCheckResult;
    } catch {
      return null;
    }
  }, []);

  function start(e: React.FormEvent) {
    e.preventDefault();
    const v = addr.trim() || "123 Elmwood Ave, Buffalo NY";
    if (!addr.trim()) setAddr(v);
    setSubmitted(v);
    setPhase("scanning");
    setShowPrice(false);
    setStepIdx(0);
    setResult(null);

    fetchRoofData(v).then((data) => {
      setResult(data);
    });
  }

  useEffect(() => {
    if (phase !== "scanning") return;
    let i = 0;
    const t = setInterval(() => { i++; if (i < STEPS.length) setStepIdx(i); }, 620);
    const done = setTimeout(() => setPhase("result"), 2700);
    return () => { clearInterval(t); clearTimeout(done); };
  }, [phase]);

  useEffect(() => {
    if (phase !== "result") return;
    const target = result?.sqft ?? localData.sqft;
    const dur = 1100;
    const t0 = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setSqft(Math.round((target * e) / 10) * 10);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const guarantee = setTimeout(() => setSqft(target), dur + 120);
    return () => { cancelAnimationFrame(raf); clearTimeout(guarantee); };
  }, [phase, result, localData.sqft]);

  const displayData = result?.measured ? result : {
    measured: false,
    sqft: localData.sqft,
    facets: localData.facets,
    pitch: localData.pitch,
    low: Math.round((localData.sqft * 4.6) / 100) * 100,
    high: Math.round((localData.sqft * 7.2) / 100) * 100,
  };

  if (phase === "idle") {
    return (
      <form onSubmit={start} className="rc">
        <div className="rc-inputrow" ref={wrapRef} style={{ position: "relative" }}>
          <span className="rc-pin"><Pin size={22} /></span>
          <input
            className="rc-input"
            value={addr}
            onChange={(e) => { setAddr(e.target.value); fetchSuggestions(e.target.value); }}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setDropOpen(true)}
            placeholder="Type your address…"
            autoComplete="off"
            aria-label="Your home address"
            aria-autocomplete="list"
            aria-expanded={dropOpen}
            aria-controls="rc-suggestions"
            role="combobox"
          />
          <button type="submit" className="btn btn-primary rc-go">
            <span>See my roof</span>
            <ArrowRight size={20} />
          </button>

          {dropOpen && suggestions.length > 0 && (
            <ul
              id="rc-suggestions"
              role="listbox"
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                right: 0,
                background: "#fff",
                border: "1.5px solid var(--line)",
                borderRadius: "var(--r)",
                boxShadow: "var(--shadow-md)",
                zIndex: 200,
                listStyle: "none",
                margin: 0,
                padding: "6px 0",
                overflow: "hidden",
              }}
            >
              {suggestions.map((s, i) => (
                <li
                  key={s.placeId}
                  role="option"
                  aria-selected={i === activeIdx}
                  onMouseDown={(e) => { e.preventDefault(); pickSuggestion(s.label); }}
                  onMouseEnter={() => setActiveIdx(i)}
                  style={{
                    padding: "10px 16px",
                    cursor: "pointer",
                    fontSize: 14,
                    color: "var(--ink)",
                    background: i === activeIdx ? "var(--bone)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Pin size={14} style={{ color: "var(--copper)", flexShrink: 0 }} />
                  {s.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rc-hint">
          <Bolt size={14} />
          <span>An aerial view of <em>your</em> roof in seconds — no ladder, no visit, no call.</span>
        </div>
      </form>
    );
  }

  return (
    <div className="rc-viewer card reveal" role="status" aria-live="polite">
      <div className="rc-stage">
        <FauxSatellite address={submitted} phase={phase === "scanning" ? "scanning" : "result"} />
        <span className="rc-badge-loc"><Pin size={13} /> {submitted}</span>
        <span className="rc-badge-src">
          {result?.measured ? "Google Solar API · real data" : "Aerial preview · estimated"}
        </span>
        {phase === "scanning" && (
          <div className="rc-scanlabel">
            <span className="rc-spinner" aria-hidden="true" />
            <span key={stepIdx} className="rc-steptext">{STEPS[stepIdx]}</span>
          </div>
        )}
      </div>

      {phase === "result" && (
        <div className="rc-result reveal">
          {!result?.measured && (
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12, padding: "8px 10px", background: "var(--bone-2)", borderRadius: 8 }}>
              We couldn&apos;t auto-measure this address — these are estimates. Your free inspection gives you the real number.
            </p>
          )}
          <div className="rc-metrics">
            <div className="rc-metric">
              <div className="rc-metric-num">
                {sqft.toLocaleString()}<span>ft²</span>
              </div>
              <div className="rc-metric-lbl">Roof area (approx.)</div>
            </div>
            <div className="rc-metric">
              <div className="rc-metric-num">{displayData.facets}</div>
              <div className="rc-metric-lbl">Roof facets</div>
            </div>
            <div className="rc-metric">
              <div className="rc-metric-num">{displayData.pitch}</div>
              <div className="rc-metric-lbl">Est. pitch</div>
            </div>
          </div>

          {!showPrice ? (
            <div className="rc-actions">
              <button className="btn btn-primary btn-block" onClick={() => onBook(submitted)}>
                <Calendar size={19} /> Book a free inspection
              </button>
              <button className="btn btn-ghost btn-block" onClick={() => setShowPrice(true)}>
                <Wallet size={19} /> Get a ballpark range
              </button>
            </div>
          ) : (
            <div className="rc-price reveal">
              <div className="rc-price-lbl">Ballpark for a full replacement</div>
              <div className="rc-price-range">
                ${displayData.low?.toLocaleString()}<span>–</span>${displayData.high?.toLocaleString()}
              </div>
              <p className="rc-price-note">
                <CheckCircle size={15} />
                A real number — not a teaser. Your free inspection confirms the exact price <em>in writing</em>. No surprises, no pressure.
              </p>
              <button className="btn btn-primary btn-block" onClick={() => onBook(submitted)}>
                <Calendar size={19} /> Lock it in — book my free inspection
              </button>
            </div>
          )}

          <button className="rc-reset" onClick={() => { setPhase("idle"); setShowPrice(false); }}>
            <Search size={15} /> Check a different address
          </button>
        </div>
      )}
    </div>
  );
}
