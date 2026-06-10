import HeroSection from "@/components/home/HeroSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import BestSellers from "@/components/home/BestSellers";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import StatsBanner from "@/components/home/StatsBanner";
import CustomOrdersCTA from "@/components/home/CustomOrdersCTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SL Fathima's Foods — Authentic Homemade Food Products Sri Lanka",
  description:
    "Shop premium homemade food products — Biriyani Kits, Pickles, Sambals, and Gift Packs. Made with natural ingredients. Island-wide delivery across Sri Lanka.",
};

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Best Selling Products */}
      <BestSellers />

      {/* Shop By Category */}
      <CategoryShowcase />

      {/* Stats Banner */}
      <StatsBanner />

      {/* Custom Orders & Delivery CTA */}
      <CustomOrdersCTA />
    </>
  );
}
