import { Leaf, Sparkles, Heart, Shield } from "lucide-react";

const features = [
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "Traditional Recipes",
    desc: "Time tested family recipes passed down through generations.",
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Premium Quality",
    desc: "We use the finest ingredients for rich taste and quality.",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Made with Love",
    desc: "Every product is prepared with care and lots of love.",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Halal Certified",
    desc: "All our products are 100% Halal and hygienically prepared.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#F4EFE6] section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className="flex gap-4 items-start bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Icon circle */}
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#2C4631] group-hover:bg-[#2C4631] group-hover:text-white transition-all duration-300">
                {feat.icon}
              </div>
              <div>
                <h3 className="font-display font-semibold text-[#222] text-sm mb-1">
                  {feat.title}
                </h3>
                <p className="text-[#666] text-xs leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
