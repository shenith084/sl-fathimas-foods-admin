"use client";

import { useEffect, useState } from "react";
import { Save, Box } from "lucide-react";
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

  return (
    <div>
      <PageHeader title="Stock Management" subtitle="Update inventory levels for all products" />

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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#D98C1F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <Box className="w-10 h-10 text-[#ccc] mx-auto mb-3" />
            <p className="text-[#888] text-sm">No products found. Add products first.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Product</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Category</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Status</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Stock Count</th>
                  <th className="text-right text-xs font-semibold text-[#999] px-5 py-3.5">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const isDirty = edits[item.id] !== undefined && edits[item.id] !== String(item.stock_count);
                  const currentValue = edits[item.id] ?? String(item.stock_count);
                  return (
                    <tr key={item.id} className={`border-b border-gray-50 transition-colors ${isDirty ? "bg-amber-50/30" : "hover:bg-gray-50/60"}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{item.emoji}</span>
                          <p className="text-sm font-medium text-[#222]">{item.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs bg-[#F4EFE6] text-[#666] px-2 py-0.5 rounded-full capitalize">
                          {item.category.replace(/-/g, " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={item.availability} />
                      </td>
                      <td className="px-5 py-3.5">
                        <input
                          type="number" min="0"
                          value={currentValue}
                          onChange={(e) => setEdits((prev) => ({ ...prev, [item.id]: e.target.value }))}
                          className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#D98C1F] text-center"
                        />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {isDirty && (
                          <button
                            onClick={() => handleSave(item)}
                            disabled={saving === item.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D98C1F] text-white text-xs font-semibold rounded-lg hover:bg-[#B8740F] transition-colors disabled:opacity-50"
                          >
                            {saving === item.id ? (
                              <span className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Save className="w-3 h-3" />
                            )}
                            Save
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
