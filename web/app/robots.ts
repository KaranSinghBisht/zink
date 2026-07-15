import type { MetadataRoute } from "next";

const publicOrigin = "https://zink-bice.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/protocol", "/new"],
      disallow: ["/dash", "/api/", "/l/"],
    },
    sitemap: `${publicOrigin}/sitemap.xml`,
  };
}
