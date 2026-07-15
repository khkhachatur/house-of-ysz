"use client";

import InfoPage from "../components/InfoPage";
import { useLang } from "@/context/LanguageContext";

export default function SizeGuidePage() {
  const { t } = useLang();
  return <InfoPage title={t.sizeGuide.title} sections={t.sizeGuide.sections} />;
}
