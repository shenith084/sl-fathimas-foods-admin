"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { getUserRoleData } from "@/lib/services/userService";
import { AppPermissions } from "@/lib/services/roleService";

// Map each admin path segment to the permission key it requires
const pathPermissionMap: Record<string, keyof AppPermissions | null> = {
  "dashboard":  null,        // Always accessible
  "products":   "products",
  "orders":     "orders",
  "customers":  "customers",
  "stock":      "products",
  "reviews":    "content",
  "reports":    "settings",
  "audit-logs": "settings",
  "users":      "users",
  "roles":      "roles",
  "settings":   "settings",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [permissions, setPermissions] = useState<AppPermissions | null>(null);
  const [isAdminPrivileges, setIsAdminPrivileges] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth?redirect=" + encodeURIComponent(pathname));
        return;
      }

      // Fetch the user's full role data (permissions + admin level)
      const roleData = await getUserRoleData(user.uid, user.email);

      if (!roleData || !roleData.isActive) {
        // No valid role = redirect to home
        router.push("/products");
        return;
      }

      const isPrivileged = roleData.isAdminPrivileges;
      setIsAdminPrivileges(isPrivileged);
      setPermissions(roleData.permissions || null);

      // Check if the current page requires a permission this user doesn't have
      const currentSegment = pathname.split("/").filter(Boolean)[1] || "dashboard";
      const requiredPermKey = pathPermissionMap[currentSegment];

      if (!isPrivileged && requiredPermKey) {
        const featurePerms = roleData.permissions?.[requiredPermKey];
        const hasAnyAccess = featurePerms && (
          featurePerms.read || featurePerms.create || featurePerms.update || featurePerms.delete
        );

        if (!hasAnyAccess) {
          setAccessDenied(true);
          setChecking(false);
          return;
        }
      }

      setAccessDenied(false);
      setChecking(false);
    });
    return () => unsubscribe();
  }, [router, pathname]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#D98C1F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#888]">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-[#F4F4F2] flex">
        <AdminSidebar permissions={permissions} isAdminPrivileges={isAdminPrivileges} />
        <div className="flex-1 ml-60 flex flex-col min-h-screen">
          <AdminHeader title="Access Denied" />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center bg-white rounded-2xl p-12 shadow-sm border border-gray-100 max-w-md">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-[#222] mb-2">Access Denied</h2>
              <p className="text-[#666] text-sm mb-6">
                You don&apos;t have permission to view this page. 
                Contact your Super Admin to request access.
              </p>
              <a
                href="/admin/dashboard"
                className="inline-block bg-[#1C3E26] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1C3E26]/90 transition-colors"
              >
                Go to Dashboard
              </a>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const pathSegment = pathname.split("/").pop() || "dashboard";
  const pageTitle = pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1).replace(/-/g, " ");

  return (
    <div className="min-h-screen bg-[#F4F4F2] flex">
      <AdminSidebar permissions={permissions} isAdminPrivileges={isAdminPrivileges} />
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <AdminHeader title={pageTitle} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
