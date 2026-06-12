"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Package, ChevronLeft, ShoppingBag } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";

interface Order {
  id: string;
  total: number;
  subtotal: number;
  deliveryCharge: number;
  status: string;
  paymentDetails: { method: string };
  shippingDetails: { firstName: string; lastName: string; address: string; city: string; district: string };
  items: { name: string; qty: number; price: number; emoji: string; vacuum?: boolean }[];
  createdAt: string;
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

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
          // Sort client-side
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

  const STATUS_STEPS = ["pending", "confirmed", "preparing", "packed", "dispatched", "delivered", "completed"];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12 border-b border-gray-200 pb-6">
          <Link href="/account" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-[#D98C1F] border border-gray-100 transition-colors shadow-sm">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-[#222]">My Orders</h1>
            <p className="text-sm text-[#D98C1F] font-bold tracking-widest uppercase mt-1">
              {orders.length} order{orders.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#D98C1F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] text-center py-24 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FAF7F2] to-transparent opacity-50"></div>
            <div className="w-20 h-20 rounded-full bg-[#FAF7F2] border border-gray-100 flex items-center justify-center mx-auto mb-6 relative z-10">
              <ShoppingBag className="w-8 h-8 text-[#ccc]" />
            </div>
            <p className="text-xl font-display font-bold text-[#222] relative z-10">No orders yet</p>
            <p className="text-sm text-[#888] mt-2 mb-8 relative z-10">Start shopping to see your orders here!</p>
            <Link href="/products"
              className="relative z-10 inline-flex items-center gap-2 bg-[#D98C1F] hover:bg-[#B8740F] text-white text-sm font-bold tracking-wide px-8 py-3.5 rounded-full transition-all shadow-[0_5px_15px_rgba(217,140,31,0.3)]">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStep = STATUS_STEPS.indexOf(order.status);
              const isOpen = expanded === order.id;
              return (
                <div key={order.id} className={`bg-white rounded-3xl border transition-all duration-300 shadow-sm overflow-hidden ${isOpen ? 'border-[#D98C1F]/30 shadow-[0_10px_30px_rgba(217,140,31,0.08)]' : 'border-gray-100 hover:border-gray-200'}`}>
                  {/* Order Header */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center gap-5 text-left hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-gray-100 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-[#D98C1F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <p className="text-xs font-mono text-[#888]">#{order.id.substring(0, 12)}...</p>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-[#555] mt-0.5 truncate font-medium">
                        {order.items?.map((i) => i.name).join(", ")}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-bold text-[#222]">LKR {order.total?.toLocaleString()}</p>
                      <p className="text-xs text-[#888] mt-1 uppercase tracking-wider">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-LK", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </p>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 text-gray-400 transition-transform duration-300 ml-2 ${isOpen ? "rotate-180 bg-[#D98C1F]/10 text-[#D98C1F] border-[#D98C1F]/20" : ""}`}>
                      ▾
                    </div>
                  </button>

                  {/* Expanded Order Details */}
                  {isOpen && (
                    <div className="border-t border-gray-100 px-6 md:px-8 py-8 space-y-8 bg-gray-50/30">
                      {/* Progress */}
                      <div>
                        <p className="text-xs font-bold tracking-widest text-[#D98C1F] uppercase mb-4">Order Progress</p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {STATUS_STEPS.map((step, i) => (
                            <div key={step} className="flex items-center gap-1.5">
                              <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                i < currentStep ? "bg-[#2C4631] text-white shadow-sm" :
                                i === currentStep ? "bg-[#D98C1F] text-white shadow-sm" :
                                "bg-white text-[#bbb] border border-gray-200"
                              }`}>
                                {step}
                              </div>
                              {i < STATUS_STEPS.length - 1 && (
                                <div className={`w-4 h-0.5 ${i < currentStep ? "bg-[#2C4631]" : "bg-gray-200"}`} />
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
                              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-2xl border border-gray-100">
                                {item.emoji}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-[#222]">{item.name}</p>
                                {item.vacuum && <p className="text-xs text-[#D98C1F] mt-1 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#D98C1F]"></span> Vacuum packaged</p>}
                              </div>
                              <div className="text-right">
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
                              {order.paymentDetails?.method}
                            </div>
                          </div>
                          <p className="text-xs text-[#888] mt-4 flex items-center gap-2">
                            <Package className="w-3.5 h-3.5" /> Delivery via Domex (3-5 days)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
