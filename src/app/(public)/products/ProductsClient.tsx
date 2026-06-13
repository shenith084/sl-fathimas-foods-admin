"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, SlidersHorizontal, Search, ShoppingCart } from "lucide-react";
import { db } from "@/lib/firebase/client";
import { collection, getDocs } from "firebase/firestore";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { products as fallbackProducts, categories as fallbackCategories } from "@/lib/mockData";

export const foodTruckListIds = [
  "seenima-300g",
  "dry-fish-sambal-70g",
  "maldive-fish-sambal-250g",
  "beef-sambal-250g",
  "kooni-sambal-70g",
  "beef-sambal-70g",
  "banana-blossom-sambal-250g",
  "seenima-200g",
  "banana-blossom-sambal-70g",
  "dry-fish-sambal-250g"
];

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

  // We use fallbackCategories from mockData to control exactly what appears in the sidebar.
  // This allows categories with 0 items (like 'Food Truck List') to display,
  // and allows precise control over category display names and emojis.

  // Component States
  const [dbProducts, setDbProducts] = useState<any[]>(initialProducts.length > 0 ? initialProducts : fallbackProducts);
  const [dbCategories, setDbCategories] = useState<any[]>(fallbackCategories);
  const [sortOption, setSortOption] = useState("Popular");
  const [searchTerm, setSearchTerm] = useState(activeSearchQuery);
  const [toast, setToast] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  const [maxPrice, setMaxPrice] = useState(6000);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 24;
  
  const toggleCategory = (slug: string) => {
    setExpandedCategories(prev => 
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    );
  };
  const [inStockOnly, setInStockOnly] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  // Sync search input with search param changes
  useEffect(() => {
    setSearchTerm(activeSearchQuery);
  }, [activeSearchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategorySlug, activeSearchQuery, sortOption, maxPrice, inStockOnly]);

  const activeProducts = dbProducts;
  const activeCategories = dbCategories;

  // Filter products by Category & Search query
  const filteredProducts = activeProducts.filter((product) => {
    // Category match
    const categoryMatches =
      activeCategorySlug === "All" ||
      (activeCategorySlug === "food-truck-list" 
        ? foodTruckListIds.includes(product.id) 
        : product.category.toLowerCase() === activeCategorySlug.toLowerCase());

    // Search query match
    const searchMatches =
      !activeSearchQuery ||
      product.name.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
      (product.ingredients && product.ingredients.toLowerCase().includes(activeSearchQuery.toLowerCase()));

    // Price Match
    const priceMatches = product.price <= maxPrice;
    
    // Availability Match
    const availabilityMatches = inStockOnly ? product.badge !== "Out of Stock" : true;

    return categoryMatches && searchMatches && priceMatches && availabilityMatches;
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

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
            <h1 className="font-display font-bold text-[#222] text-3xl md:text-4xl mb-2">
              Shop All Products
            </h1>
            <p className="text-[#666] text-[13px] mt-1">Explore our premium homemade food products made with love and natural ingredients.</p>
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
          <aside className="hidden lg:block w-[260px] flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              
              {/* Categories */}
              <div className="bg-[#FAF7F2]/50 rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="font-display font-bold text-[#222] text-[15px] mb-4">
                  Categories
                </h2>
                <ul className="space-y-1.5">
                  <li>
                    <button
                      onClick={() => handleCategorySelect("All")}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors flex justify-between items-center ${
                        activeCategorySlug === "All"
                          ? "bg-[#F4EFE6] text-[#222]"
                          : "text-[#555] hover:bg-[#F4EFE6] hover:text-[#222]"
                      }`}
                    >
                      <span>All Products</span>
                      <span className="text-[#888]">({activeProducts.length})</span>
                    </button>
                  </li>
                  {activeCategories.map((cat) => {
                    const hasSub = cat.subCategories && cat.subCategories.length > 0;
                    const isExpanded = expandedCategories.includes(cat.slug) || (hasSub && cat.subCategories.some((sub: any) => activeCategorySlug.toLowerCase() === sub.slug.toLowerCase()));
                    const isActive = activeCategorySlug.toLowerCase() === cat.slug.toLowerCase();
                    const count = cat.slug === "food-truck-list" 
                      ? activeProducts.filter(p => foodTruckListIds.includes(p.id)).length
                      : activeProducts.filter(p => p.category.toLowerCase() === cat.slug.toLowerCase()).length;
                    
                    return (
                      <li key={cat.id} className="flex flex-col gap-1">
                        <button
                          onClick={() => {
                            if (hasSub) {
                              toggleCategory(cat.slug);
                            } else {
                              handleCategorySelect(cat.slug);
                            }
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors flex justify-between items-center ${
                            isActive
                              ? "bg-[#F4EFE6] text-[#222]"
                              : "text-[#555] hover:bg-[#F4EFE6] hover:text-[#222]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {cat.name}
                          </span>
                          <span className="flex items-center gap-2 text-[#888]">
                            {!hasSub && `(${count})`}
                            {hasSub && (
                              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            )}
                          </span>
                        </button>
                        
                        {/* Subcategories */}
                        {hasSub && isExpanded && (
                          <ul className="pl-4 space-y-1">
                            {cat.subCategories.map((sub: any) => {
                              const subCount = activeProducts.filter(p => p.category.toLowerCase() === sub.slug.toLowerCase()).length;
                              const isSubActive = activeCategorySlug.toLowerCase() === sub.slug.toLowerCase();
                              return (
                                <li key={sub.id}>
                                  <button
                                    onClick={() => handleCategorySelect(sub.slug)}
                                    className={`w-full text-left px-4 py-2 rounded-xl text-[12px] font-medium transition-colors flex justify-between items-center ${
                                      isSubActive
                                        ? "bg-[#F4EFE6] text-[#2C4631]"
                                        : "text-[#666] hover:bg-[#F4EFE6] hover:text-[#2C4631]"
                                    }`}
                                  >
                                    <span>{sub.name}</span>
                                    <span className="text-[#888]">({subCount})</span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Price Filter */}
              <div className="bg-[#FAF7F2]/50 rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="font-display font-bold text-[#222] text-[15px] mb-4">
                  Filter by
                </h2>
                <h3 className="font-bold text-[#222] text-[13px] mb-4">Price</h3>
                <div className="px-1">
                  <input 
                    type="range" 
                    min="0" 
                    max="6000" 
                    step="100"
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full accent-[#2C4631] h-1.5 bg-[#D9D9D9] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-center items-center mt-4 bg-white border border-gray-200 rounded-xl py-2 text-[11px] font-bold text-[#222]">
                    <span>LKR 0 &nbsp;&nbsp;&mdash;&nbsp;&nbsp; LKR {maxPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Availability Filter */}
                <h3 className="font-bold text-[#222] text-[13px] mb-4 mt-6">Availability</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${inStockOnly ? 'bg-[#2C4631] border-[#2C4631]' : 'border-gray-300 bg-white group-hover:border-[#2C4631]'}`}>
                      {inStockOnly && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={inStockOnly}
                      onChange={() => setInStockOnly(!inStockOnly)}
                    />
                    <span className="text-[13px] text-[#222] font-medium group-hover:text-[#D98C1F] transition-colors">In Stock ({activeProducts.filter(p => p.badge !== "Out of Stock").length})</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group opacity-60">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors bg-white border-gray-300`}></div>
                    <span className="text-[13px] text-[#222] font-medium">Out of Stock ({activeProducts.filter(p => p.badge === "Out of Stock").length})</span>
                  </label>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3">
                <div className="bg-[#FAF7F2]/80 border border-gray-100 rounded-2xl p-4 flex gap-4 items-center">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xl">🌿</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[12px] text-[#222]">100% Natural Ingredients</h4>
                    <p className="text-[10px] text-[#666]">No artificial additives</p>
                  </div>
                </div>
                <div className="bg-[#FAF7F2]/80 border border-gray-100 rounded-2xl p-4 flex gap-4 items-center">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xl">✨</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[12px] text-[#222]">Freshly Made</h4>
                    <p className="text-[10px] text-[#666]">Made in small batches</p>
                  </div>
                </div>
                <div className="bg-[#FAF7F2]/80 border border-gray-100 rounded-2xl p-4 flex gap-4 items-center">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xl">🚚</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[12px] text-[#222]">Islandwide Delivery</h4>
                    <p className="text-[10px] text-[#666]">Across Sri Lanka & Overseas</p>
                  </div>
                </div>
                <div className="bg-[#FAF7F2]/80 border border-gray-100 rounded-2xl p-4 flex gap-4 items-center">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xl">🛡️</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[12px] text-[#222]">Secure Packaging</h4>
                    <p className="text-[10px] text-[#666]">Safe & hygienic delivery</p>
                  </div>
                </div>
              </div>

            </div>
          </aside>

          {/* Products Grid Area */}
          <div className="flex-1 min-w-0">
            {/* Top Sort Bar & Mobile Filters */}
            <div className="hidden lg:flex justify-end mb-6">
              <div className="flex items-center gap-3">
                <span className="text-[#888] text-[13px] font-medium">Sort by:</span>
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-gray-200 rounded-xl text-[13px] px-4 py-2 focus:outline-none focus:border-[#D98C1F] bg-white text-[#222] font-semibold appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010L12%2015L17%2010%22%20stroke%3D%22%23222222%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-no-repeat bg-[right_0.5rem_center]"
                >
                  <option value="Popular">Popularity</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Newest">Newest</option>
                </select>
              </div>
            </div>
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
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paginatedProducts.map((product) => (
                    <div
                      key={product.id}
                      id={`product-card-${product.id}`}
                      className="product-card bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group flex flex-col justify-between transition-shadow hover:shadow-md"
                    >
                      <Link href={`/products/${product.slug}`} className="block">
                        {/* Image area */}
                        <div className="relative bg-[#F4EFE6] h-56 flex items-center justify-center overflow-hidden">
                          {product.badge && (
                            <span className={`absolute top-3 left-3 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm z-10 ${badgeColors[product.badge] || "bg-[#2C4631] text-white"}`}>
                              {product.badge}
                            </span>
                          )}
                          {product.images && product.images.length > 0 ? (
                            <Image 
                              src={product.images[0]} 
                              alt={product.name}
                              fill
                              sizes="(max-width: 768px) 50vw, 25vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <span className="text-6xl group-hover:scale-110 transition-transform duration-300 select-none drop-shadow-md">
                              {product.emoji || "📦"}
                            </span>
                          )}
                          <div className="absolute bottom-3 left-3 bg-[#2C4631] text-white text-[9px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                            {product.category.replace("-", " ")}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 pb-2">
                          <h3 className="font-display font-bold text-[#222] text-[15px] leading-tight line-clamp-2 mb-2 group-hover:text-[#D98C1F] transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-1.5 mb-2">
                            <StarRating rating={product.rating} />
                            <span className="text-[11px] text-[#888] font-medium">({product.reviews} reviews)</span>
                          </div>
                        </div>
                      </Link>

                      <div className="p-5 pt-1 flex items-center justify-between mt-auto">
                        <span className="font-display font-bold text-[#D98C1F] text-[15px]">
                          LKR {product.price.toLocaleString()}.00
                        </span>
                        <button
                          id={`add-cart-${product.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          className="w-9 h-9 bg-[#2C4631] hover:bg-[#1E3322] text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105"
                          aria-label={`Add ${product.name} to cart`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12 gap-2">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-[#888] flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-colors ${
                          currentPage === page
                            ? "bg-[#2C4631] text-white shadow-md"
                            : "bg-white border border-gray-200 text-[#555] hover:border-[#2C4631] hover:text-[#2C4631]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-[#888] flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
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
                    {activeCategories.map((cat) => {
                      const hasSub = cat.subCategories && cat.subCategories.length > 0;
                      const isExpanded = expandedCategories.includes(cat.slug) || (hasSub && cat.subCategories.some((sub: any) => activeCategorySlug.toLowerCase() === sub.slug.toLowerCase()));
                      const isActive = activeCategorySlug.toLowerCase() === cat.slug.toLowerCase();

                      return (
                        <div key={cat.id} className="flex flex-col gap-1">
                          <button
                            onClick={() => {
                              if (hasSub) {
                                toggleCategory(cat.slug);
                              } else {
                                handleCategorySelect(cat.slug);
                              }
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${
                              isActive
                                ? "bg-[#D98C1F] text-white font-semibold"
                                : "text-[#555] hover:bg-[#FAF7F2] hover:text-[#D98C1F]"
                            }`}
                          >
                            <span>{cat.emoji} {cat.name}</span>
                            {hasSub && (
                              <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            )}
                          </button>
                          
                          {/* Subcategories mobile */}
                          {hasSub && isExpanded && (
                            <div className="pl-4 flex flex-col gap-1 border-l-2 border-gray-100 ml-2 mt-1">
                              {cat.subCategories.map((sub: any) => {
                                const isSubActive = activeCategorySlug.toLowerCase() === sub.slug.toLowerCase();
                                return (
                                  <button
                                    key={sub.id}
                                    onClick={() => handleCategorySelect(sub.slug)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors ${
                                      isSubActive
                                        ? "text-[#D98C1F] font-bold"
                                        : "text-[#666] hover:text-[#D98C1F]"
                                    }`}
                                  >
                                    {sub.name}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
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
