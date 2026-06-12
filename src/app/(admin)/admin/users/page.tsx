"use client";

import { useState } from "react";
import { Shield, Info } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

const ROLES = [
  {
    name: "Owner (Super Admin)",
    description: "Full access to all modules — products, orders, customers, reports, settings, audit logs, and user management.",
    permissions: ["product.*", "order.*", "customer.*", "stock.*", "report.*", "settings.*", "user.*", "audit_log.*", "review.*"],
    color: "bg-[#D98C1F]/10 border-[#D98C1F]/30",
    badge: "bg-[#D98C1F] text-white",
  },
  {
    name: "Staff",
    description: "Restricted access — can manage orders, view products, update stock. Cannot access reports, settings, or user management.",
    permissions: ["order.view", "order.update_status", "product.view", "stock.update"],
    color: "bg-[#556B4F]/10 border-[#556B4F]/30",
    badge: "bg-[#556B4F] text-white",
  },
];

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<"roles" | "info">("roles");

  return (
    <div>
      <PageHeader
        title="Users & Roles"
        subtitle="Role-based access control for admin panel"
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[{ key: "roles", label: "Roles & Permissions" }, { key: "info", label: "How RBAC Works" }].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-[#1F1F1F] text-white"
                : "bg-white text-[#666] border border-gray-200 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "roles" && (
        <div className="space-y-5">
          {ROLES.map((role) => (
            <div key={role.name} className={`rounded-2xl border p-6 ${role.color}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#D98C1F]" />
                  <div>
                    <h3 className="font-bold text-[#222]">{role.name}</h3>
                    <p className="text-sm text-[#666] mt-0.5">{role.description}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${role.badge}`}>
                  {role.name.includes("Owner") ? "Super Admin" : "Staff"}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#888] mb-2">Permissions:</p>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((perm) => (
                    <span key={perm} className="text-xs bg-white/80 text-[#444] px-2.5 py-1 rounded-full border border-white/60 font-mono">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-[#222] mb-3">RBAC Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs text-[#999] font-semibold pb-3">Module</th>
                    <th className="text-center text-xs text-[#999] font-semibold pb-3">Owner</th>
                    <th className="text-center text-xs text-[#999] font-semibold pb-3">Staff</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { module: "Dashboard", owner: true, staff: true },
                    { module: "Products (View)", owner: true, staff: true },
                    { module: "Products (Create/Edit/Delete)", owner: true, staff: false },
                    { module: "Orders (View)", owner: true, staff: true },
                    { module: "Orders (Update Status)", owner: true, staff: true },
                    { module: "Customers", owner: true, staff: false },
                    { module: "Stock", owner: true, staff: true },
                    { module: "Reviews", owner: true, staff: false },
                    { module: "Reports", owner: true, staff: false },
                    { module: "Audit Logs", owner: true, staff: false },
                    { module: "Settings", owner: true, staff: false },
                    { module: "Users & Roles", owner: true, staff: false },
                  ].map((row) => (
                    <tr key={row.module} className="border-b border-gray-50">
                      <td className="py-2.5 text-[#444]">{row.module}</td>
                      <td className="py-2.5 text-center">
                        {row.owner ? (
                          <span className="text-emerald-600 font-bold">✓</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="py-2.5 text-center">
                        {row.staff ? (
                          <span className="text-emerald-600 font-bold">✓</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "info" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-[#D98C1F]/10 rounded-xl flex items-center justify-center">
              <Info className="w-5 h-5 text-[#D98C1F]" />
            </div>
            <h3 className="font-bold text-[#222]">How Role-Based Access Control Works</h3>
          </div>
          <div className="space-y-4 text-sm text-[#555]">
            <p>This admin panel uses <strong>Firebase Authentication</strong> combined with <strong>custom claims</strong> to enforce role-based access control (RBAC).</p>
            <div>
              <p className="font-semibold text-[#222] mb-2">To assign roles:</p>
              <ol className="list-decimal list-inside space-y-1.5 text-[#666]">
                <li>Create the user in Firebase Authentication Console</li>
                <li>Use Firebase Admin SDK to set custom claims: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">{'{"role": "owner"}'}</code> or <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">{'{"role": "staff"}'}</code></li>
                <li>Have the user sign out and sign back in for claims to take effect</li>
              </ol>
            </div>
            <div>
              <p className="font-semibold text-[#222] mb-2">Security layers:</p>
              <ul className="list-disc list-inside space-y-1.5 text-[#666]">
                <li>Firebase Auth JWT token validation on every API request</li>
                <li>Firestore Security Rules enforce read/write permissions at database level</li>
                <li>Admin panel layout checks auth state on every page load</li>
                <li>All admin actions are recorded in Audit Logs</li>
              </ul>
            </div>
            <div className="bg-[#FAF7F2] rounded-xl p-4 text-xs text-[#888]">
              <strong>Note:</strong> In the current phase, auth checking is based on whether the user is logged in. Full role enforcement with Firebase custom claims is configured during the DevOps phase.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
