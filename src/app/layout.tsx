import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";

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

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://slfathimasfoods.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "SL Fathima's Foods — Authentic Homemade Food Products Sri Lanka",
    template: "%s | SL Fathima's Foods",
  },
  description:
    "Premium homemade food products made with natural ingredients and traditional Sri Lankan recipes. Biriyani kits, pickles, sambals, gift packs. No artificial preservatives. Island-wide delivery.",
  keywords: [
    "homemade biriyani Sri Lanka",
    "SL Fathima's Foods",
    "homemade chili paste Sri Lanka",
    "natural food products Sri Lanka",
    "gift food packs Sri Lanka",
    "homemade pickles Sri Lanka",
    "sambal Sri Lanka",
    "Domex delivery Sri Lanka",
    "preservative free food Sri Lanka",
    "biriyani kit online Sri Lanka",
  ],
  authors: [{ name: "SL Fathima's Foods" }],
  creator: "SL Fathima's Foods",
  publisher: "SL Fathima's Foods",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_LK",
    url: APP_URL,
    siteName: "SL Fathima's Foods",
    title: "SL Fathima's Foods — Authentic Homemade Food Products",
    description: "Premium homemade food products with natural ingredients. Biriyani kits, pickles, sambals & gift packs. Island-wide delivery Sri Lanka.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SL Fathima's Foods — Authentic Homemade Food Products Sri Lanka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SL Fathima's Foods — Authentic Homemade Food Products",
    description: "Premium homemade food — natural ingredients, no preservatives. Island-wide delivery Sri Lanka.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: APP_URL },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "SL Fathima's Foods",
    "image": "https://slfathimasfoods.com/logo.png",
    "description": "Premium homemade food products made with natural ingredients and traditional Sri Lankan recipes.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "LK"
    }
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${script.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#FAFAFA] text-[#222]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <main>{children}</main>
      </body>
    </html>
  );
}
