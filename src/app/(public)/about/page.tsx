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
      
      {/* Top Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-6">
        <nav className="flex items-center gap-2 text-xs font-medium text-[#888]">
          <Link href="/" className="hover:text-[#D98C1F] transition-colors">Home</Link>
          <span>›</span>
          <span className="text-[#2C4631]">About Us</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-[#222] mb-16">
          About SL Fathima&apos;s <span className="text-[#D98C1F] italic font-serif">Foods</span>
        </h1>

        {/* Our Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24 items-start">
          <div className="order-2 lg:order-1">
            <h2 className="font-display font-bold text-2xl text-[#222] mb-6">Our Story</h2>
            <div className="space-y-6 text-[15px] leading-relaxed text-[#555] mb-10">
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

            {/* 4 Feature Icons */}
            <div className="grid grid-cols-4 gap-2 text-center pt-2">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#D98C1F]/10 border border-[#D98C1F]/20 flex items-center justify-center mb-3">
                  <Home className="w-6 h-6 text-[#2C4631]" />
                </div>
                <span className="text-[11px] font-bold text-[#222] uppercase tracking-wide">100%<br/>Homemade</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#D98C1F]/10 border border-[#D98C1F]/20 flex items-center justify-center mb-3">
                  <Leaf className="w-6 h-6 text-[#2C4631]" />
                </div>
                <span className="text-[11px] font-bold text-[#222] uppercase tracking-wide">Natural<br/>Ingredients</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#D98C1F]/10 border border-[#D98C1F]/20 flex items-center justify-center mb-3">
                  <Scroll className="w-6 h-6 text-[#2C4631]" />
                </div>
                <span className="text-[11px] font-bold text-[#222] uppercase tracking-wide">Traditional<br/>Recipes</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#D98C1F]/10 border border-[#D98C1F]/20 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-6 h-6 text-[#2C4631]" />
                </div>
                <span className="text-[11px] font-bold text-[#222] uppercase tracking-wide">Halal<br/>Certified Food</span>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="aspect-[4/3] lg:aspect-square w-full rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
              <img src="/images/about-business-product.png" alt="Delicious Sri Lankan Food Products" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="font-display font-bold text-2xl text-[#222] mb-6">Our Mission</h2>
            <p className="text-[15px] leading-relaxed text-[#555]">
              SL Fathima&apos;s Foods is a homemade food brand from the heart of Sri Lanka, crafting authentic flavours with natural ingredients and traditional family recipes. Our mission is to provide high-quality, authentic homemade food products that bring families together and create memorable moments around the dining table.
            </p>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center">
             <div className="relative w-64 h-64 lg:w-80 lg:h-80">
               {/* Decorative Leaves/Spices representation */}
               <div className="absolute inset-0 bg-[#2C4631]/5 rounded-full flex items-center justify-center">
                 <div className="w-48 h-48 rounded-full border border-dashed border-[#D98C1F]/40 flex items-center justify-center animate-[spin_60s_linear_infinite]">
                    <Leaf className="absolute -top-4 text-[#2C4631]" size={32} />
                    <Leaf className="absolute -bottom-4 rotate-180 text-[#D98C1F]" size={32} />
                    <Leaf className="absolute -left-4 -rotate-90 text-[#2C4631]" size={32} />
                    <Leaf className="absolute -right-4 rotate-90 text-[#D98C1F]" size={32} />
                 </div>
                 <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center z-10">
                   <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>

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
      <section className="py-12 md:py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto bg-[#2C4631] rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D98C1F] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left flex-1">
            <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
              <Play className="w-6 h-6 text-white fill-white translate-x-0.5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-2xl md:text-3xl mb-3 leading-tight">
                Join Our Community on TikTok
              </h2>
              <p className="text-white/80 text-sm md:text-base max-w-lg mx-auto md:mx-0">
                Watch our cooking process behind the scenes, discover new products, and see why thousands of families love SL Fathima&apos;s Foods.
              </p>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            <a
              href="https://www.tiktok.com/@sl.fathimas.products?_r=1&_t=ZS-9724WrpOIGF"
              target="_blank"
              rel="noopener noreferrer"
              id="about-tiktok-link"
              className="inline-flex items-center gap-3 bg-white text-[#2C4631] hover:bg-[#FAF7F2] font-semibold px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.07 8.07 0 004.77 1.54V6.78s-.51.03-.99-.09z"/>
              </svg>
              @sl.fathimas.products
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
