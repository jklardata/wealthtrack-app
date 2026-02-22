import { MetadataRoute } from "next";

const BASE_URL = "https://solofi.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const articles = [
    { slug: "tax-strategies-2026-self-employed", lastModified: new Date("2026-01-15") },
    { slug: "roth-conversion-strategy-engine-launch", lastModified: new Date("2026-01-10") },
    { slug: "become-self-employed-freelancer-2026", lastModified: new Date("2026-01-05") },
    { slug: "30-percent-rule-self-employment-taxes", lastModified: new Date("2025-12-01") },
    { slug: "why-track-net-worth", lastModified: new Date("2025-11-15") },
    { slug: "how-feie-works", lastModified: new Date("2025-11-01") },
    { slug: "best-bank-accounts-for-consultants", lastModified: new Date("2025-10-20") },
    { slug: "working-remotely-from-another-country", lastModified: new Date("2025-10-10") },
    { slug: "overlooked-tax-deductions-consultants", lastModified: new Date("2025-09-15") },
    { slug: "sole-proprietor-vs-llc", lastModified: new Date("2025-09-01") },
  ];

  const tools = [
    "tax-savings",
    "fi-calculator",
    "roth-conversion",
    "net-worth-quiz",
    "quarterly-tax",
    "scorp-calculator",
    "freelance-checklist",
  ];

  const competitors = [
    "bench",
    "bonsai",
    "collective",
    "copilot",
    "monarch",
    "quickbooks-self-employed",
  ];

  return [
    // Core pages
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },

    // Free calculators
    { url: `${BASE_URL}/fire-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/quarterly-tax-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/scorp-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },

    // Articles
    ...articles.map(({ slug, lastModified }) => ({
      url: `${BASE_URL}/articles/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    // Tools
    ...tools.map((tool) => ({
      url: `${BASE_URL}/tools/${tool}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    // Compare pages
    ...competitors.map((competitor) => ({
      url: `${BASE_URL}/compare/${competitor}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
