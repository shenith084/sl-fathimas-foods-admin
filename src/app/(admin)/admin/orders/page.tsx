"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Eye, Filter, ChevronDown } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";

interface Order {
  id: string;
  shippingDetails: { firstName: string; lastName: string; email: string; phone: string; district: string };
  total: number;
  status: string;
  paymentDetails: { method: string };
  createdAt: string;
}

const ORDER_STATUSES = ["all", "pending", "processing", "dispatched", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/orders?status=${statusFilter}`);
        const data = await res.json();
        if (data.success) setOrders(data.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [statusFilter]);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.shippingDetails?.firstName?.toLowerCase().includes(q) ||
      o.shippingDetails?.lastName?.toLowerCase().includes(q) ||
      o.shippingDetails?.email?.toLowerCase().includes(q)
    );
  });

  function getTabColor(status: string) {
    if (statusFilter === status) return "bg-[#18181A] text-white border-[#18181A]";
    switch(status) {
      case "pending": return "text-amber-500 border-gray-100 hover:border-amber-200";
      case "processing": return "text-purple-500 border-gray-100 hover:border-purple-200";
      case "dispatched": return "text-cyan-500 border-gray-100 hover:border-cyan-200";
      case "delivered": return "text-emerald-600 border-gray-100 hover:border-emerald-300";
      case "cancelled": return "text-red-500 border-gray-100 hover:border-red-200";
      default: return "text-[#666] border-gray-100 hover:border-gray-300";
    }
  }

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${orders.length} orders total`} />

      {/* Status Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all border bg-white shadow-sm ${getTabColor(s)}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex items-center gap-3 px-4 py-2.5 flex-1">
          <Search className="w-4 h-4 text-[#aaa]" />
          <input
            type="text"
            placeholder="Search by order ID, customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm text-[#444] outline-none bg-transparent placeholder:text-[#bbb]"
          />
        </div>
        <button className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-2.5 text-sm font-medium text-[#444] flex items-center gap-2 hover:bg-gray-50 transition-colors">
           <Filter className="w-4 h-4 text-[#888]" /> Filters <ChevronDown className="w-4 h-4 text-[#888] ml-2" />
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {loading ? (
          <div className="flex items-center justify-center py-16 flex-1">
            <div className="w-8 h-8 border-2 border-[#E88E23] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 flex-1 flex flex-col justify-center">
            <ShoppingCart className="w-10 h-10 text-[#ccc] mx-auto mb-3" />
            <p className="text-[#888] text-sm">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto flex flex-col flex-1">
            <table className="w-full flex-1">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-[#888] px-6 py-4">Order ID</th>
                  <th className="text-left text-xs font-semibold text-[#888] px-6 py-4">Customer</th>
                  <th className="text-left text-xs font-semibold text-[#888] px-6 py-4">District</th>
                  <th className="text-left text-xs font-semibold text-[#888] px-6 py-4">Total</th>
                  <th className="text-left text-xs font-semibold text-[#888] px-6 py-4">Payment</th>
                  <th className="text-left text-xs font-semibold text-[#888] px-6 py-4">Status</th>
                  <th className="text-left text-xs font-semibold text-[#888] px-6 py-4">Date</th>
                  <th className="text-right text-xs font-semibold text-[#888] px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-[11px] tracking-wider text-[#E88E23]">#{order.id.substring(0, 8).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-[#222]">
                        {order.shippingDetails?.firstName} {order.shippingDetails?.lastName}
                      </p>
                      <p className="text-[11px] text-[#888] mt-0.5">{order.shippingDetails?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-[11px] text-[#666]">{order.shippingDetails?.district || "—"}</td>
                    <td className="px-6 py-4 text-[11px] font-bold text-[#222]">LKR {order.total?.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] text-[#666]">{order.paymentDetails?.method === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      {order.createdAt ? (
                        <>
                          <p className="text-[11px] text-[#555] whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                          <p className="text-[10px] text-[#888] mt-0.5 whitespace-nowrap">{new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p>
                        </>
                      ) : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#FFF4E6] text-[#E88E23] text-[11px] font-bold rounded-lg hover:bg-[#E88E23] hover:text-white transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Footer */}
            <div className="mt-auto px-6 py-4 border-t border-gray-100 bg-white rounded-b-2xl">
              <p className="text-xs font-medium text-[#888]">Showing {filtered.length} of {orders.length} total orders</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
