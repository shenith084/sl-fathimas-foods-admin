const stats = [
  { icon: "👥", value: "1000+", label: "Happy Customers" },
  { icon: "📦", value: "50+", label: "Premium Products" },
  { icon: "📍", value: "Islandwide", label: "Delivery" },
  { icon: "🛡️", value: "100%", label: "Quality Guaranteed" },
];

export default function StatsBanner() {
  return (
    <section className="bg-[#556B4F] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center text-center ${
                i < stats.length - 1
                  ? "md:border-r md:border-white/20"
                  : ""
              }`}
            >
              <span className="text-3xl mb-2">{stat.icon}</span>
              <span className="font-display font-bold text-white text-2xl md:text-3xl">
                {stat.value}
              </span>
              <span className="text-white/70 text-sm font-medium mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
