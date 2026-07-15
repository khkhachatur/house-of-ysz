"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import type { Category } from "../types";

export default function CategorySection({ categories }: { categories: Category[] }) {
  const { t } = useLang();
  return (
    <section id="collections" className="w-full bg-white pb-20 scroll-mt-16">
      <div className="px-6 md:px-10 py-16 flex justify-center text-center">
        <h2 className="text-[32px] text-black md:text-[50px] font-light tracking-[0.2em] uppercase">
          {t.home.collections}
        </h2>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 lg:grid-cols-4 w-full gap-1 md:gap-0">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={`/${category.slug}`}
            className={`group relative flex flex-col items-center justify-center w-full min-w-[68%] snap-start md:min-w-0 aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-zinc-900 ${
              index !== categories.length - 1 ? 'lg:border-r border-white/10' : ''
            }`}
          >
            <Image
              src={category.image_url}
              alt={category.title_en}
              fill
              className="object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 text-white">
              <h3 className="text-2xl md:text-3xl font-black italic tracking-widest uppercase mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                {category.title_en}
              </h3>
              
              <div className="flex items-center gap-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 ease-out">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{t.home.explore}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}