"use client";

import { useLang } from "@/context/LanguageContext";

export default function StoryPage() {
  const { t } = useLang();

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl md:text-7xl font-black italic tracking-wider uppercase mb-8">
        {t.story.title}
      </h1>
      <p className="text-sm md:text-base tracking-wide text-gray-400 leading-relaxed max-w-md mb-10">
        {t.story.text}
      </p>
      <a
        href="https://www.instagram.com/the.yzs?igsh=MW12dDRqY21hZHE0&utm_source=qr"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] font-bold tracking-[0.2em] uppercase border border-white/40 hover:border-white px-8 py-3 transition-colors"
      >
        Instagram
      </a>
    </main>
  );
}
