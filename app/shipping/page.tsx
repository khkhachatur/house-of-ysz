"use client";

import InfoPage from "../components/InfoPage";
import { useLang } from "@/context/LanguageContext";

export default function ShippingPage() {
  const { t } = useLang();
  return <InfoPage title={t.shipping.title} sections={t.shipping.sections} />;
}
