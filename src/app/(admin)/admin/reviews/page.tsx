"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { collection, getDocs, doc, updateDoc, orderBy, query } from "firebase/firestore";
import toast from "react-hot-toast";

interface Review {
  id: string;
  customer_id: string;
  product_id: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [productsMap, setProductsMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [reviewsRes, productsRes] = await Promise.all([
          fetch("/api/v1/reviews"),
          fetch("/api/v1/products")
        ]);

        const reviewsJson = await reviewsRes.json();
        const productsJson = await productsRes.json();

        if (reviewsJson.success) {
          setReviews(reviewsJson.data);
        }

        if (productsJson.success) {
          const map: Record<string, string> = {};
          productsJson.data.forEach((p: any) => {
            map[p.id] = p.name;
          });
          setProductsMap(map);
        }
      } catch (err) {
        console.error("Failed to load reviews or products", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    setUpdating(id);
    try {
      const res = await fetch(`/api/v1/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const json = await res.json();
      if (json.success) {
        setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
        toast.success(`Review ${status} successfully`);
        window.dispatchEvent(new Event('refreshNotifications'));
      } else {
        toast.error(json.error || "Failed to update review status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating review status");
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div>
      <PageHeader title="Reviews" subtitle="Manage customer product reviews" />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#D98C1F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16">
            <Star className="w-10 h-10 text-[#ccc] mx-auto mb-3" />
            <p className="text-[#888] text-sm">No reviews yet</p>
            <p className="text-xs text-[#aaa] mt-1">Reviews submitted by customers will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Rating</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Comment</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Product</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Status</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Date</th>
                  <th className="text-right text-xs font-semibold text-[#999] px-5 py-3.5">Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < review.rating ? "text-[#D98C1F] fill-[#D98C1F]" : "text-gray-200 fill-gray-200"}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-[#444] max-w-xs line-clamp-2">{review.comment || "—"}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-mono text-[#444] font-medium">{productsMap[review.product_id] || review.product_id?.substring(0, 10) || "—"}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={review.status} />
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[#aaa]">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-LK") : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        {review.status !== "approved" && (
                          <button
                            onClick={() => updateStatus(review.id, "approved")}
                            disabled={updating === review.id}
                            className="text-xs px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium disabled:opacity-50"
                          >
                            Approve
                          </button>
                        )}
                        {review.status !== "rejected" && (
                          <button
                            onClick={() => updateStatus(review.id, "rejected")}
                            disabled={updating === review.id}
                            className="text-xs px-3 py-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors font-medium disabled:opacity-50"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
