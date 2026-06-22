"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { categories } from "@/lib/mockData";
import toast from "react-hot-toast";

const EMOJIS = ["🍛", "🍚", "🌶️", "🥒", "🫙", "🐠", "🥩", "🎁", "✨", "🦐", "🦀", "🐟", "🌸", "🎀"];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", category: "", price: "", weight: "", shelfLife: "",
    ingredients: "", description: "", emoji: "🍛", badge: "",
    stock_count: "10", availability: "in_stock", customizable: false,
    seoTitle: "", seoDescription: "",
    imageFiles: [] as File[],
  });

  const update = (field: string, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.category || !form.price) {
      toast.error("Please fill in all required fields");
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
          seoTitle: form.seoTitle || null,
          seoDescription: form.seoDescription || null,
          rating: 5.0,
          reviews: 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const productId = data.data.id;
        
        // Upload Images to Cloudinary via API Route
        const imageFiles = form.imageFiles as File[] | undefined;
        if (imageFiles && imageFiles.length > 0) {
          const uploadPromises = imageFiles.map(async (file, i) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("productId", productId);
            formData.append("index", String(i));

            const uploadRes = await fetch("/api/v1/upload", {
              method: "POST",
              body: formData,
            });
            const result = await uploadRes.json();
            if (!result.success) throw new Error(result.message);
            return result.url as string;
          });

          try {
            const imageUrls = await Promise.all(uploadPromises);
            
            // Update product with the uploaded image URLs
            await fetch(`/api/v1/products/${productId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ images: imageUrls }),
            });
          } catch (uploadError) {
            console.error("Image upload failed:", uploadError);
            toast.error("Product created, but some images failed to upload.");
          }
        }
        
        toast.success("Product created successfully!");
        router.push("/admin/products");
      } else {
        toast.error("Failed to create product: " + data.message);
      }
    } catch {
      toast.error("Network error. Please try again.");
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
                    {categories.flatMap((c) => [
                      <option key={c.id} value={c.id} className="font-semibold">{c.name}</option>,
                      ...(c.subCategories || []).map((sc) => (
                        <option key={sc.id} value={sc.id}>— {sc.name}</option>
                      ))
                    ])}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Product Images (Max 3)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D98C1F]/10 file:text-[#D98C1F] hover:file:bg-[#D98C1F]/20 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files) {
                        const currentPendingCount = (form as any).imageFiles?.length || 0;
                        const availableSlots = 3 - currentPendingCount;
                        if (availableSlots > 0) {
                          const newFiles = Array.from(e.target.files).slice(0, availableSlots);
                          update("imageFiles", [...((form as any).imageFiles || []), ...newFiles]);
                        }
                        e.target.value = "";
                      }
                    }}
                  />
                  <p className="text-xs text-gray-400 mt-2">Select 1 to 3 images from your device. They will be uploaded when you click Create.</p>
                </div>
                {(form as any).imageFiles && ((form as any).imageFiles as File[]).length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {((form as any).imageFiles as File[]).map((f, i) => (
                      <div key={i} className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200 group">
                        <img src={URL.createObjectURL(f)} className="object-cover w-full h-full" alt="preview" />
                        <button
                          type="button"
                          onClick={() => {
                            const newPending = ((form as any).imageFiles as File[]).filter((_, idx) => idx !== i);
                            update("imageFiles", newPending);
                          }}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="text-white text-xs font-bold bg-red-600 px-2 py-1 rounded">Remove</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
            <h3 className="font-semibold text-[#222] mb-4">SEO Settings (Optional)</h3>
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">SEO Title</label>
                <input
                  value={form.seoTitle}
                  onChange={(e) => update("seoTitle", e.target.value)}
                  placeholder="e.g. Buy Premium Prawn Pickle Online"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">SEO Description</label>
                <textarea
                  rows={3}
                  value={form.seoDescription}
                  onChange={(e) => update("seoDescription", e.target.value)}
                  placeholder="Short, punchy description for Google Search results..."
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20 transition-colors resize-none"
                />
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
