"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import LiquidButton from "./LiquidButton";

export default function AccessoriesSection() {
  const imageHover = {
    scale: 1.05,
    y: -10,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  };

  const bagImages = [
    "/images/products/bag/bag-1.jpg",
    "/images/products/bag/bag-2.jpg",
    "/images/products/bag/bag-3.jpg",
    "/images/products/bag/bag-4.jpg",
    "/images/products/bag/bag-5.jpg",
  ];

  return (
    <section className="relative w-full md:h-[130vh] bg-white overflow-hidden flex flex-col md:flex-row items-center justify-center py-16 md:py-0">

      {/* ========================================= */}
      {/* LAYER 1: CENTER TYPOGRAPHY & BUTTON       */}
      {/* ========================================= */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center md:mt-[-10vh] mb-10 md:mb-0">
        <h2 className="text-[32px] md:text-[50px] font-light tracking-[0.2em] uppercase text-black mb-4">
          Accessories
        </h2>

       <LiquidButton variant="black" className="px-10 py-3">
          Shop Now
        </LiquidButton>
      </div>

      {/* ========================================= */}
      {/* MOBILE: HORIZONTAL SWIPE ROW              */}
      {/* ========================================= */}
      <div className="w-full flex md:hidden overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-3 px-6">
        {bagImages.map((src) => (
          <div key={src} className="relative min-w-[58%] aspect-[4/5] snap-start overflow-hidden">
            <Image src={src} alt="yzs Bag" fill sizes="58vw" className="object-cover" />
          </div>
        ))}
      </div>

      {/* ========================================= */}
      {/* LAYER 2: ORBITING IMAGE GRID (DESKTOP)    */}
      {/* ========================================= */}
      <div className="absolute inset-0 w-full h-full max-w-[1400px] mx-auto pointer-events-none hidden md:block">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={imageHover}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-[8%] left-[20%] w-[24%] md:w-[20%] aspect-[4/5] pointer-events-auto cursor-pointer z-10"
        >
          <Image src="/images/products/bag/bag-1.jpg" alt="yzs Bag" fill className="object-cover shadow-xl" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={imageHover}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-[5%] right-[28%] w-[22%] md:w-[18%] aspect-[4/5] pointer-events-auto cursor-pointer z-10"
        >
          <Image src="/images/products/bag/bag-2.jpg" alt="yzs Bag" fill className="object-cover shadow-xl" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={imageHover}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-[45%] left-[8%] w-[26%] md:w-[22%] aspect-[4/5] pointer-events-auto cursor-pointer z-10"
        >
          <Image src="/images/products/bag/bag-3.jpg" alt="yzs Bag" fill className="object-cover shadow-xl" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={imageHover}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-[5%] left-[36%] w-[28%] md:w-[24%] aspect-[4/5] pointer-events-auto cursor-pointer z-10"
        >
          <Image src="/images/products/bag/bag-4.jpg" alt="yzs Bag Texture" fill className="object-cover shadow-xl" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={imageHover}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-[42%] right-[10%] w-[25%] md:w-[21%] aspect-[3/4] pointer-events-auto cursor-pointer z-10"
        >
          <Image src="/images/products/bag/bag-5.jpg" alt="yzs Bag" fill className="object-cover shadow-xl" />
        </motion.div>

      </div>
    </section>
  );
}