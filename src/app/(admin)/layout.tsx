"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth?redirect=" + encodeURIComponent(pathname));
      }
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

  // Get page title from pathname
  const pathSegment = pathname.split("/").pop() || "dashboard";
  const pageTitle = pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1).replace(/-/g, " ");

  return (
    <div className="min-h-screen bg-[#F4F4F2] flex">
      <AdminSidebar />
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <AdminHeader title={pageTitle} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
