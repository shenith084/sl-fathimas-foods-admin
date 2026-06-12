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
    createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
    updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
  })) as Order[];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const doc = await adminDb.collection("orders").doc(id).get();
  if (!doc.exists) return null;
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data()?.createdAt?.toDate?.()?.toISOString() || null,
    updatedAt: doc.data()?.updatedAt?.toDate?.()?.toISOString() || null,
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
