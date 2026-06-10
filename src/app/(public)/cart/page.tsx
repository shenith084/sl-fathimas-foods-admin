"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Trash2, Plus, Minus, ShoppingBag, Tag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const storeUpdateQty = useCartStore((state) => state.updateQty);
  const storeRemoveItem = useCartStore((state) => state.removeItem);
  const storeGetTotal = useCartStore((state) => state.getCartTotal);

  const [coupon, setCoupon] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateQty = (id: string, vacuum: boolean, delta: number) => {
    const item = items.find((i) => i.id === id && i.vacuum === vacuum);
    if (item) {
      storeUpdateQty(id, vacuum, item.qty + delta);
    }
  };

  const removeItem = (id: string, vacuum: boolean) => {
    storeRemoveItem(id, vacuum);
  };

  const subtotal = storeGetTotal();
  const deliveryCharge = subtotal > 0 ? 450 : 0;
  const total = subtotal + deliveryCharge;

  if (!mounted) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="font-display font-bold text-[#222] text-2xl mb-3">Your cart is empty</h2>
          <p className="text-[#666] mb-8">Add some delicious homemade products to get started!</p>
          <Link
            href="/products"
            id="cart-shop-now-btn"
            className="inline-flex items-center gap-2 bg-[#D98C1F] hover:bg-[#B8740F] text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 shadow-md"
          >
            <ShoppingBag className="w-5 h-5" />
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-5 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-1.5 text-xs text-[#999] mb-2">
            <Link href="/" className="hover:text-[#D98C1F]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#444]">Shopping Cart</span>
          </nav>
          <h1 className="font-display font-bold text-[#222] text-2xl md:text-3xl">
            Shopping <span className="text-[#D98C1F]">Cart</span>
          </h1>
          <p className="text-[#666] text-sm mt-1">{items.length} items in your cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.id}-${item.vacuum}`} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4">
                {/* Image */}
                <div className="w-20 h-20 bg-gradient-to-br from-[#F4EFE6] to-[#FAF7F2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl">{item.emoji}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/products/${item.id}`} className="font-display font-semibold text-[#222] text-sm hover:text-[#D98C1F] transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.id, item.vacuum)}
                      aria-label="Remove item"
                      className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.vacuum && (
                    <span className="inline-block mt-1 text-[10px] bg-[#556B4F]/10 text-[#556B4F] px-2 py-0.5 rounded-full font-medium">
                      + Vacuum Packaging (+LKR 50)
                    </span>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    {/* Qty */}
                    <div className="flex items-center gap-2 bg-[#FAF7F2] rounded-lg p-0.5">
                      <button onClick={() => updateQty(item.id, item.vacuum, -1)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors">
                        <Minus className="w-3 h-3 text-[#555]" />
                      </button>
                      <span className="w-6 text-center font-semibold text-sm">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.vacuum, 1)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors">
                        <Plus className="w-3 h-3 text-[#555]" />
                      </button>
                    </div>
                    {/* Price */}
                    <span className="font-display font-bold text-[#D98C1F]">
                      LKR {((item.price + (item.vacuum ? 50 : 0)) * item.qty).toLocaleString()}.00
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue shopping */}
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#556B4F] hover:text-[#D98C1F] transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="font-display font-bold text-[#222] text-lg mb-5">Order Summary</h2>

              {/* Coupon */}
              <div className="flex gap-2 mb-5">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon code"
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] transition-colors"
                  />
                </div>
                <button className="bg-[#556B4F] hover:bg-[#3D5038] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                  Apply
                </button>
              </div>

              {/* Summary rows */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-[#666]">
                  <span>Subtotal</span>
                  <span>LKR {subtotal.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between text-sm text-[#666]">
                  <span>Delivery Charge</span>
                  <span>LKR {deliveryCharge.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between items-center text-xs text-[#999] bg-[#F4EFE6] rounded-lg px-3 py-2">
                  <span>🚚 Estimated delivery: ~5 days</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-display font-bold text-[#222]">
                  <span>Total</span>
                  <span className="text-[#D98C1F]">LKR {total.toLocaleString()}.00</span>
                </div>
              </div>

              <Link
                href="/checkout"
                id="cart-checkout-btn"
                className="block w-full text-center bg-[#D98C1F] hover:bg-[#B8740F] text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Proceed to Checkout →
              </Link>

              {/* Trust */}
              <div className="mt-5 text-center space-y-1">
                <p className="text-[#999] text-xs">🔒 Secure checkout</p>
                <p className="text-[#999] text-xs">✅ 100% Natural Ingredients</p>
                <p className="text-[#999] text-xs">☪️ Halal Certified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
