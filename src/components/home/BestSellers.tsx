"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";

export interface Product {
  id: string;
  name: string;
  nameLocal?: string;
  category: string;
  price: number;
  oldPrice?: number;
  weight?: string;
  emoji: string;
  images?: string[];
  badge?: "Best Seller" | "New" | "Out of Stock";
  rating?: number;
  reviewCount?: number;
}

const bestSellers: Product[] = [
  {
    id: "biriyani-combo-kit",
    name: "Biriyani Combo Kit",
    category: "BIRIYANI KIT",
    price: 1400,
    emoji: "🍛",
    badge: "Best Seller",
    rating: 4.9,
    reviewCount: 120,
  },
  {
    id: "chicken-pickles-150g",
    name: "Chicken Pickles 150g",
    category: "PICKLES",
    price: 700,
    emoji: "🥒",
    rating: 4.8,
    reviewCount: 85,
  },
  {
    id: "chicken-sambal",
    name: "Chicken Sambal",
    nameLocal: "(චිකන් සම්බෝල)",
    category: "SAMBAL",
    price: 1250,
    emoji: "🌶️",
    badge: "Best Seller",
    rating: 4.9,
    reviewCount: 94,
  },
  {
    id: "dry-fish-sambal-250g",
    name: "සාලය සම්බෝල",
    nameLocal: "(250g Bottle)",
    category: "DRY FISH",
    price: 1250,
    emoji: "🐟",
    rating: 4.7,
    reviewCount: 62,
  },
  {
    id: "best-sambal-250g",
    name: "හිස් හිස් සම්බෝල",
    nameLocal: "(250g Bottle)",
    category: "SAMBAL",
    price: 1350,
    emoji: "🌶️",
    badge: "New",
    rating: 4.8,
    reviewCount: 38,
  },
  {
    id: "beef-sambal-250g",
    name: "Beef Sambal",
    nameLocal: "(250g Bottle)",
    category: "SAMBAL",
    price: 1200,
    emoji: "🥩",
    rating: 4.6,
    reviewCount: 45,
  },
];

const badgeColors: Record<string, string> = {
  "Best Seller": "bg-[#D98C1F] text-white",
  New: "bg-[#2C4631] text-white",
  "Out of Stock": "bg-gray-400 text-white",
};

function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji || "📦",
      weight: product.weight || "250g",
      vacuum: false,
    }, 1);
  };

  return (
    <div className="product-card flex-shrink-0 w-[200px] sm:w-[220px] bg-white rounded-2xl overflow-hidden shadow-card group cursor-pointer">
      {/* Image area */}
      <div className="relative bg-gradient-to-br from-[#F4EFE6] to-[#FAF7F2] h-44 flex items-center justify-center overflow-hidden">
        {product.badge && (
          <span
            className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full z-10 ${badgeColors[product.badge]}`}
          >
            {product.badge}
          </span>
        )}
        {product.images && product.images.length > 0 ? (
          <Image 
            src={product.images[0]} 
            alt={product.name} 
            fill
            sizes="(max-width: 640px) 200px, 220px"
            className="object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <span className="text-7xl group-hover:scale-110 transition-transform duration-300 select-none">
            {product.emoji || "📦"}
          </span>
        )}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-[#666] px-2 py-0.5 rounded-full">
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-display font-semibold text-[#222] text-sm leading-tight line-clamp-2 mb-0.5">
          {product.name}
        </h3>
        {product.nameLocal && (
          <p className="text-[#999] text-xs mb-2">{product.nameLocal}</p>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.round(product.rating!) ? "fill-[#D98C1F] text-[#D98C1F]" : "text-gray-200 fill-gray-200"}`}
                />
              ))}
            </div>
            <span className="text-[10px] text-[#999]">({product.reviewCount})</span>
          </div>
        )}

        {/* Price & Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display font-bold text-[#D98C1F] text-base">
              LKR {product.price.toLocaleString()}.00
            </span>
          </div>
          <button
            id={`add-to-cart-${product.id}`}
            aria-label={`Add ${product.name} to cart`}
            onClick={handleAddToCart}
            className="w-8 h-8 bg-[#2C4631] hover:bg-[#D98C1F] text-white rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BestSellers() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>(bestSellers);

  useEffect(() => {
    fetch('/api/v1/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const liveData = data.data;
          const merged = bestSellers.map(staticProd => {
            const liveMatch = liveData.find((p: any) => p.slug === staticProd.id || p.id === staticProd.id);
            if (liveMatch) {
              return {
                ...staticProd,
                price: liveMatch.price || staticProd.price,
                images: liveMatch.images || undefined,
              };
            }
            return staticProd;
          });
          setProducts(merged);
        }
      })
      .catch(console.error);
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "right" ? 240 : -240,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="section-padding bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[#D98C1F] font-script text-2xl mb-1 tracking-wide">
              Our Best Sellers
            </p>
            <h2 className="font-display font-bold text-[#222] text-2xl md:text-3xl">
              Best Selling{" "}
              <span className="text-[#D98C1F]">Products</span>
            </h2>
          </div>
          <Link
            href="/products"
            id="best-sellers-view-all"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#2C4631] hover:text-[#D98C1F] transition-colors"
          >
            VIEW ALL PRODUCTS
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#2C4631] hover:bg-[#2C4631] hover:text-white transition-all duration-200 hidden sm:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Scrollable row */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#2C4631] hover:bg-[#2C4631] hover:text-white transition-all duration-200 hidden sm:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile view all */}
        <div className="mt-6 sm:hidden text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#2C4631] hover:text-[#D98C1F] transition-colors"
          >
            VIEW ALL PRODUCTS
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
