"use client";

import InfoPage from "../components/InfoPage";
import { useLang } from "@/context/LanguageContext";

export default function PrivacyPage() {
  const { t } = useLang();
  return <InfoPage title={t.privacy.title} sections={t.privacy.sections} />;
}
