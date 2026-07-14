"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "../data/products";
import { useStore } from "@/context/StoreContext";
import { useLang } from "@/context/LanguageContext";
import { pick } from "../i18n/dictionary";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const { savedItems, toggleSave, addToCart } = useStore();
  const { locale } = useLang();

  const isSaved = savedItems.some((item) => item.id === product.id);
  const name = pick(locale, product.name, product.name_ru);

  return (
    <Link href={`/products/${product.id}`} className={`group relative flex flex-col cursor-pointer ${className}`}>
      <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
        <Image src={product.imageSrc} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
        
        <button 
          onClick={(e) => {
            e.preventDefault(); 
            toggleSave(product); 
          }}
          className="absolute top-4 right-4 z-10 text-black hover:opacity-60 transition-opacity"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
          </svg>
        </button>

        <button 
          onClick={(e) => {
            e.preventDefault(); 
            addToCart(product);
          }}
          className="absolute bottom-4 left-4 z-10 border border-black w-8 h-8 flex items-center justify-center backdrop-blur-sm bg-white/20 hover:bg-black hover:text-white transition-colors duration-300"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/><path d="M12 5v14"/>
          </svg>
        </button>
      </div>

      <div className="p-5 flex flex-col gap-1.5">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{product.brand}</span>
        <span className="text-[11px] font-medium text-gray-800 tracking-wide">{name}</span>
        <span className="text-[11px] font-medium tracking-wide mt-1">{product.price}</span>
      </div>
    </Link>
  );
}