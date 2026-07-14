import Hero from "./components/Hero";
import AccessoriesSection from "./components/AccessoriesSection";
import NewArrivals from "./components/NewArrivals";
import CategorySection from "./components/CategorySection";
import { supabase } from "./utils/supabase";

export default async function Home() {
  const [{ data: categories }, { data: newest }] = await Promise.all([
    supabase.from("categories").select("*").order("display_order"),
    supabase
      .from("products")
      .select("id, name_en, brand_primary, price, currency, category, created_at, product_variants(cover_image)")
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  const newArrivals = (newest ?? []).map((p) => ({
    id: p.id as string,
    brand: p.brand_primary as string,
    name: p.name_en as string,
    price: `${p.price} ${p.currency}`,
    imageSrc:
      (p.product_variants as { cover_image: string }[])?.[0]?.cover_image ||
      "/images/placeholder.jpg",
    category: p.category as string,
  }));

  return (
    <>
      <Hero />
      <NewArrivals products={newArrivals} />
      <AccessoriesSection />
      <CategorySection categories={categories ?? []} />
    </>
  );
}