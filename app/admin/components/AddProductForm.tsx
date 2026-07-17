"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import type { Category } from "../../types";
import { slugify, uploadImages } from "../lib/helpers";

interface SizeInput {
  label: string;
  qty: number;
}

export default function AddProductForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [nameEn, setNameEn] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [descEn, setDescEn] = useState("");
  const [descRu, setDescRu] = useState("");
  const [fabricEn, setFabricEn] = useState("");
  const [fabricRu, setFabricRu] = useState("");
  const [colorEn, setColorEn] = useState("Black");
  const [colorRu, setColorRu] = useState("Чёрный");
  const [colorHex, setColorHex] = useState("#000000");
  const [sizes, setSizes] = useState<SizeInput[]>([
    { label: "M", qty: 0 },
    { label: "L", qty: 0 },
    { label: "XL", qty: 0 },
  ]);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.from("categories").select("*").order("display_order").then(({ data }) => {
      setCategories(data ?? []);
      if (data?.length) setCategory(data[0].slug);
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const slug = slugify(nameEn);
      if (!slug) throw new Error("Name (EN) is required");
      const priceNum = Number(price);
      if (!Number.isFinite(priceNum) || priceNum <= 0) throw new Error("Price must be a positive number");

      const urls = files.length ? await uploadImages(files, `products/${slug}`) : [];
      const fallbackCover = categories.find((c) => c.slug === category)?.image_url ?? "";
      const cover = urls[0] ?? fallbackCover;

      // Fabric details are stored one bullet per row (text[]); the owner types one per line.
      const toLines = (s: string) => [...new Set(s.split("\n").map((x) => x.trim()).filter(Boolean))];

      const { data: prod, error: prodErr } = await supabase
        .from("products")
        .insert({
          slug,
          name_en: nameEn,
          name_ru: nameRu || nameEn,
          category,
          price: priceNum,
          currency,
          description_en: descEn.trim() || null,
          description_ru: descRu.trim() || null,
          fabric_details_en: toLines(fabricEn),
          fabric_details_ru: toLines(fabricRu),
        })
        .select("id")
        .single();
      if (prodErr) throw prodErr;

      const { data: variant, error: varErr } = await supabase
        .from("product_variants")
        .insert({ product_id: prod.id, color_name_en: colorEn, color_name_ru: colorRu, color_hex: colorHex, cover_image: cover })
        .select("id")
        .single();
      if (varErr) throw varErr;

      const sizeRows = sizes
        .filter((s) => s.label.trim())
        .map((s) => ({
          variant_id: variant.id,
          size_label: s.label.trim().toUpperCase(),
          stock_quantity: s.qty,
          sku: `${slug.toUpperCase()}-${s.label.trim().toUpperCase()}`,
        }));
      if (sizeRows.length) {
        const { error: sizeErr } = await supabase.from("variant_sizes").insert(sizeRows);
        if (sizeErr) throw sizeErr;
      }

      if (urls.length) {
        const { error: imgErr } = await supabase
          .from("variant_images")
          .insert(urls.map((url, i) => ({ variant_id: variant.id, image_url: url, display_order: i + 1 })));
        if (imgErr) throw imgErr;
      }

      setMessage(`Added "${nameEn}" — it is live in ${category}.`);
      setNameEn("");
      setNameRu("");
      setPrice("");
      setDescEn("");
      setDescRu("");
      setFabricEn("");
      setFabricRu("");
      setFiles([]);
      setSizes([{ label: "M", qty: 0 }, { label: "L", qty: 0 }, { label: "XL", qty: 0 }]);
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : "failed"}`);
    }
    setBusy(false);
  };

  const input = "border-b border-black/30 focus:border-black transition-colors py-2 text-sm outline-none w-full";
  const textarea = "border border-black/30 focus:border-black transition-colors p-3 text-sm outline-none w-full resize-y";

  return (
    <form onSubmit={submit} className="flex flex-col gap-6 max-w-xl">
      <div className="grid grid-cols-2 gap-6">
        <input className={input} placeholder="NAME (EN) *" value={nameEn} onChange={(e) => setNameEn(e.target.value)} required />
        <input className={input} placeholder="NAME (RU)" value={nameRu} onChange={(e) => setNameRu(e.target.value)} />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <select className={input} value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.title_en}</option>
          ))}
        </select>
        <input className={input} type="number" min="0" step="0.01" placeholder="PRICE *" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <select className={input} value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="AMD">AMD</option>
        </select>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <input className={input} placeholder="COLOR (EN)" value={colorEn} onChange={(e) => setColorEn(e.target.value)} />
        <input className={input} placeholder="COLOR (RU)" value={colorRu} onChange={(e) => setColorRu(e.target.value)} />
        <input className="h-10 w-16 border border-gray-300" type="color" value={colorHex} onChange={(e) => setColorHex(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <textarea className={textarea} rows={4} placeholder="DESCRIPTION (EN)" value={descEn} onChange={(e) => setDescEn(e.target.value)} />
        <textarea className={textarea} rows={4} placeholder="DESCRIPTION (RU)" value={descRu} onChange={(e) => setDescRu(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <textarea className={textarea} rows={4} placeholder="FABRIC & CARE (EN) — one per line" value={fabricEn} onChange={(e) => setFabricEn(e.target.value)} />
        <textarea className={textarea} rows={4} placeholder="FABRIC & CARE (RU) — one per line" value={fabricRu} onChange={(e) => setFabricRu(e.target.value)} />
      </div>
      <div>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-3">Sizes & starting stock</p>
        <div className="flex flex-col gap-2">
          {sizes.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                className="w-16 border border-gray-300 px-2 py-1 text-sm text-center uppercase"
                value={s.label}
                onChange={(e) => setSizes((arr) => arr.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
              />
              <input
                className="w-20 border border-gray-300 px-2 py-1 text-sm text-center"
                type="number"
                min="0"
                value={s.qty}
                onChange={(e) => setSizes((arr) => arr.map((x, j) => (j === i ? { ...x, qty: Math.max(0, Number(e.target.value) || 0) } : x)))}
              />
              <button type="button" className="text-gray-400 hover:text-black text-xs" onClick={() => setSizes((arr) => arr.filter((_, j) => j !== i))}>
                remove
              </button>
            </div>
          ))}
          <button type="button" className="self-start text-[10px] font-bold tracking-[0.2em] uppercase underline" onClick={() => setSizes((arr) => [...arr, { label: "", qty: 0 }])}>
            + size
          </button>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-3">Photos (first = cover)</p>
        <input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []))} className="text-xs" />
      </div>
      {message && (
        <p className={`text-xs tracking-widest uppercase ${message.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>{message}</p>
      )}
      <button type="submit" disabled={busy} className="bg-black text-white py-3 text-[11px] font-bold tracking-[0.2em] uppercase disabled:opacity-50">
        {busy ? "Adding…" : "Add product"}
      </button>
    </form>
  );
}
