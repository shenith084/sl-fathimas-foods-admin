import { NextRequest, NextResponse } from "next/server";
import { getOrders } from "@/lib/services/orderService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const orders = await getOrders(status);
    return NextResponse.json({ success: true, data: orders });
  } catch (err) {
    console.error("GET /api/v1/orders error:", err);
    return NextResponse.json({ success: false, message: "Failed to fetch orders" }, { status: 500 });
  }
}
