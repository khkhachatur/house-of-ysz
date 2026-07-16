import type { MetadataRoute } from "next";

// yzs.am 308-redirects to www, so www is the canonical host.
const BASE = "https://www.yzs.am";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /admin is the owner's panel; /cart and /saved are per-visitor localStorage
      // views that render empty for a crawler and are worth nothing in an index.
      disallow: ["/admin", "/cart", "/saved"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
