"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { AdminCategory } from "@/lib/services/categoryService";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function loadCategories() {
    try {
      const res = await fetch("/api/v1/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    
    setDeleting(id);
    try {
      const res = await fetch(`/api/v1/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await loadCategories();
      } else {
        alert(data.message || "Failed to delete category");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete category");
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-3 border-[#D98C1F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#222]">Categories</h2>
          <p className="text-sm text-[#666]">{categories.length} categories configured</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 bg-[#D98C1F] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#c27c1b] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Emoji</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Slug (ID)</th>
                <th className="px-6 py-4">Sort Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <p>No categories found.</p>
                    <Link href="/admin/categories/new" className="text-[#D98C1F] hover:underline mt-2 inline-block">
                      Add your first category
                    </Link>
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-2xl">{cat.emoji}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{cat.id}</td>
                    <td className="px-6 py-4 text-gray-500">{cat.sort_order || 0}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/admin/categories/${cat.id}/edit`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        disabled={deleting === cat.id}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
