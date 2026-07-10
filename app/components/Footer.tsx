"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Category } from "../types";

export default function Footer({ categories }: { categories: Category[] }) {
  const tickerText = Array(12).fill("yzs ");

  return (
    <footer className="relative w-full bg-black text-white mt-auto flex flex-col overflow-hidden">

      <Image 
        src="/images/footer.jpg" 
        alt="yzs Footer Background" 
        fill 
        className="object-cover opacity-20 grayscale pointer-events-none" 
      />
      <div className="relative z-10 w-full overflow-hidden py-10 md:py-14 border-t border-white/10 flex items-center">
        <div className="relative z-10 flex whitespace-nowrap w-full">
          <motion.div 
            className="flex items-center"
            animate={{ x: ["0%", "-50%"] }} 
            transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
          >
            <div className="flex gap-10 px-5">
              {tickerText.map((text, i) => (
                <span key={`a-${i}`} className="text-5xl md:text-7xl font-black italic tracking-[0.1em] opacity-80 uppercase outline-text">
                  {text}
                </span>
              ))}
            </div>
            <div className="flex gap-10 px-5">
              {tickerText.map((text, i) => (
                <span key={`b-${i}`} className="text-5xl md:text-7xl font-black italic tracking-[0.1em] opacity-80 uppercase outline-text">
                  {text}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <div className="relative z-10 pt-20 pb-10 px-6 md:px-10 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between gap-16 md:gap-8 mb-20">
          
          <div className="w-full md:w-1/3 flex flex-col">
            <h3 className="text-3xl font-black italic tracking-wider mb-6">yzs</h3>
            <p className="text-xs font-medium tracking-wide text-gray-400 leading-relaxed mb-8 max-w-xs">
              Join the collective. Subscribe for exclusive releases, early access, and inside stories.
            </p>
            
            <div className="flex w-full max-w-sm border-b border-white/30 focus-within:border-white transition-colors pb-2">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-transparent w-full py-2 text-xs tracking-widest outline-none placeholder-gray-600"
              />
              <button className="text-[10px] font-bold tracking-[0.2em] uppercase hover:text-gray-400 transition-colors">
                Submit
              </button>
            </div>
          </div>

          <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-8">
            
            <div className="flex flex-col gap-5">
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-1">Shop</h4>
              {categories.map((c) => (
                <Link key={c.id} href={`/${c.slug}`} className="text-[11px] tracking-widest uppercase hover:text-white transition-colors">
                  {c.title_en}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-5">
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-1">Support</h4>
              <Link href="/shipping" className="text-[11px] tracking-widest uppercase hover:text-white transition-colors">Shipping & Returns</Link>
              <Link href="/size-guide" className="text-[11px] tracking-widest uppercase hover:text-white transition-colors">Size Guide</Link>
              <Link href="/faq" className="text-[11px] tracking-widest uppercase hover:text-white transition-colors">FAQ</Link>
              <Link href="/story" className="text-[11px] tracking-widest uppercase hover:text-white transition-colors">Brand's Story</Link>
            </div>

            <div className="flex flex-col gap-5 col-span-2 md:col-span-1">
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-1">Contact</h4>
              <a href="mailto:houseofyzs@gmail.com" className="text-[11px] tracking-widest hover:text-white transition-colors lowercase">
                houseofyzs@gmail.com
              </a>
              <a href="tel:077250201" className="text-[11px] tracking-widest hover:text-white transition-colors">
                ARM: 077 250 201
              </a>
              
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mt-2 mb-1">Socials</h4>
              <a 
                href="https://www.instagram.com/the.yzs?igsh=MW12dDRqY21hZHE0&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[11px] tracking-widest uppercase hover:text-white transition-colors flex items-center gap-2"
              >
                Instagram
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7V17"/>
                </svg>
              </a>
            </div>

          </div>
        </div>

        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-[9px] font-bold tracking-[0.2em] uppercase text-gray-500 gap-6">
          <div>© {new Date().getFullYear()} yzs. All Rights Reserved.</div>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}