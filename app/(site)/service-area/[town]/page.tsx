import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

const CORRIDOR_TOWNS: Record<string, { name: string; county: string; blurb: string }> = {
  buffalo:         { name: "Buffalo",        county: "Erie",    blurb: "We work across all Buffalo neighborhoods — North Buffalo, the East Side, South Buffalo, and everywhere in between." },
  amherst:         { name: "Amherst",        county: "Erie",    blurb: "Amherst's mix of postwar ranches and newer construction all get the same honest inspection and fair quote." },
  clarence:        { name: "Clarence",       county: "Erie",    blurb: "Clarence's open country means more wind exposure. We know what the storms do to roofs out here." },
  williamsville:   { name: "Williamsville",  county: "Erie",    blurb: "We've worked on roofs all through Williamsville — the village core and the surrounding developments alike." },
  cheektowaga:     { name: "Cheektowaga",    county: "Erie",    blurb: "From the airport corridor to established neighborhoods, Cheektowaga roofs get the same crew, same honesty." },
  "west-seneca":   { name: "West Seneca",    county: "Erie",    blurb: "West Seneca's older housing stock is our specialty — we know the materials and the common failure points." },
  hamburg:         { name: "Hamburg",        county: "Erie",    blurb: "Hamburg to Lake Erie shoreline — we cover the whole south towns area with free, no-pressure inspections." },
  "east-aurora":   { name: "East Aurora",    county: "Erie",    blurb: "East Aurora's historic homes deserve careful work. We take the time to match materials and do it right." },
  lancaster:       { name: "Lancaster",      county: "Erie",    blurb: "Lancaster and the surrounding area — we're out here regularly and can usually get to you fast." },
  lockport:        { name: "Lockport",       county: "Niagara", blurb: "Lockport's older downtown and surrounding neighborhoods are well within our regular coverage area." },
  lewiston:        { name: "Lewiston",       county: "Niagara", blurb: "From the gorge to the village, Lewiston roofs get WNY-built expertise and honest, local pricing." },
  medina:          { name: "Medina",         county: "Orleans", blurb: "Medina sits right on our Buffalo→Rochester corridor — we're out here for inspections and full jobs." },
  albion:          { name: "Albion",         county: "Orleans", blurb: "Albion is in the heart of the corridor. Lake-effect snow from both lakes hits this area hard." },
  batavia:         { name: "Batavia",        county: "Genesee", blurb: "Batavia is a regular stop on our corridor route. Free inspections available without a long wait." },
  "le-roy":        { name: "Le Roy",         county: "Genesee", blurb: "Le Roy and the surrounding Genesee County area — we make the drive because the work is worth it." },
  brockport:       { name: "Brockport",      county: "Monroe",  blurb: "Brockport's lakeside location means heavy snow loads. We spec roofs for WNY winters, not just averages." },
  spencerport:     { name: "Spencerport",    county: "Monroe",  blurb: "Spencerport and the Erie Canal corridor — we cover the western Monroe County suburbs fully." },
  hilton:          { name: "Hilton",         county: "Monroe",  blurb: "Hilton's lake proximity means ice dams are a real concern. We know how to spec against them." },
  henrietta:       { name: "Henrietta",      county: "Monroe",  blurb: "Henrietta's rapid development means a wide range of roof ages and conditions — we inspect them all honestly." },
  fairport:        { name: "Fairport",       county: "Monroe",  blurb: "Fairport's older village homes and newer subdivisions are both in our regular route east of Rochester." },
  rochester:       { name: "Rochester",      county: "Monroe",  blurb: "Rochester is the eastern end of our corridor — we serve all Rochester neighborhoods, no extra charge." },
};

const SLUG_LIST = Object.keys(CORRIDOR_TOWNS);

const SERVICES = ["Roof replacement", "Roof repair", "Storm & insurance", "Free inspections", "Gutters & guards"];

export async function generateStaticParams() {
  return SLUG_LIST.map((town) => ({ town }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ town: string }>;
}): Promise<Metadata> {
  const { town } = await params;
  const data = CORRIDOR_TOWNS[town];
  if (!data) return {};
  return {
    title: `Roofing in ${data.name}, ${data.county} County | Roofalo`,
    description: `Free roof inspections and honest quotes in ${data.name}, NY. Licensed, insured, WNY-born crew serving the Buffalo→Rochester corridor.`,
  };
}

export default async function TownPage({
  params,
}: {
  params: Promise<{ town: string }>;
}) {
  const { town } = await params;
  const data = CORRIDOR_TOWNS[town];
  if (!data) notFound();

  return (
    <>
      {/* Hero */}
      <section className="section" style={{ background: "var(--ink)", color: "#f3eee4", paddingTop: 120 }}>
        <div className="wrap">
          <p className="eyebrow on-dark" style={{ marginBottom: "1rem" }}>
            Service area &rarr; {data.name}
          </p>
          <h1 className="h-lg" style={{ marginBottom: "1.25rem", color: "#fff" }}>
            Roofing in {data.name},{" "}
            <span style={{ color: "var(--copper)" }}>NY</span>
          </h1>
          <p className="lead" style={{ color: "#cfc7b8", maxWidth: "52ch", marginBottom: "2rem" }}>
            {data.blurb}
          </p>
          <a href="/" className="btn btn-primary btn-lg">
            Get a free inspection in {data.name}
          </a>
        </div>
      </section>

      {/* What we do */}
      <section className="section" style={{ background: "var(--bone)" }}>
        <div className="wrap">
          <h2 className="h-md" style={{ marginBottom: "1rem" }}>
            What we do in {data.name}
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: "62ch", lineHeight: 1.65, marginBottom: "2.5rem", fontSize: "1.0625rem" }}>
            The same crew that inspects is the one that does the work — no subcontractors, no hand-offs.
            We cover {data.name} and all of {data.county}&nbsp;County with roof replacements, repairs,
            storm &amp; insurance work, and gutters. The inspection is always free and there&apos;s
            never pressure to commit.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "1rem" }}>
            {SERVICES.map((s) => (
              <div
                key={s}
                className="card"
                style={{ padding: "1.25rem 1.5rem", fontWeight: 600, color: "var(--ink)" }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Also serving */}
      <section className="section" style={{ background: "#fff", paddingTop: 40, paddingBottom: 40 }}>
        <div className="wrap">
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.25rem", color: "var(--ink)" }}>
            Also serving
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {SLUG_LIST.filter((s) => s !== town).map((s) => (
              <Link
                key={s}
                href={`/service-area/${s}`}
                className="chip"
                style={{ textDecoration: "none", color: "var(--muted)", minHeight: 44, display: "inline-flex", alignItems: "center" }}
              >
                {CORRIDOR_TOWNS[s].name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section final" style={{ textAlign: "center" }}>
        <div className="wrap">
          <h2 className="final-h" style={{ marginBottom: "0.75rem" }}>
            Free inspection in {data.name}.<br />No pressure. You decide.
          </h2>
          <p className="final-p" style={{ marginBottom: "2rem" }}>
            We answer in seconds, day or night — and a real person whenever you ask.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/" className="btn btn-primary btn-lg">
              Book a free inspection
            </a>
            <a href="tel:+17162000707" className="btn btn-ghost on-dark btn-lg">
              Call (716) 200-0707
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
