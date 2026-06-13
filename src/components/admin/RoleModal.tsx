"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Role, AppPermissions, defaultPermissions, saveRole } from "@/lib/services/roleService";

interface RoleModalProps {
  role: Role | null;
  isCallerSuperAdmin: boolean;  // Only Super Admin can set Admin Privileges
  onClose: () => void;
  onSuccess: () => void;
}

const features: Array<{ key: keyof AppPermissions; label: string }> = [
  { key: "products", label: "Products" },
  { key: "orders", label: "Orders" },
  { key: "customers", label: "Customers" },
  { key: "users", label: "Users" },
  { key: "roles", label: "Roles" },
  { key: "content", label: "Content" },
  { key: "messages", label: "Messages" },
  { key: "settings", label: "Settings" },
];

export default function RoleModal({ role, isCallerSuperAdmin, onClose, onSuccess }: RoleModalProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(role?.name || "");
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [description, setDescription] = useState(role?.description || "");
  const [isActive, setIsActive] = useState(role ? role.isActive : true);
  const [isAdminPrivileges, setIsAdminPrivileges] = useState(role ? role.isAdminPrivileges : false);
  const [permissions, setPermissions] = useState<AppPermissions>(
    role?.permissions ? JSON.parse(JSON.stringify(role.permissions)) : JSON.parse(JSON.stringify(defaultPermissions))
  );

  useEffect(() => {
    fetch("/api/v1/users")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsers(data.data);
          // If editing a custom role that belongs to a user, preselect them
          if (role?.id?.startsWith("custom_")) {
            setSelectedUserId(role.id.replace("custom_", ""));
          }
        }
      })
      .catch(err => console.error("Failed to fetch users", err));
  }, [role]);

  const handlePermissionChange = (featureKey: keyof AppPermissions, action: "create" | "read" | "update" | "delete") => {
    setPermissions(prev => ({
      ...prev,
      [featureKey]: {
        ...prev[featureKey],
        [action]: !prev[featureKey][action]
      }
    }));
  };

  const handleSelectAll = (featureKey: keyof AppPermissions, isAllSelected: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [featureKey]: {
        create: !isAllSelected,
        read: !isAllSelected,
        update: !isAllSelected,
        delete: !isAllSelected
      }
    }));
  };

  const handleSave = async () => {
    if (!name.trim()) return alert("Role name is required");
    
    try {
      setLoading(true);
      const roleId = role?.id || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');

      const newRole: Role = {
        id: roleId,
        name: name.trim(),
        description: description.trim(),
        isActive,
        isAdminPrivileges,
        permissions,
      };

      // 1. Save the custom role
      await saveRole(newRole);

      // 2. Assign this role to the selected user (optional)
      if (selectedUserId) {
        await fetch(`/api/v1/users/${selectedUserId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roleId }),
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving role:", err);
      alert("Failed to save role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-[#222]">
              {role ? "Edit Custom Permissions" : "Assign Custom Permissions"}
            </h2>
            <p className="text-xs text-[#666] mt-0.5">
              {role ? "Modify system access for this user." : "Create custom permissions for a specific user."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Top Form */}
          <div className="space-y-5 mb-8">
            {/* Role Name Text Input */}
            <div>
              <label className="block text-sm font-semibold text-[#333] mb-1.5">Role Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Branch Manager, Cashier, Operator"
                disabled={role?.id === "super_admin"}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D98C1F]/50 focus:bg-white transition-colors"
              />
            </div>

            {/* Assign to User Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-[#333] mb-1.5">
                Assign to User <span className="text-[#999] font-normal">(Optional)</span>
              </label>
              <select
                value={selectedUserId}
                onChange={e => setSelectedUserId(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D98C1F]/50 focus:bg-white transition-colors"
              >
                <option value="">-- Select a user to assign this role --</option>
                {users.map(u => (
                  <option key={u.uid} value={u.uid}>{u.displayName || u.email}</option>
                ))}
              </select>
              <p className="text-[11px] text-[#888] mt-1">If selected, this role will immediately be assigned to that user.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div>
                  <div className="text-sm font-semibold text-[#333]">Status</div>
                  <div className="text-[10px] text-[#666] mt-0.5">Determine if this role is active</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={isActive} onChange={e => setIsActive(e.target.checked)} disabled={role?.id === "super_admin"} />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1C3E26]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div>
                  <div className="text-sm font-semibold text-[#333]">Admin Privileges</div>
                  <div className="text-[10px] text-[#666] mt-0.5">
                    {isCallerSuperAdmin ? "Grant admin-level system access" : "Only Super Admins can grant this"}
                  </div>
                </div>
                <label className={`relative inline-flex items-center ${isCallerSuperAdmin ? "cursor-pointer" : "cursor-not-allowed opacity-40"}`}>
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isAdminPrivileges}
                    onChange={e => isCallerSuperAdmin && setIsAdminPrivileges(e.target.checked)}
                    disabled={!isCallerSuperAdmin || role?.id === "super_admin"}
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1C3E26]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Permissions Grid */}
          <div>
            <h3 className="text-sm font-bold text-[#222] mb-1">Permissions</h3>
            <p className="text-xs text-[#666] mb-4">Select the features this role can access.</p>
            
            <div className="space-y-4">
              {features.map((feature) => {
                const perms = permissions[feature.key] || { create: false, read: false, update: false, delete: false };
                const isAllSelected = perms.create && perms.read && perms.update && perms.delete;

                return (
                  <div key={feature.key} className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                      <h4 className="text-sm font-bold text-[#333]">{feature.label}</h4>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <span className="text-[10px] font-semibold text-[#666] uppercase tracking-wider">Select All</span>
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={() => handleSelectAll(feature.key, isAllSelected)}
                          disabled={role?.id === "super_admin"}
                          className="w-3.5 h-3.5 text-[#1C3E26] rounded border-gray-300 focus:ring-[#1C3E26]"
                        />
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(["create", "read", "update", "delete"] as const).map((action) => (
                        <label key={action} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={perms[action]}
                            onChange={() => handlePermissionChange(feature.key, action)}
                            disabled={role?.id === "super_admin"}
                            className="w-4 h-4 text-[#D98C1F] rounded border-gray-300 focus:ring-[#D98C1F]"
                          />
                          <span className="text-xs font-medium text-[#555] group-hover:text-[#222] capitalize">{action}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-[#555] hover:text-[#222] hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 bg-[#1C3E26] hover:bg-[#1C3E26]/90 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {role ? "Update Role" : "Create Role"}
          </button>
        </div>
      </div>
    </div>
  );
}
