"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Product } from "../app/data/products";
import CartToast from "../app/components/CartToast";

// A cart line is a product plus how many of it are in the bag. Lines are keyed by
// the product+size id built in ProductInfo (`${productId}:${size}`), so the same
// garment in two sizes is two lines and the same size twice is one line of qty 2.
export interface CartLine extends Product {
  qty: number;
}

interface StoreContextType {
  cartItems: CartLine[];
  savedItems: Product[];
  cartCount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  toggleSave: (product: Product) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Carts saved before quantities existed are a flat Product[] with duplicate entries
// for repeated adds. Collapse them into lines so old bags survive this change intact.
function normalizeCart(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const byId = new Map<string, CartLine>();
  for (const item of raw as (Product & { qty?: number })[]) {
    if (!item || typeof item.id !== "string") continue;
    const add = typeof item.qty === "number" && item.qty > 0 ? Math.floor(item.qty) : 1;
    const existing = byId.get(item.id);
    if (existing) existing.qty += add;
    else byId.set(item.id, { ...item, qty: add });
  }
  return [...byId.values()];
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartLine[]>([]);
  const [savedItems, setSavedItems] = useState<Product[]>([]);
  const [toast, setToast] = useState<{ product: Product; key: number } | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const cart = localStorage.getItem("yzs-cart");
      if (cart) setCartItems(normalizeCart(JSON.parse(cart)));
      const saved = localStorage.getItem("yzs-saved");
      if (saved) setSavedItems(JSON.parse(saved));
    } catch {
      // corrupted storage — start fresh
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("yzs-cart", JSON.stringify(cartItems));
  }, [cartItems, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem("yzs-saved", JSON.stringify(savedItems));
  }, [savedItems, hydrated]);

  const closeToast = useCallback(() => setToast(null), []);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setToast({ product, key: Date.now() });
  };

  // Removes the whole line. Line ids are unique per product+size, so this no longer
  // deletes a second identical line the way the old flat-array filter did.
  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const setQty = (productId: string, qty: number) => {
    setCartItems((prev) =>
      qty <= 0
        ? prev.filter((item) => item.id !== productId)
        : prev.map((item) => (item.id === productId ? { ...item, qty: Math.floor(qty) } : item))
    );
  };

  const toggleSave = (product: Product) => {
    setSavedItems((prev) => {
      const isSaved = prev.some((item) => item.id === product.id);
      if (isSaved) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <StoreContext.Provider
      value={{ cartItems, savedItems, cartCount, addToCart, removeFromCart, setQty, toggleSave }}
    >
      {children}
      <CartToast toast={toast} onClose={closeToast} />
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
};
