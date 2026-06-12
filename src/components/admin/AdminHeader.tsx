"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { Bell, LogOut, User } from "lucide-react";

export default function AdminHeader({ title }: { title?: string }) {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email || null);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/auth");
  };

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        {title && (
          <h1 className="text-[#222] font-semibold text-base">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications bell */}
        <button className="relative w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors">
          <Bell className="w-4 h-4 text-[#666]" />
        </button>

        {/* User avatar */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D98C1F] to-[#B8740F] flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-[#444] font-medium max-w-[120px] truncate hidden sm:block">
              {userEmail || "Admin"}
            </span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs text-[#999]">Signed in as</p>
                <p className="text-xs font-semibold text-[#222] truncate">{userEmail}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
