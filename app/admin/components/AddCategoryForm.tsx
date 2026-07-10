"use client";

import { useState } from "react";
import { supabase } from "../../utils/supabase";
import { slugify, uploadImages } from "../lib/helpers";

export default function AddCategoryForm() {
  const [titleEn, setTitleEn] = useState("");
  const [titleRu, setTitleRu] = useState("");
  const [slug, setSlug] = useState("");
  const [order, setOrder] = useState("5");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const finalSlug = slugify(slug || titleEn);
      if (!finalSlug) throw new Error("Title (EN) is required");
      if (!file) throw new Error("A photo is required");
      const [imageUrl] = await uploadImages([file], "categories");
      const { error } = await supabase.from("categories").insert({
        slug: finalSlug,
        title_en: titleEn,
        title_ru: titleRu || titleEn,
        image_url: imageUrl,
        display_order: Number(order) || 99,
      });
      if (error) throw error;
      setMessage(`Added category "${titleEn}" — it is live at /${finalSlug}.`);
      setTitleEn("");
      setTitleRu("");
      setSlug("");
      setFile(null);
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : "failed"}`);
    }
    setBusy(false);
  };

  const input = "border-b border-black/30 focus:border-black transition-colors py-2 text-sm outline-none w-full";

  return (
    <form onSubmit={submit} className="flex flex-col gap-6 max-w-xl">
      <div className="grid grid-cols-2 gap-6">
        <input className={input} placeholder="TITLE (EN) *" value={titleEn} onChange={(e) => { setTitleEn(e.target.value); setSlug(slugify(e.target.value)); }} required />
        <input className={input} placeholder="TITLE (RU)" value={titleRu} onChange={(e) => setTitleRu(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <input className={input} placeholder="URL SLUG" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <input className={input} type="number" min="0" placeholder="ORDER" value={order} onChange={(e) => setOrder(e.target.value)} />
      </div>
      <div>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-3">Tile photo *</p>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-xs" />
      </div>
      {message && (
        <p className={`text-xs tracking-widest uppercase ${message.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>{message}</p>
      )}
      <button type="submit" disabled={busy} className="bg-black text-white py-3 text-[11px] font-bold tracking-[0.2em] uppercase disabled:opacity-50">
        {busy ? "Adding…" : "Add category"}
      </button>
    </form>
  );
}
