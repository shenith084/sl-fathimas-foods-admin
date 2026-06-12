"use client";

import { useEffect, useState } from "react";
import { FileText, Search } from "lucide-react";
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
  products: "bg-blue-100 text-blue-700",
  orders: "bg-amber-100 text-amber-700",
  stock: "bg-green-100 text-green-700",
  settings: "bg-purple-100 text-purple-700",
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/audit-logs")
      .then((r) => r.json())
      .then((data) => { if (data.success) setLogs(data.data); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.action.includes(search.toLowerCase()) ||
      l.module.includes(search.toLowerCase()) ||
      (l.admin_uid || "").includes(search)
  );

  return (
    <div>
      <PageHeader title="Audit Logs" subtitle="All admin actions recorded in chronological order" />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 flex items-center gap-3 px-4 py-3">
        <Search className="w-4 h-4 text-[#aaa]" />
        <input
          type="text" placeholder="Search by action or module..."
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
            <FileText className="w-10 h-10 text-[#ccc] mx-auto mb-3" />
            <p className="text-[#888] text-sm">No audit logs yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Timestamp</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Module</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Action</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Target ID</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Admin UID</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="px-5 py-3.5 text-xs text-[#888] whitespace-nowrap">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString("en-LK") : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${MODULE_COLORS[log.module] || "bg-gray-100 text-gray-600"}`}>
                        {log.module}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-[#444] capitalize">{log.action.replace(/_/g, " ")}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs text-[#aaa]">{log.target_id?.substring(0, 12) || "—"}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs text-[#aaa]">{log.admin_uid?.substring(0, 12) || "system"}</span>
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
