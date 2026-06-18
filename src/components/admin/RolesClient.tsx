"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Shield, Loader2, CheckCircle2 } from "lucide-react";
import { Role, getRoles, deleteRole, ensureSuperAdminRole } from "@/lib/services/roleService";
import { auth } from "@/lib/firebase/client";
import RoleModal from "./RoleModal";

export default function RolesClient() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isCallerSuperAdmin, setIsCallerSuperAdmin] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      await ensureSuperAdminRole();
      const data = await getRoles();
      setRoles(data);

      // Check if current user is super admin
      const user = auth.currentUser;
      if (user) {
        const res = await fetch(`/api/v1/me?uid=${user.uid}`);
        const json = await res.json();
        const roleId = json.data?.roleId;
        setIsCallerSuperAdmin(roleId === "super_admin" || roleId === "owner");
      }
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (role: Role) => {
    if (role.id === "super_admin") return;
    if (!confirm(`Are you sure you want to delete the role "${role.name}"?`)) return;

    try {
      await deleteRole(role.id);
      await fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("Failed to delete role.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#D98C1F]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#222]">Roles & Permissions</h1>
          <p className="text-sm text-[#666] mt-1">Manage system roles and assign granular permissions.</p>
        </div>
        <button
          onClick={() => {
            setEditingRole(null);
            setIsModalOpen(true);
          }}
          className="bg-[#1C3E26] hover:bg-[#1C3E26]/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add Role
        </button>
      </div>

      {/* Roles List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2]/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-[#555] uppercase tracking-wider">Role Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#555] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#555] uppercase tracking-wider">System Level</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#555] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#D98C1F]">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#222]">{role.name}</div>
                        {role.description && <div className="text-xs text-[#888] mt-0.5">{role.description}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      role.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {role.isActive && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {role.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold tracking-wider ${
                      role.isAdminPrivileges ? 'text-[#D98C1F]' : 'text-[#666]'
                    }`}>
                      {role.isAdminPrivileges ? 'SUPER ADMIN' : 'ADMIN'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingRole(role);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-[#666] hover:text-[#D98C1F] hover:bg-[#FAF7F2] rounded-lg transition-colors"
                        title="Edit Role"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {role.id !== "super_admin" && (
                        <button
                          onClick={() => handleDelete(role)}
                          className="p-2 text-[#666] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Role"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <RoleModal
          role={editingRole}
          isCallerSuperAdmin={isCallerSuperAdmin}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchRoles}
        />
      )}
    </div>
  );
}
