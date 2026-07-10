import { supabase } from "../utils/supabase";
import CategoryProducts, { CategoryProductRow } from "../components/CategoryProducts";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const displayTitle = category.replace("-", " ");

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      product_variants (
        *,
        variant_sizes (*)
      )
    `)
    .eq("category", category);

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main className="min-h-screen bg-white text-black pt-32 md:pt-40 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <CategoryProducts
          products={(products ?? []) as CategoryProductRow[]}
          title={displayTitle}
        />
      </div>
    </main>
  );
}
