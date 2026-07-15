import type { MetadataRoute } from "next";

const publicOrigin = "https://zink-bice.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/protocol", "/new"].map((path) => ({
    url: `${publicOrigin}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
}
