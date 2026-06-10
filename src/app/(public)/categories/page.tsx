import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Categories",
  description: "Browse all SL Fathima's Foods categories — Biriyani Kits, Sambals, Pickles, Gift Packs, and more.",
};

const categories = [
  { slug: "biriyani-kit", name: "Biriyani Kit", emoji: "🍛", count: 2, desc: "Authentic biriyani masala blends and complete kits", color: "from-amber-50 to-orange-50", border: "border-amber-200" },
  { slug: "ghee-rice", name: "Ghee Rice", emoji: "🍚", count: 2, desc: "Fragrant ghee rice masala and complete combo packs", color: "from-yellow-50 to-amber-50", border: "border-yellow-200" },
  { slug: "sambals", name: "Sambals", emoji: "🌶️", count: 6, desc: "Chicken, beef, fish and coconut sambals — made fresh", color: "from-red-50 to-orange-50", border: "border-red-200" },
  { slug: "pickles", name: "Pickles", emoji: "🥒", count: 5, desc: "Chicken, beef, prawns, crab and fish pickles", color: "from-green-50 to-emerald-50", border: "border-green-200" },
  { slug: "seenima", name: "Seenima", emoji: "🫙", count: 3, desc: "Traditional Sri Lankan seenima varieties", color: "from-purple-50 to-fuchsia-50", border: "border-purple-200" },
  { slug: "umbalakada", name: "Umbalakada", emoji: "🐟", count: 2, desc: "Dried fish and umbalakada specialities", color: "from-blue-50 to-cyan-50", border: "border-blue-200" },
  { slug: "beef-products", name: "Beef Products", emoji: "🥩", count: 3, desc: "Beef sambal, pickle and special beef preparations", color: "from-stone-50 to-red-50", border: "border-stone-200" },
  { slug: "gift-packs", name: "Gift Packs", emoji: "🎁", count: 3, desc: "Beautifully curated gift sets for all occasions", color: "from-pink-50 to-rose-50", border: "border-pink-200" },
  { slug: "custom-orders", name: "Custom Orders", emoji: "✨", count: 0, desc: "Request custom bulk or personalised orders", color: "from-indigo-50 to-violet-50", border: "border-indigo-200" },
];

export default function CategoriesPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FAF7F2] to-[#F4EFE6] border-b border-gray-100 py-12 px-4 text-center">
        <h1 className="font-display font-bold text-[#222] text-3xl md:text-4xl mb-4">
          Shop by <span className="text-[#D98C1F]">Category</span>
        </h1>
        <p className="text-[#666] max-w-lg mx-auto">
          Explore our full range of authentic homemade Sri Lankan food products.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.slug === "custom-orders" ? "/custom-orders" : `/products?category=${cat.slug}`}
              id={`category-card-${cat.slug}`}
              className={`bg-gradient-to-br ${cat.color} border ${cat.border} rounded-3xl p-6 hover:shadow-md transition-all duration-300 group block`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{cat.emoji}</span>
                {cat.count > 0 && (
                  <span className="bg-white text-[#555] text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    {cat.count} products
                  </span>
                )}
              </div>
              <h2 className="font-display font-bold text-[#222] text-lg mb-1 group-hover:text-[#D98C1F] transition-colors">
                {cat.name}
              </h2>
              <p className="text-[#666] text-sm">{cat.desc}</p>
            </Link>
          ))}
        </div>

        {/* All products link */}
        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#D98C1F] hover:bg-[#B8740F] text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-md"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </div>
  );
}
