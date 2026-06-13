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
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    fetch("/api/v1/settings")
      .then(res => res.json())
      .then(data => { if (data.success) setSettings(data.data); })
      .catch(err => console.error("Failed to fetch settings", err));
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
  const deliveryCharge = subtotal > 0 ? (settings?.deliveryCharge ?? 450) : 0;
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
    <div className="bg-[#FAF7F2] min-h-screen pb-20">
      {/* Header */}
      <div className="pt-12 pb-8 px-4 max-w-6xl mx-auto">
        <nav className="flex items-center gap-2 text-[13px] text-[#888] font-medium mb-4">
          <Link href="/" className="hover:text-[#D98C1F] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#222]">Cart</span>
        </nav>
        <h1 className="font-display font-bold text-[#222] text-4xl mb-2">
          Your Cart
        </h1>
        <p className="text-[#555] text-sm">Review your selected items before checkout.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-gray-100 text-[13px] font-bold text-[#222]">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-center">Total</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-50">
            {items.map((item) => {
              const itemPrice = item.price + (item.vacuum ? 50 : 0);
              const itemTotal = itemPrice * item.qty;
              return (
                <div key={`${item.id}-${item.vacuum}`} className="grid grid-cols-12 gap-4 px-8 py-6 items-center hover:bg-gray-50/50 transition-colors">
                  {/* Product Info */}
                  <div className="col-span-6 flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#F4EFE6] to-[#FAF7F2] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100 overflow-hidden">
                      <span className="text-4xl drop-shadow-sm select-none">{item.emoji}</span>
                    </div>
                    <div>
                      <Link href={`/products/${item.id}`} className="font-display font-bold text-[#222] text-[15px] hover:text-[#D98C1F] transition-colors line-clamp-2 leading-snug">
                        {item.name}
                      </Link>
                      {item.vacuum && (
                        <span className="inline-block mt-1.5 text-[10px] bg-[#2C4631]/10 text-[#2C4631] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider">
                          + Vacuum Packaging
                        </span>
                      )}
                      {item.description && (
                        <div className="mt-2 text-xs text-[#666] whitespace-pre-line border-l-2 border-[#D98C1F]/30 pl-2">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-center font-semibold text-[#222] text-[13px]">
                    LKR {itemPrice.toLocaleString()}.00
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 flex justify-center">
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl p-0.5 w-[100px]">
                      <button onClick={() => updateQty(item.id, item.vacuum, -1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#222] transition-colors rounded-lg font-bold text-lg">
                        −
                      </button>
                      <span className="flex-1 text-center font-bold text-[#222] text-[13px]">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.vacuum, 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#222] transition-colors rounded-lg font-bold text-lg">
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total & Remove */}
                  <div className="col-span-2 flex items-center justify-between pl-4">
                    <span className="font-bold text-[#222] text-[13px]">
                      LKR {itemTotal.toLocaleString()}.00
                    </span>
                    <button
                      onClick={() => removeItem(item.id, item.vacuum)}
                      aria-label="Remove item"
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all bg-white"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Coupon & Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Coupon */}
          <div className="space-y-6">
            <div className="bg-[#FAF7F2] rounded-3xl p-8 border border-[#EBE5D9]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-[#E8F2EA] rounded-xl flex items-center justify-center text-[#2C4631]">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-[#222] text-[15px]">Have a coupon?</h3>
                  <p className="text-[#666] text-[13px]">Enter your coupon code</p>
                </div>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium focus:outline-none focus:border-[#2C4631] transition-colors bg-white shadow-sm"
                />
                <button className="bg-[#2C4631] hover:bg-[#1E3322] text-white text-[13px] font-bold px-8 py-3 rounded-xl transition-colors shadow-sm tracking-wide">
                  APPLY
                </button>
              </div>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-[#222] font-bold text-[13px] px-6 py-3.5 rounded-xl transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180 text-gray-500" />
              CONTINUE SHOPPING
            </Link>
          </div>

          {/* Right: Order Summary */}
          <div className="bg-[#FAF7F2] rounded-3xl p-8 border border-[#EBE5D9]">
            <h2 className="font-display font-bold text-[#222] text-xl mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-[13px] font-medium text-[#555]">
                <span>Subtotal ({items.reduce((acc, i) => acc + i.qty, 0)} items)</span>
                <span className="text-[#222] font-semibold">LKR {subtotal.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-[13px] font-medium text-[#555]">
                <span>Delivery Fee</span>
                <span className="text-[#222] font-semibold">LKR {deliveryCharge.toLocaleString()}.00</span>
              </div>
            </div>

            <div className="border-t border-gray-200/60 pt-5 pb-6 flex justify-between items-center font-display">
              <span className="font-bold text-[#222] text-xl">Total</span>
              <span className="font-bold text-[#D98C1F] text-2xl">LKR {total.toLocaleString()}.00</span>
            </div>

            <Link
              href="/checkout"
              id="cart-checkout-btn"
              className="flex items-center justify-center gap-3 w-full bg-[#D98C1F] hover:bg-[#B8740F] text-white font-bold py-4 rounded-xl transition-colors shadow-md text-[13px] tracking-wide"
            >
              PROCEED TO CHECKOUT
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-gray-200/60">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-[#222]">Secure Checkout</h4>
                  <p className="text-[9px] text-[#888]">100% Safe & Secure</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-[#222]">100% Homemade</h4>
                  <p className="text-[9px] text-[#888]">Premium Quality</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-[#222]">Islandwide Delivery</h4>
                  <p className="text-[9px] text-[#888]">Across Sri Lanka</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
