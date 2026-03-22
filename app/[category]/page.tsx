"use client";

import { use } from "react"; 
import { newArrivalsData } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const unwrappedParams = use(params);
  const categorySlug = unwrappedParams.category;

  const displayTitle = categorySlug.replace("-", " ");

  const categoryProducts = newArrivalsData.filter(product => product.category === categorySlug);

  return (
    <main className="min-h-screen bg-white text-black pt-32 md:pt-40 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gray-200 pb-6 gap-6">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-wider uppercase capitalize">
            {displayTitle}
          </h1>
          
          <div className="flex items-center gap-8 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
            <button className="hover:text-black transition-colors">Filters +</button>
            <button className="hover:text-black transition-colors">Sort By: Newest</button>
          </div>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="h-[40vh] flex flex-col items-center justify-center gap-4 text-gray-400 text-sm tracking-widest uppercase">
            <p>Collection arriving soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-b border-gray-200/50">
            {categoryProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                className={(index + 1) % 4 !== 0 ? 'lg:border-r border-gray-200/50' : ''} 
              />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}