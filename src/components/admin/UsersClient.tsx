"use client";

import { useState, useEffect } from "react";
import { User, Shield, Loader2, Edit2, CheckCircle2, Trash2 } from "lucide-react";
import { Role, getRoles, assignRoleToUser } from "@/lib/services/roleService";
import { auth } from "@/lib/firebase/client";
import CreateUserModal from "./CreateUserModal";

// Temporary AppUser definition if not exported properly
interface UserDoc {
  uid: string;
  email: string;
  displayName: string;
  roleId?: string;
  role?: string;
  created_at: any;
}

export default function UsersClient() {
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isCallerSuperAdmin, setIsCallerSuperAdmin] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch custom roles
      const fetchedRoles = await getRoles();
      setRoles(fetchedRoles);

      // Fetch users from API securely
      const res = await fetch("/api/v1/users");
      const json = await res.json();
      if (json.success) {
        const allUsers = json.data as UserDoc[];
        const systemUsers = allUsers.filter(u => {
          const roleId = u.roleId || u.role || "customer";
          return roleId !== "customer";
        });
        setUsers(systemUsers);
      }

      // Check current user
      const user = auth.currentUser;
      if (user) {
        setCurrentUserId(user.uid);
        const meRes = await fetch(`/api/v1/me?uid=${user.uid}`);
        const meJson = await meRes.json();
        setIsCallerSuperAdmin(meJson.data?.isSuperAdmin || false);
      }
    } catch (err) {
      console.error("Failed to fetch users or roles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRole = async (uid: string) => {
    if (!selectedRoleId) return;
    
    try {
      setIsSaving(true);
      await assignRoleToUser(uid, selectedRoleId);
      setEditingUserId(null);
      await fetchData();
    } catch (error: any) {
      console.error("Error updating user role:", error);
      alert(error.message || "Failed to update role. You must be a Super Admin.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) throw new Error("Not logged in");
      const token = await user.getIdToken();
      const res = await fetch(`/api/v1/users/${uid}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      await fetchData();
    } catch (err: any) {
      console.error("Failed to delete user:", err);
      alert(err.message || "Failed to delete user.");
      setLoading(false);
    }
  };

  const getRoleBadge = (user: UserDoc) => {
    const roleId = user.roleId || user.role || "customer";
    
    if (roleId === "super_admin" || roleId === "owner") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#D98C1F]/10 text-[#D98C1F] border border-[#D98C1F]/30">
          Super Admin
        </span>
      );
    }

    const matchedRole = roles.find(r => r.id === roleId);
    if (matchedRole) {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
          matchedRole.isAdminPrivileges ? 'bg-[#1C3E26]/10 text-[#1C3E26] border border-[#1C3E26]/20' : 'bg-gray-100 text-gray-700 border border-gray-200'
        }`}>
          {matchedRole.name}
        </span>
      );
    }

    if (roleId === "staff") {
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#2C4631]/10 text-[#2C4631] border border-[#2C4631]/30">Staff</span>;
    }

    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">Customer</span>;
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
          <h1 className="text-2xl font-bold text-[#222]">System Users</h1>
          <p className="text-sm text-[#666] mt-1">Manage user accounts and assign custom roles.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#1C3E26] hover:bg-[#1C3E26]/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
        >
          <User className="w-4 h-4" /> Create User
        </button>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2]/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-[#555] uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#555] uppercase tracking-wider">Assigned Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#555] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.uid} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1C3E26] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                        {user.displayName ? user.displayName[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-[#222]">{user.displayName || "Unknown User"}</div>
                        <div className="text-xs text-[#666] mt-0.5">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    {editingUserId === user.uid ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedRoleId}
                          onChange={(e) => setSelectedRoleId(e.target.value)}
                          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#D98C1F]/50"
                        >
                          <option value="customer">Customer</option>
                          <option value="staff">Staff</option>
                          <option value="super_admin">⭐ Super Admin</option>
                          {roles.filter(r => r.id !== "super_admin").map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleSaveRole(user.uid)}
                          disabled={isSaving}
                          className="bg-[#D98C1F] hover:bg-[#B8740F] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 disabled:opacity-50"
                        >
                          {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
                        </button>
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="text-[#666] hover:text-[#222] text-xs font-medium px-2"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      getRoleBadge(user)
                    )}
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    {editingUserId !== user.uid && 
                     (user.role !== "owner") && 
                     (isCallerSuperAdmin || user.roleId !== "super_admin") && 
                     (currentUserId !== user.uid) && (
                      <>
                        <button
                          onClick={() => {
                            setEditingUserId(user.uid);
                            setSelectedRoleId(user.roleId || user.role || "customer");
                          }}
                          className="p-2 text-[#666] hover:text-[#D98C1F] hover:bg-[#FAF7F2] rounded-lg transition-colors inline-flex"
                          title="Change Role"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.uid)}
                          className="p-2 text-[#666] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex ml-1"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isCreateModalOpen && (
        <CreateUserModal
          roles={roles}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
