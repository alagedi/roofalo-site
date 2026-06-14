"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyBar } from "@/components/StickyBar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="btn btn-primary"
        style={{
          position: "absolute",
          top: -100,
          left: 16,
          zIndex: 9999,
          transition: "top .2s",
        }}
        onFocus={(e) => { (e.currentTarget as HTMLAnchorElement).style.top = "16px"; }}
        onBlur={(e) => { (e.currentTarget as HTMLAnchorElement).style.top = "-100px"; }}
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <StickyBar />
    </>
  );
}
