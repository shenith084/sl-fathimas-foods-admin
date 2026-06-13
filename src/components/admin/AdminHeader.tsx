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
    <header className="h-14 bg-transparent flex items-center justify-between px-6 pt-2 sticky top-0 z-30">
      <div className="flex flex-col">
        {title && (
          <h1 className="text-[#222] font-bold text-lg">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications bell */}
        <button className="relative w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm">
          <Bell className="w-4 h-4 text-[#666]" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 border border-white rounded-full"></span>
        </button>

        {/* User avatar */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <div className="w-6 h-6 rounded-full bg-[#E88E23] flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs text-[#444] font-medium pr-1 max-w-[120px] truncate hidden sm:block">
              {userEmail || "Admin"}
            </span>
            <svg className="w-3 h-3 text-[#888] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
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
