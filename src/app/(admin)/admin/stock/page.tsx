"use client";

import { useEffect, useState } from "react";
import { Save, Box, Search, RotateCcw, Upload } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";

interface StockItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
  stock_count: number;
  availability: string;
}

export default function AdminStockPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  useEffect(() => {
    fetch("/api/v1/stock")
      .then((r) => r.json())
      .then((data) => { if (data.success) setItems(data.data); })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(item: StockItem) {
    const newCount = Number(edits[item.id] ?? item.stock_count);
    setSaving(item.id);
    try {
      await fetch("/api/v1/stock", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, stock_count: newCount }),
      });
      setItems((prev) =>
        prev.map((p) =>
          p.id === item.id
            ? { ...p, stock_count: newCount, availability: newCount > 0 ? "in_stock" : "out_of_stock" }
            : p
        )
      );
      const { [item.id]: _, ...rest } = edits;
      setEdits(rest);
    } finally {
      setSaving(null);
    }
  }

  const lowStock = items.filter((i) => i.stock_count > 0 && i.stock_count <= 5);
  const outOfStock = items.filter((i) => i.stock_count === 0);

  const categories = Array.from(new Set(items.map(i => i.category)));
  const filtered = items.filter((i) => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || i.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <PageHeader 
        title="Stock Management" 
        subtitle="Update inventory levels for all products."
      />

      {/* Alerts */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {outOfStock.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-700 font-semibold text-sm">{outOfStock.length} product(s) out of stock</p>
              <p className="text-red-500 text-xs mt-0.5">{outOfStock.map((i) => i.name).join(", ")}</p>
            </div>
          )}
          {lowStock.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-amber-700 font-semibold text-sm">{lowStock.length} product(s) low in stock</p>
              <p className="text-amber-500 text-xs mt-0.5">{lowStock.map((i) => i.name).join(", ")}</p>
            </div>
          )}
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex items-center gap-3 px-4 py-2.5 flex-1">
          <Search className="w-4 h-4 text-[#aaa]" />
          <input
            type="text"
            placeholder="Search stock by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm text-[#444] outline-none bg-transparent placeholder:text-[#bbb]"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-xs text-[#aaa] hover:text-[#555]">Clear</button>
          )}
        </div>
        
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
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {loading ? (
          <div className="flex items-center justify-center py-16 flex-1">
            <div className="w-8 h-8 border-2 border-[#E88E23] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 flex-1 flex flex-col items-center justify-center">
            <Box className="w-10 h-10 text-[#ccc] mx-auto mb-3" />
            <p className="text-[#888] text-sm">No products found. Add products first.</p>
          </div>
        ) : (
          <div className="overflow-x-auto flex flex-col flex-1">
            <table className="w-full flex-1">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-[#888] px-6 py-4">Product</th>
                  <th className="text-left text-xs font-semibold text-[#888] px-6 py-4">Category</th>
                  <th className="text-left text-xs font-semibold text-[#888] px-6 py-4">Status</th>
                  <th className="text-center text-xs font-semibold text-[#888] px-6 py-4">Current Stock</th>
                  <th className="text-center text-xs font-semibold text-[#888] px-6 py-4">Update Stock</th>
                  <th className="text-right text-xs font-semibold text-[#888] px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const isDirty = edits[item.id] !== undefined && edits[item.id] !== String(item.stock_count);
                  const currentValue = edits[item.id] ?? String(item.stock_count);
                  return (
                    <tr key={item.id} className={`border-b border-gray-50 transition-colors ${isDirty ? "bg-[#E88E23]/5" : "hover:bg-gray-50/50"}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-xl shadow-sm border border-[#E88E23]/20 flex-shrink-0">
                            {item.emoji}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#222]">{item.name}</p>
                            <p className="text-xs text-[#888] font-mono mt-0.5">{item.id.substring(0,8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold bg-[#FFF4E6] text-[#E88E23] px-3 py-1.5 rounded-full capitalize">
                          {item.category.replace(/-/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={item.availability || "in_stock"} />
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-[#444]">
                        {item.stock_count}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <input
                            type="number" min="0"
                            value={currentValue}
                            onChange={(e) => setEdits((prev) => ({ ...prev, [item.id]: e.target.value }))}
                            className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-[#E88E23] text-center"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleSave(item)}
                            disabled={!isDirty || saving === item.id}
                            className={`p-2 rounded-lg transition-colors ${isDirty ? "text-blue-500 hover:text-blue-600 hover:bg-blue-50" : "text-gray-300 cursor-not-allowed"}`}
                          >
                            {saving === item.id ? (
                              <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin block" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              const { [item.id]: _, ...rest } = edits;
                              setEdits(rest);
                            }}
                            disabled={!isDirty || saving === item.id}
                            className={`p-2 rounded-lg transition-colors ${isDirty ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100" : "text-gray-300 cursor-not-allowed"}`}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* Footer */}
            <div className="mt-auto px-6 py-4 border-t border-gray-100 bg-white rounded-b-2xl">
              <p className="text-xs font-medium text-[#888]">Showing {filtered.length} of {items.length} total products</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
