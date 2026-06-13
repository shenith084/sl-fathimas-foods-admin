"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Package, ShoppingBag } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import Link from "next/link";

interface Order {
  id: string;
  total: number;
  subtotal: number;
  deliveryCharge: number;
  status: string;
  paymentDetails: { method: string };
  shippingDetails: { firstName: string; lastName: string; address: string; city: string; district: string };
  items: { name: string; qty: number; price: number; emoji: string; vacuum?: boolean; description?: string }[];
  status_history?: { status: string; timestamp: string; note?: string }[];
  createdAt: string;
}

const TABS = ["All Orders", "Pending", "Processing", "Shipped", "Delivered", "Canceled"];
const STATUS_STEPS = ["pending", "processing", "dispatched", "delivered"];

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("All Orders");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth?redirect=/account/orders");
        return;
      }
      try {
        const res = await fetch(`/api/v1/orders?userId=${user.uid}`);
        const json = await res.json();
        
        if (json.success) {
          const data = json.data as Order[];
          data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setOrders(data);
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

  // Reset page when changing tabs
  useEffect(() => {
    setCurrentPage(1);
    setExpanded(null);
  }, [activeTab]);

  const mapStatusToTab = (status: string) => {
    if (status === "pending") return "Pending";
    if (status === "processing") return "Processing";
    if (status === "dispatched") return "Shipped";
    if (status === "delivered") return "Delivered";
    if (status === "cancelled") return "Canceled";
    return "All Orders";
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === "All Orders") return true;
    return mapStatusToTab(order.status) === activeTab;
  });

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#D98C1F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-[#222]">My Orders</h1>
        <p className="text-sm text-[#555] mt-1">View and manage all your orders.</p>
      </div>

      <div className="flex items-center gap-6 border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap pb-3 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === tab
                ? "border-[#D98C1F] text-[#D98C1F]"
                : "border-transparent text-[#888] hover:text-[#222]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20 px-6">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-gray-100 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-6 h-6 text-[#ccc]" />
          </div>
          <p className="text-lg font-bold text-[#222]">No orders found</p>
          <p className="text-sm text-[#888] mt-2 mb-6">You haven't placed any orders yet.</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-[#D98C1F] hover:bg-[#B8740F] text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-16 px-6">
          <p className="text-[#555]">No orders found for the status "{activeTab}".</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
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
                {paginatedOrders.map(order => {
                  const currentStep = STATUS_STEPS.indexOf(order.status);
                  const isExpanded = expanded === order.id;
                  
                  return (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-sm text-[#222]">#{order.id.substring(0, 8).toUpperCase()}</td>
                        <td className="px-6 py-4 text-sm text-[#555]">
                          {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#555]">{order.items?.length || 0} Items</td>
                        <td className="px-6 py-4 text-sm font-semibold text-[#222]">LKR {order.total.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setExpanded(isExpanded ? null : order.id)}
                            className={`px-4 py-1.5 border rounded-lg text-xs font-semibold transition-colors ${
                              isExpanded 
                                ? "bg-[#D98C1F] border-[#D98C1F] text-white" 
                                : "border-gray-200 text-[#555] hover:bg-gray-50"
                            }`}
                          >
                            {isExpanded ? "Close Details" : "View Details"}
                          </button>
                        </td>
                      </tr>
                      
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="bg-[#FAF7F2]/50 p-0 border-b border-gray-100 shadow-inner">
                            <div className="px-8 py-8 space-y-8">
                              {/* Progress */}
                              <div>
                                <p className="text-xs font-bold tracking-widest text-[#D98C1F] uppercase mb-4">Order Progress</p>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {STATUS_STEPS.map((step, i) => (
                                    <div key={step} className="flex items-center gap-1.5">
                                      <div className={`px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                                        i < currentStep ? "bg-[#2C4631] text-white shadow-sm" :
                                        i === currentStep ? "bg-[#D98C1F] text-white shadow-sm" :
                                        "bg-white text-[#bbb] border border-gray-200"
                                      }`}>
                                        {step}
                                      </div>
                                      {i < STATUS_STEPS.length - 1 && (
                                        <div className={`w-3 sm:w-4 h-0.5 ${i < currentStep ? "bg-[#2C4631]" : "bg-gray-200"}`} />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Items */}
                              <div>
                                <p className="text-xs font-bold tracking-widest text-[#D98C1F] uppercase mb-4">Items Ordered</p>
                                <div className="space-y-3">
                                  {order.items?.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                                      <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-2xl border border-gray-100">
                                        {item.emoji || "📦"}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-[#222] truncate">{item.name}</p>
                                        {item.vacuum && <p className="text-xs text-[#D98C1F] mt-1 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#D98C1F]"></span> Vacuum packaged</p>}
                                        {item.description && (
                                          <p className="text-xs text-[#666] mt-1.5 whitespace-pre-line border-l border-[#D98C1F]/30 pl-2">
                                            {item.description}
                                          </p>
                                        )}
                                      </div>
                                      <div className="text-right flex-shrink-0">
                                        <span className="text-sm font-bold text-[#222] block">
                                          LKR {((item.price + (item.vacuum ? 50 : 0)) * item.qty).toLocaleString()}
                                        </span>
                                        <span className="text-xs text-[#888] font-medium">Qty: {item.qty}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-6 pt-5 border-t border-gray-200 space-y-2 text-sm max-w-sm ml-auto">
                                  <div className="flex justify-between text-[#555]">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-[#222]">LKR {order.subtotal?.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between text-[#555]">
                                    <span>Delivery</span>
                                    <span className="font-medium text-[#222]">LKR {order.deliveryCharge?.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between items-center font-bold text-lg pt-3 mt-3 border-t border-gray-200">
                                    <span className="text-[#222]">Total</span>
                                    <span className="text-[#D98C1F]">LKR {order.total?.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Shipping & Payment */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                  <p className="text-xs font-bold tracking-widest text-[#D98C1F] uppercase mb-3">Shipping To</p>
                                  <p className="text-base text-[#222] font-bold mb-1">
                                    {order.shippingDetails?.firstName} {order.shippingDetails?.lastName}
                                  </p>
                                  <p className="text-sm text-[#555] leading-relaxed">{order.shippingDetails?.address}</p>
                                  <p className="text-sm text-[#555]">{order.shippingDetails?.city}, {order.shippingDetails?.district}</p>
                                </div>
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                                  <div>
                                    <p className="text-xs font-bold tracking-widest text-[#D98C1F] uppercase mb-3">Payment Method</p>
                                    <div className="inline-block bg-[#FAF7F2] text-[#444] font-bold text-sm px-4 py-2 rounded-lg capitalize border border-gray-100">
                                      {order.paymentDetails?.method === "bank" ? "Bank Transfer" : "Cash on Delivery"}
                                    </div>
                                  </div>
                                  <p className="text-xs text-[#888] mt-4 flex items-center gap-2">
                                    <Package className="w-3.5 h-3.5" /> Delivery via Domex
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-5 border-t border-gray-100 flex items-center justify-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                &lt;
              </button>
              
              {Array.from({length: totalPages}).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                    currentPage === i + 1 
                      ? "bg-[#2C4631] text-white border border-[#2C4631]" 
                      : "border border-gray-200 text-[#555] hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
