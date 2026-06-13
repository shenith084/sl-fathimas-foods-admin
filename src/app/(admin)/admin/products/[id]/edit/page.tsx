"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { categories } from "@/lib/mockData";

const EMOJIS = ["🍛", "🍚", "🌶️", "🥒", "🫙", "🐠", "🥩", "🎁", "✨", "🦐", "🦀", "🐟", "🌸", "🎀"];

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    name: "", slug: "", category: "", price: "", weight: "", shelfLife: "",
    ingredients: "", description: "", emoji: "🍛", badge: "",
    stock_count: "10", availability: "in_stock", customizable: false,
    images: [] as string[],
    imageFiles: [] as File[],
  });

  useEffect(() => {
    fetch(`/api/v1/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const p = data.data;
          setForm((prev) => ({
            ...prev,
            name: p.name || "",
            slug: p.slug || "",
            category: p.category || "",
            price: String(p.price || ""),
            weight: p.weight || "",
            shelfLife: p.shelfLife || "",
            ingredients: p.ingredients || "",
            description: p.description || "",
            emoji: p.emoji || "🍛",
            images: p.images || [],
            imageFiles: [],
            badge: p.badge || "",
            stock_count: String(p.stock_count ?? 0),
            availability: p.availability || "in_stock",
            customizable: p.customizable || false,
          }));
        }
      })
      .finally(() => setFetching(false));
  }, [id]);

  const update = (field: string, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImages = (form as any).images;
      
      // Upload Images to Cloudinary if new files are selected
      const imageFiles = (form as any).imageFiles as File[] | undefined;
      if (imageFiles && imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(async (file, i) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("productId", id as string);
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
          const newImages = await Promise.all(uploadPromises);
          finalImages = [...finalImages, ...newImages];
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          alert("Some images failed to upload. Please try again.");
          setLoading(false);
          return;
        }
      }

      const res = await fetch(`/api/v1/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          images: finalImages,
          price: Number(form.price),
          stock_count: Number(form.stock_count),
          badge: form.badge || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/products");
      } else {
        alert("Failed to update product");
      }
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#D98C1F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="text-[#888] hover:text-[#444] transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <PageHeader title="Edit Product" subtitle={`Editing: ${form.name}`} />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-[#222] mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Product Name *</label>
                  <input
                    required value={form.name} onChange={(e) => update("name", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-2 focus:ring-[#D98C1F]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">URL Slug</label>
                  <input
                    value={form.slug} onChange={(e) => update("slug", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] font-mono text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Category *</label>
                  <select
                    required value={form.category} onChange={(e) => update("category", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] bg-white"
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
                        const currentUploadedCount = (form as any).images?.length || 0;
                        const currentPendingCount = (form as any).imageFiles?.length || 0;
                        const availableSlots = 3 - currentUploadedCount - currentPendingCount;
                        if (availableSlots > 0) {
                          const newFiles = Array.from(e.target.files).slice(0, availableSlots);
                          update("imageFiles", [...((form as any).imageFiles || []), ...newFiles]);
                        }
                        // Reset input so the same file could be selected again if removed
                        e.target.value = "";
                      }
                    }}
                  />
                  <p className="text-xs text-gray-400 mt-2">Add up to 3 images total.</p>
                </div>

                {/* Show existing images with delete option */}
                {(form as any).images && ((form as any).images as string[]).length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {((form as any).images as string[]).map((url, i) => (
                      <div key={`exist-${i}`} className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200 group">
                        <img src={url} className="object-cover w-full h-full" alt="current" />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = ((form as any).images as string[]).filter((_, idx) => idx !== i);
                            update("images", newImages);
                          }}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="text-white text-xs font-bold bg-red-600 px-2 py-1 rounded">Delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Show new selected files preview */}
                {(form as any).imageFiles && ((form as any).imageFiles as File[]).length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    <p className="text-xs text-gray-500 w-full mb-1">New images to be added:</p>
                    {((form as any).imageFiles as File[]).map((f, i) => (
                      <div key={`new-${i}`} className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200 group">
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
                  rows={4} value={form.description} onChange={(e) => update("description", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Ingredients</label>
                <textarea
                  rows={2} value={form.ingredients} onChange={(e) => update("ingredients", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-[#222] mb-4">Pricing & Details</h3>
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Price (LKR) *</label>
                <input
                  required type="number" min="0" value={form.price} onChange={(e) => update("price", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Weight</label>
                <input
                  value={form.weight} onChange={(e) => update("weight", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Shelf Life</label>
                <input
                  value={form.shelfLife} onChange={(e) => update("shelfLife", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Badge</label>
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
                  type="number" min="0" value={form.stock_count} onChange={(e) => update("stock_count", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555] mb-1.5">Availability</label>
                <select
                  value={form.availability} onChange={(e) => update("availability", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#D98C1F] bg-white"
                >
                  <option value="in_stock">In Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="pre_order">Pre-Order</option>
                </select>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox" checked={form.customizable}
                  onChange={(e) => update("customizable", e.target.checked)}
                  className="w-4 h-4 rounded accent-[#D98C1F]"
                />
                <span className="text-sm text-[#555]">Allow vacuum packaging</span>
              </label>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#D98C1F] hover:bg-[#B8740F] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-sm disabled:bg-gray-300"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
