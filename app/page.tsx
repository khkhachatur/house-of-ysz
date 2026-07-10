import Hero from "./components/Hero";
import AccessoriesSection from "./components/AccessoriesSection";
import NewArrivals from "./components/NewArrivals";
import CategorySection from "./components/CategorySection";
import { supabase } from "./utils/supabase";

export default async function Home() {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  return (
    <>
      <Hero />
      <NewArrivals />
      <AccessoriesSection />
      <CategorySection categories={data ?? []} />
    </>
  );
}