import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";

export const metadata: Metadata = {
  title: "Gift Packs",
  description: "Send the gift of authentic Sri Lankan homemade flavours. SL Fathima's Foods gift packs — perfect for any occasion.",
  alternates: { canonical: "/gift-packs" },
  openGraph: {
    title: "Gift Packs | SL Fathima's Foods",
    description: "Send authentic Sri Lankan homemade food gift packs to your loved ones. Perfect for any occasion.",
    url: "/gift-packs",
  },
};

const packs = [
  {
    id: "gift-pack-small",
    name: "Starter Gift Pack",
    subtitle: "Perfect for gifting",
    price: 2500,
    items: ["Chicken Sambal 250g", "Chicken Pickle 150g", "Beef Sambal 250g"],
    emoji: "🎁",
    badge: "Most Popular",
    color: "from-amber-50 to-orange-50",
    border: "border-[#D98C1F]/30",
  },
  {
    id: "gift-pack-medium",
    name: "Family Gift Pack",
    subtitle: "Great for families",
    price: 3800,
    items: ["Biriyani Combo Kit", "Chicken Sambal 250g", "Chicken Pickle 150g", "Dry Fish Sambal 250g"],
    emoji: "🎀",
    badge: "Best Value",
    color: "from-green-50 to-emerald-50",
    border: "border-[#556B4F]/30",
  },
  {
    id: "gift-pack-large",
    name: "Premium Gift Pack",
    subtitle: "Ultimate experience",
    price: 5500,
    items: ["Biriyani Combo Kit", "Ghee Rice Combo Kit", "Chicken Sambal 250g", "Beef Sambal 250g", "Chicken Pickle 150g", "Seenima 250g"],
    emoji: "🎊",
    badge: "Premium",
    color: "from-purple-50 to-fuchsia-50",
    border: "border-purple-200",
  },
];

export default function GiftPacksPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#556B4F] to-[#3D5038] text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">🎁</div>
          <h1 className="font-display font-bold text-3xl md:text-5xl mb-4">
            Gift Packs & <span className="text-[#E8B04A]">Special Sets</span>
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Send the taste of authentic Sri Lankan homemade food to your loved ones. Perfect for Eid, birthdays, weddings, and any occasion.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Packs grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {packs.map((pack) => (
            <div key={pack.id} className={`bg-gradient-to-br ${pack.color} border ${pack.border} rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col`}>
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-5xl">{pack.emoji}</span>
                  <span className="bg-white text-[#555] text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                    {pack.badge}
                  </span>
                </div>
                <h3 className="font-display font-bold text-[#222] text-xl mb-1">{pack.name}</h3>
                <p className="text-[#666] text-sm mb-4">{pack.subtitle}</p>
                <div className="space-y-1.5 mb-5">
                  {pack.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-[#555]">
                      <span className="text-[#556B4F]">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="text-2xl font-display font-bold text-[#D98C1F]">
                  LKR {pack.price.toLocaleString()}.00
                </div>
              </div>
              <div className="p-4 pt-0">
                <Link
                  href={`/products/${pack.id}`}
                  id={`gift-pack-order-${pack.id}`}
                  className="block w-full text-center bg-[#D98C1F] hover:bg-[#B8740F] text-white font-bold py-3 rounded-2xl transition-all duration-200 shadow-md"
                >
                  Order This Pack
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Gift Pack CTA */}
        <div className="bg-[#1F1F1F] rounded-3xl p-8 md:p-10 text-center text-white">
          <Gift className="w-12 h-12 text-[#D98C1F] mx-auto mb-4" />
          <h2 className="font-display font-bold text-2xl md:text-3xl mb-3">
            Want a <span className="text-[#D98C1F]">Custom Pack?</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-6">
            We create personalised gift packs for any budget. Choose your products, add a message, and we&apos;ll wrap it beautifully.
          </p>
          <Link href="/custom-orders" id="gift-custom-order-btn"
            className="inline-flex items-center gap-2 bg-[#D98C1F] hover:bg-[#E8B04A] text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg">
            Create Custom Pack
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
