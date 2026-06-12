"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingCart, DollarSign, Users, Package, AlertTriangle,
  TrendingUp, Clock, ArrowRight
} from "lucide-react";
import KPICard from "@/components/admin/KPICard";
import StatusBadge from "@/components/admin/StatusBadge";
import PageHeader from "@/components/admin/PageHeader";

interface SalesReport {
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  monthOrders: number;
  monthRevenue: number;
  topProducts: { name: string; qty: number; revenue: number }[];
  statusBreakdown: Record<string, number>;
}

interface Order {
  id: string;
  shippingDetails: { firstName: string; lastName: string; email: string };
  total: number;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [repRes, ordRes] = await Promise.all([
          fetch("/api/v1/reports"),
          fetch("/api/v1/orders"),
        ]);
        const repData = await repRes.json();
        const ordData = await ordRes.json();
        if (repData.success) setReport(repData.data);
        if (ordData.success) setRecentOrders(ordData.data.slice(0, 8));
      } catch {
        // Use mock data if API fails
        setReport({
          totalOrders: 0, totalRevenue: 0, todayOrders: 0, todayRevenue: 0,
          monthOrders: 0, monthRevenue: 0, topProducts: [], statusBreakdown: {},
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#D98C1F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pendingCount = report?.statusBreakdown?.pending || 0;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back! Here's what's happening today.`}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Total Revenue"
          value={`LKR ${(report?.totalRevenue || 0).toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5" />}
          color="gold"
        />
        <KPICard
          title="Total Orders"
          value={report?.totalOrders || 0}
          icon={<ShoppingCart className="w-5 h-5" />}
          color="green"
        />
        <KPICard
          title="This Month Revenue"
          value={`LKR ${(report?.monthRevenue || 0).toLocaleString()}`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="blue"
        />
        <KPICard
          title="Pending Orders"
          value={pendingCount}
          icon={<Clock className="w-5 h-5" />}
          color={pendingCount > 5 ? "red" : "gold"}
          trendLabel={pendingCount > 0 ? "Needs attention" : "All clear!"}
        />
      </div>

      {/* Today Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-[#888] mb-3 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Today&apos;s Orders
          </h3>
          <p className="text-3xl font-bold text-[#222]">{report?.todayOrders || 0}</p>
          <p className="text-sm text-[#888] mt-1">LKR {(report?.todayRevenue || 0).toLocaleString()} revenue</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-[#888] mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" /> Order Status Breakdown
          </h3>
          <div className="space-y-1.5">
            {Object.entries(report?.statusBreakdown || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <StatusBadge status={status} />
                <span className="text-sm font-bold text-[#444]">{count}</span>
              </div>
            ))}
            {Object.keys(report?.statusBreakdown || {}).length === 0 && (
              <p className="text-xs text-[#aaa]">No orders yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders + Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-[#222]">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs text-[#D98C1F] font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <ShoppingCart className="w-8 h-8 text-[#ccc] mx-auto mb-2" />
              <p className="text-sm text-[#aaa]">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#FAFAFA] border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-[#999] px-6 py-3">Order ID</th>
                    <th className="text-left text-xs font-semibold text-[#999] px-6 py-3">Customer</th>
                    <th className="text-left text-xs font-semibold text-[#999] px-6 py-3">Total</th>
                    <th className="text-left text-xs font-semibold text-[#999] px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <Link href={`/admin/orders/${order.id}`} className="text-xs font-mono text-[#D98C1F] hover:underline">
                          {order.id.substring(0, 8)}...
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-sm text-[#444]">
                        {order.shippingDetails?.firstName} {order.shippingDetails?.lastName}
                      </td>
                      <td className="px-6 py-3 text-sm font-semibold text-[#222]">
                        LKR {order.total?.toLocaleString()}
                      </td>
                      <td className="px-6 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-[#222]">Top Products</h3>
            <Link href="/admin/reports" className="text-xs text-[#D98C1F] font-medium hover:underline">
              Reports
            </Link>
          </div>
          {(report?.topProducts || []).length === 0 ? (
            <div className="px-6 py-10 text-center">
              <Package className="w-8 h-8 text-[#ccc] mx-auto mb-2" />
              <p className="text-sm text-[#aaa]">No data yet</p>
            </div>
          ) : (
            <div className="px-6 py-4 space-y-4">
              {(report?.topProducts || []).map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#D98C1F]/10 flex items-center justify-center text-xs font-bold text-[#D98C1F] flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#222] truncate">{p.name}</p>
                    <p className="text-xs text-[#888]">{p.qty} sold</p>
                  </div>
                  <p className="text-sm font-bold text-[#444]">LKR {p.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-gradient-to-r from-[#1F1F1F] to-[#2a2a2a] rounded-2xl p-6 flex flex-wrap gap-3 items-center">
        <div className="flex-1">
          <p className="text-white font-semibold">Quick Actions</p>
          <p className="text-[#888] text-xs mt-0.5">Common admin tasks</p>
        </div>
        {[
          { label: "Add Product", href: "/admin/products/new" },
          { label: "View Orders", href: "/admin/orders" },
          { label: "Update Stock", href: "/admin/stock" },
          { label: "View Reports", href: "/admin/reports" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="px-4 py-2 bg-white/10 hover:bg-[#D98C1F] text-white text-sm font-medium rounded-xl transition-all duration-200"
          >
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
