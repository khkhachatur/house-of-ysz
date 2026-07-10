"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Category } from "../types";

export default function Navbar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const [lang, setLang] = useState<"EN" | "RU">("EN");
  const [isScrolled, setIsScrolled] = useState(false);

  const isProductPage = pathname?.startsWith("/products/");
  const isCartPage = pathname === "/cart";
  const isSavedPage = pathname === "/saved";

  const forceBackground = isProductPage || isCartPage || isSavedPage;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 2) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "EN" ? "RU" : "EN"));
  };

  const showBackground = isScrolled || forceBackground;

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-10 transition-all duration-500 text-white ${
        showBackground 
          ? "bg-black/95 backdrop-blur-md py-4 shadow-lg" 
          : "bg-transparent py-8"
      }`}
    >
      <div className="flex items-center gap-8 text-[11px] tracking-widest uppercase">
        {categories.map((c) => (
          <Link key={c.id} href={`/${c.slug}`} className="hover:opacity-70 transition-opacity">
            {c.title_en}
          </Link>
        ))}
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <Link href="/">
          <Image src="/yzs-logo.svg" alt="YZS" width={74} height={30} priority />
        </Link>
      </div>

      <div className="flex items-center gap-8 text-[11px] tracking-widest uppercase">
        <Link href="/story" className="hover:opacity-70 transition-opacity">Brand's Story</Link>
        
        <button onClick={toggleLanguage} className="hover:opacity-70 transition-opacity w-6 text-center font-medium">
          {lang}
        </button>
        
        <div className="flex items-center gap-5 ml-4">
          <button className="hover:opacity-70 transition-opacity">
            <Image src="/icons/search.svg" alt="Search" width={18} height={18} />
          </button>
          
          <Link href="/saved" className="hover:opacity-70 transition-opacity">
            <Image src="/icons/bookmark.svg" alt="Bookmark" width={18} height={18} />
          </Link>
          
          <button className="hover:opacity-70 transition-opacity">
            <Image src="/icons/user.svg" alt="Account" width={18} height={18} />
          </button>
          
          <Link href="/cart" className="hover:opacity-70 transition-opacity">
            <Image src="/icons/bag.svg" alt="Cart" width={18} height={18} />
          </Link>
        </div>
      </div>
    </nav>
  );
}