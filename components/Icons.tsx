"use client";

import React from "react";

interface IconProps {
  size?: number;
  sw?: number;
  fill?: string;
  stroke?: string;
  className?: string;
  style?: React.CSSProperties;
}

const I = ({
  d,
  size = 22,
  sw = 1.9,
  fill = "none",
  children,
  ...rest
}: IconProps & { d?: string; children?: React.ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={fill}
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    {d ? <path d={d} /> : children}
  </svg>
);

export const Phone = (p: IconProps) => (
  <I {...p} d="M5 3h3.5l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5V21a1 1 0 0 1-1 1A17 17 0 0 1 4 5a1 1 0 0 1 1-2z" />
);
export const Star = ({ size = 18, ...p }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2.5l2.9 6 6.6.6-5 4.3 1.5 6.5L12 16.9 6 19.9l1.5-6.5-5-4.3 6.6-.6z" />
  </svg>
);
export const Shield = (p: IconProps) => (
  <I {...p}>
    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
    <path d="M9 12l2 2 4-4.5" />
  </I>
);
export const Check = (p: IconProps) => <I {...p} d="M5 12.5l4.5 4.5L19 7" />;
export const CheckCircle = (p: IconProps) => (
  <I {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.3l2.4 2.4 4.6-5" />
  </I>
);
export const Pin = (p: IconProps) => (
  <I {...p}>
    <path d="M12 21c4-4 7-7.5 7-11a7 7 0 1 0-14 0c0 3.5 3 7 7 11z" />
    <circle cx="12" cy="10" r="2.4" />
  </I>
);
export const Bolt = ({ fill = "currentColor", size, ...p }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size || 22} height={size || 22} fill={fill} aria-hidden="true" {...p}>
    <path d="M13 2L4 14h6l-1 8 9-12h-6z" />
  </svg>
);
export const Search = (p: IconProps) => (
  <I {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </I>
);
export const Camera = (p: IconProps) => (
  <I {...p}>
    <path d="M3 8h3l1.5-2.5h9L18 8h3v11H3z" />
    <circle cx="12" cy="13" r="3.4" />
  </I>
);
export const Home = (p: IconProps) => (
  <I {...p}>
    <path d="M4 11l8-6 8 6" />
    <path d="M6 10v9h12v-9" />
  </I>
);
export const Calendar = (p: IconProps) => (
  <I {...p}>
    <rect x="4" y="5" width="16" height="16" rx="2.5" />
    <path d="M4 9h16M8 3v4M16 3v4" />
  </I>
);
export const Clock = (p: IconProps) => (
  <I {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V12l3 2" />
  </I>
);
export const Snow = (p: IconProps) => (
  <I {...p}>
    <path d="M12 3v18M5 7l14 10M19 7L5 17" />
    <path d="M12 7l-2-2M12 7l2-2M12 17l-2 2M12 17l2 2" />
  </I>
);
export const Wallet = (p: IconProps) => (
  <I {...p}>
    <rect x="3" y="6" width="18" height="13" rx="2.5" />
    <path d="M16 12.5h2.5" />
    <path d="M3 9h13a2 2 0 0 1 2 2" />
  </I>
);
export const ArrowRight = (p: IconProps) => <I {...p} d="M5 12h14M13 6l6 6-6 6" />;
export const ArrowLeft = (p: IconProps) => <I {...p} d="M19 12H5M11 6l-6 6 6 6" />;
export const Plus = (p: IconProps) => <I {...p} d="M12 5v14M5 12h14" />;
export const Minus = (p: IconProps) => <I {...p} d="M5 12h14" />;
export const X = (p: IconProps) => <I {...p} d="M6 6l12 12M18 6L6 18" />;
export const Menu = (p: IconProps) => <I {...p} d="M4 7h16M4 12h16M4 17h16" />;
export const Drop = (p: IconProps) => (
  <I {...p} d="M12 3c3 4 6 7 6 10.5A6 6 0 0 1 6 13.5C6 10 9 7 12 3z" />
);
export const Wrench = (p: IconProps) => (
  <I {...p} d="M14 7a4 4 0 0 0-5.2 5.2L3 18l3 3 5.8-5.8A4 4 0 0 0 17 10l-2.3 2.3-2-2L15 8z" />
);
export const Gutter = (p: IconProps) => (
  <I {...p}>
    <path d="M3 7l9-4 9 4" />
    <path d="M5 9v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" />
    <path d="M5 13h14" />
  </I>
);
export const Doc = (p: IconProps) => (
  <I {...p}>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4M9 13h6M9 17h6" />
  </I>
);
export const Spark = (p: IconProps) => (
  <I
    {...p}
    d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"
    fill="currentColor"
    stroke="none"
  />
);
export const PlayIcon = (p: IconProps) => <I {...p} d="M8 5l11 7-11 7z" fill="currentColor" stroke="none" />;
