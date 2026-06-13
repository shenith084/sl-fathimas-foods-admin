// roleService.ts - all operations go through backend API routes (/api/v1/roles)
import { auth } from "@/lib/firebase/client";

export type Action = "create" | "read" | "update" | "delete";

export type FeaturePermissions = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

export type AppPermissions = {
  products: FeaturePermissions;
  orders: FeaturePermissions;
  customers: FeaturePermissions;
  users: FeaturePermissions;
  roles: FeaturePermissions;
  settings: FeaturePermissions;
  content: FeaturePermissions;
  messages: FeaturePermissions;
};

export interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isAdminPrivileges: boolean;
  permissions: AppPermissions;
  createdAt?: any;
  updatedAt?: any;
}

export const defaultPermissions: AppPermissions = {
  products: { create: false, read: false, update: false, delete: false },
  orders: { create: false, read: false, update: false, delete: false },
  customers: { create: false, read: false, update: false, delete: false },
  users: { create: false, read: false, update: false, delete: false },
  roles: { create: false, read: false, update: false, delete: false },
  settings: { create: false, read: false, update: false, delete: false },
  content: { create: false, read: false, update: false, delete: false },
  messages: { create: false, read: false, update: false, delete: false },
};

/** Gets the current user's Firebase ID token for authorized API calls */
async function getAuthToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("UNAUTHORIZED: Not logged in");
  return user.getIdToken();
}

// Seed a super admin role if it doesn't exist
export async function ensureSuperAdminRole() {
  try {
    const existing = await getRole("super_admin");
    if (!existing) {
      const superAdminRole: Role = {
        id: "super_admin",
        name: "Super Admin",
        description: "Full system access with all privileges.",
        isActive: true,
        isAdminPrivileges: true,
        permissions: {
          products: { create: true, read: true, update: true, delete: true },
          orders: { create: true, read: true, update: true, delete: true },
          customers: { create: true, read: true, update: true, delete: true },
          users: { create: true, read: true, update: true, delete: true },
          roles: { create: true, read: true, update: true, delete: true },
          settings: { create: true, read: true, update: true, delete: true },
          content: { create: true, read: true, update: true, delete: true },
          messages: { create: true, read: true, update: true, delete: true },
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await saveRole(superAdminRole);
    }
  } catch (err) {
    console.warn("Failed to ensure super admin role:", err);
  }
}

export async function getRoles(): Promise<Role[]> {
  const res = await fetch("/api/v1/roles");
  if (!res.ok) throw new Error("Failed to fetch roles");
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to fetch roles");
  return json.data as Role[];
}

export async function getRole(id: string): Promise<Role | null> {
  const roles = await getRoles();
  return roles.find(r => r.id === id) || null;
}

export async function saveRole(role: Role): Promise<void> {
  const token = await getAuthToken();
  const res = await fetch("/api/v1/roles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(role),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || "Failed to save role");
  }
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to save role");
}

export async function deleteRole(id: string): Promise<void> {
  if (id === "super_admin") throw new Error("Cannot delete super admin role");
  const token = await getAuthToken();
  const res = await fetch(`/api/v1/roles/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete role");
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to delete role");
}

/** Assign a role to a user — Super Admin only */
export async function assignRoleToUser(userId: string, roleId: string): Promise<void> {
  const token = await getAuthToken();
  const res = await fetch(`/api/v1/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ roleId }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || "Failed to assign role");
  }
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to assign role");
}
