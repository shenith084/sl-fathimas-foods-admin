import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

// GET /api/v1/reviews
// Supports: ?status=approved&productId=abc
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const productId = searchParams.get("productId");

    let query: FirebaseFirestore.Query = adminDb.collection("reviews");

    if (status) {
      query = query.where("status", "==", status);
    }
    if (productId) {
      query = query.where("product_id", "==", productId);
    }

    const snap = await query.get();
    const reviews = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().created_at?.toDate?.()?.toISOString() || null,
    }));

    reviews.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return NextResponse.json({ success: true, data: reviews });
  } catch (err: any) {
    console.error("GET /api/v1/reviews error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST /api/v1/reviews
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_id, user_id, user_name, rating, comment } = body;

    if (!product_id || !user_id || !rating || !comment) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Purchase restriction: Only allow users who purchased this product
    const ordersSnap = await adminDb.collection("orders")
      .where("userId", "==", user_id)
      .get();

    let hasPurchased = false;
    for (const doc of ordersSnap.docs) {
      const order = doc.data();
      if (order.items && Array.isArray(order.items)) {
        // Checking if any item matches the product_id
        if (order.items.some((item: any) => item.id === product_id)) {
          hasPurchased = true;
          break;
        }
      }
    }

    if (!hasPurchased) {
      return NextResponse.json(
        { success: false, error: "You must purchase this product before reviewing it." },
        { status: 403 }
      );
    }

    // Check if the user already reviewed this product
    const existingReview = await adminDb.collection("reviews")
      .where("user_id", "==", user_id)
      .where("product_id", "==", product_id)
      .get();

    if (!existingReview.empty) {
      return NextResponse.json(
        { success: false, error: "You have already reviewed this product." },
        { status: 400 }
      );
    }

    const reviewRef = adminDb.collection("reviews").doc();
    const reviewData = {
      id: reviewRef.id,
      product_id,
      user_id,
      user_name: user_name || "Anonymous",
      rating: Number(rating),
      comment,
      status: "approved", // Auto-publish reviews
      created_at: FieldValue.serverTimestamp()
    };

    await reviewRef.set(reviewData);

    // Recalculate product rating immediately since the review is auto-published
    const approvedReviewsSnap = await adminDb.collection("reviews")
      .where("product_id", "==", product_id)
      .where("status", "==", "approved")
      .get();
    
    let totalRating = 0;
    let reviewCount = approvedReviewsSnap.size;

    approvedReviewsSnap.forEach(doc => {
      totalRating += doc.data().rating || 0;
    });

    const averageRating = reviewCount > 0 ? Number((totalRating / reviewCount).toFixed(1)) : 0;

    await adminDb.collection("products").doc(product_id).update({
      rating: averageRating,
      reviews: reviewCount,
      updated_at: FieldValue.serverTimestamp()
    });

    return NextResponse.json({ success: true, data: { ...reviewData, createdAt: new Date().toISOString() } });
  } catch (err: any) {
    console.error("POST /api/v1/reviews error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
