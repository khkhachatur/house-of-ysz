"use client";

import { Product } from "../data/products";
import ProductCard from "./ProductCard";
import { useLang } from "@/context/LanguageContext";

export default function NewArrivals({ products }: { products: Product[] }) {
  const { t } = useLang();
  const currentProducts = products.slice(0, 4);

  return (
    <section className="w-full bg-white text-black py-20 overflow-hidden">
      
      {/* ========================================= */}
      {/* HEADER CONTROLS                           */}
      {/* ========================================= */}
      <div className="relative flex items-center justify-center px-6 md:px-10 mb-6 text-[10px] md:text-[11px] font-bold tracking-[0.15em] uppercase w-full">
        <div className="absolute left-6 md:left-10 text-left hidden md:block">
          {t.home.newIn}
        </div>
        <button className="bg-black text-white px-5 py-1.5 transition-colors">
          Main SS26
        </button>
      </div>

      {/* ========================================= */}
      {/* PRODUCT GRID                              */}
      {/* ========================================= */}
      <div className="w-full px-4 md:px-0">
        <div className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-b border-gray-200/50">
          {currentProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              className={`min-w-[62%] snap-start md:min-w-0 ${index !== 3 ? 'lg:border-r border-gray-200/50' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}