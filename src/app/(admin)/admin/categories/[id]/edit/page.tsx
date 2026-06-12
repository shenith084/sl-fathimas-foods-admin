"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    emoji: "📦",
    sort_order: 0,
  });

  useEffect(() => {
    async function loadCategory() {
      try {
        const res = await fetch(`/api/v1/categories/${params.id}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setFormData({
            name: data.data.name || "",
            id: data.data.id || "",
            emoji: data.data.emoji || "📦",
            sort_order: data.data.sort_order || 0,
          });
        } else {
          alert("Category not found");
          router.push("/admin/categories");
        }
      } catch (err) {
        console.error("Failed to load category", err);
      } finally {
        setFetching(false);
      }
    }
    loadCategory();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/v1/categories/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin/categories");
        router.refresh();
      } else {
        alert(data.message || "Failed to update category");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-3 border-[#D98C1F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <h2 className="text-2xl font-bold text-[#222]">Edit Category: {formData.name}</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D98C1F]/20 focus:border-[#D98C1F] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug (ID)</label>
              <input
                type="text"
                disabled
                value={formData.id}
                className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Slug cannot be changed after creation.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
                <input
                  type="text"
                  required
                  value={formData.emoji}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D98C1F]/20 focus:border-[#D98C1F] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  required
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D98C1F]/20 focus:border-[#D98C1F] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#D98C1F] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#c27c1b] transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
