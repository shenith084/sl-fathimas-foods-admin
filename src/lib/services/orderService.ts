import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { sendLowStockAlertAdminEmail } from "@/lib/services/emailService";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  emoji: string;
  weight: string;
  vacuum?: boolean;
  subItems?: { id: string; qty: number }[];
}

export interface Order {
  id: string;
  items: OrderItem[];
  shippingDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    postalCode?: string;
  };
  paymentDetails: {
    method: string;
    status: string;
  };
  subtotal: number;
  deliveryCharge: number;
  total: number;
  userId: string;
  status: string;
  status_history?: { status: string; timestamp: string; note?: string }[];
  createdAt: string | null;
  updatedAt?: string | null;
}

export async function getOrders(statusFilter?: string, limit = 100): Promise<Order[]> {
  let query = adminDb.collection("orders").orderBy("createdAt", "desc").limit(limit);

  if (statusFilter && statusFilter !== "all") {
    query = adminDb
      .collection("orders")
      .where("status", "==", statusFilter)
      .orderBy("createdAt", "desc")
      .limit(limit);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : doc.data().createdAt || null,
    updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate().toISOString() : doc.data().updatedAt || null,
  })) as Order[];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const doc = await adminDb.collection("orders").doc(id).get();
  const data = doc.data();
  if (!data) return null;
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || null,
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt || null,
  } as Order;
}

export async function updateOrderStatus(
  id: string,
  status: string,
  note?: string,
  total?: number,
  markUnread?: boolean
): Promise<void> {
  const historyEntry = {
    status,
    timestamp: new Date().toISOString(),
    note: note || "",
  };

  const updateData: any = {
    status,
    updatedAt: FieldValue.serverTimestamp(),
    status_history: FieldValue.arrayUnion(historyEntry),
  };
  
  if (total !== undefined) {
    updateData.total = total;
    updateData.subtotal = total;
  }

  if (note || markUnread) {
    updateData.hasUnreadMessage = true;
  }

  await adminDb.collection("orders").doc(id).update(updateData);
}

export async function updateOrderPayment(id: string, receiptUrl: string): Promise<void> {
  await adminDb.collection("orders").doc(id).update({
    "paymentDetails.method": "bank",
    "paymentDetails.receiptUrl": receiptUrl,
    hasUnreadReceipt: true
  });
}

export async function clearUnreadMessage(id: string): Promise<void> {
  await adminDb.collection("orders").doc(id).update({
    hasUnreadMessage: false
  });
}

export async function clearUnreadReceiptFlag(id: string): Promise<void> {
  await adminDb.collection("orders").doc(id).update({
    hasUnreadReceipt: false
  });
}

export async function reduceStockForOrder(order: Order): Promise<void> {
  const batch = adminDb.batch();
  const lowStockAlerts: { id: string, name: string, stock: number }[] = [];
  
  for (const item of order.items) {
    if (item.subItems && item.subItems.length > 0) {
      for (const subItem of item.subItems) {
        const productRef = adminDb.collection("products").doc(subItem.id);
        const doc = await productRef.get();
        if (doc.exists) {
          const data = doc.data();
          const oldStock = data?.stock_count || 0;
          const qtyToReduce = item.qty * subItem.qty;
          const newStock = oldStock - qtyToReduce;
          batch.update(productRef, { stock_count: newStock });
          
          if (oldStock > 5 && newStock <= 5) {
            lowStockAlerts.push({ id: subItem.id, name: data?.name || subItem.id, stock: newStock });
          }
        }
      }
    } else if (!item.id.startsWith("custom-gift-pack")) {
      const productRef = adminDb.collection("products").doc(item.id);
      const doc = await productRef.get();
      if (doc.exists) {
        const data = doc.data();
        const oldStock = data?.stock_count || 0;
        const newStock = oldStock - item.qty;
        batch.update(productRef, { stock_count: newStock });
        
        if (oldStock > 5 && newStock <= 5) {
          lowStockAlerts.push({ id: item.id, name: data?.name || item.name, stock: newStock });
        }
      }
    }
  }
  
  await batch.commit();

  if (lowStockAlerts.length > 0) {
    try {
      await sendLowStockAlertAdminEmail(lowStockAlerts);
    } catch (err) {
      console.error("Failed to send low stock alerts:", err);
    }
  }
}
