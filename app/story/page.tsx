import type { Metadata } from "next";
import StoryContent from "./StoryContent";

export const metadata: Metadata = {
  title: "Brand's Story",
  description:
    "YZS is a fashion house founded in Armenia in 2024 by Karapetyan F. and Jagatspanyan E. — the house, the inspiration, and the vision of the future.",
  openGraph: {
    title: "Brand's Story — YZS",
    description:
      "A fashion house founded in Armenia in 2024. Make clothes true to the gut, and strike everyone with the work — ourselves included.",
    images: ["/images/story/hero.jpg"],
  },
};

export default function StoryPage() {
  return <StoryContent />;
}
