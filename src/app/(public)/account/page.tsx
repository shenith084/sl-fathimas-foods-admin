"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { ShoppingBag, User, Package, ChevronRight, Clock } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: { name: string; qty: number }[];
}

export default function AccountDashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth?redirect=/account");
        return;
      }
      setUserEmail(user.email);
      setUserName(user.displayName);

      // Load recent orders
      try {
        const q = query(
          collection(db, "orders"),
          where("shippingDetails.email", "==", user.email),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.()?.toISOString() || null,
        })) as Order[];
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D98C1F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D98C1F] to-[#B8740F] flex items-center justify-center text-white font-bold text-xl shadow-md">
              {userName ? userName[0].toUpperCase() : userEmail ? userEmail[0].toUpperCase() : "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#222]">Welcome back, {userName || "there"}! 👋</h1>
              <p className="text-sm text-[#888]">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Package, label: "My Orders", subtitle: `${orders.length} recent orders`, href: "/account/orders", color: "from-[#D98C1F]/10 to-[#D98C1F]/5 border-[#D98C1F]/20" },
            { icon: User, label: "My Profile", subtitle: "Edit name & password", href: "/account/profile", color: "from-[#556B4F]/10 to-[#556B4F]/5 border-[#556B4F]/20" },
            { icon: ShoppingBag, label: "Shop Now", subtitle: "Browse all products", href: "/products", color: "from-blue-500/10 to-blue-500/5 border-blue-500/20" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`bg-gradient-to-br ${item.color} border rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200 group`}
            >
              <div className="w-11 h-11 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-[#D98C1F]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#222] text-sm">{item.label}</p>
                <p className="text-xs text-[#888] mt-0.5">{item.subtitle}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#bbb] group-hover:text-[#D98C1F] transition-colors" />
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D98C1F]" />
              <h2 className="font-semibold text-[#222]">Recent Orders</h2>
            </div>
            <Link href="/account/orders" className="text-xs text-[#D98C1F] font-medium hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 px-6">
              <ShoppingBag className="w-10 h-10 text-[#ddd] mx-auto mb-3" />
              <p className="text-[#888] text-sm font-medium">No orders yet</p>
              <p className="text-xs text-[#aaa] mt-1">When you place an order, it will appear here.</p>
              <Link href="/products"
                className="mt-4 inline-flex items-center gap-2 bg-[#D98C1F] hover:bg-[#B8740F] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {orders.map((order) => (
                <div key={order.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#D98C1F]/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-[#D98C1F]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-mono text-[#aaa]">#{order.id.substring(0, 10)}...</p>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-[#555] truncate">
                      {order.items?.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-[#222]">LKR {order.total?.toLocaleString()}</p>
                    <p className="text-xs text-[#aaa] mt-0.5">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-LK") : "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
