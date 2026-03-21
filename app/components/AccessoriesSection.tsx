"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

export default function AccessoriesSection() {
  const [isHovered, setIsHovered] = useState(false);

  // Animation states for the images to push them back into the canvas
  const imageVariants = {
    initial: { scale: 1, filter: "brightness(1)", opacity: 1 },
    hovered: { scale: 0.95, filter: "brightness(0.6)", opacity: 0.8, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section 
      className="relative w-full min-h-[120vh] bg-white text-black py-20 overflow-hidden flex items-center justify-center cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ========================================= */}
      {/* LAYER 1: SCATTERED IMAGE GRID             */}
      {/* ========================================= */}
      <div className="absolute inset-0 w-full h-full max-w-[1400px] mx-auto">
        
        {/* Top Left Image */}
        <motion.div 
          variants={imageVariants} animate={isHovered ? "hovered" : "initial"}
          className="absolute top-[10%] left-[15%] w-[22%] aspect-[3/4]"
        >
          <Image src="/images/products/bag/bag-1.jpg" alt="YSZ Bag" fill className="object-cover" />
        </motion.div>

        {/* Middle Left Image */}
        <motion.div 
          variants={imageVariants} animate={isHovered ? "hovered" : "initial"}
          className="absolute top-[45%] left-[8%] w-[25%] aspect-square"
        >
          <Image src="/images/products/bag/bag-2.jpg" alt="YSZ Bag" fill className="object-cover" />
        </motion.div>

        {/* Top Right Image (Product Only) */}
        <motion.div 
          variants={imageVariants} animate={isHovered ? "hovered" : "initial"}
          className="absolute top-[15%] right-[20%] w-[24%] aspect-square"
        >
          <Image src="/images/products/bag/bag-3.jpg" alt="YSZ Bag" fill className="object-cover bg-gray-100" />
        </motion.div>

        {/* Bottom Center (Texture Close-up) */}
        <motion.div 
          variants={imageVariants} animate={isHovered ? "hovered" : "initial"}
          className="absolute bottom-[5%] left-[38%] w-[26%] aspect-[4/5]"
        >
          <Image src="/images/products/bag/bag-4.jpg" alt="YSZ Bag Texture" fill className="object-cover" />
        </motion.div>

        {/* Bottom Right Image */}
        <motion.div 
          variants={imageVariants} animate={isHovered ? "hovered" : "initial"}
          className="absolute bottom-[15%] right-[10%] w-[25%] aspect-[3/4]"
        >
          <Image src="/images/products/bag/bag-5.jpg" alt="YSZ Bag" fill className="object-cover" />
        </motion.div>

      </div>

      {/* ========================================= */}
      {/* LAYER 2: TYPOGRAPHY & INTERACTION REVEAL  */}
      {/* ========================================= */}
      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none w-full max-w-2xl text-center px-6">
        
        {/* Default Title */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: isHovered ? 0 : 1, y: isHovered ? -20 : 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute"
        >
          <h2 className="text-[60px] md:text-[80px] font-light tracking-[0.2em] uppercase mix-blend-difference text-white">
            Accessories
          </h2>
        </motion.div>

        {/* Product Info Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-6 bg-white/90 backdrop-blur-md p-10 shadow-2xl pointer-events-auto"
        >
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400">Limited Run</span>
            <h3 className="text-4xl font-black italic tracking-wider">TO-1</h3>
          </div>
          
          <p className="text-sm font-medium tracking-wide leading-relaxed text-gray-800 max-w-md">
            Ручная работа. Полуэфирная ткань, вязана крючком.<br/> 
            Стирать желательно при 30 градусах.
          </p>

          <button className="mt-4 bg-black text-white px-10 py-3 text-xs font-medium tracking-[0.15em] uppercase hover:bg-gray-800 transition-colors">
            View Product
          </button>
        </motion.div>

      </div>
    </section>
  );
}