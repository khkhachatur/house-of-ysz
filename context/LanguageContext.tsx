"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { dictionaries, LOCALE_COOKIE, type Dict, type Locale } from "../app/i18n/dictionary";

interface LanguageContextType {
  locale: Locale;
  t: Dict;
  toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const router = useRouter();

  const toggleLocale = () => {
    const next: Locale = locale === "en" ? "ru" : "en";
    setLocale(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = next;
    router.refresh();
  };

  return (
    <LanguageContext.Provider value={{ locale, t: dictionaries[locale], toggleLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLang must be used within a LanguageProvider");
  return context;
};
