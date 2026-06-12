import { db } from "@/lib/firebase/client";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Role, getRole, AppPermissions } from "./roleService";

// Only these emails are hardcoded Super Admins — no one else gets in automatically
const SUPER_ADMIN_EMAILS = ["admin@slfathimasfoods.com"];

export type UserRole = string;

/**
 * Fetches the user's roleId securely via the backend API (bypasses Firestore rules).
 * Falls back to "customer" if not found or on error.
 */
export async function getUserRole(uid: string, email?: string | null): Promise<string> {
  // Hardcoded super admin emails always win
  if (email && SUPER_ADMIN_EMAILS.includes(email)) return "super_admin";

  try {
    // Use secure backend API (Admin SDK bypasses Firestore security rules)
    const res = await fetch(`/api/v1/me?uid=${uid}`);
    if (!res.ok) return "customer";
    const json = await res.json();
    if (!json.success) return "customer";

    const { roleId, email: storedEmail } = json.data;

    // Also check if stored email is a super admin
    if (storedEmail && SUPER_ADMIN_EMAILS.includes(storedEmail)) return "super_admin";

    return roleId || "customer";
  } catch {
    return "customer";
  }
}

export async function getUserRoleData(uid: string, email?: string | null): Promise<Role | null> {
  const roleId = await getUserRole(uid, email);

  // Super admin (by email or roleId)
  if (roleId === "super_admin" || roleId === "owner") {
    return {
      id: "super_admin",
      name: "Super Admin",
      description: "Full system access",
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
      }
    };
  }

  // "staff" role = can access admin, but with limited permissions (NOT admin privileges)
  if (roleId === "staff") {
    return {
      id: "staff",
      name: "Staff",
      description: "Staff member with limited access",
      isActive: true,
      isAdminPrivileges: false, // ← Staff is NOT a super admin
      permissions: {
        products: { create: false, read: true, update: true, delete: false },
        orders: { create: false, read: true, update: true, delete: false },
        customers: { create: false, read: true, update: false, delete: false },
        users: { create: false, read: false, update: false, delete: false },
        roles: { create: false, read: false, update: false, delete: false },
        settings: { create: false, read: false, update: false, delete: false },
        content: { create: false, read: true, update: false, delete: false },
      }
    };
  }

  // "customer" = no admin access at all
  if (roleId === "customer") {
    return null;
  }

  // For any custom role — look it up from the database
  return await getRole(roleId);
}

export async function createOrUpdateUserDoc(
  uid: string,
  email: string,
  displayName: string | null
): Promise<string> {
  const roleId = SUPER_ADMIN_EMAILS.includes(email) ? "super_admin" : "customer";

  try {
    const userRef = doc(db, "users", uid);
    const existing = await getDoc(userRef);

    if (!existing.exists()) {
      await setDoc(userRef, {
        uid,
        email,
        displayName: displayName || "",
        roleId,
        addresses: [],
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      return roleId;
    } else {
      const data = existing.data();
      if (!data.roleId && !data.role) {
        await setDoc(userRef, { roleId, updated_at: serverTimestamp() }, { merge: true });
        return roleId;
      }
      return data.roleId || data.role || roleId;
    }
  } catch (err) {
    console.error("Error creating/updating user doc:", err);
  }

  return roleId;
}

/**
 * Determines if a user can ACCESS the admin panel at all.
 * 
 * - super_admin / owner → YES
 * - staff → YES (but limited access inside)
 * - custom role with isAdminPrivileges → YES  
 * - custom role without isAdminPrivileges → YES (they have some panel access)
 * - customer / unknown → NO
 */
export async function isAdminUser(uid: string, email?: string | null): Promise<boolean> {
  if (email && SUPER_ADMIN_EMAILS.includes(email)) return true;

  const roleId = await getUserRole(uid, email);

  // Super admin and owner always have access
  if (roleId === "super_admin" || roleId === "owner") return true;

  // "staff" role has limited admin access
  if (roleId === "staff") return true;

  // Customers and unrecognized roles = no access
  if (roleId === "customer") return false;

  // Custom roles — check if the role is active
  try {
    const role = await getRole(roleId);
    // Any active custom role can access the admin panel
    return role ? role.isActive : false;
  } catch {
    return false;
  }
}
