import Link from "next/link";
import { cookies } from "next/headers";
import { dictionaries, isLocale, LOCALE_COOKIE, type Locale } from "./i18n/dictionary";

export default async function NotFound() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: Locale = isLocale(cookieLocale) ? cookieLocale : "en";
  const t = dictionaries[locale];

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-[120px] md:text-[200px] font-black italic tracking-wider leading-none opacity-90">
        404
      </h1>
      <p className="text-sm tracking-widest uppercase text-gray-400 mb-10">{t.notFound.text}</p>
      <Link
        href="/"
        className="text-[11px] font-bold tracking-[0.2em] uppercase border border-white/40 hover:border-white px-8 py-3 transition-colors"
      >
        {t.notFound.home}
      </Link>
    </main>
  );
}
