"use client";

import React, { useEffect, useState } from "react";
import { FileText, Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Filter, Database, ArrowRightLeft } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

interface AuditLog {
  id: string;
  admin_uid: string;
  action: string;
  module: string;
  target_id: string | null;
  old_value: unknown;
  new_value: unknown;
  timestamp: string | null;
}

const MODULE_COLORS: Record<string, string> = {
  products: "bg-blue-100 text-blue-700 border-blue-200",
  orders: "bg-amber-100 text-amber-700 border-amber-200",
  stock: "bg-emerald-100 text-emerald-700 border-emerald-200",
  settings: "bg-purple-100 text-purple-700 border-purple-200",
  users: "bg-indigo-100 text-indigo-700 border-indigo-200",
  roles: "bg-pink-100 text-pink-700 border-pink-200",
};

const MODULE_ICONS: Record<string, React.ReactNode> = {
  products: <span className="text-blue-500">📦</span>,
  orders: <span className="text-amber-500">🛒</span>,
  stock: <span className="text-emerald-500">📊</span>,
  settings: <span className="text-purple-500">⚙️</span>,
  users: <span className="text-indigo-500">👥</span>,
  roles: <span className="text-pink-500">🔐</span>,
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [moduleFilter, setModuleFilter] = useState("all");
  const [search, setSearch] = useState(""); 
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const fetchLogs = (currentPage: number, currentModule: string) => {
    setLoading(true);
    let url = `/api/v1/audit-logs?page=${currentPage}&limit=${limit}`;
    if (currentModule !== "all") {
      url += `&module=${currentModule}`;
    }

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setLogs(data.data);
          setTotalPages(data.meta.totalPages || 1);
          setTotalRecords(data.meta.total || 0);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs(page, moduleFilter);
  }, [page, moduleFilter]);

  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModuleFilter(e.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  const toggleRow = (id: string) => {
    if (expandedRowId === id) setExpandedRowId(null);
    else setExpandedRowId(id);
  };

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      (l.admin_uid || "").toLowerCase().includes(search.toLowerCase()) ||
      (l.target_id || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-10 max-w-7xl mx-auto">
      <PageHeader title="Audit Logs" subtitle="Track all system actions in chronological order for security and compliance." />

      {/* Modern Filters and Search */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center gap-4 px-5 py-4">
        <div className="flex items-center gap-3 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-5">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <Filter className="w-4 h-4" />
          </div>
          <select 
            value={moduleFilter} 
            onChange={handleModuleChange}
            className="text-sm font-medium text-gray-700 outline-none bg-transparent cursor-pointer w-full md:w-auto focus:ring-0 border-none px-0 py-1 hover:text-gray-900"
          >
            <option value="all">All Modules</option>
            <option value="products">📦 Products</option>
            <option value="orders">🛒 Orders</option>
            <option value="stock">📊 Stock</option>
            <option value="settings">⚙️ Settings</option>
            <option value="users">👥 Users</option>
            <option value="roles">🔐 Roles</option>
          </select>
        </div>

        <div className="flex items-center gap-3 flex-1 px-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text" placeholder="Search by action, target ID, or Admin UID..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder:text-gray-400 w-full"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-[#D98C1F] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-gray-500">Loading audit records...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-24 px-4 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
              <Database className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-800 font-bold text-lg mb-1">No logs found</p>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">We couldn't find any audit logs matching your current filters and search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider px-6 py-4 w-12"></th>
                  <th className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Timestamp</th>
                  <th className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Module</th>
                  <th className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Action</th>
                  <th className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Target ID</th>
                  <th className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Admin UID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr 
                      className={`hover:bg-gray-50/80 cursor-pointer transition-colors ${expandedRowId === log.id ? 'bg-gray-50/80' : 'bg-white'}`}
                      onClick={() => toggleRow(log.id)}
                    >
                      <td className="px-6 py-4">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${expandedRowId === log.id ? 'bg-[#2C4631] text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                          {expandedRowId === log.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.timestamp ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-800">{new Date(log.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                            <span className="text-xs font-medium text-gray-500 mt-0.5">{new Date(log.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full capitalize border ${MODULE_COLORS[log.module] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                          {MODULE_ICONS[log.module]} {log.module}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-800 capitalize bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 inline-block shadow-sm">{log.action.replace(/_/g, " ")}</span>
                      </td>
                      <td className="px-6 py-4">
                        {log.target_id ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#F4EFE6] text-[#2C4631]">
                            <span className="font-mono text-xs font-bold">{log.target_id.substring(0, 12)}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 ml-2">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
                          <div className="w-5 h-5 rounded-full bg-gray-800 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                            {(log.admin_uid || "S")[0].toUpperCase()}
                          </div>
                          <span className="font-mono text-xs font-bold text-gray-700">{log.admin_uid?.substring(0, 12) || "system"}</span>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Details Row */}
                    {expandedRowId === log.id && (
                      <tr className="bg-gray-50/50 border-b border-gray-200">
                        <td colSpan={6} className="px-6 sm:px-12 py-8">
                          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                              <div className="w-10 h-10 rounded-xl bg-[#2C4631]/10 flex items-center justify-center text-[#2C4631]">
                                <ArrowRightLeft className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-gray-800">Change Details</h4>
                                <p className="text-xs text-gray-500 mt-0.5">A detailed view of the modifications made during this action.</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-2 h-2 rounded-full bg-red-400" />
                                  <h5 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Previous State</h5>
                                </div>
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 overflow-auto max-h-[400px] flex-1">
                                  <pre className="text-[12px] text-gray-600 font-mono leading-relaxed">
                                    {log.old_value ? JSON.stringify(log.old_value, null, 2) : "No previous state (null)"}
                                  </pre>
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-2 h-2 rounded-full bg-green-400" />
                                  <h5 className="text-xs font-bold text-gray-600 uppercase tracking-wider">New State</h5>
                                </div>
                                <div className="bg-[#F4FDF4] border border-[#E2F0E2] rounded-xl p-4 overflow-auto max-h-[400px] flex-1 shadow-sm">
                                  <pre className="text-[12px] text-[#2F6B2F] font-mono leading-relaxed">
                                    {log.new_value ? JSON.stringify(log.new_value, null, 2) : "No new state (null)"}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-800">{(page - 1) * limit + 1}</span> to <span className="font-semibold text-gray-800">{Math.min(page * limit, totalRecords)}</span> of <span className="font-semibold text-gray-800">{totalRecords}</span> entries
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-sm font-semibold text-gray-800">Page {page} of {totalPages}</span>
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
