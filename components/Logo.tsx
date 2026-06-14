import React from "react";

const BUFFALO_PATH =
  "M18 92 L33 73 Q36 66 39 65 Q31 55 31 50 Q42 58 48 65 Q55 40 68 30 Q71 28 75 31 Q112 44 151 59 Q169 67 171 81 Q172 101 166 107 L150 107 L92 109 L60 108 Q52 108 50 111 Q44 117 37 115 Q42 107 41 99 Q34 97 30 93 Z";

const BUFFALO_LEGS = (
  <>
    <rect x="56" y="103" width="14" height="40" rx="2.5" />
    <rect x="73" y="105" width="13" height="38" rx="2.5" />
    <rect x="135" y="104" width="13" height="39" rx="2.5" />
    <rect x="153" y="103" width="14" height="40" rx="2.5" />
  </>
);

export function BuffaloSilhouette({
  size = 120,
  color = "currentColor",
  style,
}: {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 200 150"
      width={size}
      height={(size * 150) / 200}
      style={style}
      aria-hidden="true"
    >
      <g fill={color}>
        <path d={BUFFALO_PATH} />
        {BUFFALO_LEGS}
      </g>
    </svg>
  );
}

type BadgeVariant = "dark" | "copper" | "light";

export function BuffaloBadge({
  size = 64,
  variant = "dark",
}: {
  size?: number;
  variant?: BadgeVariant;
}) {
  const cfg = {
    dark: {
      shield: "var(--ink)",
      ring: "rgba(255,255,255,0.16)",
      roof: "var(--amber)",
      buffalo: "#f3eee4",
      ground: "rgba(255,255,255,0.14)",
    },
    copper: {
      shield: "var(--copper)",
      ring: "rgba(255,255,255,0.22)",
      roof: "#fff",
      buffalo: "#fff",
      ground: "rgba(255,255,255,0.2)",
    },
    light: {
      shield: "var(--cream-card)",
      ring: "var(--line)",
      roof: "var(--copper)",
      buffalo: "var(--ink)",
      ground: "var(--line)",
    },
  }[variant];

  return (
    <svg
      viewBox="0 0 240 264"
      width={size}
      height={(size * 264) / 240}
      aria-label="Roofalo buffalo badge"
    >
      <path
        d="M120 6 L226 36 V128 C226 196 180 238 120 258 C60 238 14 196 14 128 V36 Z"
        fill={cfg.shield}
        stroke={cfg.ring}
        strokeWidth="5"
      />
      <path
        d="M58 96 L120 58 L182 96"
        fill="none"
        stroke={cfg.roof}
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g transform="translate(38 116) scale(0.82)">
        <g fill={cfg.buffalo}>
          <path d={BUFFALO_PATH} />
          {BUFFALO_LEGS}
        </g>
      </g>
      <rect x="56" y="232" width="128" height="5" rx="2.5" fill={cfg.ground} />
    </svg>
  );
}

export function Logo({
  size = 40,
  tone = "ink",
  badge = "dark" as BadgeVariant,
}: {
  size?: number;
  tone?: "ink" | "light";
  badge?: BadgeVariant;
}) {
  const color = tone === "light" ? "#f3eee4" : "var(--ink)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
      <BuffaloBadge size={size} variant={badge} />
      <div style={{ lineHeight: 0.92 }}>
        <svg
          viewBox="0 0 240 22"
          width={size * 1.9}
          height={size * 0.18}
          style={{ display: "block", marginBottom: size * 0.05, overflow: "visible" }}
          aria-hidden="true"
        >
          <path
            d="M14 18 L120 5 L226 18"
            fill="none"
            stroke="var(--copper)"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 800,
            fontSize: size * 0.62,
            letterSpacing: "-0.03em",
            color,
          }}
        >
          Roofalo
        </div>
        <div
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontWeight: 700,
            fontSize: size * 0.21,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--copper)",
            marginTop: 3,
          }}
        >
          Buffalo&nbsp;→&nbsp;Rochester
        </div>
      </div>
    </div>
  );
}
