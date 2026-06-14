import type { Metadata } from "next";
import { Archivo, Hanken_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_ANALYTICS_ID;

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Roofalo — Roofing for Western New York | Buffalo to Rochester",
    template: "%s | Roofalo",
  },
  description:
    "Honest roofing for the Buffalo→Rochester corridor. Free inspections, real local crew, fair prices. Licensed & insured. Call or text 24/7.",
  keywords: [
    "roofing",
    "Buffalo NY",
    "Rochester NY",
    "Western New York",
    "roof replacement",
    "storm damage",
    "insurance claim",
    "WNY roofer",
  ],
  openGraph: {
    title: "Roofalo — Built like a Buffalo.",
    description:
      "Honest roofing for the Buffalo→Rochester corridor. Free inspections, fair prices, local crew.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roofalo — Built like a Buffalo.",
    description: "Honest roofing for the Buffalo→Rochester corridor.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${hanken.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RoofingContractor",
              name: "Roofalo",
              description:
                "Residential roofing serving the Buffalo to Rochester corridor in Western New York.",
              telephone: "+17162000707",
              areaServed: [
                "Buffalo, NY",
                "Amherst, NY",
                "Clarence, NY",
                "Williamsville, NY",
                "Hamburg, NY",
                "East Aurora, NY",
                "Lancaster, NY",
                "Lockport, NY",
                "Lewiston, NY",
                "Medina, NY",
                "Batavia, NY",
                "Brockport, NY",
                "Henrietta, NY",
                "Rochester, NY",
              ],
              openingHours: "Mo-Su 00:00-23:59",
              priceRange: "$$",
              knowsAbout: [
                "Roof replacement",
                "Roof repair",
                "Storm damage",
                "Insurance claims",
                "Ice dams",
                "Lake-effect snow",
              ],
            }),
          }}
        />
      </head>
      <body
        style={
          {
            fontFamily: "var(--font-body), system-ui, sans-serif",
          } as React.CSSProperties
        }
      >
        {children}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { page_path: window.location.pathname });
            `}</Script>
          </>
        )}
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
