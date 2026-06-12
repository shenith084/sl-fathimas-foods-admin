import type { Metadata } from "next";
import { products as fallbackProducts } from "@/lib/mockData";
import ProductDetailClient from "./ProductDetailClient";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://slfathimasfoods.com";

// Generate dynamic metadata for each product page
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

  // Try Firestore first; fall back to mock data
  const product = fallbackProducts.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for could not be found.",
    };
  }

  const title = `${product.name} — SL Fathima's Foods`;
  const description = `${product.description} Made with natural ingredients. LKR ${product.price.toLocaleString()}. Island-wide delivery across Sri Lanka.`;
  const productUrl = `${APP_URL}/products/${slug}`;

  return {
    title: product.name,
    description,
    alternates: { canonical: productUrl },
    openGraph: {
      title,
      description,
      url: productUrl,
      type: "website",
      siteName: "SL Fathima's Foods",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${product.name} — SL Fathima's Foods`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    keywords: [
      product.name,
      `${product.name} Sri Lanka`,
      `buy ${product.name} online`,
      "SL Fathima's Foods",
      "homemade food Sri Lanka",
      "natural ingredients Sri Lanka",
    ],
  };
}

// Generate static paths for all known products at build time
export async function generateStaticParams() {
  return fallbackProducts.map((p) => ({ slug: p.slug }));
}

// Server component — renders the client component with the slug
export default async function ProductDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}
