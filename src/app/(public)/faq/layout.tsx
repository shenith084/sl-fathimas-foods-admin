import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description: "Answers to common questions about SL Fathima's Foods — delivery times, shelf life, preservatives, payment methods, custom orders, and returns.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Frequently Asked Questions | SL Fathima's Foods",
    description: "Find answers about delivery, products, ingredients, payments and custom orders for SL Fathima's Foods.",
    url: "/faq",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
