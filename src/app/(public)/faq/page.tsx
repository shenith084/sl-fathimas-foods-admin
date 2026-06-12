"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    category: "Delivery",
    id: "delivery",
    items: [
      {
        q: "How long does delivery take?",
        a: "We deliver island-wide via Domex courier. Delivery typically takes 3–5 business days from order confirmation.",
      },
      {
        q: "Do you deliver overseas?",
        a: "Yes! We offer vacuum-packed options suitable for overseas shipping. Please contact us to arrange overseas orders.",
      },
      {
        q: "What are the delivery charges?",
        a: "Delivery charges are calculated based on the total weight of your order. You'll see the exact charge at checkout before placing your order.",
      },
      {
        q: "Which courier do you use?",
        a: "We use Domex courier service for all island-wide deliveries. They provide reliable, tracked shipping.",
      },
    ],
  },
  {
    category: "Products & Ingredients",
    id: "products",
    items: [
      {
        q: "Are your products free from preservatives?",
        a: "Yes! All SL Fathima's Foods products are 100% free from artificial preservatives and artificial flavours. We only use natural ingredients.",
      },
      {
        q: "Are your products Halal certified?",
        a: "All our products are 100% Halal and hygienically prepared according to Halal standards.",
      },
      {
        q: "What is the shelf life of your products?",
        a: "Shelf life varies by product: pickles and sambals typically last 3–6 months when stored properly in a cool, dry place. Biriyani kits last up to 3 months. Check each product page for specific shelf life.",
      },
      {
        q: "How should I store the products?",
        a: "Store in a cool, dry place away from direct sunlight. Once opened, refrigerate and use within 2–3 weeks for best quality.",
      },
    ],
  },
  {
    category: "Orders & Payment",
    id: "orders",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We currently accept Cash on Delivery (COD) and Bank Transfer. Online payment gateway options are coming soon.",
      },
      {
        q: "Can I modify or cancel my order?",
        a: "You can modify or cancel your order within 24 hours of placing it by contacting us via WhatsApp. Once the order is dispatched, it cannot be cancelled.",
      },
      {
        q: "Do you do custom or bulk orders?",
        a: "Absolutely! We love creating custom gift packs and handling bulk orders for events, weddings, and corporate gifts. Contact us for custom order arrangements.",
      },
      {
        q: "What is the minimum order?",
        a: "There is no minimum order requirement. You can order as little as one item.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    id: "returns",
    items: [
      {
        q: "What is your return policy?",
        a: "If you receive a damaged or incorrect product, please contact us within 48 hours with photos and we will arrange a replacement or refund.",
      },
      {
        q: "What if my package is damaged during delivery?",
        a: "Please photograph the damaged package and contact us immediately via WhatsApp. We will resolve the issue as quickly as possible.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200 ${open ? "bg-white shadow-md" : "bg-white"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className={`font-semibold text-sm md:text-base transition-colors ${open ? "text-[#D98C1F]" : "text-[#222]"}`}>
          {q}
        </span>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 text-[#999] transition-transform duration-200 ${open ? "rotate-180 text-[#D98C1F]" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-[#666] text-sm leading-relaxed border-t border-gray-100 pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FAF7F2] to-[#F4EFE6] border-b border-gray-100 py-12 px-4 text-center">
        <span className="inline-block bg-[#D98C1F]/10 text-[#D98C1F] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          Help Centre
        </span>
        <h1 className="font-display font-bold text-[#222] text-3xl md:text-4xl mb-4">
          Frequently Asked <span className="text-[#D98C1F]">Questions</span>
        </h1>
        <p className="text-[#666] max-w-xl mx-auto">
          Find answers to common questions about our products, delivery, orders, and more.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Quick Links */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {faqs.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-[#555] hover:border-[#D98C1F] hover:text-[#D98C1F] transition-colors"
            >
              {section.category}
            </a>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-10">
          {faqs.map((section) => (
            <div key={section.id} id={section.id}>
              <h2 className="font-display font-bold text-[#222] text-xl mb-4">
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.items.map((item, i) => (
                  <FAQItem key={i} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 bg-[#2C4631] rounded-3xl p-8 text-center text-white">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="font-display font-bold text-xl mb-3">Still have questions?</h3>
          <p className="text-white/80 text-sm mb-6">
            Can&apos;t find what you&apos;re looking for? Chat with us directly on WhatsApp — we usually reply within minutes!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noopener noreferrer"
              id="faq-whatsapp-btn"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bb5a] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              WhatsApp Us
            </a>
            <Link
              href="/contact"
              id="faq-contact-btn"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Contact Form
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
