"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { categories } from "@/lib/mockData";

const EMOJIS = ["🍛", "🍚", "🌶️", "🥒", "🫙", "🐠", "🥩", "🎁", "✨", "🦐", "🦀", "🐟", "🌸", "🎀"];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", category: "", price: "", weight: "", shelfLife: "",
    ingredients: "", description: "", emoji: "🍛", badge: "",
    stock_count: "10", availability: "in_stock", customizable: false,
  });

  const update = (field: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.category || !form.price) {
      alert("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/v1/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock_count: Number(form.stock_count),
          badge: form.badge || null,
          slug: form.slug || generateSlug(form.name),
          rating: 5.0,
          reviews: 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/products");
      } else {
        alert("Failed to create product: " + data.message);
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="text-[#888] hover:text-[#444] transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <PageHeader title="Add New Product" subtitle="Fill in the details to add a product to your catalog" />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-[#222] mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Product Name *</label>
                  <input
                    required value={form.name}
                    onChange={(e) => { update("name", e.target.value); update("slug", generateSlug(e.target.value)); }}
                    placeholder="e.g. Chicken Sambal 250g"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">URL Slug</label>
                  <input
                    value={form.slug}
                    onChange={(e) => update("slug", e.target.value)}
                    placeholder="auto-generated"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Category *</label>
                  <select
                    required value={form.category}
                    onChange={(e) => update("category", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors bg-white"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Emoji</label>
                  <select
                    value={form.emoji}
                    onChange={(e) => update("emoji", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] bg-white"
                  >
                    {EMOJIS.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Description</label>
                <textarea
                  rows={4} value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Describe the product in detail..."
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Ingredients</label>
                <textarea
                  rows={2} value={form.ingredients}
                  onChange={(e) => update("ingredients", e.target.value)}
                  placeholder="Comma-separated ingredient list"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Pricing, Stock */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-[#222] mb-4">Pricing & Details</h3>
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Price (LKR) *</label>
                <input
                  required type="number" min="0" value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  placeholder="1250"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Weight</label>
                <input
                  value={form.weight} onChange={(e) => update("weight", e.target.value)}
                  placeholder="e.g. 250g"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Shelf Life</label>
                <input
                  value={form.shelfLife} onChange={(e) => update("shelfLife", e.target.value)}
                  placeholder="e.g. 4 months"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Badge (optional)</label>
                <select
                  value={form.badge} onChange={(e) => update("badge", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] bg-white"
                >
                  <option value="">None</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="New">New</option>
                  <option value="Popular">Popular</option>
                  <option value="Limited">Limited</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-[#222] mb-4">Inventory</h3>
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Stock Count</label>
                <input
                  type="number" min="0" value={form.stock_count}
                  onChange={(e) => update("stock_count", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Availability</label>
                <select
                  value={form.availability}
                  onChange={(e) => update("availability", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] bg-white"
                >
                  <option value="in_stock">In Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="pre_order">Pre-Order</option>
                </select>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.customizable}
                  onChange={(e) => update("customizable", e.target.checked)}
                  className="w-4 h-4 rounded accent-[#D98C1F]"
                />
                <span className="text-sm text-[#555]">Allow vacuum packaging (+LKR 50)</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#D98C1F] hover:bg-[#B8740F] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-sm disabled:bg-gray-300"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Save className="w-4 h-4" /> Create Product</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
