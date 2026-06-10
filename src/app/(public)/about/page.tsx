import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about SL Fathima's Foods — our story, our passion for authentic Sri Lankan homemade food made with natural ingredients and traditional family recipes.",
};

const values = [
  {
    emoji: "🌿",
    title: "100% Natural Ingredients",
    desc: "We never use artificial flavours, colours, or preservatives. Every ingredient is carefully sourced and natural.",
  },
  {
    emoji: "🏠",
    title: "Made at Home with Love",
    desc: "Every product is handcrafted in our home kitchen with the same care as cooking for our own family.",
  },
  {
    emoji: "📜",
    title: "Traditional Family Recipes",
    desc: "Our recipes are time-tested family secrets passed down through generations, preserving authentic Sri Lankan flavours.",
  },
  {
    emoji: "☪️",
    title: "100% Halal",
    desc: "All our products are prepared according to Halal standards, hygienically and with full transparency.",
  },
  {
    emoji: "🚚",
    title: "Island-wide Delivery",
    desc: "We deliver across all of Sri Lanka via Domex courier and offer vacuum-packed options for overseas orders.",
  },
  {
    emoji: "💝",
    title: "Made for Your Family",
    desc: "From our family to yours — every jar, every pack is prepared with the intention of bringing joy to your table.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#556B4F] to-[#3D5038] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/15 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-wider uppercase">
            Our Story
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            Made with Love,<br />
            <span className="text-[#E8B04A]">Served with Purity</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            SL Fathima&apos;s Foods is a homemade food brand from the heart of Sri Lanka,
            crafting authentic flavours with natural ingredients and traditional family recipes.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Illustration / Image placeholder */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#F4EFE6] to-[#FAF7F2] rounded-3xl aspect-square flex items-center justify-center shadow-xl border border-[#E8D5B7]">
                <div className="text-center p-8">
                  <div className="text-8xl mb-4">👩‍🍳</div>
                  <div className="font-display font-bold text-[#556B4F] text-xl">Homemade with Love</div>
                  <div className="text-[#666] text-sm mt-2">Natural • Traditional • Halal</div>
                  {/* Decorative spice dots */}
                  <div className="flex justify-center gap-2 mt-4">
                    {["🌶️", "🧄", "🌿", "🫙"].map((s) => (
                      <span key={s} className="text-2xl">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-[#D98C1F] text-white rounded-2xl p-4 shadow-lg text-center">
                <div className="font-display font-bold text-2xl">1000+</div>
                <div className="text-xs font-medium">Happy Customers</div>
              </div>
            </div>

            {/* Text content */}
            <div>
              <p className="text-[#D98C1F] font-display italic text-lg mb-3">Our Journey</p>
              <h2 className="font-display font-bold text-[#222] text-3xl md:text-4xl mb-6 leading-tight">
                From Our Kitchen<br />to Your Table
              </h2>
              <div className="space-y-4 text-[#666] leading-relaxed">
                <p>
                  SL Fathima&apos;s Foods started as a passion project — a mother&apos;s desire to share the authentic
                  tastes of Sri Lankan home cooking with families near and far.
                </p>
                <p>
                  What began as orders from friends and family quickly grew into a beloved food brand,
                  discovered by thousands through TikTok and trusted for our commitment to purity.
                  No artificial preservatives. No artificial flavours. Just real, homemade goodness.
                </p>
                <p>
                  Every product — from our signature Biriyani Combo Kit to our hand-crafted pickles and
                  sambals — is made in small batches to ensure quality and freshness in every jar.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-[#D98C1F] hover:bg-[#B8740F] text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Shop Our Products
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#556B4F] text-[#556B4F] hover:bg-[#556B4F] hover:text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-[#F4EFE6] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-[#222] text-3xl md:text-4xl mb-4">
              Why Families <span className="text-[#D98C1F]">Trust Us</span>
            </h2>
            <p className="text-[#666] max-w-xl mx-auto">
              Our commitment to quality and authenticity is at the heart of everything we do.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group"
              >
                <div className="text-4xl mb-4">{v.emoji}</div>
                <h3 className="font-display font-semibold text-[#222] text-lg mb-2 group-hover:text-[#D98C1F] transition-colors">
                  {v.title}
                </h3>
                <p className="text-[#666] text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TikTok CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">🎵</div>
          <h2 className="font-display font-bold text-[#222] text-2xl md:text-3xl mb-4">
            Follow Us on TikTok
          </h2>
          <p className="text-[#666] mb-6">
            Watch our cooking process, discover new products, and see why thousands of families love SL Fathima&apos;s Foods.
          </p>
          <a
            href="https://www.tiktok.com/@sl.fathimas.products"
            target="_blank"
            rel="noopener noreferrer"
            id="about-tiktok-link"
            className="inline-flex items-center gap-2 bg-[#1F1F1F] hover:bg-[#333] text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.07 8.07 0 004.77 1.54V6.78s-.51.03-.99-.09z"/>
            </svg>
            @sl.fathimas.products
          </a>
        </div>
      </section>
    </div>
  );
}
