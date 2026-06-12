import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop — All Products",
  description: "Browse all SL Fathima's Foods products — Biriyani Kits, Ghee Rice Combos, Sambals, Pickles, Seenima, and more. Made with natural ingredients. Order online with island-wide delivery.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Shop All Products | SL Fathima's Foods",
    description: "Authentic Sri Lankan homemade food products. Biriyani Kits, Sambals, Pickles, Gift Packs — natural ingredients, no preservatives.",
    url: "/products",
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
