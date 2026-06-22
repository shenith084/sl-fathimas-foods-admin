import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET() {
  try {
    // Fetch count of pending orders
    const ordersSnap = await adminDb.collection("orders").where("status", "==", "pending").get();
    const pendingOrdersCount = ordersSnap.size;

    // Fetch count of unread messages
    const messagesSnap = await adminDb.collection("contact_messages").where("read", "==", false).get();
    const unreadMessagesCount = messagesSnap.size;

    // Fetch count of pending reviews (if any exist)
    const reviewsSnap = await adminDb.collection("reviews").where("status", "==", "pending").get();
    const pendingReviewsCount = reviewsSnap.size;

    return NextResponse.json({
      success: true,
      data: {
        orders: pendingOrdersCount,
        messages: unreadMessagesCount,
        reviews: pendingReviewsCount,
      }
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
