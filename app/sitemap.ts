import type { MetadataRoute } from "next";
import { supabase } from "./utils/supabase";

// yzs.am 308-redirects to www, so www is the canonical host.
const BASE = "https://www.yzs.am";

// Products and categories come from Supabase, so regenerate hourly: a new drop
// reaches crawlers without a redeploy.
export const revalidate = 3600;

// Pages with no tracked edit date deliberately omit lastModified rather than claim
// "now" on every regeneration — a policy page that reports itself as changed every
// hour just gets its dates discounted.
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE, changeFrequency: "weekly", priority: 1 },
  { url: `${BASE}/story`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/faq`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE}/shipping`, changeFrequency: "yearly", priority: 0.4 },
  { url: `${BASE}/size-guide`, changeFrequency: "yearly", priority: 0.4 },
  { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categoriesRes, productsRes] = await Promise.all([
    supabase.from("categories").select("slug, created_at").order("display_order"),
    supabase.from("products").select("id, created_at"),
  ]);

  // The DB is on Supabase's free tier and can auto-pause. If it is unreachable,
  // still serve the static routes instead of failing the whole sitemap.
  if (categoriesRes.error || productsRes.error) {
    console.error("sitemap: could not reach Supabase", categoriesRes.error ?? productsRes.error);
  }

  const categories = (categoriesRes.data ?? []).map((c) => ({
    url: `${BASE}/${c.slug}`,
    lastModified: new Date(c.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Routed by id, not by the (unused) slug column — see app/products/[id]/page.tsx.
  // created_at is the only date the schema tracks; there is no updated_at, so an
  // edited product keeps its original date here.
  const products = (productsRes.data ?? []).map((p) => ({
    url: `${BASE}/products/${p.id}`,
    lastModified: new Date(p.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...STATIC_ROUTES, ...categories, ...products];
}
