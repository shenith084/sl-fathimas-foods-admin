import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, Home, Scroll, ShieldCheck, Truck, Heart, Play } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about SL Fathima's Foods — our story, our passion for authentic Sri Lankan homemade food made with natural ingredients and traditional family recipes.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About SL Fathima's Foods",
    description: "Our story of bringing authentic Sri Lankan homemade food to your table. 100% natural ingredients, no preservatives.",
    url: "/about",
  },
};

const values = [
  {
    icon: Leaf,
    title: "100% Natural Ingredients",
    desc: "We never use artificial flavours, colours, or preservatives. Every ingredient is carefully sourced and natural.",
  },
  {
    icon: Home,
    title: "Made at Home with Love",
    desc: "Every product is handcrafted in our home kitchen with the same care as cooking for our own family.",
  },
  {
    icon: Scroll,
    title: "Traditional Family Recipes",
    desc: "Our recipes are time-tested family secrets passed down through generations, preserving authentic Sri Lankan flavours.",
  },
  {
    icon: ShieldCheck,
    title: "100% Halal & Pure",
    desc: "All our products are prepared according to strict standards, hygienically and with full transparency.",
  },
  {
    icon: Truck,
    title: "Island-wide Delivery",
    desc: "We deliver across all of Sri Lanka via Domex courier and offer vacuum-packed options for overseas orders.",
  },
  {
    icon: Heart,
    title: "Made for Your Family",
    desc: "From our family to yours — every jar, every pack is prepared with the intention of bringing joy to your table.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Refined Hero Banner */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D98C1F]/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#2C4631]/5 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center gap-2 bg-[#2C4631]/5 border border-[#2C4631]/10 text-[#2C4631] text-xs font-bold px-5 py-2 rounded-full mb-8 tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D98C1F]"></span>
            Our Story
          </div>
          <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl mb-8 leading-[1.1] text-[#222]">
            Made with Love,<br />
            <span className="text-[#D98C1F] italic font-serif">Served with Purity.</span>
          </h1>
          <p className="text-[#555] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            SL Fathima&apos;s Foods is a homemade food brand from the heart of Sri Lanka,
            crafting authentic flavours with natural ingredients and traditional family recipes.
          </p>
        </div>
      </section>

      {/* Elegant Story Section */}
      <section className="py-16 px-4 bg-white relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visual Element */}
            <div className="relative group lg:w-11/12">
              <div className="bg-[#FAF7F2] rounded-[2rem] aspect-square flex flex-col items-center justify-center p-8 border border-gray-100 relative overflow-hidden transition-all duration-700 hover:shadow-xl hover:-translate-y-1.5">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2C4631]/5 to-transparent"></div>
                <div className="w-16 h-16 rounded-full bg-[#2C4631] flex items-center justify-center mb-6 shadow-[0_10px_25px_rgba(44,70,49,0.3)] relative z-10">
                  <Home className="w-8 h-8 text-[#D98C1F]" />
                </div>
                <h3 className="font-display font-bold text-[#222] text-2xl mb-3 text-center relative z-10">From Our Kitchen</h3>
                <div className="w-10 h-1 bg-[#D98C1F] rounded-full mb-6 relative z-10"></div>
                <p className="text-center text-[#666] text-sm leading-relaxed relative z-10">
                  What began as a mother's passion project to share authentic home cooking has grown into a trusted brand loved by thousands.
                </p>
              </div>
              
              {/* Premium Floating Badge */}
              <div className="absolute -bottom-4 -right-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.08)] flex items-center gap-4 transition-transform duration-500 group-hover:-translate-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#D98C1F]/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[#D98C1F] fill-[#D98C1F]/20" />
                </div>
                <div>
                  <div className="font-display font-bold text-2xl text-[#222]">1000+</div>
                  <div className="text-xs font-semibold text-[#888] uppercase tracking-wider">Happy Families</div>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="lg:pl-6">
              <h2 className="font-display font-bold text-[#222] text-3xl md:text-4xl mb-6 leading-tight">
                Crafting the Taste <br/> of <span className="text-[#D98C1F]">Home</span>
              </h2>
              <div className="space-y-4 text-[#555] text-[15px] leading-relaxed">
                <p>
                  SL Fathima&apos;s Foods started as a passion project — a mother&apos;s desire to share the authentic
                  tastes of Sri Lankan home cooking with families near and far.
                </p>
                <p>
                  What began as orders from friends and family quickly grew into a beloved food brand,
                  discovered by thousands through TikTok and trusted for our unwavering commitment to purity.
                  <strong className="font-semibold text-[#222]"> No artificial preservatives. No artificial flavours. Just real, homemade goodness.</strong>
                </p>
                <p>
                  Every product — from our signature Biriyani Combo Kit to our hand-crafted pickles and
                  sambals — is made in small batches to ensure quality and freshness in every single jar.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-[#2C4631] hover:bg-[#1E3322] text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-[0_8px_15px_rgba(44,70,49,0.2)] hover:shadow-[0_12px_20px_rgba(44,70,49,0.3)] hover:-translate-y-0.5"
                >
                  Shop Our Products
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-[#444] hover:border-[#2C4631] hover:text-[#2C4631] font-bold px-6 py-3 rounded-xl transition-all duration-300"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-[#FAF7F2] py-20 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-[#222] text-3xl md:text-4xl mb-4">
              Why Families <span className="text-[#D98C1F] italic font-serif">Trust Us</span>
            </h2>
            <p className="text-[#666] max-w-xl mx-auto">
              Our commitment to quality and authenticity is the foundation of everything we craft.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_5px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-500 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-gray-100 flex items-center justify-center mb-4 group-hover:bg-[#D98C1F]/10 group-hover:border-[#D98C1F]/20 transition-colors duration-500">
                    <Icon className="w-6 h-6 text-[#2C4631] group-hover:text-[#D98C1F] transition-colors duration-500 stroke-[1.5]" />
                  </div>
                  <h3 className="font-display font-bold text-[#222] text-lg mb-2">
                    {v.title}
                  </h3>
                  <p className="text-[#666] text-sm leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TikTok CTA */}
      <section className="py-24 px-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto bg-[#2C4631] rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D98C1F] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20">
            <Play className="w-8 h-8 text-white fill-white translate-x-0.5" />
          </div>
          
          <h2 className="font-display font-bold text-white text-3xl md:text-5xl mb-6 relative z-10 leading-tight">
            Join Our Community on TikTok
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto relative z-10">
            Watch our cooking process behind the scenes, discover new products, and see why thousands of families love SL Fathima&apos;s Foods.
          </p>
          <a
            href="https://www.tiktok.com/@sl.fathimas.products"
            target="_blank"
            rel="noopener noreferrer"
            id="about-tiktok-link"
            className="relative z-10 inline-flex items-center gap-3 bg-white text-[#2C4631] hover:bg-[#FAF7F2] font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl hover:scale-105"
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
