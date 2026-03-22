"use client";

import Image from "next/image";
import Link from "next/link";

export default function CategorySection() {
  const categories = [
    {
      id: "t-shirts",
      title: "T-Shirts",
      href: "/t-shirts",
      imageSrc: "/images/products/bag/bag-1.jpg", 
    },
    {
      id: "hoodies",
      title: "Hoodies",
      href: "/hoodies",
      imageSrc: "/images/products/bag/bag-2.jpg", 
    },
    {
      id: "long-sleeves",
      title: "Long Sleeves",
      href: "/long-sleeves",
      imageSrc: "/images/products/bag/bag-3.jpg", 
    },
    {
      id: "accessories",
      title: "Accessories",
      href: "/accessories",
      imageSrc: "/images/products/bag/bag-5.jpg", 
    }
  ];

  return (
    <section className="w-full bg-black text-white py-1">
      <div className="px-6 md:px-10 py-16 flex justify-center text-center">
        <h2 className="text-[32px] md:text-[50px] font-light tracking-[0.2em] uppercase">
          Collections
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-1 md:gap-0">
        {categories.map((category, index) => (
          <Link 
            key={category.id} 
            href={category.href}
            className={`group relative flex flex-col items-center justify-center w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-zinc-900 ${
              index !== 3 ? 'lg:border-r border-white/10' : ''
            }`}
          >
            <Image 
              src={category.imageSrc} 
              alt={category.title} 
              fill 
              className="object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" 
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
              <h3 className="text-2xl md:text-3xl font-black italic tracking-widest uppercase mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                {category.title}
              </h3>
              
              <div className="flex items-center gap-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 ease-out">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Explore</span>
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