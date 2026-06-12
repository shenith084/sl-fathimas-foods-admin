"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import KPICard from "@/components/admin/KPICard";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";

interface Report {
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  monthOrders: number;
  monthRevenue: number;
  topProducts: { name: string; qty: number; revenue: number }[];
  statusBreakdown: Record<string, number>;
}

export default function AdminReportsPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/reports")
      .then((r) => r.json())
      .then((data) => { if (data.success) setReport(data.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#D98C1F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Reports & Analytics" subtitle="Sales performance and business insights" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <KPICard title="Total Revenue" value={`LKR ${(report?.totalRevenue || 0).toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} color="gold" />
        <KPICard title="Total Orders" value={report?.totalOrders || 0} icon={<ShoppingCart className="w-5 h-5" />} color="green" />
        <KPICard title="This Month Revenue" value={`LKR ${(report?.monthRevenue || 0).toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} color="blue" />
        <KPICard title="This Month Orders" value={report?.monthOrders || 0} icon={<Package className="w-5 h-5" />} color="gold" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-[#222] mb-5">Top 5 Products by Revenue</h3>
          {(report?.topProducts || []).length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-8 h-8 text-[#ccc] mx-auto mb-2" />
              <p className="text-[#aaa] text-sm">No data yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(report?.topProducts || []).map((p, i) => {
                const maxRevenue = (report?.topProducts?.[0]?.revenue || 1);
                const pct = Math.round((p.revenue / maxRevenue) * 100);
                return (
                  <div key={p.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#D98C1F] w-5">#{i + 1}</span>
                        <span className="text-sm font-medium text-[#222] truncate max-w-[180px]">{p.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#222]">LKR {p.revenue.toLocaleString()}</p>
                        <p className="text-xs text-[#aaa]">{p.qty} sold</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-[#D98C1F] to-[#E8B04A] h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-[#222] mb-5">Order Status Distribution</h3>
          {Object.keys(report?.statusBreakdown || {}).length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-8 h-8 text-[#ccc] mx-auto mb-2" />
              <p className="text-[#aaa] text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(report?.statusBreakdown || {}).map(([status, count]) => {
                const total = report?.totalOrders || 1;
                const pct = Math.round((count / total) * 100);
                const colorMap: Record<string, string> = {
                  pending: "bg-amber-400",
                  confirmed: "bg-blue-400",
                  preparing: "bg-purple-400",
                  dispatched: "bg-cyan-400",
                  delivered: "bg-emerald-400",
                  completed: "bg-green-500",
                  cancelled: "bg-red-400",
                };
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm capitalize text-[#555]">{status}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#222]">{count}</span>
                        <span className="text-xs text-[#aaa]">({pct}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`${colorMap[status] || "bg-gray-400"} h-1.5 rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-[#222] mb-5">Today&apos;s Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#D98C1F]/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[#D98C1F]">{report?.todayOrders || 0}</p>
              <p className="text-xs text-[#888] mt-1">Orders Today</p>
            </div>
            <div className="bg-[#556B4F]/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[#556B4F]">LKR {(report?.todayRevenue || 0).toLocaleString()}</p>
              <p className="text-xs text-[#888] mt-1">Revenue Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-[#222] mb-5">This Month</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-500/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{report?.monthOrders || 0}</p>
              <p className="text-xs text-[#888] mt-1">Orders This Month</p>
            </div>
            <div className="bg-emerald-500/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">LKR {(report?.monthRevenue || 0).toLocaleString()}</p>
              <p className="text-xs text-[#888] mt-1">Revenue This Month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
