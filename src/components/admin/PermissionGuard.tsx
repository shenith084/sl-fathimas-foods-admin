"use client";

import { useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { getUserRoleData } from "@/lib/services/userService";
import { AppPermissions, Role } from "@/lib/services/roleService";

interface PermissionGuardProps {
  feature: keyof AppPermissions;
  action: "create" | "read" | "update" | "delete";
  children: ReactNode;
  fallback?: ReactNode;
}

export default function PermissionGuard({ feature, action, children, fallback = null }: PermissionGuardProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setHasPermission(false);
        return;
      }
      
      try {
        const roleData: Role | null = await getUserRoleData(user.uid, user.email);
        
        if (!roleData || !roleData.isActive) {
          setHasPermission(false);
          return;
        }

        if (roleData.isAdminPrivileges) {
          setHasPermission(true);
          return;
        }

        if (roleData.permissions?.[feature]?.[action] === true) {
          setHasPermission(true);
        } else {
          setHasPermission(false);
        }
      } catch (err) {
        console.error("Permission check failed:", err);
        setHasPermission(false);
      }
    });

    return () => unsubscribe();
  }, [feature, action]);

  if (hasPermission === null) return null; // Loading state
  
  if (hasPermission) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}
