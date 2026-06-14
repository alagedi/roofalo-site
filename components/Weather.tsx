import { Snow, Drop, Bolt, Home } from "./Icons";

const items = [
  { Icon: Snow, h: "Lake-effect snow load", p: "Feet of heavy, wet snow in a single storm. We build for the weight WNY roofs actually carry — not some national average." },
  { Icon: Drop, h: "Ice dams at the eaves", p: "Melt-freeze cycles back water up under your shingles. Proper ice-and-water shield at the eaves is non-negotiable here." },
  { Icon: Bolt, h: "Freeze-thaw punishment", p: "Western New York swings above and below freezing constantly. It's brutal on flashing, fasteners, and old shingles." },
  { Icon: Home, h: "Century homes welcome", p: "From 1912 Buffalo doubles to Rochester foursquares — we know the region's older housing stock inside out." },
];

export function Weather() {
  return (
    <section className="section weather" id="weather">
      <div className="wrap weather-grid">
        <div className="weather-intro">
          <div className="eyebrow">Built for here</div>
          <h2 className="h-lg">We know what a lake-effect winter does to a roof.</h2>
          <p className="lead">
            Because we live here too. A roof that&apos;s fine in Charlotte will fail in Cheektowaga.
            Local weather isn&apos;t a footnote for us — it&apos;s the whole job.
          </p>
          <div className="weather-quote">
            <Snow size={22} />
            <span>
              &ldquo;Ice-and-water shield three feet up from every eave. On a WNY roof, that&apos;s not an upsell —
              it&apos;s the difference between a dry winter and a ruined ceiling.&rdquo;
            </span>
          </div>
        </div>
        <div className="weather-cards">
          {items.map(({ Icon, h, p }) => (
            <div className="weather-card" key={h}>
              <div className="weather-ic" aria-hidden="true"><Icon size={24} /></div>
              <div>
                <h3 className="weather-h">{h}</h3>
                <p className="weather-p">{p}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
