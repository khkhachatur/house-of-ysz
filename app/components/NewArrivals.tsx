"use client";

import { newArrivalsData } from "../data/products"; 
import ProductCard from "./ProductCard";

export default function NewArrivals() {
  const currentProducts = newArrivalsData.slice(0, 4);

  return (
    <section className="w-full bg-white text-black py-20 overflow-hidden">
      
      {/* ========================================= */}
      {/* HEADER CONTROLS                           */}
      {/* ========================================= */}
      <div className="relative flex items-center justify-center px-6 md:px-10 mb-6 text-[10px] md:text-[11px] font-bold tracking-[0.15em] uppercase w-full">
        <div className="absolute left-6 md:left-10 text-left hidden md:block">
          New In
        </div>
        <button className="bg-black text-white px-5 py-1.5 transition-colors">
          Main SS26
        </button>
      </div>

      {/* ========================================= */}
      {/* PRODUCT GRID                              */}
      {/* ========================================= */}
      <div className="w-full px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-b border-gray-200/50">
          {currentProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              className={index !== 3 ? 'lg:border-r border-gray-200/50' : ''} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}