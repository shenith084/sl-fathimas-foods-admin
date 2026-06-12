import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with SL Fathima's Foods. Chat on WhatsApp, send an email, or fill in our contact form. We reply within 24 hours.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact SL Fathima's Foods",
    description: "Have a question or custom order? Chat on WhatsApp or send us a message. We reply within 24 hours.",
    url: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
