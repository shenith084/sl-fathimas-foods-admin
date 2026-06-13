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
import { event as fbEvent } from "@/components/analytics/MetaPixel";
import { ttevent } from "@/components/analytics/TikTokPixel";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import ReviewModal from "@/components/products/ReviewModal";

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
  const [activeTab, setActiveTab] = useState("Description");

  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/products/by-slug/${slug}`);
        const data = await res.json();
        
        if (data.success && data.data) {
          setProduct(data.data);
          // Trigger ViewContent event
          fbEvent("ViewContent", { content_name: data.data.name, content_ids: [data.data.id], content_type: "product", value: data.data.price, currency: "LKR" });
          ttevent("ViewContent", { contents: [{ content_id: data.data.id, content_name: data.data.name, price: data.data.price, quantity: 1 }], value: data.data.price, currency: "LKR" });
        } else {
          // fallback to mock data
          const localProd = fallbackProducts.find(p => p.slug === slug);
          setProduct(localProd || null);
          if (localProd) {
            fbEvent("ViewContent", { content_name: localProd.name, content_ids: [localProd.id], content_type: "product", value: localProd.price, currency: "LKR" });
            ttevent("ViewContent", { contents: [{ content_id: localProd.id, content_name: localProd.name, price: localProd.price, quantity: 1 }], value: localProd.price, currency: "LKR" });
          }
        }
      } catch (err) {
        console.warn("API fetch error, falling back to local static catalog:", err);
        const localProd = fallbackProducts.find(p => p.slug === slug);
        setProduct(localProd || null);
        if (localProd) {
          fbEvent("ViewContent", { content_name: localProd.name, content_ids: [localProd.id], content_type: "product", value: localProd.price, currency: "LKR" });
          ttevent("ViewContent", { contents: [{ content_id: localProd.id, content_name: localProd.name, price: localProd.price, quantity: 1 }], value: localProd.price, currency: "LKR" });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product?.id) {
      fetch(`/api/v1/reviews?status=approved&productId=${product.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setReviews(data.data);
          }
        })
        .catch(console.error);
    }
  }, [product?.id]);

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
    
    // Trigger AddToCart event
    fbEvent("AddToCart", { content_name: product.name, content_ids: [product.id], content_type: "product", value: totalPrice, currency: "LKR" });
    ttevent("AddToCart", { contents: [{ content_id: product.id, content_name: product.name, price: product.price, quantity: qty }], value: totalPrice, currency: "LKR" });
    
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Product Image Gallery */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#F4EFE6] to-[#FAF7F2] rounded-[2.5rem] aspect-square flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
              {product.badge && (
                <span className="absolute top-6 left-6 bg-[#D98C1F] text-white text-[11px] font-bold px-4 py-2 rounded-full z-10 uppercase tracking-widest">
                  {product.badge}
                </span>
              )}
              {product.images && product.images.length > 0 ? (
                <Image 
                  src={product.images[activeImageIndex] || product.images[0]} 
                  alt={product.name} 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover" 
                  priority
                />
              ) : (
                <span className="text-[12rem] select-none drop-shadow-xl" role="img" aria-label={product.name}>{product.emoji || "📦"}</span>
              )}
            </div>
            
            {/* Gallery Thumbnails */}
            {product.images && product.images.length > 1 ? (
              <div className="flex items-center gap-4 relative px-12">
                <button className="absolute left-0 w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-[#222] shadow-sm transition-colors">
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <div className="flex gap-4 overflow-hidden w-full">
                  {product.images.map((img: string, i: number) => (
                    <div 
                      key={i} 
                      onClick={() => setActiveImageIndex(i)}
                      className={`flex-1 bg-[#FAF7F2] rounded-2xl aspect-square overflow-hidden cursor-pointer border-2 transition-all duration-300 relative ${i === activeImageIndex ? "border-[#D98C1F] opacity-100 scale-105 shadow-md" : "border-transparent opacity-50 hover:opacity-100"}`}
                    >
                      <Image 
                        src={img} 
                        alt={`Thumbnail ${i+1}`} 
                        fill
                        sizes="100px"
                        className="object-cover" 
                      />
                    </div>
                  ))}
                </div>
                <button className="absolute right-0 w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-[#222] shadow-sm transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              (!product.images || product.images.length === 0) ? (
                <div className="flex items-center gap-4 relative px-12">
                  <button className="absolute left-0 w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-[#222] shadow-sm transition-colors">
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  <div className="flex gap-4 overflow-hidden w-full">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`flex-1 bg-gradient-to-br from-[#F4EFE6] to-[#FAF7F2] rounded-2xl aspect-square flex items-center justify-center cursor-pointer border-2 transition-colors ${i === 1 ? "border-[#D98C1F] scale-105 shadow-md" : "border-transparent opacity-50 hover:opacity-100"}`}>
                        <span className="text-4xl">{product.emoji || "📦"}</span>
                      </div>
                    ))}
                  </div>
                  <button className="absolute right-0 w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-[#222] shadow-sm transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ) : null
            )}
          </div>

          {/* Product Info Right Column */}
          <div className="pt-2">
            <h1 className="font-display font-bold text-[#222] text-4xl mb-4">{product.name}</h1>

            <div className="mb-6">
              <StarRating rating={product.rating || 5.0} count={product.reviews || 128} />
            </div>

            <div className="mb-6">
              <span className="font-display font-bold text-[#D98C1F] text-[2rem]">
                LKR {product.price.toLocaleString()}.00
              </span>
            </div>

            {(product.stock_count ?? product.stock ?? 0) <= 0 ? (
              <div className="flex items-center gap-2 mb-6">
                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="w-3 h-3 text-red-600 flex items-center justify-center font-bold text-xs">!</span>
                </div>
                <span className="text-sm font-semibold text-red-600">Out of Stock</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-6">
                <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
                </div>
                <span className="text-sm font-semibold text-green-600">In Stock</span>
              </div>
            )}

            <p className="text-[#555] text-[15px] leading-relaxed mb-8">
              {product.description || "Everything you need to make delicious, authentic biriyani at home. Made with premium ingredients and traditional spices."}
            </p>

            <div className="mb-8">
              <h3 className="font-display font-bold text-[#222] text-sm mb-4">This Kit Contains:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-[#555] text-sm"><Check className="w-4 h-4 text-gray-400" /> Biriyani Masala</li>
                <li className="flex items-center gap-3 text-[#555] text-sm"><Check className="w-4 h-4 text-gray-400" /> Fried Onions</li>
                <li className="flex items-center gap-3 text-[#555] text-sm"><Check className="w-4 h-4 text-gray-400" /> Specialty Spice Mix</li>
                <li className="flex items-center gap-3 text-[#555] text-sm"><Check className="w-4 h-4 text-gray-400" /> Recipe Card</li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="font-display font-bold text-[#222] text-sm mb-4">Quantity:</h3>
              <div className="inline-flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#222] hover:bg-gray-50 rounded-lg transition-colors font-bold text-lg">−</button>
                <span className="w-8 text-center font-bold text-[#222] text-sm">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#222] hover:bg-gray-50 rounded-lg transition-colors font-bold text-lg">+</button>
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-10">
              <button
                onClick={handleAddToCart}
                disabled={added || (product.stock_count ?? product.stock ?? 0) <= 0}
                className={`w-full text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
                  added 
                    ? "bg-[#2C4631]" 
                    : (product.stock_count ?? product.stock ?? 0) <= 0 
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" 
                      : "bg-[#D98C1F] hover:bg-[#B8740F]"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    ADDED TO CART!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {(product.stock_count ?? product.stock ?? 0) <= 0 ? "OUT OF STOCK" : "ADD TO CART"}
                  </>
                )}
              </button>
              {(product.stock_count ?? product.stock ?? 0) > 0 && (
                <Link
                  href="/checkout"
                  onClick={handleAddToCart}
                  className="w-full bg-[#2C4631] hover:bg-[#1E3322] text-white font-bold py-3 rounded-xl transition-colors shadow-md flex items-center justify-center text-center"
                >
                  BUY NOW
                </Link>
              )}
            </div>

            {/* 4 Horizontal Trust Badges */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div className="flex items-center gap-3 text-[#555]">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#2C4631]">🌿</div>
                <span className="text-sm font-medium">100% Homemade</span>
              </div>
              <div className="flex items-center gap-3 text-[#555]">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#2C4631]">☪️</div>
                <span className="text-sm font-medium">Halal Certified</span>
              </div>
              <div className="flex items-center gap-3 text-[#555]">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#2C4631]">✨</div>
                <span className="text-sm font-medium">No Preservatives</span>
              </div>
              <div className="flex items-center gap-3 text-[#555]">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#2C4631]">🚚</div>
                <span className="text-sm font-medium">Islandwide Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs Section */}
        <div className="mt-16 pt-10 border-t border-gray-200">
          <div className="flex flex-wrap gap-8 border-b border-gray-200 mb-10">
            {["Description", "Ingredients", "How to Use", `Reviews (${product.reviews || 128})`, "Delivery Info"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[15px] font-semibold transition-colors relative ${activeTab === tab ? "text-[#222]" : "text-[#888] hover:text-[#555]"}`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#D98C1F] rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>

          {activeTab === "Description" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-12">
                <div className="space-y-6 text-[#555] text-[15px] leading-relaxed">
                  <p>
                    Our {product.name} is carefully curated to help you prepare authentic, flavorful meals with ease.
                  </p>
                  <p>
                    We use only the finest natural ingredients, blended with traditional recipes passed down through generations.
                  </p>
                </div>
                
                {/* 4 Feature Icons */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-[#2C4631]">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-[#222]">Time Saving</h4>
                      <p className="text-[11px] text-[#888]">Easy to Cook</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-[#2C4631]">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-[#222]">Premium</h4>
                      <p className="text-[11px] text-[#888]">Quality</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-[#2C4631]">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-[#222]">Authentic</h4>
                      <p className="text-[11px] text-[#888]">Taste</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-[#2C4631]">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-[#222]">Made with</h4>
                      <p className="text-[11px] text-[#888]">Love</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Information Table Box */}
              <div className="bg-[#FAF7F2] rounded-3xl p-8 lg:p-10">
                <h3 className="font-display font-bold text-[#222] text-lg mb-8">Product Information</h3>
                <div className="space-y-6">
                  <div className="flex justify-between border-b border-gray-200/50 pb-4">
                    <span className="text-[#555] font-medium text-sm">Net Weight</span>
                    <span className="text-[#222] font-semibold text-sm">{product.weight || "500g"}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/50 pb-4">
                    <span className="text-[#555] font-medium text-sm">Shelf Life</span>
                    <span className="text-[#222] font-semibold text-sm">{product.shelfLife || "6 Months"}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/50 pb-4">
                    <span className="text-[#555] font-medium text-sm">Storage</span>
                    <span className="text-[#222] font-semibold text-sm">Store in a cool, dry place</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/50 pb-4">
                    <span className="text-[#555] font-medium text-sm">Servings</span>
                    <span className="text-[#222] font-semibold text-sm">4 - 5 Persons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555] font-medium text-sm">Origin</span>
                    <span className="text-[#222] font-semibold text-sm">Sri Lanka</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "Ingredients" && (
            <div className="py-8">
              <h3 className="font-display font-bold text-[#222] text-xl mb-6">Ingredients List</h3>
              <p className="text-[#555] leading-relaxed max-w-3xl">
                {product.ingredients || "Made with 100% natural, locally sourced ingredients. No artificial colors, flavors, or preservatives added. Please see the product packaging for a full detailed list."}
              </p>
            </div>
          )}

          {activeTab !== "Description" && activeTab !== "Ingredients" && (
            <div className="py-16 text-center text-[#888]">
              <span className="text-5xl block mb-4">✨</span>
              <p>Content for {activeTab} will be available soon.</p>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="mt-16 pt-16 border-t border-gray-200/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display font-bold text-[#222] text-2xl mb-1">
                Customer <span className="text-[#D98C1F]">Reviews</span>
              </h2>
              <div className="flex items-center gap-2">
                <StarRating rating={product.rating || 5} count={product.reviews || 0} />
              </div>
            </div>
            {user ? (
              <button 
                onClick={() => setShowReviewModal(true)}
                className="bg-[#2C4631] hover:bg-[#1E3322] text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md"
              >
                Write a Review
              </button>
            ) : (
              <Link href={`/auth?redirect=/products/${slug}`} className="bg-[#2C4631] hover:bg-[#1E3322] text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md text-center">
                Log in to Review
              </Link>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
              <span className="text-4xl mb-3 block">⭐</span>
              <h3 className="font-display font-bold text-lg text-[#222] mb-1">No reviews yet</h3>
              <p className="text-[#666] text-sm">Be the first to share your experience with this product!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map((r, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FAF7F2] rounded-full flex items-center justify-center text-[#D98C1F] font-display font-bold text-sm border border-[#D98C1F]/20">
                        {r.user_name ? r.user_name[0].toUpperCase() : "A"}
                      </div>
                      <div>
                        <p className="font-semibold text-[#222] text-sm">{r.user_name || "Anonymous"}</p>
                        <p className="text-[#999] text-xs">Verified Buyer</p>
                      </div>
                    </div>
                    <span className="text-[#999] text-xs">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recently"}
                    </span>
                  </div>
                  <div className="mb-3">
                    <StarRating rating={r.rating} count={0} />
                  </div>
                  <p className="text-[#555] text-sm leading-relaxed">&ldquo;{r.comment}&rdquo;</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* You May Also Like */}
        <div className="mt-16">
          <h2 className="font-display font-bold text-[#222] text-2xl mb-6">
            You May Also <span className="text-[#D98C1F]">Like</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="bg-white rounded-2xl overflow-hidden shadow-sm group block hover:shadow-md transition-shadow">
                <div className="h-36 bg-gradient-to-br from-[#F4EFE6] to-[#FAF7F2] flex items-center justify-center overflow-hidden relative">
                  {p.images && p.images.length > 0 ? (
                    <Image 
                      src={p.images[0]} 
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
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
      
      {showReviewModal && user && (
        <ReviewModal
          productId={product.id}
          userId={user.uid}
          userName={user.displayName || user.email || "Anonymous"}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => {
            setShowReviewModal(false);
            alert("Your review has been published! Please refresh to see it.");
          }}
        />
      )}
    </div>
  );
}
