import Link from "next/link";

const categories = [
  { label: "Biriyani Kit", slug: "biriyani-kit", image: "/categories/biriyani.png", color: "bg-amber-100" },
  { label: "Ghee Rice", slug: "ghee-rice-combo-kit", image: "/categories/ghee_rice.png", color: "bg-yellow-100" },
  { label: "Sambals", slug: "sambals", image: "/categories/sambals.png", color: "bg-red-100" },
  { label: "Pickles", slug: "pickles", image: "/categories/pickles.png", color: "bg-green-100" },
  { label: "Seenima", slug: "seenima", image: "/categories/seenima.png", color: "bg-orange-100" },
  { label: "Umbalakada", slug: "umbalakada", image: "/categories/umbalakada.png", color: "bg-blue-100" },
  { label: "Beef Products", slug: "beef-products", image: "/categories/beef.png", color: "bg-rose-100" },
  { label: "Gift Packs", slug: "gift-packs", image: "/categories/gift_packs.png", color: "bg-purple-100" },
  { label: "Custom Orders", slug: "custom-orders", image: "/categories/custom_orders.png", color: "bg-teal-100" },
];

export default function CategoryShowcase() {
  return (
    <section className="section-padding bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="font-display font-bold text-[#222] text-2xl md:text-3xl">
            Shop By <span className="text-[#D98C1F]">Category</span>
          </h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              id={`category-${cat.slug}`}
              className="flex flex-col items-center gap-3 group"
            >
              {/* Circle */}
              <div
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${cat.color} flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300 border-2 border-white overflow-hidden`}
              >
                <img src={cat.image} alt={cat.label} className="w-full h-full object-cover" />
              </div>
              {/* Label */}
              <span className="text-[#444] text-xs font-medium text-center leading-tight group-hover:text-[#D98C1F] transition-colors duration-200">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
