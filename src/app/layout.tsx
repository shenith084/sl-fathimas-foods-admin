import type { Metadata } from "next";
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const script = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SL Fathima's Foods — Authentic Homemade Food Products Sri Lanka",
    template: "%s | SL Fathima's Foods",
  },
  description:
    "Premium homemade food products made with natural ingredients and traditional recipes. Biriyani kits, pickles, sambals, and gift packs. Island-wide delivery across Sri Lanka.",
  keywords: [
    "homemade biriyani Sri Lanka",
    "SL Fathima's Foods Sri Lanka",
    "homemade chili paste Sri Lanka",
    "natural food products Sri Lanka",
    "gift food packs Sri Lanka",
  ],
  openGraph: {
    type: "website",
    locale: "en_LK",
    siteName: "SL Fathima's Foods",
    title: "SL Fathima's Foods — Authentic Homemade Food Products",
    description: "Premium homemade food products made with natural ingredients. Island-wide delivery Sri Lanka.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SL Fathima's Foods — Authentic Homemade Food Products",
    description: "Premium homemade food — island-wide delivery Sri Lanka.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${script.variable}`}>
      <body className="font-sans antialiased bg-cream text-charcoal">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
