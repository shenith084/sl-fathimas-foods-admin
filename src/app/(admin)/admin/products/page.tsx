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

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

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

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;
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
      alert("Failed to seed products. Please check server logs.");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${products.length} products in catalog`}
        action={
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-[#D98C1F] hover:bg-[#B8740F] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        }
      />

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 flex items-center gap-3 px-4 py-3">
        <Search className="w-4 h-4 text-[#aaa]" />
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm text-[#444] outline-none bg-transparent placeholder:text-[#bbb]"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-xs text-[#aaa] hover:text-[#555]">Clear</button>
        )}
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Product</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Category</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Price</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Stock</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Status</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Badge</th>
                  <th className="text-right text-xs font-semibold text-[#999] px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{product.emoji}</span>
                        <div>
                          <p className="text-sm font-semibold text-[#222]">{product.name}</p>
                          <p className="text-xs text-[#aaa] font-mono">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs bg-[#F4EFE6] text-[#666] px-2.5 py-1 rounded-full capitalize">
                        {product.category.replace(/-/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-bold text-[#222]">
                      LKR {product.price.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#444]">{product.stock_count ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={product.availability || "in_stock"} />
                    </td>
                    <td className="px-5 py-3.5">
                      {product.badge ? (
                        <span className="text-xs bg-[#D98C1F]/10 text-[#D98C1F] px-2 py-0.5 rounded-full">{product.badge}</span>
                      ) : (
                        <span className="text-xs text-[#ccc]">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleting === product.id}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
