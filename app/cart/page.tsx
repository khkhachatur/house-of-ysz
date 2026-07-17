"use client";

import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { useStore } from "@/context/StoreContext";
import { useLang } from "@/context/LanguageContext";
import LiquidButton from "../components/LiquidButton";

function priceValue(price: string): number {
  return parseFloat(price.replace(",", ".").split(" ")[0]) || 0;
}

export default function CartPage() {
  const { cartItems, cartCount, removeFromCart, setQty } = useStore();
  const { t } = useLang();

  const subtotal = cartItems.reduce((acc, item) => acc + priceValue(item.price) * item.qty, 0);

  // The checkout flow does not exist yet (no route, no orders table, no payment
  // rail — that is a pending owner decision). Until it is built, this button stays
  // deliberately inert and only records the click, so there is a baseline of lost
  // purchase intent to measure the real checkout against once it ships.
  const handleCheckout = () => {
    track("checkout_click", { items: cartCount, subtotal: Number(subtotal.toFixed(2)) });
  };

  return (
    <main className="min-h-screen bg-white text-black flex flex-col md:flex-row pt-24 md:pt-0">

      <div className="w-full md:w-[60%] flex flex-col border-r border-gray-100 p-8 md:p-16 md:pt-32">
        <h1 className="text-3xl md:text-5xl font-black italic tracking-wider mb-12 uppercase">
          {t.cart.title} ({cartCount})
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-sm tracking-widest uppercase mt-10">{t.cart.empty}</p>
        ) : (
          <div className="flex flex-col gap-10">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-6 border-b border-gray-100 pb-10">
                <div className="relative w-32 md:w-48 aspect-[3/4] bg-gray-100">
                  <Image src={item.imageSrc} alt={item.name} fill className="object-cover" />
                </div>

                <div className="flex flex-col justify-between flex-grow py-2">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-1">{item.brand}</div>
                    <Link href={`/products/${item.id.split(":")[0]}`} className="text-lg md:text-xl font-black italic uppercase hover:opacity-60 transition-opacity">
                      {item.name}
                    </Link>
                    <div className="text-sm font-medium tracking-wide mt-2">{item.price}</div>
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-4">
                    <div className="flex items-center border border-gray-300" role="group" aria-label={t.cart.quantity}>
                      <button
                        type="button"
                        onClick={() => setQty(item.id, item.qty - 1)}
                        aria-label={t.cart.decrease}
                        className="w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(item.id, item.qty + 1)}
                        aria-label={t.cart.increase}
                        className="w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-red-500 transition-colors"
                    >
                      {t.cart.remove}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Order Summary (40% Sticky) */}
      <div className="w-full md:w-[40%] md:h-screen md:sticky md:top-0 bg-gray-50/50">
        <div className="flex flex-col p-8 md:p-16 pt-10 md:pt-32 h-full">
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-8">{t.cart.orderSummary}</h2>

          <div className="flex flex-col gap-4 text-sm font-medium tracking-wide mb-8 border-b border-gray-200 pb-8">
            <div className="flex justify-between">
              <span className="text-gray-600">{t.cart.subtotal}</span>
              <span>{subtotal.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t.cart.shipping}</span>
              <span>{t.cart.calculated}</span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-black uppercase tracking-widest mb-10">
            <span>{t.cart.total}</span>
            <span>{subtotal.toFixed(2)} USD</span>
          </div>

          <LiquidButton
            type="button"
            variant="black"
            className="w-full py-4"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            {t.cart.checkout}
          </LiquidButton>
        </div>
      </div>
    </main>
  );
}
