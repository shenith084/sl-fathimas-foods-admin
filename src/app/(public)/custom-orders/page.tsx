"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

const products = [
  "Biriyani Combo Kit", "Ghee Rice Combo Kit", "Chicken Sambal", "Beef Sambal",
  "Dry Fish Sambal", "Kooni Sambal", "Chicken Pickle", "Beef Pickle",
  "Prawns Pickle", "Seenima", "Gift Pack (Custom)", "Other",
];

export default function CustomOrdersPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", occasion: "",
    products: [] as string[], quantity: "", notes: "", budget: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const toggleProduct = (p: string) => {
    setForm((f) => ({
      ...f,
      products: f.products.includes(p) ? f.products.filter((x) => x !== p) : [...f.products, p],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-[#556B4F] mx-auto mb-5" />
          <h2 className="font-display font-bold text-[#222] text-2xl mb-3">Request Received! 🎉</h2>
          <p className="text-[#666] mb-6">
            Thank you for your custom order request. We&apos;ll review your requirements and get back to you within 24 hours via WhatsApp or email.
          </p>
          <a href="https://wa.me/94771234567" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-[#20bb5a] transition-colors">
            Chat on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FAF7F2] to-[#F4EFE6] border-b border-gray-100 py-12 px-4 text-center">
        <span className="inline-block bg-[#D98C1F]/10 text-[#D98C1F] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">✨ Special Orders</span>
        <h1 className="font-display font-bold text-[#222] text-3xl md:text-4xl mb-4">
          Custom Orders & <span className="text-[#D98C1F]">Gift Packs</span>
        </h1>
        <p className="text-[#666] max-w-lg mx-auto">
          Looking for something special? We create customised gift packs and bulk orders for any occasion — weddings, Eid, corporate events, and more.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
          <h2 className="font-display font-bold text-[#222] text-xl">Tell us what you need</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#444] mb-1.5">Full Name *</label>
              <input type="text" required placeholder="Your name" value={form.name} onChange={(e) => update("name", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#444] mb-1.5">Phone / WhatsApp *</label>
              <input type="tel" required placeholder="+94 77 000 0000" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#444] mb-1.5">Email Address *</label>
            <input type="email" required placeholder="your@email.com" value={form.email} onChange={(e) => update("email", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#444] mb-1.5">Occasion</label>
            <select value={form.occasion} onChange={(e) => update("occasion", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors bg-white text-[#444]">
              <option value="">Select occasion</option>
              {["Eid / Festival", "Wedding", "Birthday", "Corporate Gift", "Bulk Order", "Overseas Shipping", "Other"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#444] mb-2">Products Interested In</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {products.map((p) => (
                <button type="button" key={p} onClick={() => toggleProduct(p)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-150 ${
                    form.products.includes(p) ? "bg-[#556B4F] text-white border-[#556B4F]" : "bg-white border-gray-200 text-[#555] hover:border-[#556B4F]"
                  }`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#444] mb-1.5">Quantity / Packs</label>
              <input type="text" placeholder="e.g. 10 packs" value={form.quantity} onChange={(e) => update("quantity", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#444] mb-1.5">Budget (LKR)</label>
              <input type="text" placeholder="e.g. 10,000" value={form.budget} onChange={(e) => update("budget", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#444] mb-1.5">Additional Notes</label>
            <textarea rows={4} placeholder="Any specific requirements, packaging preferences, delivery date, etc."
              value={form.notes} onChange={(e) => update("notes", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors resize-none" />
          </div>

          <button type="submit" id="custom-order-submit-btn"
            className="w-full flex items-center justify-center gap-2 bg-[#D98C1F] hover:bg-[#B8740F] text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-md">
            <Send className="w-4 h-4" />
            Submit Custom Order Request
          </button>
        </form>
      </div>
    </div>
  );
}
