"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Lock, Check, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { auth, db } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const steps = ["Cart", "Shipping", "Payment", "Confirm"];

const districts = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
  "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla",
  "Moneragala", "Ratnapura", "Kegalle",
];

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getCartTotal = useCartStore((state) => state.getCartTotal);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", district: "", postalCode: "",
    paymentMethod: "cod", bankReceiptNote: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  // Autofill signed in user info
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setForm((f) => ({
          ...f,
          email: user.email || f.email,
          firstName: user.displayName ? user.displayName.split(" ")[0] : f.firstName,
          lastName: user.displayName && user.displayName.split(" ").length > 1 ? user.displayName.split(" ").slice(1).join(" ") : f.lastName,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const subtotal = getCartTotal();
  const delivery = subtotal > 0 ? 450 : 0;
  const total = subtotal + delivery;

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.address || !form.city || !form.district) {
      alert("Please fill in all required fields marked with *");
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setErrorMsg("");
    
    const orderData = {
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        emoji: item.emoji,
        weight: item.weight,
        vacuum: item.vacuum
      })),
      shippingDetails: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        district: form.district,
        postalCode: form.postalCode
      },
      paymentDetails: {
        method: form.paymentMethod,
        status: "pending"
      },
      subtotal,
      deliveryCharge: delivery,
      total,
      userId: auth.currentUser?.uid || "guest",
      status: "pending",
    };

    try {
      const res = await fetch("/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to process order. Please try again.");
      }

      clearCart();
      router.push(`/order-confirmation?orderId=${json.data.id}`);
    } catch (err: any) {
      console.error("Order submission failed:", err);
      setErrorMsg(err.message || "An unexpected error occurred. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-5 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-1.5 text-xs text-[#999] mb-3">
            <Link href="/" className="hover:text-[#D98C1F]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/cart" className="hover:text-[#D98C1F]">Cart</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#444]">Checkout</span>
          </nav>
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i < step ? "bg-[#2C4631] text-white" : i === step - 1 ? "bg-[#D98C1F] text-white" : "bg-gray-100 text-[#999]"}`}>
                  {i < step - 1 ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i === step - 1 ? "text-[#D98C1F]" : "text-[#999]"}`}>{s}</span>
                {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-[#ccc]" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {/* Shipping Details */}
            {step === 1 && (
              <form onSubmit={handleContinueToPayment} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
                <h2 className="font-display font-bold text-[#222] text-xl mb-6">Shipping Details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "First Name", field: "firstName", placeholder: "Fathima" },
                      { label: "Last Name", field: "lastName", placeholder: "Silva" },
                    ].map((f) => (
                      <div key={f.field}>
                        <label className="block text-sm font-medium text-[#444] mb-1.5">{f.label} *</label>
                        <input type="text" required placeholder={f.placeholder}
                          value={form[f.field as keyof typeof form]}
                          onChange={(e) => update(f.field, e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#444] mb-1.5">Email Address *</label>
                    <input type="email" required placeholder="your@email.com"
                      value={form.email} onChange={(e) => update("email", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#444] mb-1.5">Phone Number *</label>
                    <input type="tel" required placeholder="+94 77 000 0000"
                      value={form.phone} onChange={(e) => update("phone", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#444] mb-1.5">Address *</label>
                    <textarea rows={2} required placeholder="No. 123, Main Road"
                      value={form.address} onChange={(e) => update("address", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#444] mb-1.5">City *</label>
                      <input type="text" required placeholder="Colombo"
                        value={form.city} onChange={(e) => update("city", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#444] mb-1.5">District *</label>
                      <select required value={form.district} onChange={(e) => update("district", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors bg-white text-[#444]">
                        <option value="">Select district</option>
                        {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <button type="submit"
                  className="mt-6 w-full bg-[#D98C1F] hover:bg-[#B8740F] text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-md">
                  Continue to Payment →
                </button>
              </form>
            )}

            {/* Payment */}
            {step === 2 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
                <h2 className="font-display font-bold text-[#222] text-xl mb-6">Payment Method</h2>

                {/* Payment options */}
                <div className="space-y-3 mb-6">
                  {/* COD */}
                  <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${form.paymentMethod === "cod" ? "border-[#D98C1F] bg-[#D98C1F]/5" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" name="payment" value="cod" checked={form.paymentMethod === "cod"} onChange={() => update("paymentMethod", "cod")} className="mt-1" />
                    <div>
                      <p className="font-semibold text-[#222] text-sm">💵 Cash on Delivery (COD)</p>
                      <p className="text-[#666] text-xs mt-1">Pay when your order arrives. Available island-wide via Domex courier.</p>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${form.paymentMethod === "bank" ? "border-[#D98C1F] bg-[#D98C1F]/5" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" name="payment" value="bank" checked={form.paymentMethod === "bank"} onChange={() => update("paymentMethod", "bank")} className="mt-1" />
                    <div className="flex-1">
                      <p className="font-semibold text-[#222] text-sm">🏦 Bank Transfer</p>
                      <p className="text-[#666] text-xs mt-1">Transfer to our bank account and upload the receipt.</p>
                      {form.paymentMethod === "bank" && (
                        <div className="mt-3 bg-[#F4EFE6] rounded-xl p-4 text-xs text-[#555] space-y-1">
                          <p className="font-semibold text-[#222]">Bank Account Details:</p>
                          <p>Bank: <span className="font-medium">People's Bank</span></p>
                          <p>Account Name: <span className="font-medium">SL Fathima&apos;s Foods</span></p>
                          <p>Account No: <span className="font-medium">123-456-789-012</span></p>
                          <p>Branch: <span className="font-medium">Colombo Main Branch</span></p>
                          <p className="mt-2 text-[#999]">Please send order ID and payment screenshot to our WhatsApp (+94 77 123 4567) to confirm.</p>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Coming Soon Gateways */}
                  <div className="p-4 rounded-2xl border-2 border-dashed border-gray-200 opacity-60">
                    <p className="text-sm font-semibold text-[#999] mb-2">💳 Online Payment — Coming Soon</p>
                    <div className="flex gap-2">
                      {["PayHere", "Stripe", "PayPal"].map((gw) => (
                        <span key={gw} className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">{gw}</span>
                      ))}
                    </div>
                  </div>
                  {/* Error Message */}
                  {errorMsg && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-start gap-3">
                      <div className="mt-0.5">⚠️</div>
                      <div>
                        <p className="font-semibold">Order Failed</p>
                        <p className="opacity-90">{errorMsg}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3.5 rounded-xl font-bold text-[#555] bg-gray-100 hover:bg-gray-200 transition-colors"
                      disabled={loading}
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="w-2/3 bg-[#D98C1F] hover:bg-[#B8740F] text-white py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {loading ? "Processing Order..." : "Confirm & Place Order"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary sidebar */}
          <div>
            <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-24">
              <h3 className="font-display font-semibold text-[#222] text-base mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={`${item.id}-${item.vacuum}`} className="flex items-center gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#222] text-xs font-medium line-clamp-1">{item.name}</p>
                      <p className="text-[#999] text-[10px]">
                        x{item.qty} {item.vacuum && " (Vacuum)"}
                      </p>
                    </div>
                    <span className="font-semibold text-[#444] text-xs">
                      LKR {((item.price + (item.vacuum ? 50 : 0)) * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex justify-between text-xs text-[#666]">
                  <span>Subtotal</span><span>LKR {subtotal.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between text-xs text-[#666]">
                  <span>Delivery</span><span>LKR {delivery.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between font-bold text-[#222] text-sm pt-2 border-t border-gray-100">
                  <span>Total</span><span className="text-[#D98C1F]">LKR {total.toLocaleString()}.00</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-[#999] justify-center">
                <Lock className="w-3 h-3" />
                Secure checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
