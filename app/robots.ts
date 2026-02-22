import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/dashboard",
          "/profile",
          "/net-worth",
          "/retirement",
          "/retirement-scenarios",
          "/roth-conversion",
          "/tax-calculator",
          "/tax-bracket-filling",
          "/tax-optimization",
          "/tax-returns",
          "/quarterly-estimated-taxes",
          "/geo-arbitrage",
          "/early-retirement",
          "/lifetime-income",
          "/lifetime-tax-map",
          "/portfolio-optimizer",
          "/withdrawal-stress-test",
          "/credit-cards",
          "/compare-scenarios",
          "/upgrade",
          "/settings",
          "/founder-notes",
          "/admin",
          "/api/",
          "/sign-in",
          "/sign-up",
        ],
      },
    ],
    sitemap: "https://solofi.io/sitemap.xml",
  };
}
