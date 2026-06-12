import { getProducts } from "@/lib/services/productService";
import ProductsClientComponent from "./ProductsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Products | SL Fathima's Foods",
  description: "Browse our complete catalog of premium homemade Sri Lankan foods. Authentic biriyani kits, sambals, pickles, and gift packs with island-wide delivery.",
};

export const revalidate = 60; // Revalidate the cache every 60 seconds

export default async function ProductsPage() {
  // Fetch live products securely from Firestore on the Server!
  const liveProducts = await getProducts(false); // don't include deleted products
  
  // Format the data perfectly for the client component
  const initialProducts = liveProducts.map(p => ({
    id: p.slug || p.id,
    slug: p.slug || p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    description: p.description || "",
    emoji: p.emoji || "📦",
    badge: p.badge || null,
    rating: p.rating || 4.9,
    reviews: p.reviews || 0,
    images: (p as any).images || undefined,
  }));

  return <ProductsClientComponent initialProducts={initialProducts} />;
}
