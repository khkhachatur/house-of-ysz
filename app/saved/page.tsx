"use client";

import { useStore } from "@/context/StoreContext";
import ProductCard from "../components/ProductCard";

export default function SavedPage() {
  const { savedItems } = useStore();

  return (
    <main className="min-h-screen bg-white text-black pt-32 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto ">
        <h1 className="text-3xl md:text-5xl font-black italic tracking-wider mb-12 uppercase border-b border-gray-200 pb-6">
          Saved Items
        </h1>

        {savedItems.length === 0 ? (
          <div className="h-[40vh] flex items-center justify-center text-gray-400 text-sm tracking-widest uppercase">
            Your wishlist is empty.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-b border-gray-200/50">
            {savedItems.map((product, index) => (
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