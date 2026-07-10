"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import LiquidButton from "./LiquidButton";

export default function Hero() {
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
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/yzs-hero.jpg"
          alt="yzs Spy Collection"
          fill
          priority
          className="object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="absolute bottom-24 left-10 text-white z-10">
        <motion.div 
          variants={containerVars}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start"
        >
          <motion.h1 variants={itemVars} className="flex flex-col leading-none mb-8">
            <span className="text-[160px] font-black italic tracking-tighter text-gray-200 drop-shadow-md">SPY</span>
            <span className="text-[40px] font-light tracking-[0.2em] mt-4 text-white">COLLECTION</span>
          </motion.h1>

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