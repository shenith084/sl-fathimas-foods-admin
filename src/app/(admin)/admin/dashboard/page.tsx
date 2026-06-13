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
      <div className="mb-6">
        <h1 className="text-[#222] font-bold text-xl mb-1">Dashboard</h1>
        <p className="text-[#888] text-sm">Welcome back! Here's what's happening today.</p>
      </div>

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

      {/* Middle Row: Today Overview + Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Today's Overview */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[280px]">
          <div className="relative z-10 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 border border-blue-100">
              <ShoppingCart className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-sm font-bold text-[#888] mb-2 uppercase tracking-wider">
              Today's Overview
            </h3>
            <p className="text-6xl font-black text-[#222] mb-1 tracking-tight">{report?.todayOrders || 0}</p>
            <p className="text-[#666] text-sm font-medium mb-4">Orders Today</p>
            <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full">
              <p className="text-emerald-600 text-sm font-bold">LKR {(report?.todayRevenue || 0).toLocaleString()} revenue</p>
            </div>
          </div>
          
          {/* Graphic Illustration Background */}
          <div className="absolute opacity-[0.03] pointer-events-none -right-8 -bottom-8">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-[#222] mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#888]" /> Order Status Breakdown
          </h3>
          <div className="flex-1 flex flex-col justify-center space-y-5">
            {[
              { label: 'Pending', count: report?.statusBreakdown?.pending || 0, color: 'bg-orange-100 text-orange-600', bar: 'bg-orange-200' },
              { label: 'Processing', count: report?.statusBreakdown?.processing || 0, color: 'bg-purple-100 text-purple-600', bar: 'bg-purple-200' },
              { label: 'Dispatched', count: report?.statusBreakdown?.dispatched || 0, color: 'bg-teal-100 text-teal-600', bar: 'bg-teal-200' },
              { label: 'Delivered', count: report?.statusBreakdown?.delivered || 0, color: 'bg-emerald-100 text-emerald-600', bar: 'bg-emerald-200' },
              { label: 'Cancelled', count: report?.statusBreakdown?.cancelled || 0, color: 'bg-red-100 text-red-600', bar: 'bg-red-200' },
            ].map(status => (
              <div key={status.label} className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color} w-24 text-center`}>
                  {status.label}
                </div>
                <div className="flex-1 h-1.5 bg-gray-50 rounded-full overflow-hidden">
                  <div className={`h-full ${status.bar}`} style={{ width: status.count > 0 ? `${Math.min(status.count * 10, 100)}%` : '0%' }}></div>
                </div>
                <span className="text-sm font-bold text-[#444] w-4 text-right">{status.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders + Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 flex items-center justify-between border-b border-gray-50">
            <h3 className="font-bold text-[#222] text-sm">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs text-[#E88E23] font-semibold flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="px-6 py-8 text-center flex-1 flex flex-col items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-[#ccc] mx-auto mb-2" />
              <p className="text-xs text-[#aaa]">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/30">
                    <th className="text-left text-xs font-semibold text-[#888] px-6 py-3">Order ID</th>
                    <th className="text-left text-xs font-semibold text-[#888] px-6 py-3">Customer</th>
                    <th className="text-left text-xs font-semibold text-[#888] px-6 py-3">Total</th>
                    <th className="text-left text-xs font-semibold text-[#888] px-6 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-[#888] px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3">
                        <Link href={`/admin/orders/${order.id}`} className="text-xs font-bold text-[#222] hover:text-[#E88E23]">
                          #SLF{order.id.substring(0, 5).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-xs font-medium text-[#666]">
                        {order.shippingDetails?.firstName} {order.shippingDetails?.lastName}
                      </td>
                      <td className="px-6 py-3 text-xs font-medium text-[#666]">
                        LKR {order.total?.toLocaleString()}
                      </td>
                      <td className="px-6 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-3 text-[11px] font-medium text-[#888]">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 flex items-center justify-between border-b border-gray-50">
            <h3 className="font-bold text-[#222] text-sm">Top Products</h3>
            <Link href="/admin/reports" className="text-xs text-[#E88E23] font-semibold flex items-center gap-1 hover:underline">
              Reports <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {(report?.topProducts || []).length === 0 ? (
            <div className="px-6 py-8 text-center flex-1 flex flex-col items-center justify-center">
              <Package className="w-6 h-6 text-[#ccc] mx-auto mb-2" />
              <p className="text-xs text-[#aaa]">No data yet</p>
            </div>
          ) : (
            <div className="px-6 pb-4 pt-2 flex-1 flex flex-col justify-between">
              {(report?.topProducts || []).map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <div className="w-5 h-5 rounded bg-[#FFF4E6] flex items-center justify-center text-[9px] font-bold text-[#E88E23] flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-black overflow-hidden flex-shrink-0">
                    <img src="/logo.png" alt={p.name} className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#222] truncate">{p.name}</p>
                    <p className="text-[9px] text-[#888] mt-0.5">{p.qty} sold</p>
                  </div>
                  <p className="text-xs font-bold text-[#222]">LKR {p.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
