"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import type { Category } from "../types";

export default function Navbar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const { locale, t, toggleLocale } = useLang();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const forceBackground = pathname !== "/";

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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const showBackground = isScrolled || forceBackground;

  return (
    <>
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 transition-all duration-500 text-white ${
        showBackground
          ? "bg-black/95 backdrop-blur-md py-4 shadow-lg"
          : "bg-transparent py-6 md:py-8"
      }`}
    >
      <button
        onClick={() => setMenuOpen(true)}
        aria-label={t.nav.openMenu}
        className="md:hidden hover:opacity-70 transition-opacity"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      <div className="hidden md:flex items-center gap-8 text-[11px] tracking-widest uppercase">
        {categories.map((c) => (
          <Link key={c.id} href={`/${c.slug}`} className="hover:opacity-70 transition-opacity">
            {c.title_en}
          </Link>
        ))}
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <Link href="/">
          <span className="text-3xl font-black italic tracking-wider">yzs</span>
        </Link>
      </div>

      <div className="flex items-center gap-8 text-[11px] tracking-widest uppercase">
        <Link href="/story" className="hidden md:block hover:opacity-70 transition-opacity">{t.nav.story}</Link>

        <button onClick={toggleLocale} className="hidden md:block hover:opacity-70 transition-opacity w-6 text-center font-medium">
          {locale.toUpperCase()}
        </button>

        <div className="flex items-center gap-5 md:ml-4">
          <button className="hidden md:block hover:opacity-70 transition-opacity">
            <Image src="/icons/search.svg" alt={t.nav.search} width={18} height={18} />
          </button>

          <Link href="/saved" className="hover:opacity-70 transition-opacity">
            <Image src="/icons/bookmark.svg" alt={t.nav.saved} width={18} height={18} />
          </Link>

          <button className="hidden md:block hover:opacity-70 transition-opacity">
            <Image src="/icons/user.svg" alt={t.nav.account} width={18} height={18} />
          </button>

          <Link href="/cart" className="hover:opacity-70 transition-opacity">
            <Image src="/icons/bag.svg" alt={t.nav.cart} width={18} height={18} />
          </Link>
        </div>
      </div>

    </nav>

    <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-[60] flex flex-col text-white md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                <span className="text-2xl font-black italic tracking-wider">yzs</span>
              </Link>
              <button onClick={() => setMenuOpen(false)} aria-label={t.nav.closeMenu} className="hover:opacity-70 transition-opacity">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-7 px-6 pt-12">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/${c.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-3xl font-black italic tracking-wider uppercase hover:opacity-70 transition-opacity"
                >
                  {c.title_en}
                </Link>
              ))}
              <Link
                href="/story"
                onClick={() => setMenuOpen(false)}
                className="text-3xl font-black italic tracking-wider uppercase hover:opacity-70 transition-opacity"
              >
                {t.nav.story}
              </Link>
            </div>

            <div className="mt-auto px-6 pb-10 flex items-center gap-10 text-[11px] font-bold tracking-[0.2em] uppercase">
              <Link href="/saved" onClick={() => setMenuOpen(false)} className="hover:opacity-70 transition-opacity">{t.nav.saved}</Link>
              <Link href="/cart" onClick={() => setMenuOpen(false)} className="hover:opacity-70 transition-opacity">{t.nav.bag}</Link>
              <button onClick={toggleLocale} className="hover:opacity-70 transition-opacity">{locale.toUpperCase()}</button>
            </div>
          </motion.div>
        )}
    </AnimatePresence>
    </>
  );
}
