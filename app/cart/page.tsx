"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { useLang } from "@/context/LanguageContext";
import { pick } from "../i18n/dictionary";
import LiquidButton from "../components/LiquidButton";

export default function CartPage() {
  const { cartItems, removeFromCart } = useStore();
  const { locale, t } = useLang();

  const subtotal = cartItems.reduce((acc, item) => {
    const num = parseFloat(item.price.replace(",", ".").split(" ")[0]);
    return acc + num;
  }, 0);

  return (
    <main className="min-h-screen bg-white text-black flex flex-col md:flex-row pt-24 md:pt-0">
      
      <div className="w-full md:w-[60%] flex flex-col border-r border-gray-100 p-8 md:p-16 md:pt-32">
        <h1 className="text-3xl md:text-5xl font-black italic tracking-wider mb-12 uppercase">
          {t.cart.title} ({cartItems.length})
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-400 text-sm tracking-widest uppercase mt-10">{t.cart.empty}</p>
        ) : (
          <div className="flex flex-col gap-10">
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex gap-6 border-b border-gray-100 pb-10">
                <div className="relative w-32 md:w-48 aspect-[3/4] bg-gray-100">
                  <Image src={item.imageSrc} alt={pick(locale, item.name, item.name_ru)} fill className="object-cover" />
                </div>

                <div className="flex flex-col justify-between flex-grow py-2">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-1">{item.brand}</div>
                    <Link href={`/products/${item.id.split(":")[0]}`} className="text-lg md:text-xl font-black italic uppercase hover:opacity-60 transition-opacity">
                      {pick(locale, item.name, item.name_ru)}
                    </Link>
                    <div className="text-sm font-medium tracking-wide mt-2">{item.price}</div>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-red-500 text-left transition-colors"
                  >
                    {t.cart.remove}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Order Summary (40% Sticky) */}
      <div className="w-full md:w-[40%] md:h-screen md:sticky md:top-0 bg-gray-50/50">
        <div className="flex flex-col p-8 md:p-16 pt-10 md:pt-32 h-full">
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-8">{t.cart.orderSummary}</h2>

          <div className="flex flex-col gap-4 text-sm font-medium tracking-wide mb-8 border-b border-gray-200 pb-8">
            <div className="flex justify-between">
              <span className="text-gray-500">{t.cart.subtotal}</span>
              <span>{subtotal.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t.cart.shipping}</span>
              <span>{t.cart.calculated}</span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-black uppercase tracking-widest mb-10">
            <span>{t.cart.total}</span>
            <span>{subtotal.toFixed(2)} USD</span>
          </div>

          <LiquidButton variant="black" className="w-full py-4">
            {t.cart.checkout}
          </LiquidButton>
        </div>
      </div>
    </main>
  );
}