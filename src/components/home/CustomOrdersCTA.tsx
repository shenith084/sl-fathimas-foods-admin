import Link from "next/link";
import Image from "next/image";

export default function CustomOrdersCTA() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Custom Orders & Gift Packs */}
          <div className="relative bg-[#111111] rounded-2xl overflow-hidden flex flex-col sm:flex-row items-center min-h-[220px]">
            {/* Content Left */}
            <div className="relative z-10 p-6 md:p-8 flex-1 flex flex-col justify-center h-full">
              <h2 className="font-display font-bold text-white text-2xl md:text-3xl leading-tight mb-3">
                Custom Orders &<br />Gift Packs
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-[280px]">
                Looking for something special? We create customized gift packs
                and bulk orders for any occasion.
              </p>
              <Link
                href="/custom-orders"
                className="inline-flex items-center justify-center bg-[#D98C1F] hover:bg-[#E8B04A] text-white font-semibold px-6 py-2.5 rounded-full transition-colors self-start text-xs tracking-wider"
              >
                ORDER NOW
              </Link>
            </div>
            {/* Image Right */}
            <div className="w-full sm:w-[45%] h-48 sm:h-full sm:absolute sm:right-0 sm:top-0 sm:bottom-0 relative shrink-0">
              {/* Fallback gradient if image doesn't load fully */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/80 to-transparent z-10 hidden sm:block w-32" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-transparent z-10 sm:hidden h-24 bottom-0 top-auto" />
              <Image 
                src="/images/gift_pack_box.png" 
                alt="Custom Gift Packs" 
                fill 
                className="object-cover object-center sm:object-right"
              />
            </div>
          </div>

          {/* We Deliver Love */}
          <div className="relative bg-[#FAF6F0] rounded-2xl overflow-hidden flex flex-col sm:flex-row items-center min-h-[220px]">
            {/* Content Left */}
            <div className="relative z-10 p-6 md:p-8 flex-1 flex flex-col justify-center h-full">
              <h2 className="font-display font-bold text-[#222] text-2xl md:text-3xl leading-tight mb-3">
                We Deliver <span className="text-[#D98C1F]">Love</span>
              </h2>
              <p className="text-[#555] text-sm leading-relaxed mb-6 max-w-[280px]">
                Delivering happiness to your doorstep anywhere in Sri Lanka
                and overseas. Fast & reliable via Domex courier.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-[#2C4631] text-[#2C4631] hover:bg-[#2C4631] hover:text-white font-semibold px-6 py-2.5 rounded-full transition-colors self-start text-xs tracking-wider"
              >
                CONTACT US
              </Link>
            </div>
            {/* Image Right */}
            <div className="w-full sm:w-[50%] h-48 sm:h-full sm:absolute sm:right-0 sm:top-0 sm:bottom-0 relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0] via-[#FAF6F0]/80 to-transparent z-10 hidden sm:block w-32" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6F0] via-[#FAF6F0]/80 to-transparent z-10 sm:hidden h-24 bottom-0 top-auto" />
              <Image 
                src="/images/delivery_truck_map.png" 
                alt="Islandwide Delivery" 
                fill 
                className="object-cover object-center sm:object-right mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
