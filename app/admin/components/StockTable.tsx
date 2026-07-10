"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";

interface SizeRow {
  id: string;
  size_label: string;
  stock_quantity: number;
  sku: string;
}
interface VariantRow {
  id: string;
  color_name_en: string;
  variant_sizes: SizeRow[];
}
interface ProductRow {
  id: string;
  slug: string;
  name_en: string;
  category: string;
  price: number;
  currency: string;
  product_variants: VariantRow[];
}

export default function StockTable() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("id, slug, name_en, category, price, currency, product_variants(id, color_name_en, variant_sizes(id, size_label, stock_quantity, sku))")
      .order("category")
      .order("name_en");
    if (!error && data) {
      const rows = data as unknown as ProductRow[];
      setProducts(rows);
      const p: Record<string, string> = {};
      const q: Record<string, number> = {};
      for (const prod of rows) {
        p[prod.id] = String(prod.price);
        for (const v of prod.product_variants) {
          for (const s of v.variant_sizes) q[s.id] = s.stock_quantity;
        }
      }
      setPrices(p);
      setQuantities(q);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (prod: ProductRow) => {
    setStatus((s) => ({ ...s, [prod.id]: "saving" }));
    try {
      const newPrice = Number(prices[prod.id]);
      if (Number.isFinite(newPrice) && newPrice !== prod.price) {
        const { error } = await supabase.from("products").update({ price: newPrice }).eq("id", prod.id);
        if (error) throw error;
      }
      for (const v of prod.product_variants) {
        for (const s of v.variant_sizes) {
          const q = quantities[s.id];
          if (q !== s.stock_quantity) {
            const { error } = await supabase.from("variant_sizes").update({ stock_quantity: q }).eq("id", s.id);
            if (error) throw error;
          }
        }
      }
      setStatus((s) => ({ ...s, [prod.id]: "saved" }));
      load();
    } catch (e) {
      setStatus((s) => ({ ...s, [prod.id]: `error: ${e instanceof Error ? e.message : "failed"}` }));
    }
  };

  if (loading) return <p className="text-xs tracking-widest uppercase text-gray-400">Loading…</p>;

  const valueByCurrency: Record<string, number> = {};
  let totalUnits = 0;
  let soldOutSizes = 0;
  for (const prod of products) {
    for (const v of prod.product_variants) {
      for (const s of v.variant_sizes) {
        totalUnits += s.stock_quantity;
        if (s.stock_quantity === 0) soldOutSizes++;
        valueByCurrency[prod.currency] = (valueByCurrency[prod.currency] ?? 0) + s.stock_quantity * Number(prod.price);
      }
    }
  }
  const stats = [
    {
      label: "Stock value",
      value: Object.entries(valueByCurrency)
        .map(([cur, sum]) => `${sum.toLocaleString("en-US")} ${cur}`)
        .join(" + ") || "0",
    },
    { label: "Total units", value: totalUnits.toLocaleString("en-US") },
    { label: "Products", value: String(products.length) },
    { label: "Sold-out sizes", value: String(soldOutSizes) },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
        {stats.map((st) => (
          <div key={st.label} className="bg-white p-5">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-2">{st.label}</p>
            <p className="text-2xl font-black italic tracking-wider">{st.value}</p>
          </div>
        ))}
      </div>
      {products.map((prod) => (
        <div key={prod.id} className="border border-gray-200 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">{prod.category}</span>
              <h2 className="text-lg font-black italic tracking-wider uppercase">{prod.name_en}</h2>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="0.01"
                value={prices[prod.id] ?? ""}
                onChange={(e) => setPrices((p) => ({ ...p, [prod.id]: e.target.value }))}
                className="w-24 border border-gray-300 px-2 py-1 text-sm text-right"
              />
              <span className="text-xs text-gray-500">{prod.currency}</span>
            </div>
          </div>
          {prod.product_variants.map((v) => (
            <div key={v.id} className="flex flex-wrap items-center gap-6 mb-2">
              <span className="text-[10px] tracking-widest uppercase text-gray-500 w-20">{v.color_name_en}</span>
              {[...v.variant_sizes]
                .sort((a, b) => a.size_label.localeCompare(b.size_label))
                .map((s) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <span className="text-xs font-bold w-6">{s.size_label}</span>
                    <button
                      type="button"
                      onClick={() => setQuantities((q) => ({ ...q, [s.id]: Math.max(0, (q[s.id] ?? 0) - 1) }))}
                      className="w-7 h-7 border border-gray-300 hover:bg-black hover:text-white transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={quantities[s.id] ?? 0}
                      onChange={(e) => setQuantities((q) => ({ ...q, [s.id]: Math.max(0, Number(e.target.value) || 0) }))}
                      className="w-14 border border-gray-300 px-1 py-1 text-sm text-center"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantities((q) => ({ ...q, [s.id]: (q[s.id] ?? 0) + 1 }))}
                      className="w-7 h-7 border border-gray-300 hover:bg-black hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                ))}
            </div>
          ))}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => save(prod)}
              disabled={status[prod.id] === "saving"}
              className="bg-black text-white px-6 py-2 text-[10px] font-bold tracking-[0.2em] uppercase disabled:opacity-50"
            >
              {status[prod.id] === "saving" ? "Saving…" : "Save"}
            </button>
            {status[prod.id] === "saved" && <span className="text-[10px] tracking-widest uppercase text-green-600">Saved</span>}
            {status[prod.id]?.startsWith("error") && (
              <span className="text-[10px] tracking-widest uppercase text-red-600">{status[prod.id]}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
