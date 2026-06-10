"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will be wired to API in Phase 6
    setSent(true);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FAF7F2] to-[#F4EFE6] border-b border-gray-100 py-12 px-4 text-center">
        <span className="inline-block bg-[#D98C1F]/10 text-[#D98C1F] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          Get in Touch
        </span>
        <h1 className="font-display font-bold text-[#222] text-3xl md:text-4xl mb-4">
          Contact <span className="text-[#D98C1F]">Us</span>
        </h1>
        <p className="text-[#666] max-w-lg mx-auto">
          Have a question, custom order request, or just want to say hello? We&apos;d love to hear from you!
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            {/* WhatsApp CTA */}
            <div className="bg-[#25D366] rounded-2xl p-5 text-white">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-display font-bold text-lg mb-1">Chat on WhatsApp</h3>
              <p className="text-white/80 text-sm mb-4">Fastest way to reach us — usually reply within minutes!</p>
              <a
                href="https://wa.me/94771234567"
                target="_blank"
                rel="noopener noreferrer"
                id="contact-whatsapp-btn"
                className="block text-center bg-white text-[#25D366] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                +94 77 123 4567
              </a>
            </div>

            {/* Info cards */}
            {[
              { icon: <Phone className="w-5 h-5" />, label: "Phone", value: "+94 77 123 4567" },
              { icon: <Mail className="w-5 h-5" />, label: "Email", value: "slfathimasfoods@gmail.com" },
              { icon: <MapPin className="w-5 h-5" />, label: "Location", value: "Sri Lanka" },
              { icon: <Clock className="w-5 h-5" />, label: "Response Time", value: "Within 24 hours" },
            ].map((info) => (
              <div key={info.label} className="bg-white rounded-2xl p-4 flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 bg-[#F4EFE6] rounded-xl flex items-center justify-center text-[#556B4F] flex-shrink-0">
                  {info.icon}
                </div>
                <div>
                  <p className="text-[#999] text-xs">{info.label}</p>
                  <p className="font-semibold text-[#222] text-sm mt-0.5">{info.value}</p>
                </div>
              </div>
            ))}

            {/* TikTok */}
            <div className="bg-[#1F1F1F] rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.07 8.07 0 004.77 1.54V6.78s-.51.03-.99-.09z"/>
                </svg>
              </div>
              <div>
                <p className="text-white/60 text-xs">TikTok</p>
                <a
                  href="https://www.tiktok.com/@sl.fathimas.products"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-semibold text-sm hover:text-[#D98C1F] transition-colors"
                >
                  @sl.fathimas.products
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="bg-white rounded-3xl p-10 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="text-6xl mb-5">✅</div>
                <h3 className="font-display font-bold text-[#222] text-2xl mb-3">Message Sent!</h3>
                <p className="text-[#666] max-w-md mx-auto mb-8">
                  Thank you for reaching out. We&apos;ll get back to you within 24 hours. For faster response, WhatsApp us!
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="bg-[#D98C1F] hover:bg-[#B8740F] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-5"
              >
                <h2 className="font-display font-bold text-[#222] text-xl mb-2">Send us a Message</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#444] mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#444] mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+94 77 000 0000"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#444] mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#444] mb-1.5">Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors text-[#444] bg-white"
                  >
                    <option value="">Select a subject</option>
                    <option>General Inquiry</option>
                    <option>Order Issue</option>
                    <option>Custom Order Request</option>
                    <option>Bulk/Wholesale Order</option>
                    <option>Delivery Question</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#444] mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help you..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  id="contact-submit-btn"
                  className="w-full flex items-center justify-center gap-2 bg-[#D98C1F] hover:bg-[#B8740F] text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
