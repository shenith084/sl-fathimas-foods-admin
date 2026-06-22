"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Check } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import toast from "react-hot-toast";

const ORDER_WORKFLOW = ["pending", "processing", "dispatched", "delivered"];

interface Order {
  id: string;
  items: { name: string; price: number; qty: number; emoji: string; vacuum?: boolean; description?: string }[];
  shippingDetails: { firstName: string; lastName: string; email: string; phone: string; address: string; city: string; district: string };
  paymentDetails: { method: string; status: string; receiptUrl?: string };
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: string;
  status_history?: { status: string; timestamp: string; note?: string }[];
  createdAt: string;
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newTotal, setNewTotal] = useState("");
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setOrder(data.data);
          setNewStatus(data.data.status);
          setNewTotal("0");
          
          if (data.data.hasUnreadReceipt) {
            fetch(`/api/v1/orders/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ clearUnreadReceipt: true }),
            }).catch(console.error);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusUpdate() {
    if (!newStatus) return;
    setUpdating(true);
    try {
      const payload: any = { status: newStatus, note };
      if (isCustomOrder && newTotal !== "0" && newTotal !== "") {
        payload.total = Number(newTotal);
      }

      const res = await fetch(`/api/v1/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const resData = await res.json();
      
      if (!resData.success) {
        toast.error("Failed to update order");
        return;
      }

      setOrder((prev) => prev ? { ...prev, status: newStatus, total: payload.total ?? prev.total, subtotal: payload.total ?? prev.subtotal } : prev);
      setNewTotal("0");
      setNote("");
      toast.success("Order status updated!");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#D98C1F] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!order) return (
    <div className="text-center py-20">
      <p className="text-[#888]">Order not found</p>
      <Link href="/admin/orders" className="text-[#D98C1F] text-sm mt-2 inline-block">← Back to Orders</Link>
    </div>
  );

  const currentIndex = ORDER_WORKFLOW.indexOf(order.status);
  const isCustomOrder = order.items?.[0]?.name === "Custom Order Request";

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="text-[#888] hover:text-[#444] transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <PageHeader
          title={`Order #${order.id.substring(0, 12)}...`}
          subtitle={`Placed on ${order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-LK", { dateStyle: "long" }) : "—"}`}
        />
      </div>

      {/* Status Workflow */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h3 className="font-semibold text-[#222] mb-5">Order Status</h3>
        <div className="flex items-center gap-1 flex-wrap mb-6">
          {ORDER_WORKFLOW.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                i < currentIndex ? "bg-[#2C4631] text-white" :
                i === currentIndex ? "bg-[#D98C1F] text-white" :
                "bg-gray-100 text-[#aaa]"
              }`}>
                {i < currentIndex && <Check className="w-3 h-3" />}
                <span className="capitalize">{s}</span>
              </div>
              {i < ORDER_WORKFLOW.length - 1 && <div className="w-4 h-0.5 bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-[#555] mb-1.5">Update Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] bg-white"
            >
              {[...ORDER_WORKFLOW, "cancelled"].map((s) => (
                <option key={s} value={s} className="capitalize">{s}</option>
              ))}
            </select>
          </div>
          <div className="flex-[2]">
            <label className="block text-xs font-semibold text-[#555] mb-1.5">Note (optional)</label>
            <input
              value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Dispatched via Domex #12345"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F]"
            />
          </div>
          {isCustomOrder && (
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-semibold text-[#555] mb-1.5">Quote Total (LKR)</label>
              <input
                type="number"
                value={newTotal} onChange={(e) => setNewTotal(e.target.value)}
                placeholder="0"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F]"
              />
            </div>
          )}
          <button
            onClick={handleStatusUpdate}
            disabled={updating || (newStatus === order.status && note === "" && (!isCustomOrder || newTotal === "0" || newTotal === ""))}
            className="px-5 py-2.5 bg-[#D98C1F] hover:bg-[#B8740F] text-white text-sm font-semibold rounded-xl transition-colors disabled:bg-gray-200 disabled:text-gray-400"
          >
            {updating ? "Saving..." : "Update"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-[#222] mb-4">Ordered Items</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#222]">{item.name}</p>
                    {item.vacuum && <p className="text-xs text-[#D98C1F]">+ Vacuum packaging</p>}
                    {item.description && (
                      <p className="text-xs text-[#666] mt-2 whitespace-pre-line border-l border-[#D98C1F]/30 pl-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-[#666]">×{item.qty}</p>
                  <p className="text-sm font-bold text-[#222]">LKR {((item.price + (item.vacuum ? 50 : 0)) * item.qty).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm text-[#666]">
                <span>Subtotal</span><span>LKR {order.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-[#666]">
                <span>Delivery (Domex)</span><span>LKR {order.deliveryCharge?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-[#222] pt-2 border-t border-gray-100">
                <span>Total</span><span className="text-[#D98C1F]">LKR {order.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Status History */}
          {(order.status_history || []).length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-[#222] mb-4">Status History</h3>
              <div className="space-y-3">
                {(order.status_history || []).map((entry, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#D98C1F] mt-1.5 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={entry.status} />
                        <span className="text-xs text-[#aaa]">{new Date(entry.timestamp).toLocaleString("en-LK")}</span>
                      </div>
                      {entry.note && <p className="text-xs text-[#666] mt-0.5">{entry.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Shipping + Payment */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-[#222] mb-4">Shipping Address</h3>
            <div className="space-y-1 text-sm text-[#555]">
              <p className="font-semibold text-[#222]">{order.shippingDetails?.firstName} {order.shippingDetails?.lastName}</p>
              <p>{order.shippingDetails?.phone}</p>
              <p>{order.shippingDetails?.email}</p>
              <p className="pt-1">{order.shippingDetails?.address}</p>
              <p>{order.shippingDetails?.city}, {order.shippingDetails?.district}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-[#222] mb-4">Payment</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#888]">Method</span>
                <span className="font-medium text-[#222] capitalize">{order.paymentDetails?.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888]">Status</span>
                <StatusBadge status={order.paymentDetails?.status || "pending"} />
              </div>
              {order.paymentDetails?.receiptUrl && (
                <div className="pt-3 mt-3 border-t border-gray-100">
                  <span className="block text-[#888] mb-2">Bank Receipt</span>
                  <button 
                    onClick={() => setIsReceiptModalOpen(true)}
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-[#F4EFE6] hover:bg-[#E8DFCC] text-[#2C4631] text-sm font-semibold rounded-xl transition-colors"
                  >
                    View Payment Receipt
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-[#222] mb-3">Current Status</h3>
            <StatusBadge status={order.status} />
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setIsReceiptModalOpen(false)}>
          <div className="relative bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-semibold text-[#222]">Payment Receipt</h3>
              <button onClick={() => setIsReceiptModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-4 overflow-auto flex justify-center bg-gray-50">
              <img 
                src={order.paymentDetails?.receiptUrl?.endsWith('.pdf') ? order.paymentDetails.receiptUrl.replace('.pdf', '.png') : order.paymentDetails?.receiptUrl} 
                alt="Payment Receipt" 
                className="max-w-full h-auto max-h-[70vh] object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
