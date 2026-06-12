"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Eye } from "lucide-react";
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

const ORDER_STATUSES = ["all", "pending", "confirmed", "preparing", "packed", "dispatched", "delivered", "completed", "cancelled"];

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

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${orders.length} orders total`} />

      {/* Status Filter Tabs */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
              statusFilter === s
                ? "bg-[#1F1F1F] text-white shadow-sm"
                : "bg-white text-[#666] border border-gray-200 hover:border-gray-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 flex items-center gap-3 px-4 py-3">
        <Search className="w-4 h-4 text-[#aaa]" />
        <input
          type="text"
          placeholder="Search by order ID, customer name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm text-[#444] outline-none bg-transparent placeholder:text-[#bbb]"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#D98C1F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-10 h-10 text-[#ccc] mx-auto mb-3" />
            <p className="text-[#888] text-sm">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Order ID</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Customer</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">District</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Total</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Payment</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Status</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Date</th>
                  <th className="text-right text-xs font-semibold text-[#999] px-5 py-3.5">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs text-[#D98C1F]">{order.id.substring(0, 10)}...</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-[#222]">
                        {order.shippingDetails?.firstName} {order.shippingDetails?.lastName}
                      </p>
                      <p className="text-xs text-[#aaa]">{order.shippingDetails?.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#555]">{order.shippingDetails?.district || "—"}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-[#222]">LKR {order.total?.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs capitalize text-[#555]">{order.paymentDetails?.method || "cod"}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[#999]">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-LK") : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F4EFE6] text-[#D98C1F] text-xs font-medium rounded-lg hover:bg-[#D98C1F]/15 transition-colors"
                      >
                        <Eye className="w-3 h-3" /> View
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
