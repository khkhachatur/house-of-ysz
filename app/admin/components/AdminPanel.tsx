"use client";

import { useState } from "react";
import { supabase } from "../../utils/supabase";
import StockTable from "./StockTable";
import AddProductForm from "./AddProductForm";
import AddCategoryForm from "./AddCategoryForm";

const TABS = ["Stock", "Add product", "Add category"] as const;
type Tab = (typeof TABS)[number];

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>("Stock");

  return (
    <main className="min-h-screen bg-white text-black px-6 md:px-10 py-10">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-end justify-between border-b border-gray-200 pb-4 mb-8">
          <h1 className="text-3xl font-black italic tracking-wider uppercase">YZS Admin</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-black transition-colors"
          >
            Sign out
          </button>
        </div>
        <div className="flex gap-6 mb-10 text-[11px] font-bold tracking-[0.2em] uppercase">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-1 border-b-2 transition-colors ${
                tab === t ? "border-black text-black" : "border-transparent text-gray-400 hover:text-black"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "Stock" && <StockTable />}
        {tab === "Add product" && <AddProductForm />}
        {tab === "Add category" && <AddCategoryForm />}
      </div>
    </main>
  );
}
