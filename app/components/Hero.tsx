"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LiquidButton from "./LiquidButton";

const SLIDES = [
  { src: "/yzs-hero.jpg", alt: "yzs Spy Collection", title: "SPY", subtitle: "COLLECTION", titleClass: "text-[160px]" },
  { src: "/yzs-hero-2.jpg", alt: "yzs Just Dance Collection", title: "JUST DANCE", subtitle: "COLLECTION", titleClass: "text-[54px] whitespace-nowrap" },
];

const ROTATE_MS = 7000;

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), ROTATE_MS);
    return () => clearInterval(timer);
  }, []);

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {SLIDES.map((slide, i) => (
        <motion.div
          key={slide.src}
          className="absolute inset-0 w-full h-full z-0"
          initial={false}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            className="object-cover object-center opacity-80"
          />
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-[1]" />

      <div className="absolute bottom-24 left-10 text-white z-10">
        <motion.div
          variants={containerVars}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start"
        >
          <AnimatePresence mode="wait">
            <motion.h1
              key={index}
              className="flex flex-col leading-none mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={`${SLIDES[index].titleClass} font-black italic tracking-tighter text-gray-200 drop-shadow-md`}>
                {SLIDES[index].title}
              </span>
              <span className="text-[40px] font-light tracking-[0.2em] mt-4 text-white">
                {SLIDES[index].subtitle}
              </span>
            </motion.h1>
          </AnimatePresence>

          <motion.div variants={itemVars} className="flex flex-col gap-3">
            <LiquidButton variant="white">
              Shop Now
            </LiquidButton>

            <LiquidButton variant="transparent">
              Explore More
            </LiquidButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
