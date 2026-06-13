import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

// PATCH /api/v1/reviews/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    const reviewRef = adminDb.collection("reviews").doc(id);
    const reviewDoc = await reviewRef.get();

    if (!reviewDoc.exists) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    const reviewData = reviewDoc.data()!;
    
    // Update the review status
    await reviewRef.update({
      status,
      updated_at: FieldValue.serverTimestamp()
    });

    // If the review is approved, we should recalculate the product's average rating
    // Note: If a review is changed from approved -> rejected, we should also recalculate
    const productId = reviewData.product_id;
    
    // Fetch all approved reviews for this product
    const approvedReviewsSnap = await adminDb.collection("reviews")
      .where("product_id", "==", productId)
      .where("status", "==", "approved")
      .get();
    
    let totalRating = 0;
    let reviewCount = approvedReviewsSnap.size;

    approvedReviewsSnap.forEach(doc => {
      totalRating += doc.data().rating || 0;
    });

    const averageRating = reviewCount > 0 ? Number((totalRating / reviewCount).toFixed(1)) : 0;

    // Update the product document
    await adminDb.collection("products").doc(productId).update({
      rating: averageRating,
      reviews: reviewCount,
      updated_at: FieldValue.serverTimestamp()
    });

    return NextResponse.json({ success: true, data: { id, status, newAverage: averageRating, newCount: reviewCount } });
  } catch (err: any) {
    console.error("PATCH /api/v1/reviews/[id] error:", err);
    return NextResponse.json({ success: false, error: "Failed to update review" }, { status: 500 });
  }
}
