"use client";

import { useState } from "react";
import LiquidButton from "./LiquidButton";
import { useStore } from "@/context/StoreContext";
import { useLang } from "@/context/LanguageContext";

export interface ProductInfoData {
  id: string;
  brand: string;
  name: string;
  price: string;
  description: string | null;
  descriptionRu?: string | null;
  imageSrc: string;
  category: string;
  sizes: { label: string; inStock: boolean }[];
}

export default function ProductInfo({ product }: { product: ProductInfoData }) {
  const { addToCart } = useStore();
  const { locale, t } = useLang();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);

  const description =
    (locale === "ru" && product.descriptionRu) ||
    product.description ||
    t.product.defaultDescription;

  const handleAdd = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addToCart({
      id: `${product.id}:${selectedSize}`,
      brand: product.brand,
      name: `${product.name} — ${selectedSize}`,
      price: product.price,
      imageSrc: product.imageSrc,
      category: product.category,
    });
  };

  return (
    <div className="flex flex-col p-8 md:p-12 lg:p-16 pt-16 md:pt-32">
      <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-2">
        {product.brand}
      </div>

      <h1 className="text-3xl md:text-4xl font-black italic tracking-wider mb-4 uppercase">
        {product.name}
      </h1>

      <p className="text-sm font-medium tracking-wide mb-10">
        {product.price}
      </p>

      {/* Size Selector */}
      <div className="mb-10">
        <div className="flex justify-between text-[10px] font-bold tracking-[0.15em] uppercase mb-4">
          <span>{t.product.selectSize}</span>
          <button className="underline opacity-50 hover:opacity-100">{t.product.sizeGuide}</button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {product.sizes.map(({ label, inStock }) => (
            <button
              key={label}
              disabled={!inStock}
              onClick={() => { setSelectedSize(label); setSizeError(false); }}
              className={`border py-3 text-xs font-medium transition-all ${
                !inStock
                  ? "border-gray-100 text-gray-300 line-through cursor-not-allowed"
                  : selectedSize === label
                  ? "border-black bg-black text-white"
                  : "border-gray-200 hover:border-black"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {sizeError && (
          <p className="text-[10px] tracking-widest uppercase text-red-600 mt-3">{t.product.sizeError}</p>
        )}
      </div>

      <LiquidButton variant="black" className="w-full py-4 mb-10" onClick={handleAdd}>
        {t.product.addToCart}
      </LiquidButton>

      {/* Accordion Style Details */}
      <div className="border-t border-gray-100 pt-8 space-y-4">
        <details className="group cursor-pointer bg-gray-50 px-5 py-4">
          <summary className="list-none flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
            {t.product.description}
            <span className="group-open:rotate-180 transition-transform">↓</span>
          </summary>
          <p className="pt-4 text-xs leading-relaxed text-gray-600">
            {description}
          </p>
        </details>

        <details className="group cursor-pointer bg-gray-50 px-5 py-4">
          <summary className="list-none flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
            {t.product.shippingReturns}
            <span className="group-open:rotate-180 transition-transform">↓</span>
          </summary>
          <p className="pt-4 text-xs leading-relaxed text-gray-600">
            {t.product.shippingText}
          </p>
        </details>
      </div>
    </div>
  );
}
