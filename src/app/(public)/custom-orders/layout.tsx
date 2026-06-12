import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Orders & Bulk Purchases",
  description: "Request custom gift packs, wedding favours, and bulk orders for SL Fathima's Foods. Authentic homemade Sri Lankan food tailored for your special occasion.",
  alternates: { canonical: "/custom-orders" },
  openGraph: {
    title: "Custom Orders & Bulk Purchases | SL Fathima's Foods",
    description: "Create custom gift packs and order in bulk for your special events and weddings.",
    url: "/custom-orders",
  },
};

export default function CustomOrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
