"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FAF7F2] via-[#F4EFE6] to-[#FAF7F2] min-h-[580px] md:min-h-[680px]">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2C4631]/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D98C1F]/8 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-12 md:pt-6 md:pb-16 lg:pt-8 lg:pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* Eyebrow tag */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-[#D98C1F] font-script text-3xl md:text-4xl tracking-wide">
                Homemade with Love
              </span>
              <svg className="w-5 h-5 text-[#D98C1F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-medium text-[#222222] text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6">
              Authentic Flavors <br />
              Made with <span className="text-[#D98C1F]">Purity</span>
            </h1>

            {/* Subtext */}
            <p className="text-[#666666] text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Premium homemade food products made with natural ingredients and
              traditional recipes. Made for your loved ones.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-10">
              <Link
                href="/products"
                id="hero-shop-now-btn"
                className="btn-primary flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto justify-center"
              >
                SHOP NOW
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/about"
                id="hero-our-story-btn"
                className="btn-secondary flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 w-full sm:w-auto justify-center"
              >
                OUR STORY
              </Link>
            </div>

            {/* Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto lg:mx-0">
              {[
                { icon: "🏠", label: "100%", sub: "Homemade" },
                { icon: "🚫", label: "No", sub: "Artificial Preservatives" },
                { icon: "🌿", label: "Natural", sub: "Ingredients" },
                { icon: "🚚", label: "Islandwide", sub: "Delivery" },
              ].map((feat) => (
                <div
                  key={feat.label}
                  className="flex flex-col items-center gap-1 bg-white/70 backdrop-blur-sm rounded-2xl p-3 border border-white shadow-sm"
                >
                  <span className="text-2xl">{feat.icon}</span>
                  <span className="font-display font-bold text-[#222] text-xs leading-tight text-center">
                    {feat.label}
                  </span>
                  <span className="text-[#666] text-[10px] leading-tight text-center">
                    {feat.sub}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="order-1 lg:order-2 relative flex items-center justify-center">
            {/* Trust badge */}
            <div className="absolute top-0 right-0 md:-top-4 md:-right-4 z-20 bg-[#FAF7F2] border border-[#2C4631]/20 text-[#222] rounded-full w-24 h-24 md:w-28 md:h-28 flex flex-col items-center justify-center text-center shadow-md">
              <span className="text-[9px] md:text-[10px] font-semibold text-[#666] tracking-wider mb-1">TRUSTED BY</span>
              <span className="font-display font-bold text-xl md:text-2xl leading-none text-[#222]">1000+</span>
              <span className="text-[9px] md:text-[10px] font-medium leading-tight mt-1 px-2 text-[#666]">
                HAPPY<br/>CUSTOMERS
              </span>
            </div>

            {/* Main product image */}
            <div className="relative w-full max-w-[550px] mx-auto">
              <div className="absolute inset-0 bg-[#2C4631]/5 rounded-[3rem] blur-2xl -z-10" />
              <div className="relative w-full aspect-[4/3.5] flex items-center justify-center">
                <Image
                  src="/images/hero-product.png"
                  alt="SL Fathima's Foods Premium Products"
                  fill
                  sizes="(max-width: 768px) 100vw, 550px"
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
