import { notFound } from "next/navigation";
import { supabase } from "../utils/supabase";
import CategoryProducts, { CategoryProductRow } from "../components/CategoryProducts";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const { data } = await supabase
    .from("categories")
    .select("title_en")
    .eq("slug", category)
    .maybeSingle();
  return data ? { title: data.title_en as string } : {};
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  const [{ data: products, error }, { data: categoryRow }] = await Promise.all([
    supabase
      .from("products")
      .select(`
        *,
        product_variants (
          *,
          variant_sizes (*)
        )
      `)
      .eq("category", category),
    supabase
      .from("categories")
      .select("title_en, title_ru")
      .eq("slug", category)
      .maybeSingle(),
  ]);

  if (error) {
    console.error("Error fetching products:", error);
  }

  if (!categoryRow) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-black pt-32 md:pt-40 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <CategoryProducts
          products={(products ?? []) as CategoryProductRow[]}
          title={categoryRow.title_en}
          titleRu={categoryRow.title_ru}
        />
      </div>
    </main>
  );
}
