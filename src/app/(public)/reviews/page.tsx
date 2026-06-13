import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "Read what our customers say about SL Fathima's Foods. Authentic homemade Sri Lankan food loved by 1000+ happy customers.",
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: "Customer Reviews | SL Fathima's Foods",
    description: "Read verified customer reviews about our authentic Sri Lankan homemade food products.",
    url: "/reviews",
  },
};

import { adminDb } from "@/lib/firebase/admin";

async function getApprovedReviews() {
  const snap = await adminDb.collection("reviews")
    .where("status", "==", "approved")
    .get();

  const reviews = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().created_at?.toDate?.()?.toISOString() || null,
  })) as any[];

  reviews.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  // Also fetch products to get their names
  const productsSnap = await adminDb.collection("products").get();
  const productsMap: Record<string, string> = {};
  productsSnap.docs.forEach(doc => {
    productsMap[doc.id] = doc.data().name;
  });

  return reviews.map(r => ({
    ...r,
    productName: productsMap[r.product_id] || "Product"
  }));
}

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

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();
  const avg = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "5.0";

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
          {reviews.length === 0 ? (
            <div className="col-span-full text-center py-12 text-[#666]">
              No reviews available yet.
            </div>
          ) : reviews.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#2C4631] rounded-full flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0">
                    {r.user_name ? r.user_name[0].toUpperCase() : "A"}
                  </div>
                  <div>
                    <p className="font-semibold text-[#222] text-sm">{r.user_name || "Anonymous"}</p>
                    <p className="text-[#999] text-xs">Verified Buyer</p>
                  </div>
                </div>
                <span className="text-[#999] text-xs">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recently"}
                </span>
              </div>
              <Stars rating={r.rating} />
              <span className="inline-block mt-2 mb-3 text-[10px] bg-[#D98C1F]/10 text-[#D98C1F] px-2 py-0.5 rounded-full font-medium">
                {r.productName}
              </span>
              <p className="text-[#555] text-sm leading-relaxed">&ldquo;{r.comment}&rdquo;</p>
            </div>
          ))}
        </div>

        {/* Write a review CTA */}
        <div className="bg-[#2C4631] rounded-3xl p-8 text-center text-white">
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
