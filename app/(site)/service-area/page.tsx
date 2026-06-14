import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Service Area — Buffalo to Rochester Corridor | Roofalo",
  description:
    "Roofalo serves the entire Buffalo→Rochester corridor in Western New York. Free roof inspections and honest quotes across Erie, Niagara, Orleans, Genesee, and Monroe counties.",
};

const TOWNS = [
  { slug: "buffalo",       name: "Buffalo",       county: "Erie"    },
  { slug: "amherst",       name: "Amherst",       county: "Erie"    },
  { slug: "clarence",      name: "Clarence",      county: "Erie"    },
  { slug: "williamsville", name: "Williamsville", county: "Erie"    },
  { slug: "cheektowaga",   name: "Cheektowaga",   county: "Erie"    },
  { slug: "west-seneca",   name: "West Seneca",   county: "Erie"    },
  { slug: "hamburg",       name: "Hamburg",       county: "Erie"    },
  { slug: "east-aurora",   name: "East Aurora",   county: "Erie"    },
  { slug: "lancaster",     name: "Lancaster",     county: "Erie"    },
  { slug: "lockport",      name: "Lockport",      county: "Niagara" },
  { slug: "lewiston",      name: "Lewiston",      county: "Niagara" },
  { slug: "medina",        name: "Medina",        county: "Orleans" },
  { slug: "albion",        name: "Albion",        county: "Orleans" },
  { slug: "batavia",       name: "Batavia",       county: "Genesee" },
  { slug: "le-roy",        name: "Le Roy",        county: "Genesee" },
  { slug: "brockport",     name: "Brockport",     county: "Monroe"  },
  { slug: "spencerport",   name: "Spencerport",   county: "Monroe"  },
  { slug: "hilton",        name: "Hilton",        county: "Monroe"  },
  { slug: "henrietta",     name: "Henrietta",     county: "Monroe"  },
  { slug: "fairport",      name: "Fairport",      county: "Monroe"  },
  { slug: "rochester",     name: "Rochester",     county: "Monroe"  },
];

const COUNTIES = ["Erie", "Niagara", "Orleans", "Genesee", "Monroe"] as const;

export default function ServiceAreaPage() {
  return (
    <>
      {/* Hero */}
      <section className="section" style={{ background: "var(--ink)", color: "#f3eee4", paddingTop: 120 }}>
        <div className="wrap">
          <p className="eyebrow on-dark" style={{ marginBottom: "1rem" }}>Where we work</p>
          <h1 className="h-lg" style={{ color: "#fff", marginBottom: "1.25rem" }}>
            The whole Buffalo&nbsp;&rarr;&nbsp;Rochester corridor.
          </h1>
          <p className="lead" style={{ color: "#cfc7b8", maxWidth: "52ch" }}>
            We cover {TOWNS.length} towns across five counties — Erie, Niagara, Orleans, Genesee, and Monroe.
            One crew, no subcontractors, WNY-born and based.
          </p>
        </div>
      </section>

      {/* County grid */}
      <section className="section" style={{ background: "var(--bone)" }}>
        <div className="wrap">
          {COUNTIES.map((county) => {
            const countyTowns = TOWNS.filter((t) => t.county === county);
            return (
              <div key={county} style={{ marginBottom: "3rem" }}>
                <p className="eyebrow" style={{ marginBottom: "1rem" }}>{county} County</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
                  {countyTowns.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/service-area/${t.slug}`}
                      className="chip"
                      style={{
                        textDecoration: "none",
                        color: "var(--ink)",
                        fontWeight: 600,
                        minHeight: 44,
                        display: "inline-flex",
                        alignItems: "center",
                        background: "#fff",
                      }}
                    >
                      {t.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          <p style={{ color: "var(--muted)", fontSize: "0.9375rem", borderTop: "1px solid var(--line-soft)", paddingTop: "2rem" }}>
            Don&apos;t see your town?{" "}
            <a href="tel:+17162000707" style={{ color: "var(--copper)", fontWeight: 600 }}>
              Call or text (716) 200-0707
            </a>{" "}
            — we&apos;ll let you know if you&apos;re in our range. We answer in seconds, day or night.
          </p>
        </div>
      </section>
    </>
  );
}
