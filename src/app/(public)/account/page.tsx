"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
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

      // Load recent orders securely
      try {
        const res = await fetch(`/api/v1/orders?userId=${user.uid}`);
        const json = await res.json();
        
        if (json.success) {
          const data = json.data as Order[];
          // Sort client-side and take top 5
          data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setOrders(data.slice(0, 5));
        } else {
          setOrders([]);
        }
      } catch (err) {
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
    <div className="w-full">
      {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D98C1F] to-[#B8740F] flex items-center justify-center text-white font-display font-bold text-2xl shadow-[0_5px_15px_rgba(217,140,31,0.3)] border border-[#D98C1F]/20">
              {userName ? userName[0].toUpperCase() : userEmail ? userEmail[0].toUpperCase() : "U"}
            </div>
            <div>
              <p className="text-[#D98C1F] text-xs font-bold tracking-[0.2em] uppercase mb-1">Valued Customer</p>
              <h1 className="text-3xl font-display font-bold text-[#222]">Welcome back, {userName?.split(" ")[0] || "there"}</h1>
              <p className="text-sm text-[#888] mt-1">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          {[
            { icon: Package, label: "My Orders", subtitle: `${orders.length} recent order${orders.length !== 1 ? 's' : ''}`, href: "/account/orders" },
            { icon: User, label: "My Profile", subtitle: "Edit details", href: "/account/profile" },
            { icon: ShoppingBag, label: "Shop Now", subtitle: "Browse products", href: "/products" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 hover:border-[#D98C1F]/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-gray-100 flex items-center justify-center group-hover:bg-[#D98C1F]/10 group-hover:border-[#D98C1F]/20 transition-colors">
                  <item.icon className="w-5 h-5 text-[#D98C1F]" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#D98C1F] transition-colors group-hover:translate-x-1" />
              </div>
              <div>
                <p className="font-display font-bold text-[#222] text-lg">{item.label}</p>
                <p className="text-xs text-[#888] mt-1 uppercase tracking-wider">{item.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D98C1F] to-transparent opacity-30"></div>
          
          <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#D98C1F]/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#D98C1F]" />
              </div>
              <h2 className="font-display font-bold text-xl text-[#222]">Recent Orders</h2>
            </div>
            <Link href="/account/orders" className="text-sm text-[#D98C1F] font-semibold hover:text-[#B8740F] transition-colors flex items-center gap-1 group">
              View all <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-gray-100 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-[#222] text-lg font-display font-semibold">No orders yet</p>
              <p className="text-sm text-[#888] mt-2 mb-6">When you place an order, it will appear here.</p>
              <Link href="/products"
                className="inline-flex items-center gap-2 bg-[#D98C1F] hover:bg-[#B8740F] text-white text-sm font-bold tracking-wide px-8 py-3.5 rounded-full transition-all shadow-[0_5px_15px_rgba(217,140,31,0.3)]">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-[#555] tracking-wide">Order</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#555] tracking-wide">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#555] tracking-wide">Items</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#555] tracking-wide">Total</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#555] tracking-wide">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#555] tracking-wide text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-sm text-[#222]">#{order.id.substring(0, 8).toUpperCase()}</td>
                      <td className="px-6 py-4 text-sm text-[#555]">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#555]">{order.items?.length || 0} Items</td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#222]">LKR {order.total?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href="/account/orders" className="px-4 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-[#555] hover:bg-gray-50 transition-colors inline-block">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
    </div>
  );
}
