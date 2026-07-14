"use client";

import Image from "next/image";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Product } from "../data/products";
import { useLang } from "@/context/LanguageContext";
import { pick } from "../i18n/dictionary";

interface CartToastProps {
  toast: { product: Product; key: number } | null;
  onClose: () => void;
}

export default function CartToast({ toast, onClose }: CartToastProps) {
  const { locale, t } = useLang();
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.key}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-4 bg-black text-white border border-white/15 pl-3 pr-6 py-3 shadow-2xl"
        >
          <div className="relative w-10 h-12 bg-gray-800 overflow-hidden shrink-0">
            <Image src={toast.product.imageSrc} alt={pick(locale, toast.product.name, toast.product.name_ru)} fill sizes="40px" className="object-cover" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{t.toast.added}</span>
            <span className="text-[10px] tracking-widest uppercase text-gray-400">{pick(locale, toast.product.name, toast.product.name_ru)}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
