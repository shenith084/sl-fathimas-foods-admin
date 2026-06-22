"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  stock_count: number;
  availability: string;
  badge: string | null;
  emoji: string;
}

import { writeBatch, doc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { products as mockProducts } from "@/lib/mockData";
import toast from "react-hot-toast";
import { useConfirmStore } from "@/lib/store/confirmStore";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const { showConfirm } = useConfirmStore();

  async function loadProducts() {
    try {
      const res = await fetch("/api/v1/products");
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch {
      // fallback: show empty
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProducts(); }, []);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  async function handleDelete(id: string, name: string) {
    const confirmed = await showConfirm("Delete Product", `Delete "${name}"? This action cannot be undone.`);
    if (!confirmed) return;
    setDeleting(id);
    try {
      await fetch(`/api/v1/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  async function handleSeed() {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed");
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to seed via API");
      }
      
      await loadProducts();
    } catch (err) {
      console.error("Failed to seed products", err);
      toast.error("Failed to seed products. Please check server logs.");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage all your products in one place."
        action={
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-[#E88E23] hover:bg-[#d47b1c] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        }
      />

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.querySelector('input');
            if (input) input.blur();
          }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm flex items-center gap-3 px-4 py-2.5 flex-1"
        >
          <Search className="w-4 h-4 text-[#aaa]" />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm text-[#444] outline-none bg-transparent placeholder:text-[#bbb]"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="text-xs text-[#aaa] hover:text-[#555]">Clear</button>
          )}
        </form>
        
        <div className="flex gap-4">
          <select 
            className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-2.5 text-sm font-medium text-[#444] outline-none cursor-pointer min-w-[160px] appearance-none relative capitalize"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All Categories">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.replace(/-/g, " ")}</option>
            ))}
          </select>
          <select className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-2.5 text-sm font-medium text-[#444] outline-none cursor-pointer min-w-[160px] appearance-none">
            <option>All Status</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#D98C1F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-10 h-10 text-[#ccc] mx-auto mb-3" />
            <p className="text-[#888] text-sm mb-4">No products found in the database.</p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/admin/products/new" className="text-[#D98C1F] text-sm font-medium hover:underline inline-block">
                Add your first product
              </Link>
              <span className="text-gray-300">or</span>
              <button 
                onClick={handleSeed}
                disabled={seeding}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {seeding ? "Loading Demo Data..." : "Load Demo Products"}
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto flex flex-col min-h-[500px]">
            <table className="w-full flex-1">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-[#888] px-6 py-4">Product</th>
                  <th className="text-left text-xs font-semibold text-[#888] px-6 py-4">Category</th>
                  <th className="text-left text-xs font-semibold text-[#888] px-6 py-4">Price</th>
                  <th className="text-left text-xs font-semibold text-[#888] px-6 py-4">Status</th>
                  <th className="text-left text-xs font-semibold text-[#888] px-6 py-4">Badge</th>
                  <th className="text-right text-xs font-semibold text-[#888] px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-xl shadow-sm border border-[#E88E23]/20 flex-shrink-0">
                          {product.emoji}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#222]">{product.name}</p>
                          <p className="text-xs text-[#888] font-mono mt-0.5">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold bg-[#FFF4E6] text-[#E88E23] px-3 py-1.5 rounded-full capitalize">
                        {product.category.replace(/-/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-[#444]">
                      LKR {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={product.availability || "in_stock"} />
                    </td>
                    <td className="px-6 py-4">
                      {product.badge ? (
                        <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full capitalize ${
                          product.badge.toLowerCase() === 'bestseller' ? 'bg-[#FFF4E6] text-[#E88E23]' :
                          product.badge.toLowerCase() === 'popular' ? 'bg-blue-50 text-blue-500' :
                          product.badge.toLowerCase() === 'new' ? 'bg-emerald-50 text-emerald-500' :
                          'bg-gray-50 text-gray-500'
                        }`}>
                          {product.badge}
                        </span>
                      ) : (
                        <span className="text-xs text-[#ccc]">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-blue-500 hover:text-blue-600 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleting === product.id}
                          className="text-red-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div className="mt-auto px-6 py-4 border-t border-gray-100 bg-white rounded-b-2xl">
              <p className="text-xs font-medium text-[#888]">Showing {filtered.length} of {products.length} total products</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
