"use client";

import Image from "next/image";
import { newArrivalsData } from "../data/products"; 

export default function NewArrivals() {
  const currentProducts = newArrivalsData.slice(0, 4);

  return (
    <section className="w-full bg-white text-black py-20 overflow-hidden">
      
      {/* ========================================= */}
      {/* HEADER CONTROLS (Cleaned up)              */}
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
            <div 
              key={product.id} 
              className={`group relative flex flex-col ${index !== 3 ? 'lg:border-r border-gray-200/50' : ''}`}
            >
              <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden cursor-pointer">
                <Image 
                  src={product.imageSrc} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                />
                
                <button className="absolute top-4 right-4 z-10 text-black hover:opacity-60 transition-opacity">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                  </svg>
                </button>

                <button className="absolute bottom-4 left-4 z-10 border border-black w-8 h-8 flex items-center justify-center backdrop-blur-sm bg-white/20 hover:bg-black hover:text-white transition-colors duration-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="M12 5v14"/>
                  </svg>
                </button>
              </div>

              <div className="p-5 flex flex-col gap-1.5 cursor-pointer">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{product.brand}</span>
                <span className="text-[11px] font-medium text-gray-800 tracking-wide">{product.name}</span>
                <span className="text-[11px] font-medium tracking-wide mt-1">{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}