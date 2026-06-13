import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

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
  if (!doc.exists) return null;
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data()?.createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : doc.data()?.createdAt || null,
    updatedAt: doc.data()?.updatedAt?.toDate ? doc.data().updatedAt.toDate().toISOString() : doc.data()?.updatedAt || null,
  } as Order;
}

export async function updateOrderStatus(
  id: string,
  status: string,
  note?: string
): Promise<void> {
  const historyEntry = {
    status,
    timestamp: new Date().toISOString(),
    note: note || "",
  };

  await adminDb.collection("orders").doc(id).update({
    status,
    updatedAt: FieldValue.serverTimestamp(),
    status_history: FieldValue.arrayUnion(historyEntry),
  });
}

export async function reduceStockForOrder(order: Order): Promise<void> {
  const batch = adminDb.batch();
  
  for (const item of order.items) {
    if (item.subItems && item.subItems.length > 0) {
      for (const subItem of item.subItems) {
        const productRef = adminDb.collection("products").doc(subItem.id);
        batch.update(productRef, { stock_count: FieldValue.increment(-(item.qty * subItem.qty)) });
      }
    } else if (!item.id.startsWith("custom-gift-pack")) {
      const productRef = adminDb.collection("products").doc(item.id);
      batch.update(productRef, { stock_count: FieldValue.increment(-item.qty) });
    }
  }
  
  await batch.commit();
}
