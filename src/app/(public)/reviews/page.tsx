import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "Read what our customers say about SL Fathima's Foods. Authentic homemade Sri Lankan food loved by 1000+ happy customers.",
};

const reviews = [
  { name: "Amina R.", location: "Colombo", rating: 5, product: "Biriyani Combo Kit", comment: "Absolutely amazing! The biriyani came out restaurant quality — my whole family loved it. Will definitely order again.", date: "2 days ago", initials: "AR" },
  { name: "Nurul H.", location: "Kandy", rating: 5, product: "Chicken Pickle", comment: "The best homemade pickle I've ever tasted. You can really feel the love and quality in every bite. Fast delivery too!", date: "1 week ago", initials: "NH" },
  { name: "Fatima K.", location: "Galle", rating: 5, product: "Chicken Sambal", comment: "Reminded me of my grandmother's cooking. So authentic and flavourful. No artificial taste at all!", date: "1 week ago", initials: "FK" },
  { name: "Sara M.", location: "Jaffna", rating: 4, product: "Dry Fish Sambal", comment: "Very tasty and well-packed. The vacuum option is great for overseas orders. Highly recommended!", date: "2 weeks ago", initials: "SM" },
  { name: "Roshani P.", location: "Kurunegala", rating: 5, product: "Gift Pack", comment: "Ordered a gift pack for my mother's birthday — she absolutely loved it! Beautiful packaging and delicious products.", date: "2 weeks ago", initials: "RP" },
  { name: "Ayesha B.", location: "Colombo", rating: 5, product: "Beef Sambal", comment: "Been a loyal customer for 6 months now. Quality is always consistent. Fathima aunty's food is the best!", date: "3 weeks ago", initials: "AB" },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < rating ? "fill-[#D98C1F] text-[#D98C1F]" : "fill-gray-200 text-gray-200"}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FAF7F2] to-[#F4EFE6] border-b border-gray-100 py-12 px-4 text-center">
        <span className="inline-block bg-[#D98C1F]/10 text-[#D98C1F] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">⭐ Customer Love</span>
        <h1 className="font-display font-bold text-[#222] text-3xl md:text-4xl mb-4">
          What Our Customers <span className="text-[#D98C1F]">Say</span>
        </h1>
        {/* Rating summary */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <span className="font-display font-bold text-[#222] text-5xl">{avg}</span>
          <div>
            <Stars rating={5} />
            <p className="text-[#666] text-sm mt-1">{reviews.length} verified reviews</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#556B4F] rounded-full flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0">
                    {r.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-[#222] text-sm">{r.name}</p>
                    <p className="text-[#999] text-xs">{r.location}</p>
                  </div>
                </div>
                <span className="text-[#999] text-xs">{r.date}</span>
              </div>
              <Stars rating={r.rating} />
              <span className="inline-block mt-2 mb-3 text-[10px] bg-[#D98C1F]/10 text-[#D98C1F] px-2 py-0.5 rounded-full font-medium">
                {r.product}
              </span>
              <p className="text-[#555] text-sm leading-relaxed">&ldquo;{r.comment}&rdquo;</p>
            </div>
          ))}
        </div>

        {/* Write a review CTA */}
        <div className="bg-[#556B4F] rounded-3xl p-8 text-center text-white">
          <div className="text-4xl mb-4">✍️</div>
          <h2 className="font-display font-bold text-2xl mb-3">Tried Our Products?</h2>
          <p className="text-white/80 mb-6">Share your experience and help other customers discover the joy of homemade Sri Lankan flavours.</p>
          <Link href="/auth" id="write-review-btn"
            className="inline-flex items-center gap-2 bg-[#D98C1F] hover:bg-[#E8B04A] text-white font-bold px-6 py-3.5 rounded-2xl transition-colors shadow-lg">
            Write a Review
          </Link>
        </div>
      </div>
    </div>
  );
}
