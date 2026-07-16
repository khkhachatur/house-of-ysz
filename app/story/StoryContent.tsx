"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useLang } from "@/context/LanguageContext";

const INSTAGRAM =
  "https://www.instagram.com/the.yzs?igsh=MW12dDRqY21hZHE0&utm_source=qr";

// Sampled from the founders' own film — the dominant tone across all four frames.
const ACCENT = "#F88808";

const EASE = [0.16, 1, 0.3, 1] as const;

// Grain over the whole page, so the black UI sits in the same emulsion as the
// photographs. Kept under the navbar (z-50) and never eats clicks.
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23g)'/%3E%3C/svg%3E";

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`text-[10px] md:text-[11px] font-bold tracking-[0.25em] uppercase ${className}`}
    >
      {children}
    </span>
  );
}

function ChapterHead({ n, h }: { n: string; h: string }) {
  return (
    <div>
      <div className="flex items-baseline gap-4">
        <span
          className="text-2xl md:text-3xl font-black italic"
          style={{ color: ACCENT }}
        >
          {n}
        </span>
        <span className="h-px flex-1 bg-white/15" />
      </div>
      <h2 className="mt-5 text-[clamp(1.75rem,4.5vw,3.25rem)] font-black italic uppercase tracking-tight leading-[0.95]">
        {h}
      </h2>
    </div>
  );
}

function Body({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="mt-8 space-y-5">
      {paragraphs.map((p) => (
        <p
          key={p}
          className="max-w-[48ch] text-sm md:text-base leading-relaxed text-white/70"
        >
          {p}
        </p>
      ))}
    </div>
  );
}

export default function StoryContent() {
  const { t } = useLang();
  const s = t.story;
  const [ch1, ch2, ch3] = s.chapters;

  return (
    <div className="relative bg-black text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.07] mix-blend-screen"
        style={{ backgroundImage: `url("${GRAIN}")` }}
      />

      {/* Hero. A 2:3 frame in a wide viewport only ever shows a band of itself, so
          the crop is pulled down to keep the hooded figure under the ring of stone
          circles. Taller windows and phones reveal the sun above it. */}
      <section className="relative h-svh min-h-[560px] w-full overflow-hidden">
        <Image
          src="/images/story/hero.jpg"
          alt={s.alts.hero}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_57%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/50" />

        <div className="absolute inset-x-0 bottom-0 px-6 md:px-10 pb-14 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          >
            <Eyebrow className="text-white/70">{s.eyebrow}</Eyebrow>
            {/* Narrow enough to stack the title bottom-left in both locales, keeping
                white type off the white hood in the centre of the frame. */}
            <h1 className="mt-4 max-w-[10ch] text-[clamp(2.75rem,10vw,8.5rem)] font-black italic uppercase tracking-tighter leading-[0.85] drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)]">
              {s.title}
            </h1>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-6 right-6 md:right-10 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Eyebrow className="text-white/50">{s.scroll}</Eyebrow>
          <span className="block h-px w-10 bg-white/40" />
        </motion.div>
      </section>

      {/* 01 — The House */}
      <section className="px-6 md:px-10 py-24 md:py-36">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-5">
            <ChapterHead n={ch1.n} h={ch1.h} />
            <Body paragraphs={ch1.p} />
          </Reveal>
          <Reveal className="md:col-span-6 md:col-start-7" delay={0.1}>
            <div className="relative aspect-[4/5] w-full overflow-hidden ring-1 ring-white/10">
              <Image
                src="/images/story/plaza.jpg"
                alt={s.alts.plaza}
                fill
                sizes="(max-width: 768px) 100vw, 48vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cut from the hero frame: the carved sun, on its own. */}
      <section className="relative h-[26vh] min-h-[170px] md:h-[38vh] w-full overflow-hidden">
        <Image
          src="/images/story/band-sun.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/20" />
      </section>

      {/* 02 — Inspiration */}
      <section className="px-6 md:px-10 py-24 md:py-36">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-6">
            <div className="relative aspect-[4/5] w-full overflow-hidden ring-1 ring-white/10">
              <Image
                src="/images/story/scrawl.jpg"
                alt={s.alts.scrawl}
                fill
                sizes="(max-width: 768px) 100vw, 48vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal className="md:col-span-5 md:col-start-8" delay={0.1}>
            <ChapterHead n={ch2.n} h={ch2.h} />
            <Body paragraphs={ch2.p} />
          </Reveal>
        </div>
      </section>

      {/* The thesis. Centred, to rhyme with the symmetry of the hero. */}
      <section className="px-6 md:px-10 py-24 md:py-36">
        <div className="mx-auto max-w-[900px] text-center">
          <Reveal>
            <div className="relative mx-auto aspect-square w-[150px] md:w-[210px] overflow-hidden ring-1 ring-white/15">
              <Image
                src="/images/story/eye.jpg"
                alt=""
                fill
                sizes="210px"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow className="mt-10 block" >
              <span style={{ color: ACCENT }}>{s.quoteLabel}</span>
            </Eyebrow>
            <blockquote className="mt-6 text-[clamp(1.5rem,4.2vw,3rem)] font-black italic uppercase tracking-tight leading-[1.05]">
              {`“${s.quote}”`}
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* 03 — The Future, over the collage. */}
      <section className="relative flex min-h-[85svh] w-full items-end overflow-hidden">
        <Image
          src="/images/story/collage.jpg"
          alt={s.alts.collage}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent md:bg-gradient-to-r md:from-black/95 md:via-black/40 md:to-transparent" />

        <div className="relative w-full px-6 md:px-10 pb-16 md:pb-24">
          <Reveal className="max-w-[540px]">
            <ChapterHead n={ch3.n} h={ch3.h} />
            <Body paragraphs={ch3.p} />
          </Reveal>
        </div>
      </section>

      {/* Their own hand, above their own names. */}
      <section className="px-6 md:px-10 py-24 md:py-32">
        <div className="mx-auto max-w-[900px] text-center">
          <Reveal>
            <div className="relative mx-auto aspect-[1120/530] w-full max-w-[520px] overflow-hidden">
              <Image
                src="/images/story/mark.jpg"
                alt={s.alts.mark}
                fill
                sizes="(max-width: 768px) 90vw, 520px"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow className="mt-12 block text-white/40">
              {s.foundersLabel}
            </Eyebrow>
            <div className="mt-5 flex flex-col items-center justify-center gap-2 md:flex-row md:gap-12">
              {s.founders.map((f) => (
                <span
                  key={f}
                  className="text-lg md:text-2xl font-black italic uppercase tracking-tight"
                >
                  {f}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 md:px-10 py-16 md:py-20">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-8 md:flex-row">
          <Eyebrow className="text-white/40">{s.ctaLabel}</Eyebrow>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/40 px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors hover:border-white hover:bg-white hover:text-black"
            >
              {s.instagram}
            </a>
            <Link
              href="/#collections"
              className="border border-white/40 px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors hover:border-white hover:bg-white hover:text-black"
            >
              {s.shop}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
