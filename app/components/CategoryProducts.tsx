"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { useLang } from "@/context/LanguageContext";
import { pick } from "../i18n/dictionary";

interface SizeRow {
  size_label: string;
  stock_quantity: number;
}
interface VariantRow {
  color_name_en: string;
  color_name_ru: string | null;
  cover_image: string;
  variant_sizes: SizeRow[];
}
export interface CategoryProductRow {
  id: string;
  brand_primary: string;
  name_en: string;
  name_ru: string | null;
  price: number;
  currency: string;
  category: string;
  created_at: string;
  product_variants: VariantRow[];
}

const SORT_KEYS = ["newest", "price-asc", "price-desc"] as const;
type SortKey = (typeof SORT_KEYS)[number];

const chip = (active: boolean) =>
  `border px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors ${
    active ? "bg-black text-white border-black" : "border-gray-300 text-gray-500 hover:border-black hover:text-black"
  }`;

export default function CategoryProducts({
  products,
  title,
  titleRu,
}: {
  products: CategoryProductRow[];
  title: string;
  titleRu?: string | null;
}) {
  const { locale, t } = useLang();
  const [showFilters, setShowFilters] = useState(false);
  const [sizes, setSizes] = useState<Set<string>>(new Set());
  const [colors, setColors] = useState<Set<string>>(new Set());
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortIdx, setSortIdx] = useState(0);
  const sort: SortKey = SORT_KEYS[sortIdx];
  const sortLabels: Record<SortKey, string> = {
    newest: t.catalog.sortNewest,
    "price-asc": t.catalog.sortPriceAsc,
    "price-desc": t.catalog.sortPriceDesc,
  };

  const allSizes = useMemo(() => {
    const s = new Set<string>();
    for (const p of products) for (const v of p.product_variants) for (const sz of v.variant_sizes) s.add(sz.size_label);
    return [...s].sort((a, b) => ["XS", "S", "M", "L", "XL", "XXL"].indexOf(a) - ["XS", "S", "M", "L", "XL", "XXL"].indexOf(b));
  }, [products]);

  const allColors = useMemo(() => {
    const c = new Set<string>();
    for (const p of products) for (const v of p.product_variants) c.add(v.color_name_en);
    return [...c].sort();
  }, [products]);

  const colorRuByEn = useMemo(() => {
    const map = new Map<string, string | null>();
    for (const p of products) for (const v of p.product_variants) map.set(v.color_name_en, v.color_name_ru);
    return map;
  }, [products]);

  const toggle = (set: Set<string>, value: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const visible = useMemo(() => {
    let list = products.filter((p) => {
      if (sizes.size > 0) {
        const hasSize = p.product_variants.some((v) =>
          v.variant_sizes.some((s) => sizes.has(s.size_label) && s.stock_quantity > 0)
        );
        if (!hasSize) return false;
      }
      if (colors.size > 0 && !p.product_variants.some((v) => colors.has(v.color_name_en))) return false;
      if (inStockOnly) {
        const total = p.product_variants.reduce(
          (sum, v) => sum + v.variant_sizes.reduce((s, x) => s + x.stock_quantity, 0),
          0
        );
        if (total === 0) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return Number(a.price) - Number(b.price);
      if (sort === "price-desc") return Number(b.price) - Number(a.price);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return list;
  }, [products, sizes, colors, inStockOnly, sort]);

  const activeCount = sizes.size + colors.size + (inStockOnly ? 1 : 0);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 border-b border-gray-200 pb-6 gap-6">
        <h1 className="text-4xl md:text-6xl font-black italic tracking-wider uppercase capitalize">
          {pick(locale, title, titleRu)}
        </h1>
        <div className="flex items-center gap-8 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
          <button onClick={() => setShowFilters((v) => !v)} className={`transition-colors ${showFilters || activeCount > 0 ? "text-black" : "hover:text-black"}`}>
            {t.catalog.filters} {showFilters ? "−" : "+"}{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
          <button onClick={() => setSortIdx((i) => (i + 1) % SORT_KEYS.length)} className="hover:text-black transition-colors">
            {t.catalog.sortBy}: {sortLabels[sort]}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-x-12 gap-y-6 bg-gray-50 p-6 mb-8">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">{t.catalog.size}</span>
                <div className="flex gap-2">
                  {allSizes.map((s) => (
                    <button key={s} onClick={() => toggle(sizes, s, setSizes)} className={chip(sizes.has(s))}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {allColors.length > 1 && (
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">{t.catalog.color}</span>
                  <div className="flex gap-2 flex-wrap">
                    {allColors.map((c) => (
                      <button key={c} onClick={() => toggle(colors, c, setColors)} className={chip(colors.has(c))}>
                        {pick(locale, c, colorRuByEn.get(c))}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">{t.catalog.availability}</span>
                <button onClick={() => setInStockOnly((v) => !v)} className={chip(inStockOnly)}>
                  {t.catalog.inStockOnly}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {products.length === 0 ? (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-4 text-gray-400 text-sm tracking-widest uppercase">
          <p>{t.catalog.comingSoon}</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="h-[30vh] flex flex-col items-center justify-center gap-4 text-gray-400 text-xs tracking-widest uppercase">
          <p>{t.catalog.noMatches}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-t border-b border-gray-200/50">
          {visible.map((product, index) => {
            const firstVariant = product.product_variants[0];
            const mappedProduct = {
              id: product.id,
              brand: product.brand_primary,
              name: product.name_en,
              name_ru: product.name_ru ?? undefined,
              price: `${product.price} ${product.currency}`,
              imageSrc: firstVariant?.cover_image || "/images/placeholder.jpg",
              category: product.category,
            };
            return (
              <ProductCard
                key={product.id}
                product={mappedProduct}
                className={(index + 1) % 4 !== 0 ? "lg:border-r border-gray-200/50" : ""}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
