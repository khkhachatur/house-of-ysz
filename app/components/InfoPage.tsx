"use client";

export default function InfoPage({
  title,
  sections,
}: {
  title: string;
  sections: { h: string; p: string }[];
}) {
  return (
    <main className="min-h-screen bg-white text-black pt-32 px-6 md:px-10 pb-24">
      <div className="max-w-[800px] mx-auto">
        <h1 className="text-3xl md:text-5xl font-black italic tracking-wider leading-tight mb-12 uppercase border-b border-gray-200 pb-6">
          {title}
        </h1>

        <div className="space-y-10">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3">{s.h}</h2>
              <p className="text-sm leading-relaxed text-gray-600">{s.p}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
