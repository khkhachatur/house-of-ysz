import localFont from 'next/font/local';
import { Montserrat } from 'next/font/google';
import { cookies } from "next/headers";
import Navbar from "./components/Navbar";
import { StoreProvider } from "../context/StoreContext";
import { LanguageProvider } from "../context/LanguageContext";
import "./globals.css";
import Footer from './components/Footer';
import { supabase } from "./utils/supabase";
import { isLocale, LOCALE_COOKIE, type Locale } from "./i18n/dictionary";
import type { Category } from "./types";

export const dynamic = "force-dynamic";

const rebelton = localFont({
  src: [
    { path: '../fonts/REBELTON-Light.woff2', weight: '300', style: 'normal' },
    { path: '../fonts/REBELTON-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/REBELTON-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/REBELTON-Bold.woff2', weight: '700', style: 'normal' },
    // Italics
    { path: '../fonts/REBELTONITALIC-Light.woff2', weight: '300', style: 'italic' },
    { path: '../fonts/REBELTONITALIC-Regular.woff2', weight: '400', style: 'italic' },
    { path: '../fonts/REBELTONITALIC-Medium.woff2', weight: '500', style: 'italic' },
    { path: '../fonts/REBELTONITALIC-Bold.woff2', weight: '700', style: 'italic' },
  ],
  variable: '--font-rebelton',
  display: 'swap',
  // Without this, next/font injects an Arial-based "rebelton Fallback" scaled
  // ~157% to match REBELTON's metrics; it covers Cyrillic, so Russian text
  // rendered huge instead of falling through to Montserrat.
  adjustFontFallback: false,
});

const rebeltonExtended = localFont({
  src: [
    { path: '../fonts/REBELTON-Extended.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/REBELTONITALIC-Extended.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-rebelton-extended',
  display: 'swap',
  adjustFontFallback: false,
});

// Cyrillic fallback: REBELTON has no Cyrillic glyphs, so Russian text
// falls through to this instead of the system default.
const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  style: ['normal', 'italic'],
  variable: '--font-montserrat',
  display: 'swap',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ data }, cookieStore] = await Promise.all([
    supabase.from("categories").select("*").order("display_order"),
    cookies(),
  ]);
  const categories: Category[] = data ?? [];

  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: Locale = isLocale(cookieLocale) ? cookieLocale : "en";

  return (
    <html lang={locale} className={`${rebelton.variable} ${rebeltonExtended.variable} ${montserrat.variable}`}>
      <body className="antialiased bg-black min-h-screen font-sans text-white">
        <LanguageProvider initialLocale={locale}>
          <StoreProvider>
            <Navbar categories={categories} />
            <main>{children}</main>
            <Footer categories={categories} />
          </StoreProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}