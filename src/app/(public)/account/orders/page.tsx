"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
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
        const q = query(
          collection(db, "orders"),
          where("shippingDetails.email", "==", user.email),
          orderBy("createdAt", "desc")
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

  const STATUS_STEPS = ["pending", "confirmed", "preparing", "packed", "dispatched", "delivered", "completed"];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/account" className="text-[#888] hover:text-[#444] transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#222]">My Orders</h1>
            <p className="text-sm text-[#888] mt-0.5">{orders.length} order{orders.length !== 1 ? "s" : ""} found</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#D98C1F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-16 px-6">
            <ShoppingBag className="w-12 h-12 text-[#ddd] mx-auto mb-4" />
            <p className="font-semibold text-[#444]">No orders yet</p>
            <p className="text-sm text-[#aaa] mt-1 mb-5">Start shopping to see your orders here!</p>
            <Link href="/products"
              className="inline-flex items-center gap-2 bg-[#D98C1F] hover:bg-[#B8740F] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const currentStep = STATUS_STEPS.indexOf(order.status);
              const isOpen = expanded === order.id;
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#D98C1F]/10 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-[#D98C1F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-mono text-[#aaa]">#{order.id.substring(0, 12)}...</p>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-[#555] mt-0.5 truncate">
                        {order.items?.map((i) => i.name).join(", ")}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-[#222]">LKR {order.total?.toLocaleString()}</p>
                      <p className="text-xs text-[#aaa]">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-LK") : "—"}
                      </p>
                    </div>
                    <span className={`text-[#aaa] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </button>

                  {/* Expanded Order Details */}
                  {isOpen && (
                    <div className="border-t border-gray-100 px-5 py-5 space-y-5">
                      {/* Progress */}
                      <div>
                        <p className="text-xs font-semibold text-[#888] mb-3">Order Progress</p>
                        <div className="flex items-center gap-1 flex-wrap">
                          {STATUS_STEPS.map((step, i) => (
                            <div key={step} className="flex items-center gap-1">
                              <div className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                                i < currentStep ? "bg-[#556B4F] text-white" :
                                i === currentStep ? "bg-[#D98C1F] text-white" :
                                "bg-gray-100 text-[#bbb]"
                              }`}>
                                {step}
                              </div>
                              {i < STATUS_STEPS.length - 1 && (
                                <div className={`w-3 h-0.5 ${i < currentStep ? "bg-[#556B4F]" : "bg-gray-200"}`} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <p className="text-xs font-semibold text-[#888] mb-2">Items Ordered</p>
                        <div className="space-y-2">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <span className="text-xl">{item.emoji}</span>
                              <div className="flex-1">
                                <p className="text-sm text-[#333]">{item.name}</p>
                                {item.vacuum && <p className="text-xs text-[#D98C1F]">+ Vacuum packaging</p>}
                              </div>
                              <span className="text-sm text-[#555]">×{item.qty}</span>
                              <span className="text-sm font-semibold text-[#222]">
                                LKR {((item.price + (item.vacuum ? 50 : 0)) * item.qty).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-sm">
                          <div className="flex justify-between text-[#666]">
                            <span>Subtotal</span>
                            <span>LKR {order.subtotal?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-[#666]">
                            <span>Delivery</span>
                            <span>LKR {order.deliveryCharge?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-bold text-[#222] pt-1 border-t border-gray-100">
                            <span>Total</span>
                            <span className="text-[#D98C1F]">LKR {order.total?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping & Payment */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#FAF7F2] rounded-xl p-4">
                          <p className="text-xs font-semibold text-[#888] mb-2">Shipping To</p>
                          <p className="text-sm text-[#444] font-medium">
                            {order.shippingDetails?.firstName} {order.shippingDetails?.lastName}
                          </p>
                          <p className="text-xs text-[#888] mt-0.5">{order.shippingDetails?.address}</p>
                          <p className="text-xs text-[#888]">{order.shippingDetails?.city}, {order.shippingDetails?.district}</p>
                        </div>
                        <div className="bg-[#FAF7F2] rounded-xl p-4">
                          <p className="text-xs font-semibold text-[#888] mb-2">Payment</p>
                          <p className="text-sm font-medium text-[#444] capitalize">{order.paymentDetails?.method}</p>
                          <p className="text-xs text-[#888] mt-1">Delivery via Domex (5 business days)</p>
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
