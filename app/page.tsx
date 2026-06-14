"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AreaSection } from "@/components/AreaSection";
import { TrustStack } from "@/components/TrustStack";
import { HowItWorks } from "@/components/HowItWorks";
import { Services } from "@/components/Services";
import { OurWork } from "@/components/OurWork";
import { Weather } from "@/components/Weather";
import { Financing } from "@/components/Financing";
import { Reviews } from "@/components/Reviews";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { StickyBar } from "@/components/StickyBar";
import { BookingModal } from "@/components/BookingModal";
import { PhotoAssess } from "@/components/PhotoAssess";

export default function HomePage() {
  const [booking, setBooking] = useState({ open: false, addr: "" });
  const [photoOpen, setPhotoOpen] = useState(false);

  const openBook = useCallback((addr?: string) => {
    setBooking({ open: true, addr: typeof addr === "string" ? addr : "" });
  }, []);

  const closeBook = useCallback(() => {
    setBooking((b) => ({ ...b, open: false }));
  }, []);

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

      <Header onBook={openBook} />

      <main id="main-content">
        <Hero onBook={openBook} onPhoto={() => setPhotoOpen(true)} />
        <AreaSection onBook={openBook} />
        <TrustStack />
        <HowItWorks onBook={openBook} />
        <Services onBook={openBook} />
        <OurWork />
        <Weather />
        <Financing onBook={openBook} />
        <Reviews />
        <FAQ onBook={openBook} />
        <FinalCTA onBook={openBook} />
      </main>

      <Footer />
      <StickyBar onBook={openBook} />

      <BookingModal
        open={booking.open}
        prefillAddress={booking.addr}
        onClose={closeBook}
      />
      <PhotoAssess
        open={photoOpen}
        onClose={() => setPhotoOpen(false)}
        onBook={() => openBook()}
      />
    </>
  );
}
