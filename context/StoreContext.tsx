"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Product } from "../app/data/products";
import CartToast from "../app/components/CartToast";

interface StoreContextType {
  cartItems: Product[];
  savedItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  toggleSave: (product: Product) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [savedItems, setSavedItems] = useState<Product[]>([]);
  const [toast, setToast] = useState<{ product: Product; key: number } | null>(null);

  const closeToast = useCallback(() => setToast(null), []);

  const addToCart = (product: Product) => {
    setCartItems((prev) => [...prev, product]);
    setToast({ product, key: Date.now() });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
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

  return (
    <StoreContext.Provider value={{ cartItems, savedItems, addToCart, removeFromCart, toggleSave }}>
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
