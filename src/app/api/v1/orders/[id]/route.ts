import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/lib/services/orderService";
import { logAuditAction } from "@/lib/services/auditService";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: order });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status, note, adminUid } = await req.json();
    const oldOrder = await getOrderById(id);
    await updateOrderStatus(id, status, note);
    await logAuditAction({
      adminUid: adminUid || "system",
      action: "update_order_status",
      module: "orders",
      targetId: id,
      oldValue: { status: oldOrder?.status },
      newValue: { status },
    });
    return NextResponse.json({ success: true, message: "Order status updated" });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to update order" }, { status: 500 });
  }
}
