import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CustomOrdersCTA() {
  return (
    <section className="section-padding bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Custom Orders & Gift Packs */}
          <div className="relative bg-[#1F1F1F] rounded-3xl overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[280px]">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D98C1F]/10 rounded-full -translate-y-1/4 translate-x-1/4 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#556B4F]/20 rounded-full translate-y-1/4 -translate-x-1/4 blur-2xl" />

            <div className="relative z-10">
              <span className="inline-block bg-[#D98C1F]/20 text-[#D98C1F] text-xs font-semibold px-3 py-1 rounded-full mb-4">
                🎁 SPECIAL ORDERS
              </span>
              <h2 className="font-display font-bold text-white text-2xl md:text-3xl leading-tight mb-3">
                Custom Orders &<br />Gift Packs
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                Looking for something special? We create customised gift packs
                and bulk orders for any occasion.
              </p>
            </div>

            <Link
              href="/custom-orders"
              id="custom-orders-cta-btn"
              className="relative z-10 inline-flex items-center gap-2 bg-[#D98C1F] hover:bg-[#E8B04A] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 self-start shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              ORDER NOW
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* We Deliver Love */}
          <div className="relative bg-white rounded-3xl overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[280px] border border-gray-100 shadow-sm">
            {/* Decorative truck illustration */}
            <div className="absolute bottom-4 right-4 text-8xl opacity-10 select-none pointer-events-none">
              🚚
            </div>
            <div className="absolute top-4 right-20 text-4xl opacity-10 select-none pointer-events-none">
              📍
            </div>

            <div className="relative z-10">
              <span className="inline-block bg-[#556B4F]/10 text-[#556B4F] text-xs font-semibold px-3 py-1 rounded-full mb-4">
                🚚 ISLANDWIDE DELIVERY
              </span>
              <h2 className="font-display font-bold text-[#222] text-2xl md:text-3xl leading-tight mb-1">
                We Deliver{" "}
                <span className="text-[#D98C1F]">Love</span>
              </h2>
              <p className="text-[#666] text-sm leading-relaxed mb-6 max-w-sm">
                Delivering happiness to your doorstep anywhere in Sri Lanka
                and overseas. Fast & reliable via Domex courier.
              </p>
              <div className="flex gap-4 mb-6">
                {[
                  { label: "Delivery Time", value: "~5 Days" },
                  { label: "Partner", value: "Domex" },
                  { label: "Overseas", value: "Available" },
                ].map((info) => (
                  <div key={info.label} className="text-center">
                    <div className="font-display font-bold text-[#556B4F] text-sm">
                      {info.value}
                    </div>
                    <div className="text-[#999] text-xs">{info.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/contact"
              id="delivery-contact-btn"
              className="relative z-10 inline-flex items-center gap-2 border-2 border-[#556B4F] text-[#556B4F] hover:bg-[#556B4F] hover:text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 self-start"
            >
              CONTACT US
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
