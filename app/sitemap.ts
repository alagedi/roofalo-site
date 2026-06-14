import { MetadataRoute } from "next";

const BASE = "https://roofalo.com";

const TOWNS = [
  "buffalo", "amherst", "clarence", "williamsville", "cheektowaga",
  "west-seneca", "hamburg", "east-aurora", "lancaster", "lockport",
  "lewiston", "medina", "albion", "batavia", "le-roy", "brockport",
  "spencerport", "hilton", "henrietta", "fairport", "rochester",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const townPages = TOWNS.map((town) => ({
    url: `${BASE}/service-area/${town}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/our-work`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/reviews`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/financing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/service-area`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/services/roof-replacement`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/services/roof-repair`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/services/storm-insurance`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/services/inspections`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/services/gutters`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...townPages,
  ];
}
