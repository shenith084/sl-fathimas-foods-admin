import { adminDb } from "@/lib/firebase/admin";

export interface SalesReport {
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  monthOrders: number;
  monthRevenue: number;
  topProducts: { name: string; qty: number; revenue: number }[];
  statusBreakdown: Record<string, number>;
}

export async function getSalesReport(): Promise<SalesReport> {
  const snapshot = await adminDb.collection("orders").get();
  const orders = snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate?.() || new Date(0),
  }));

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  let totalRevenue = 0;
  let todayOrders = 0;
  let todayRevenue = 0;
  let monthOrders = 0;
  let monthRevenue = 0;
  const statusBreakdown: Record<string, number> = {};
  const productMap: Record<string, { name: string; qty: number; revenue: number }> = {};

  for (const order of orders) {
    const total = (order as any).total || 0;
    const createdAt: Date = (order as any).createdAt;
    const status: string = (order as any).status || "pending";

    totalRevenue += total;
    statusBreakdown[status] = (statusBreakdown[status] || 0) + 1;

    if (createdAt >= todayStart) {
      todayOrders++;
      todayRevenue += total;
    }
    if (createdAt >= monthStart) {
      monthOrders++;
      monthRevenue += total;
    }

    for (const item of (order as any).items || []) {
      const key = item.name;
      if (!productMap[key]) {
        productMap[key] = { name: key, qty: 0, revenue: 0 };
      }
      productMap[key].qty += item.qty || 1;
      productMap[key].revenue += (item.price || 0) * (item.qty || 1);
    }
  }

  const topProducts = Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    totalOrders: orders.length,
    totalRevenue,
    todayOrders,
    todayRevenue,
    monthOrders,
    monthRevenue,
    topProducts,
    statusBreakdown,
  };
}

export async function getCustomers(limit = 100) {
  const snapshot = await adminDb.collection("orders").get();
  const customerMap: Record<
    string,
    { email: string; name: string; phone: string; orderCount: number; totalSpent: number; lastOrder: string }
  > = {};

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const email = data.shippingDetails?.email || "guest";
    const name = `${data.shippingDetails?.firstName || ""} ${data.shippingDetails?.lastName || ""}`.trim();
    if (!customerMap[email]) {
      customerMap[email] = {
        email,
        name,
        phone: data.shippingDetails?.phone || "",
        orderCount: 0,
        totalSpent: 0,
        lastOrder: data.createdAt?.toDate?.()?.toISOString() || "",
      };
    }
    customerMap[email].orderCount++;
    customerMap[email].totalSpent += data.total || 0;
    const orderDate = data.createdAt?.toDate?.()?.toISOString() || "";
    if (orderDate > customerMap[email].lastOrder) {
      customerMap[email].lastOrder = orderDate;
    }
  }

  return Object.values(customerMap)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit);
}
