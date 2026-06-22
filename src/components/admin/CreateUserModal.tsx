"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Role } from "@/lib/services/roleService";
import toast from "react-hot-toast";

interface CreateUserModalProps {
  roles: Role[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateUserModal({ roles, onClose, onSuccess }: CreateUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleName, setRoleName] = useState("");   // Admin types the role name
  const [isActive, setIsActive] = useState(true);

  // Match typed role name to an existing role ID
  const resolveRoleId = () => {
    const trimmed = roleName.trim().toLowerCase();
    if (!trimmed) return "customer";
    // Try exact match on ID
    const byId = roles.find(r => r.id.toLowerCase() === trimmed);
    if (byId) return byId.id;
    // Try match on name
    const byName = roles.find(r => r.name.toLowerCase() === trimmed);
    if (byName) return byName.id;
    // Special cases
    if (trimmed === "super admin" || trimmed === "super_admin") return "super_admin";
    if (trimmed === "staff") return "staff";
    // Use the typed name as the role id (slug)
    return trimmed.replace(/\s+/g, "_");
  };

  const handleSave = async () => {
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      return toast.error("Name, Email, and Password are required");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    try {
      setLoading(true);
      const roleId = resolveRoleId();

      const res = await fetch("/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          email: email.trim(),
          password,
          roleId,
          isActive,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to create user");

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error creating user:", err);
      toast.error(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  // Available role names to show as hint
  const roleHints = [
    "Staff",
    "Super Admin",
    ...roles.filter(r => r.id !== "super_admin").map(r => r.name),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden my-8" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-[#222]">Create User Account</h2>
            <p className="text-xs text-[#666] mt-0.5">Add a new admin panel user.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#333] mb-1.5">Full Name</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D98C1F]/50 focus:bg-white transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#333] mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. john@slfathimasfoods.com"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D98C1F]/50 focus:bg-white transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#333] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D98C1F]/50 focus:bg-white transition-colors text-sm"
            />
          </div>

          {/* Role Name — Text Input */}
          <div>
            <label className="block text-sm font-semibold text-[#333] mb-1.5">Role Name</label>
            <input
              type="text"
              value={roleName}
              onChange={e => setRoleName(e.target.value)}
              placeholder="e.g. Staff, Branch Manager, Cashier"
              list="role-suggestions"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D98C1F]/50 focus:bg-white transition-colors text-sm"
            />
            {/* Autocomplete suggestions from existing roles */}
            <datalist id="role-suggestions">
              {roleHints.map(r => (
                <option key={r} value={r} />
              ))}
            </datalist>
            <p className="text-[11px] text-[#888] mt-1.5">
              Available roles: {roleHints.join(", ")}
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl mt-2">
            <div>
              <div className="text-sm font-semibold text-[#333]">Active Account</div>
              <div className="text-[10px] text-[#666] mt-0.5">Can this user log in?</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1C3E26]"></div>
            </label>
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
            Create User
          </button>
        </div>
      </div>
    </div>
  );
}
