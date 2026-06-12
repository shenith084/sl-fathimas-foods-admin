import { NextRequest, NextResponse } from "next/server";
import { getOrders } from "@/lib/services/orderService";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    let orders = await getOrders(status);

    if (userId) {
      orders = orders.filter(o => o.userId === userId);
    } else if (email) {
      orders = orders.filter(o => o.shippingDetails?.email === email);
    }

    return NextResponse.json({ success: true, data: orders });
  } catch (err) {
    console.error("GET /api/v1/orders error:", err);
    return NextResponse.json({ success: false, message: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shippingDetails, paymentDetails, subtotal, deliveryCharge, total, userId, status } = body;

    if (!items || !shippingDetails || !total) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const orderRef = adminDb.collection("orders").doc();
    const orderData = {
      id: orderRef.id,
      items,
      shippingDetails,
      paymentDetails: paymentDetails || { method: "COD", status: "pending" },
      subtotal,
      deliveryCharge,
      total,
      userId: userId || "guest",
      status: status || "pending",
      createdAt: new Date().toISOString()
    };

    await orderRef.set(orderData);

    return NextResponse.json({ success: true, data: orderData });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
