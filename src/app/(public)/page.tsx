import HeroSection from "@/components/home/HeroSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import BestSellers from "@/components/home/BestSellers";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import StatsBanner from "@/components/home/StatsBanner";
import CustomOrdersCTA from "@/components/home/CustomOrdersCTA";
import type { Metadata } from "next";
import Script from "next/script";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://slfathimasfoods.com";

export const metadata: Metadata = {
  title: "SL Fathima's Foods — Authentic Homemade Food Products Sri Lanka",
  description:
    "Shop premium homemade food products — Biriyani Kits, Pickles, Sambals, and Gift Packs. Made with natural ingredients. No artificial preservatives. Island-wide delivery across Sri Lanka.",
  alternates: { canonical: APP_URL },
  openGraph: {
    title: "SL Fathima's Foods — Authentic Homemade Food Products Sri Lanka",
    description: "Premium homemade food — Biriyani Kits, Pickles, Sambals & Gift Packs. Natural ingredients. Island-wide delivery Sri Lanka.",
    url: APP_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "SL Fathima's Foods" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SL Fathima's Foods — Authentic Homemade Food Products Sri Lanka",
    description: "Premium homemade food — Biriyani Kits, Pickles, Sambals & Gift Packs. Natural ingredients. Island-wide delivery.",
    images: ["/og-image.png"],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${APP_URL}/#business`,
  name: "SL Fathima's Foods",
  description: "Premium homemade food products made with natural ingredients and traditional Sri Lankan recipes. Biriyani kits, pickles, sambals, and gift packs.",
  url: APP_URL,
  telephone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+94771234567",
  image: `${APP_URL}/og-image.png`,
  logo: `${APP_URL}/logo.png`,
  sameAs: ["https://www.tiktok.com/@sl.fathimas.products"],
  address: {
    "@type": "PostalAddress",
    addressCountry: "LK",
    addressLocality: "Sri Lanka",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 7.8731,
    longitude: 80.7718,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "SL Fathima's Foods Products",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Biriyani Combo Kit" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Ghee Rice Combo Kit" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Chicken Sambal" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Chicken Pickles" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Gift Packs" } },
    ],
  },
  priceRange: "LKR 700 – LKR 4500",
  servesCuisine: "Sri Lankan",
  currenciesAccepted: "LKR",
  paymentAccepted: "Cash on Delivery, Bank Transfer",
  areaServed: {
    "@type": "Country",
    name: "Sri Lanka",
  },
};

export default function HomePage() {
  return (
    <>
      {/* LocalBusiness Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

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

