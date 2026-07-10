import Image from "next/image";
import LiquidButton from "../../components/LiquidButton";
import { newArrivalsData } from "../../data/products";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = newArrivalsData.find(p => p.id === params.id) || newArrivalsData[0];

  return (
    <main className="w-full min-h-screen bg-white text-black flex flex-col md:flex-row pt-20 md:pt-0">
      
      {/* ========================================= */}
      {/* LEFT COLUMN: 60% Width Image Stack        */}
      {/* ========================================= */}
      <div className="w-full md:w-[50%] flex flex-row overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-col md:overflow-x-visible border-r border-gray-100">
        <div className="relative w-full min-w-[90%] snap-start md:min-w-0 aspect-[3/4] md:h-screen bg-gray-100">
          <Image src={product.imageSrc} alt={product.name} fill className="object-cover" priority />
        </div>
        <div className="relative w-full min-w-[90%] snap-start md:min-w-0 aspect-[3/4] md:h-screen bg-gray-50 md:border-t border-gray-100">
          <Image src="/images/products/bag/bag-4.jpg" alt="Detail" fill className="object-cover" />
        </div>
      </div>

      {/* ========================================= */}
      {/* RIGHT COLUMN: 40% Width Sticky Info       */}
      {/* ========================================= */}
      <div className="w-full md:w-[50%] md:h-screen md:sticky md:top-0 overflow-y-auto">
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
              <span>Select Size</span>
              <button className="underline opacity-50 hover:opacity-100">Size Guide</button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["S", "M", "L", "XL"].map(size => (
                <button key={size} className="border border-gray-200 py-3 text-xs font-medium hover:border-black transition-all">
                  {size}
                </button>
              ))}
            </div>
          </div>

          <LiquidButton variant="black" className="w-full py-4 mb-10">
            Add To Cart
          </LiquidButton>

          {/* Accordion Style Details */}
          <div className="border-t border-gray-100 pt-8 space-y-4">
            <details className="group cursor-pointer bg-gray-50 px-5 py-4">
              <summary className="list-none flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                Description
                <span className="group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <p className="pt-4 text-xs leading-relaxed text-gray-600">
                Ручная работа. Полуэфирная ткань, вязана крючком. Стирать желательно при 30 градусах.
              </p>
            </details>

            <details className="group cursor-pointer bg-gray-50 px-5 py-4">
              <summary className="list-none flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                Shipping & Returns
                <span className="group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <p className="pt-4 text-xs leading-relaxed text-gray-600">
                Worldwide shipping available. Returns accepted within 14 days.
              </p>
            </details>
          </div>

        </div>
      </div>
    </main>
  );
}