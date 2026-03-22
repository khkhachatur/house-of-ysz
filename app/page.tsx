import Hero from "./components/Hero";
import AccessoriesSection from "./components/AccessoriesSection";
import NewArrivals from "./components/NewArrivals";
import CategorySection from "./components/CategorySection";

export default function Home() {
  return (
    <>
      <Hero />
      <NewArrivals />
      <AccessoriesSection />
      <CategorySection />
    </>
  );
}