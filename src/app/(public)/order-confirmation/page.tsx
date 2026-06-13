import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import OrderPixelTracker from "@/components/analytics/OrderPixelTracker";

export const metadata: Metadata = { title: "Order Confirmed!" };

interface PageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderConfirmationPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.orderId || "SLF-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-16 px-4">
      <OrderPixelTracker orderId={orderId} total={4800} />
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full border-2 border-green-500 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-display font-bold text-[#222] text-4xl mb-4">
          Thank You!
        </h1>
        <p className="text-[#222] font-medium mb-8">
          Your order has been placed successfully.
        </p>

        {/* Order Number Box */}
        <div className="bg-[#EDF2EC] rounded-2xl py-6 px-12 text-center w-full max-w-md mb-8">
          <p className="text-[#222] font-semibold mb-2">Order Number</p>
          <p className="font-display font-bold text-[#2C4631] text-4xl">{orderId}</p>
        </div>

        <p className="text-[#555] text-center mb-2">
          We have received your order and it is now being processed.
        </p>
        <p className="text-[#555] text-center mb-12">
          You will receive a confirmation email and WhatsApp message shortly.
        </p>

        {/* Two Columns: Order Summary & What's Next */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-16">
          {/* Order Summary */}
          <div className="bg-[#FAF7F2] rounded-2xl border border-[#EBE5D9] p-8">
            <h3 className="font-display font-bold text-[#222] text-lg mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-[13px] text-[#555]">
                <span className="w-48">Biriyani Combo Kit</span>
                <span>x 1</span>
                <span>LKR 1,400.00</span>
              </div>
              <div className="flex justify-between items-center text-[13px] text-[#555]">
                <span className="w-48">Chicken Pickles 150g</span>
                <span>x 1</span>
                <span>LKR 700.00</span>
              </div>
              <div className="flex justify-between items-center text-[13px] text-[#555]">
                <span className="w-48">Chicken Sambal</span>
                <span>x 1</span>
                <span>LKR 1,150.00</span>
              </div>
              <div className="flex justify-between items-center text-[13px] text-[#555]">
                <span className="w-48">Dry Fish Sambal</span>
                <span>x 1</span>
                <span>LKR 1,250.00</span>
              </div>
            </div>

            <div className="border-t border-gray-200/60 pt-6 space-y-4 mb-6">
              <div className="flex justify-between text-[13px] text-[#555]">
                <span>Subtotal</span>
                <span>LKR 4,500.00</span>
              </div>
              <div className="flex justify-between text-[13px] text-[#555]">
                <span>Delivery Fee</span>
                <span>LKR 300.00</span>
              </div>
            </div>

            <div className="border-t border-gray-200/60 pt-6 flex justify-between items-center">
              <span className="font-display font-bold text-[#222] text-xl">Total</span>
              <span className="font-bold text-[#D98C1F] text-xl">LKR 4,800.00</span>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-[#FAF7F2] rounded-2xl border border-[#EBE5D9] p-8">
            <h3 className="font-display font-bold text-[#222] text-lg mb-8">What's Next?</h3>
            
            <div className="space-y-8 relative">
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200/60 z-0"></div>

              <div className="flex gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border-2 border-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="pt-1.5">
                  <h4 className="font-bold text-[#222] text-[15px]">Order Confirmed</h4>
                  <p className="text-[#666] text-[13px] mt-1">We have received your order.</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10 opacity-70">
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🍲</span>
                </div>
                <div className="pt-1.5">
                  <h4 className="font-bold text-[#222] text-[15px]">Preparing Your Order</h4>
                  <p className="text-[#666] text-[13px] mt-1">We are preparing your delicious items.</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10 opacity-70">
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🚚</span>
                </div>
                <div className="pt-1.5">
                  <h4 className="font-bold text-[#222] text-[15px]">Out for Delivery</h4>
                  <p className="text-[#666] text-[13px] mt-1">Your order is on the way.</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10 opacity-70">
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📦</span>
                </div>
                <div className="pt-1.5">
                  <h4 className="font-bold text-[#222] text-[15px]">Delivered</h4>
                  <p className="text-[#666] text-[13px] mt-1">Enjoy your homemade goodness!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Need Help Section */}
        <h3 className="font-display font-bold text-[#222] text-[17px] mb-2">Need Help?</h3>
        <p className="text-[#555] text-[15px] mb-8">If you have any questions about your order, please contact us.</p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full max-w-lg">
          <Link
            href="/account/orders"
            className="flex-1 bg-[#4A5D4E] hover:bg-[#3A4A3E] text-white font-bold py-3.5 rounded-md transition-colors text-center flex items-center justify-center gap-2 text-[13px] tracking-wide"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            VIEW MY ORDERS
          </Link>
          <Link
            href="/products"
            className="flex-1 bg-[#FAF7F2] border border-[#222] text-[#222] hover:bg-gray-50 font-bold py-3.5 rounded-md transition-colors text-center flex items-center justify-center gap-2 text-[13px] tracking-wide"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            CONTINUE SHOPPING
          </Link>
        </div>

        {/* Bottom Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full border-t border-gray-200/60 pt-10">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="text-gray-600">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-[#222] text-[11px] uppercase tracking-wider mb-1">Fast Processing</h4>
              <p className="text-[12px] text-[#666]">Quick & Reliable</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="text-gray-600">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-[#222] text-[11px] uppercase tracking-wider mb-1">Secure Packaging</h4>
              <p className="text-[12px] text-[#666]">Safe & Hygienic</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="text-gray-600">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-[#222] text-[11px] uppercase tracking-wider mb-1">Inlandwide Delivery</h4>
              <p className="text-[12px] text-[#666]">Across Sri Lanka</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="text-gray-600">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-[#222] text-[11px] uppercase tracking-wider mb-1">100% Satisfaction</h4>
              <p className="text-[12px] text-[#666]">Quality Guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
