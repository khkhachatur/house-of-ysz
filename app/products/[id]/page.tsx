import Image from "next/image";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { supabase } from "../../utils/supabase";
import ProductInfo from "../../components/ProductInfo";
import { dictionaries, isLocale, LOCALE_COOKIE, type Locale } from "../../i18n/dictionary";

interface GalleryImage {
  image_url: string;
  display_order: number;
}
interface SizeRow {
  size_label: string;
  stock_quantity: number;
}
interface VariantRow {
  cover_image: string;
  variant_images: GalleryImage[];
  variant_sizes: SizeRow[];
}
interface ProductRow {
  id: string;
  brand_primary: string;
  name_en: string;
  category: string;
  price: number;
  currency: string;
  description_en: string | null;
  description_ru: string | null;
  fabric_details_en: string[] | null;
  fabric_details_ru: string[] | null;
  product_variants: VariantRow[];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await supabase
    .from("products")
    .select("name_en, description_en, product_variants(cover_image)")
    .eq("id", id)
    .maybeSingle();
  if (!data) return {};
  const cover = (data.product_variants as { cover_image: string }[])?.[0]?.cover_image;
  return {
    title: data.name_en as string,
    description: (data.description_en as string | null) ?? undefined,
    openGraph: cover ? { images: [cover] } : undefined,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, cookieStore] = await Promise.all([params, cookies()]);
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: Locale = isLocale(cookieLocale) ? cookieLocale : "en";

  const { data } = await supabase
    .from("products")
    .select(`
      id, brand_primary, name_en, category, price, currency,
      description_en, description_ru, fabric_details_en, fabric_details_ru,
      product_variants (
        cover_image,
        variant_images ( image_url, display_order ),
        variant_sizes ( size_label, stock_quantity )
      )
    `)
    .eq("id", id)
    .maybeSingle();

  const product = data as ProductRow | null;
  const variant = product?.product_variants?.[0];
  if (!product || !variant) {
    notFound();
  }

  const gallery = [...variant.variant_images]
    .sort((a, b) => a.display_order - b.display_order)
    .map((img) => img.image_url);
  const images = gallery.length > 0 ? gallery : [variant.cover_image];

  const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];
  const sizes = [...variant.variant_sizes]
    .sort((a, b) => sizeOrder.indexOf(a.size_label) - sizeOrder.indexOf(b.size_label))
    .map((s) => ({ label: s.size_label, inStock: s.stock_quantity > 0 }));

  return (
    <main className="w-full min-h-screen bg-white text-black flex flex-col md:flex-row pt-20 md:pt-0">

      {/* ========================================= */}
      {/* LEFT COLUMN: Image Gallery                */}
      {/* ========================================= */}
      <div className="w-full md:w-[50%] flex flex-row overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-col md:overflow-x-visible border-r border-gray-100">
        {images.map((src, i) => (
          <div
            key={src}
            className={`relative w-full min-w-[90%] snap-start md:min-w-0 aspect-[3/4] bg-gray-100 ${i > 0 ? "md:border-t border-gray-100" : ""}`}
          >
            <Image
              src={src}
              alt={`${product.name_en} — ${dictionaries[locale].product.photo} ${i + 1}`}
              fill
              sizes="(max-width: 768px) 90vw, 50vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* ========================================= */}
      {/* RIGHT COLUMN: Sticky Info                 */}
      {/* ========================================= */}
      <div className="w-full md:w-[50%] md:h-screen md:sticky md:top-0 overflow-y-auto">
        <ProductInfo
          product={{
            id: product.id,
            brand: product.brand_primary,
            name: product.name_en,
            price: `${product.price} ${product.currency}`,
            description: product.description_en,
            descriptionRu: product.description_ru,
            fabric:
              locale === "ru" && product.fabric_details_ru?.length
                ? product.fabric_details_ru
                : product.fabric_details_en,
            imageSrc: images[0],
            category: product.category,
            sizes,
          }}
        />
      </div>
    </main>
  );
}
