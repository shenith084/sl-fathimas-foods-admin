"use client";

import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

interface Customer {
  email: string;
  name: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/customers")
      .then((r) => r.json())
      .then((data) => { if (data.success) setCustomers(data.data); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="Customers" subtitle={`${customers.length} customers found`} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 flex items-center gap-3 px-4 py-3">
        <Search className="w-4 h-4 text-[#aaa]" />
        <input
          type="text" placeholder="Search by name or email..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm text-[#444] outline-none bg-transparent placeholder:text-[#bbb]"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#D98C1F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-10 h-10 text-[#ccc] mx-auto mb-3" />
            <p className="text-[#888] text-sm">No customers yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Customer</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Phone</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Orders</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Total Spent</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Last Order</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr key={customer.email} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D98C1F]/20 to-[#D98C1F]/5 flex items-center justify-center text-[#D98C1F] font-bold text-sm">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#222]">{customer.name || "Guest"}</p>
                          <p className="text-xs text-[#aaa]">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#555]">{customer.phone || "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className="bg-[#F4EFE6] text-[#D98C1F] text-xs font-semibold px-2 py-0.5 rounded-full">
                        {customer.orderCount}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-bold text-[#222]">
                      LKR {customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[#999]">
                      {customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString("en-LK") : "—"}
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
