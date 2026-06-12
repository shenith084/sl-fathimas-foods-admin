"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ChevronRight, ShoppingCart, Shield, Truck, RefreshCcw, Plus, Minus, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { db } from "@/lib/firebase/client";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useCartStore } from "@/store/cartStore";
import { products as fallbackProducts } from "@/lib/mockData";
import Script from "next/script";

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} className={`w-4 h-4 ${i < Math.round(rating) ? "fill-[#D98C1F] text-[#D98C1F]" : "fill-gray-200 text-gray-200"}`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-[#666]">{rating} ({count} reviews)</span>
    </div>
  );
}

export default function ProductDetailClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [vacuum, setVacuum] = useState(false);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/products/by-slug/${slug}`);
        const data = await res.json();
        
        if (data.success && data.data) {
          setProduct(data.data);
        } else {
          // fallback to mock data
          const localProd = fallbackProducts.find(p => p.slug === slug);
          setProduct(localProd || null);
        }
      } catch (err) {
        console.warn("API fetch error, falling back to local static catalog:", err);
        const localProd = fallbackProducts.find(p => p.slug === slug);
        setProduct(localProd || null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-[#2C4631] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#2C4631] font-semibold text-sm">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://slfathimasfoods.com";

  // Product JSON-LD Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images && product.images.length > 0 ? product.images[0] : `${APP_URL}/og-image.png`,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "SL Fathima's Foods",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "LKR",
      price: product.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "SL Fathima's Foods",
      },
    },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviews || 1,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
  };

  const vacuumPrice = vacuum && product.customizable ? 50 : 0;
  const totalPrice = (product.price + vacuumPrice) * qty;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji || "📦",
      weight: product.weight,
      vacuum: vacuum && product.customizable,
    }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = fallbackProducts
    .filter(p => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  if (related.length < 4) {
    const extra = fallbackProducts
      .filter(p => p.slug !== product.slug && !related.find(r => r.slug === p.slug))
      .slice(0, 4 - related.length);
    related.push(...extra);
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Product Schema.org JSON-LD */}
      <Script
        id={`product-schema-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-1.5 text-xs text-[#999]" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#D98C1F]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/products" className="hover:text-[#D98C1F]">Products</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#444]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#F4EFE6] to-[#FAF7F2] rounded-3xl aspect-square flex items-center justify-center shadow-md relative overflow-hidden">
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#D98C1F] text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
                  {product.badge}
                </span>
              )}
              {product.images && product.images.length > 0 ? (
                <img src={product.images[activeImageIndex] || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10rem] select-none" role="img" aria-label={product.name}>{product.emoji || "📦"}</span>
              )}
            </div>
            
            {/* Gallery Thumbnails */}
            {product.images && product.images.length > 1 ? (
              <div className="flex gap-3">
                {product.images.map((img: string, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveImageIndex(i)}
                    className={`flex-1 bg-gray-100 rounded-xl aspect-square overflow-hidden cursor-pointer border-2 transition-all duration-200 ${i === activeImageIndex ? "border-[#D98C1F] opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img src={img} alt={`Thumbnail ${i+1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              /* Fallback to emojis if no images, just to keep the layout looking similar */
              (!product.images || product.images.length === 0) ? (
                <div className="flex gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`flex-1 bg-gradient-to-br from-[#F4EFE6] to-[#FAF7F2] rounded-xl aspect-square flex items-center justify-center cursor-pointer border-2 transition-colors ${i === 1 ? "border-[#D98C1F]" : "border-transparent hover:border-[#D98C1F]/40"}`}>
                      <span className="text-3xl">{product.emoji || "📦"}</span>
                    </div>
                  ))}
                </div>
              ) : null
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-[#D98C1F] text-xs font-semibold uppercase tracking-widest mb-2">{product.category.replace("-", " ")}</p>
            <h1 className="font-display font-bold text-[#222] text-3xl md:text-4xl mb-3 leading-tight">{product.name}</h1>

            <StarRating rating={product.rating} count={product.reviews} />

            <div className="my-5 flex items-baseline gap-3">
              <span className="font-display font-bold text-[#D98C1F] text-4xl">
                LKR {product.price.toLocaleString()}.00
              </span>
              {product.customizable && (
                <span className="text-[#999] text-sm">+ vacuum packaging option</span>
              )}
            </div>

            <p className="text-[#666] leading-relaxed mb-6">{product.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: "Weight", value: product.weight },
                { label: "Shelf Life", value: product.shelfLife },
                { label: "Preservatives", value: "None" },
                { label: "Certification", value: "Halal ☪️" },
              ].map((d) => (
                <div key={d.label} className="bg-[#F4EFE6] rounded-xl px-4 py-3">
                  <p className="text-[#999] text-xs mb-0.5">{d.label}</p>
                  <p className="font-semibold text-[#222] text-sm">{d.value}</p>
                </div>
              ))}
            </div>

            {product.customizable && (
              <div className="mb-5 bg-white border border-gray-200 rounded-2xl p-4">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" checked={vacuum} onChange={(e) => setVacuum(e.target.checked)} className="sr-only" />
                  <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${vacuum ? "bg-[#2C4631] border-[#2C4631]" : "border-gray-300"}`}>
                    {vacuum && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <p className="font-semibold text-[#222] text-sm">Vacuum Packaging (+LKR 50/item)</p>
                    <p className="text-[#999] text-xs">Ideal for overseas orders — extends shelf life</p>
                  </div>
                </label>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-[#444]">Quantity:</span>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#FAF7F2] transition-colors" aria-label="Decrease quantity">
                  <Minus className="w-4 h-4 text-[#555]" />
                </button>
                <span className="w-8 text-center font-semibold text-[#222]">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#FAF7F2] transition-colors" aria-label="Increase quantity">
                  <Plus className="w-4 h-4 text-[#555]" />
                </button>
              </div>
              <span className="text-sm text-[#999]">
                Total: <span className="font-bold text-[#D98C1F]">LKR {totalPrice.toLocaleString()}.00</span>
              </span>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                id={`product-detail-add-cart-${product.id}`}
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-base transition-all duration-200 ${
                  added ? "bg-[#2C4631] text-white" : "bg-[#D98C1F] hover:bg-[#B8740F] text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {added ? (
                  <><Check className="w-5 h-5" /> Added to Cart!</>
                ) : (
                  <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
                )}
              </button>
              <Link
                href="/checkout"
                className="px-6 py-4 rounded-2xl font-semibold text-base border-2 border-[#2C4631] text-[#2C4631] hover:bg-[#2C4631] hover:text-white transition-all duration-200"
              >
                Buy Now
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Shield className="w-4 h-4" />, label: "100% Natural" },
                { icon: <Truck className="w-4 h-4" />, label: "Island-wide Delivery" },
                { icon: <RefreshCcw className="w-4 h-4" />, label: "Quality Guarantee" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1 bg-[#F4EFE6] rounded-xl p-3 text-center">
                  <span className="text-[#2C4631]">{b.icon}</span>
                  <span className="text-[#555] text-xs font-medium">{b.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-display font-semibold text-[#222] text-sm mb-2">🌿 Ingredients</h3>
              <p className="text-[#666] text-sm leading-relaxed">{product.ingredients}</p>
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        <div className="mt-16">
          <h2 className="font-display font-bold text-[#222] text-2xl mb-6">
            You May Also <span className="text-[#D98C1F]">Like</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="bg-white rounded-2xl overflow-hidden shadow-sm group block hover:shadow-md transition-shadow">
                <div className="h-36 bg-gradient-to-br from-[#F4EFE6] to-[#FAF7F2] flex items-center justify-center overflow-hidden">
                  {p.images && p.images.length > 0 ? (
                    <img 
                      src={p.images[0]} 
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300 select-none" role="img" aria-label={p.name}>{p.emoji || "📦"}</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-display font-semibold text-[#222] text-sm line-clamp-2 mb-1 group-hover:text-[#D98C1F] transition-colors">{p.name}</h3>
                  <span className="font-bold text-[#D98C1F] text-sm">LKR {p.price.toLocaleString()}.00</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
