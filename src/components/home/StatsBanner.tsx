import { Users, Package, MapPin, ShieldCheck } from "lucide-react";

const stats = [
  { icon: Users, value: "1000+", label: "Happy Customers" },
  { icon: Package, value: "50+", label: "Premium Products" },
  { icon: MapPin, value: "Islandwide", label: "Delivery" },
  { icon: ShieldCheck, value: "100%", label: "Quality Guaranteed" },
];

export default function StatsBanner() {
  return (
    <section className="bg-[#FAF7F2] py-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#2C4631] rounded-2xl md:rounded-3xl shadow-sm py-8 px-6 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 relative">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`flex items-center justify-center md:justify-start gap-4 ${
                    i < stats.length - 1
                      ? "md:border-r md:border-white/20"
                      : ""
                  } md:pl-8 lg:pl-12`}
                >
                  <Icon className="w-10 h-10 lg:w-12 lg:h-12 text-[#F4EFE6] flex-shrink-0 stroke-[1.5]" />
                  <div className="flex flex-col text-left">
                    <span className="font-display font-bold text-white text-xl lg:text-2xl leading-tight">
                      {stat.value}
                    </span>
                    <span className="text-[#F4EFE6] text-xs lg:text-sm font-medium mt-0.5 whitespace-nowrap">
                      {stat.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
