"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "../utils/supabase";
import { useLang } from "@/context/LanguageContext";

interface SearchResult {
  id: string;
  name_en: string;
  brand_primary: string;
  price: number;
  currency: string;
  product_variants: { cover_image: string }[];
}

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSearched(false);
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name_en, brand_primary, price, currency, product_variants(cover_image)")
        .ilike("name_en", `%${q}%`)
        .limit(8);
      setResults((data as SearchResult[]) ?? []);
      setSearched(true);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-md text-white flex flex-col"
        >
          <div className="flex items-center gap-4 px-6 md:px-10 py-6 border-b border-white/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="shrink-0 opacity-60">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search.placeholder}
              className="bg-transparent flex-grow text-sm md:text-base tracking-[0.15em] uppercase outline-none placeholder-gray-500"
            />
            <button onClick={onClose} aria-label={t.nav.closeMenu} className="hover:opacity-70 transition-opacity">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto px-6 md:px-10 py-8">
            {results.length > 0 ? (
              <div className="flex flex-col max-w-[700px] mx-auto">
                {results.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    onClick={onClose}
                    className="flex items-center gap-5 py-4 border-b border-white/10 hover:bg-white/5 transition-colors px-2"
                  >
                    <div className="relative w-12 h-16 bg-gray-800 overflow-hidden shrink-0">
                      <Image
                        src={p.product_variants?.[0]?.cover_image || "/images/placeholder.jpg"}
                        alt={p.name_en}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-500">{p.brand_primary}</span>
                      <span className="text-xs tracking-widest uppercase">{p.name_en}</span>
                      <span className="text-xs tracking-wide text-gray-400">{p.price} {p.currency}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : searched ? (
              <p className="text-center text-gray-500 text-xs tracking-widest uppercase mt-16">{t.search.noResults}</p>
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
