"use client";

import { useLang } from "@/context/LanguageContext";

export default function FaqPage() {
  const { t } = useLang();

  return (
    <main className="min-h-screen bg-white text-black pt-32 px-6 md:px-10 pb-24">
      <div className="max-w-[800px] mx-auto">
        <h1 className="text-3xl md:text-5xl font-black italic tracking-wider leading-tight mb-12 uppercase border-b border-gray-200 pb-6">
          {t.faq.title}
        </h1>

        <div className="space-y-4">
          {t.faq.items.map((item) => (
            <details key={item.q} className="group cursor-pointer bg-gray-50 px-5 py-4">
              <summary className="list-none flex justify-between items-center gap-4 text-[11px] font-bold uppercase tracking-widest">
                {item.q}
                <span className="group-open:rotate-180 transition-transform shrink-0">↓</span>
              </summary>
              <p className="pt-4 text-xs leading-relaxed text-gray-600">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}
