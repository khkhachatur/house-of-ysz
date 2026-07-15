"use client";

import InfoPage from "../components/InfoPage";
import { useLang } from "@/context/LanguageContext";

export default function TermsPage() {
  const { t } = useLang();
  return <InfoPage title={t.terms.title} sections={t.terms.sections} />;
}
