import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatus, reduceStockForOrder } from "@/lib/services/orderService";
import { logAuditAction } from "@/lib/services/auditService";
import { sendStatusUpdateEmail } from "@/lib/services/emailService";

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
    const { status, note, adminUid, total, receiptUrl, clearUnread, clearUnreadReceipt } = await req.json();
    const oldOrder = await getOrderById(id);
    
    if (clearUnread) {
      await import("@/lib/services/orderService").then(m => m.clearUnreadMessage(id));
      return NextResponse.json({ success: true, message: "Unread message cleared" });
    }

    if (clearUnreadReceipt) {
      await import("@/lib/services/orderService").then(m => m.clearUnreadReceiptFlag(id));
      return NextResponse.json({ success: true, message: "Unread receipt cleared" });
    }

    if (receiptUrl) {
      await import("@/lib/services/orderService").then(m => m.updateOrderPayment(id, receiptUrl));
      return NextResponse.json({ success: true, message: "Payment receipt uploaded" });
    }

    const statusChanged = Boolean(oldOrder && oldOrder.status !== status);
    await updateOrderStatus(id, status, note, total, statusChanged);
    await logAuditAction({
      adminUid: adminUid || "system",
      action: "update_order_status",
      module: "orders",
      targetId: id,
      oldValue: { status: oldOrder?.status },
      newValue: { status },
    });

    // Only send email for 'preparing' and 'dispatched' as requested
    if (oldOrder && (status === "preparing" || status === "dispatched") && status !== oldOrder.status) {
      try {
        await sendStatusUpdateEmail(
          oldOrder.shippingDetails.email, 
          oldOrder.shippingDetails.firstName, 
          id, 
          status, 
          note
        );
      } catch (err) {
        console.error("Status update email failed:", err);
      }
    }

    // Auto-reduce stock when processing
    if (oldOrder && status === "processing" && oldOrder.status !== "processing") {
      try {
        await reduceStockForOrder(oldOrder);
      } catch (err) {
        console.error("Failed to reduce stock for confirmed order:", err);
      }
    }

    return NextResponse.json({ success: true, message: "Order status updated" });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to update order" }, { status: 500 });
  }
}
