import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = { title: "Order Confirmed!" };

interface PageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderConfirmationPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.orderId || "SLF-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  return (
    <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#2C4631]/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-[#2C4631]" />
          </div>
        </div>

        <h1 className="font-display font-bold text-[#222] text-3xl md:text-4xl mb-3">
          Order Confirmed! 🎉
        </h1>
        <p className="text-[#666] text-lg mb-2">
          Thank you for your order!
        </p>
        <p className="text-[#999] text-sm mb-6">
          A confirmation email has been sent to your inbox.
        </p>

        {/* Order ID */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 inline-block w-full">
          <p className="text-[#999] text-xs mb-1">Your Order ID</p>
          <p className="font-display font-bold text-[#D98C1F] text-2xl">{orderId}</p>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 text-left">
          <h3 className="font-display font-semibold text-[#222] text-sm mb-4">What happens next?</h3>
          <div className="space-y-3">
            {[
              { icon: "📧", title: "Email Confirmation", desc: "You'll receive an order confirmation email shortly." },
              { icon: "👩‍🍳", title: "Preparing Your Order", desc: "Our team will start preparing your homemade products." },
              { icon: "📦", title: "Dispatched via Domex", desc: "Your order will be dispatched within 1–2 business days." },
              { icon: "🚚", title: "Delivered in ~5 Days", desc: "Sit tight — your order is on its way!" },
            ].map((step) => (
              <div key={step.title} className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{step.icon}</span>
                <div>
                  <p className="font-semibold text-[#222] text-sm">{step.title}</p>
                  <p className="text-[#666] text-xs">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp follow-up */}
        <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-4 mb-6 text-sm">
          <p className="text-[#1a9e4e] font-medium">
            📱 Have questions about your order? WhatsApp us anytime!
          </p>
          <a
            href="https://wa.me/94771234567"
            target="_blank"
            rel="noopener noreferrer"
            id="order-confirm-whatsapp-btn"
            className="inline-block mt-2 text-[#1a9e4e] font-bold underline underline-offset-2"
          >
            +94 77 123 4567
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/products"
            id="order-confirm-continue-shopping"
            className="flex-1 border-2 border-[#2C4631] text-[#2C4631] hover:bg-[#2C4631] hover:text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex-1 bg-[#D98C1F] hover:bg-[#B8740F] text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 text-center shadow-md"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
