"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, SlidersHorizontal, Search, ShoppingCart } from "lucide-react";
import { db } from "@/lib/firebase/client";
import { collection, getDocs } from "firebase/firestore";
import { useCartStore } from "@/store/cartStore";
import { products as fallbackProducts, categories as fallbackCategories } from "@/lib/mockData";

const badgeColors: Record<string, string> = {
  "Best Seller": "bg-[#D98C1F] text-white",
  New: "bg-[#2C4631] text-white",
  Popular: "bg-purple-600 text-white",
  "Out of Stock": "bg-gray-400 text-white",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < Math.round(rating) ? "fill-[#D98C1F] text-[#D98C1F]" : "fill-gray-200 text-gray-200"}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ProductsContent({ initialProducts }: { initialProducts: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Selected parameters
  const activeCategorySlug = searchParams ? searchParams.get("category") || "All" : "All";
  const activeSearchQuery = searchParams ? searchParams.get("search") || "" : "";

  // Extract unique categories from the live products
  const liveCategories = Array.from(new Set(initialProducts.map((p: any) => p.category))).map((name: any) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    return {
      id: slug,
      slug: slug,
      name: name,
      emoji: "📦"
    };
  });

  // Component States
  const [dbProducts, setDbProducts] = useState<any[]>(initialProducts.length > 0 ? initialProducts : fallbackProducts);
  const [dbCategories, setDbCategories] = useState<any[]>(liveCategories.length > 0 ? liveCategories : fallbackCategories);
  const [sortOption, setSortOption] = useState("Popular");
  const [searchTerm, setSearchTerm] = useState(activeSearchQuery);
  const [toast, setToast] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  // Sync search input with search param changes
  useEffect(() => {
    setSearchTerm(activeSearchQuery);
  }, [activeSearchQuery]);

  const activeProducts = dbProducts;
  const activeCategories = dbCategories;

  // Filter products by Category & Search query
  const filteredProducts = activeProducts.filter((product) => {
    // Category match
    const categoryMatches =
      activeCategorySlug === "All" ||
      product.category.toLowerCase() === activeCategorySlug.toLowerCase();

    // Search query match
    const searchMatches =
      !activeSearchQuery ||
      product.name.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
      (product.ingredients && product.ingredients.toLowerCase().includes(activeSearchQuery.toLowerCase()));

    return categoryMatches && searchMatches;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "Price: Low to High":
        return a.price - b.price;
      case "Price: High to Low":
        return b.price - a.price;
      case "Newest":
        const badgeA = a.badge === "New" ? 1 : 0;
        const badgeB = b.badge === "New" ? 1 : 0;
        return badgeB - badgeA;
      case "Popular":
      default:
        // Sort by rating desc, then reviews desc
        return b.rating - a.rating || b.reviews - a.reviews;
    }
  });

  const handleCategorySelect = (slug: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    if (slug === "All") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    router.push(`/products?${params.toString()}`);
    setMobileFilterOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    if (!searchTerm.trim()) {
      params.delete("search");
    } else {
      params.set("search", searchTerm);
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      weight: product.weight || "250g",
      vacuum: false,
    }, 1);
    setToast(`${product.name} added to cart!`);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen relative pb-12">
      {/* Toast notifications */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C4631] text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slide-up transition-all duration-300">
          <span className="font-semibold text-lg">✅</span>
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-[#999] mb-3">
              <Link href="/" className="hover:text-[#D98C1F] transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#444]">All Products</span>
            </nav>
            <h1 className="font-display font-bold text-[#222] text-2xl md:text-3xl">
              All <span className="text-[#D98C1F]">Products</span>
            </h1>
            <p className="text-[#666] text-sm mt-1">{sortedProducts.length} items found</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-64 max-w-sm">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-all bg-[#FAF7F2]/50"
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D98C1F]">
                <Search className="w-4 h-4" />
              </button>
            </form>

            <button
              id="products-filter-btn"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="flex items-center gap-2 border border-gray-200 text-[#444] text-sm font-medium px-4 py-2 rounded-xl hover:border-[#2C4631] hover:text-[#2C4631] transition-colors lg:hidden"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters (desktop) */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-24">
              <h2 className="font-display font-semibold text-[#222] text-sm mb-4 uppercase tracking-wider">
                Categories
              </h2>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleCategorySelect("All")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeCategorySlug === "All"
                        ? "bg-[#D98C1F] text-white font-semibold"
                        : "text-[#555] hover:bg-[#FAF7F2] hover:text-[#D98C1F]"
                    }`}
                  >
                    🍛 All Products
                  </button>
                </li>
                {activeCategories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeCategorySlug.toLowerCase() === cat.slug.toLowerCase()
                          ? "bg-[#D98C1F] text-white font-semibold"
                          : "text-[#555] hover:bg-[#FAF7F2] hover:text-[#D98C1F]"
                      }`}
                    >
                      {cat.emoji} {cat.name}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h2 className="font-display font-semibold text-[#222] text-sm mb-4 uppercase tracking-wider">
                  Sort By
                </h2>
                <ul className="space-y-1">
                  {["Popular", "Price: Low to High", "Price: High to Low", "Newest"].map((s) => (
                    <li key={s}>
                      <button
                        onClick={() => setSortOption(s)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          sortOption === s
                            ? "bg-[#2C4631] text-white font-semibold"
                            : "text-[#555] hover:bg-[#FAF7F2] hover:text-[#D98C1F]"
                        }`}
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Products Grid Area */}
          <div className="flex-1">
            {/* Category chips (mobile) */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-6 lg:hidden" style={{ scrollbarWidth: "none" }}>
              <button
                onClick={() => handleCategorySelect("All")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategorySlug === "All"
                    ? "bg-[#D98C1F] text-white"
                    : "bg-white border border-gray-200 text-[#555] hover:border-[#D98C1F] hover:text-[#D98C1F]"
                }`}
              >
                🍛 All
              </button>
              {activeCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategorySlug.toLowerCase() === cat.slug.toLowerCase()
                      ? "bg-[#D98C1F] text-white"
                      : "bg-white border border-gray-200 text-[#555] hover:border-[#D98C1F] hover:text-[#D98C1F]"
                  }`}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>

            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm max-w-xl mx-auto">
                <span className="text-5xl block mb-4">🔍</span>
                <h3 className="font-display font-bold text-lg text-[#222] mb-1">No products found</h3>
                <p className="text-[#666] text-sm mb-6">
                  We couldn&apos;t find any items matching your filters or search query &ldquo;{activeSearchQuery}&rdquo;.
                </p>
                <button
                  onClick={() => {
                    router.push("/products");
                    setSearchTerm("");
                  }}
                  className="bg-[#D98C1F] hover:bg-[#B8740F] text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    id={`product-card-${product.id}`}
                    className="product-card bg-white rounded-2xl overflow-hidden shadow-card group flex flex-col justify-between"
                  >
                    <Link href={`/products/${product.slug}`} className="block">
                      {/* Image area */}
                      <div className="relative bg-gradient-to-br from-[#F4EFE6] to-[#FAF7F2] h-40 flex items-center justify-center overflow-hidden">
                        {product.badge && (
                          <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full z-10 ${badgeColors[product.badge] || "bg-gray-200 text-gray-700"}`}>
                            {product.badge}
                          </span>
                        )}
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <span className="text-6xl group-hover:scale-110 transition-transform duration-300 select-none">
                            {product.emoji || "📦"}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3 pb-1">
                        <p className="text-[#999] text-[10px] font-medium uppercase tracking-wide mb-1">
                          {product.category.replace("-", " ")}
                        </p>
                        <h3 className="font-display font-semibold text-[#222] text-sm leading-tight line-clamp-2 mb-1 group-hover:text-[#D98C1F] transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                          <StarRating rating={product.rating} />
                          <span className="text-[10px] text-[#999]">({product.reviews})</span>
                        </div>
                      </div>
                    </Link>

                    <div className="p-3 pt-0 flex items-center justify-between mt-auto">
                      <span className="font-display font-bold text-[#D98C1F] text-sm">
                        LKR {product.price.toLocaleString()}.00
                      </span>
                      <button
                        id={`add-cart-${product.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="w-8 h-8 bg-[#2C4631] hover:bg-[#D98C1F] text-white rounded-lg flex items-center justify-center transition-colors duration-200 shadow-sm"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/50 backdrop-blur-sm animate-fade-in flex justify-end">
          <div className="w-80 bg-white h-full p-6 flex flex-col justify-between shadow-2xl animate-slide-left">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <h3 className="font-display font-bold text-[#222] text-lg">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-medium"
                >
                  Close
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm text-[#222] mb-3 uppercase tracking-wider text-xs">Categories</h4>
                  <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
                    <button
                      onClick={() => handleCategorySelect("All")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeCategorySlug === "All"
                          ? "bg-[#D98C1F] text-white font-semibold"
                          : "text-[#555] hover:bg-[#FAF7F2] hover:text-[#D98C1F]"
                      }`}
                    >
                      🍛 All Products
                    </button>
                    {activeCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeCategorySlug.toLowerCase() === cat.slug.toLowerCase()
                            ? "bg-[#D98C1F] text-white font-semibold"
                            : "text-[#555] hover:bg-[#FAF7F2] hover:text-[#D98C1F]"
                        }`}
                      >
                        {cat.emoji} {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-[#222] mb-3 uppercase tracking-wider text-xs">Sort By</h4>
                  <div className="flex flex-col gap-1.5">
                    {["Popular", "Price: Low to High", "Price: High to Low", "Newest"].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSortOption(s);
                          setMobileFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          sortOption === s
                            ? "bg-[#2C4631] text-white font-semibold"
                            : "text-[#555] hover:bg-[#FAF7F2]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                router.push("/products");
                setSearchTerm("");
                setMobileFilterOpen(false);
              }}
              className="w-full border-2 border-gray-200 hover:border-[#D98C1F] hover:text-[#D98C1F] py-3 rounded-xl text-sm font-semibold text-[#555] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsClientComponent({ initialProducts }: { initialProducts: any[] }) {
  return (
    <Suspense fallback={<div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center text-[#2C4631] font-semibold">Loading catalog...</div>}>
      <ProductsContent initialProducts={initialProducts} />
    </Suspense>
  );
}
