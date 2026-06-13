"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, User, Package, KeyRound, LogOut, ChevronRight } from "lucide-react";
import { auth } from "@/lib/firebase/client";
import { signOut } from "firebase/auth";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/account" },
    { label: "My Profile", icon: User, href: "/account/profile" },
    { label: "My Orders", icon: Package, href: "/account/orders" },
    { label: "Change Password", icon: KeyRound, href: "/account/password" },
  ];

  // Helper to determine if a nav item is active. 
  // "/account" should only be active if pathname is exactly "/account".
  const isActive = (href: string) => {
    if (href === "/account") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Build the breadcrumb based on pathname
  const getBreadcrumbName = () => {
    if (pathname === "/account") return "Dashboard";
    if (pathname.includes("/profile")) return "My Profile";
    if (pathname.includes("/orders")) return "My Orders";
    if (pathname.includes("/password")) return "Change Password";
    return "Dashboard";
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-12">
      {/* Breadcrumb Area */}
      <div className="bg-[#FAF7F2] pt-8 pb-4 px-4 sm:px-6 max-w-7xl mx-auto">
        <nav className="flex items-center gap-1.5 text-xs text-[#999]">
          <Link href="/" className="hover:text-[#D98C1F]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/account" className="hover:text-[#D98C1F]">My Account</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#444] font-medium">{getBreadcrumbName()}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <h2 className="font-display font-bold text-[#222] text-lg mb-4 px-3">My Account</h2>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#FAF7F2] text-[#D98C1F]"
                        : "text-[#555] hover:bg-gray-50 hover:text-[#222]"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${active ? "text-[#D98C1F]" : "text-[#888]"}`} />
                    {item.label}
                  </Link>
                );
              })}
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#555] hover:bg-gray-50 hover:text-[#222] transition-colors mt-2 text-left"
              >
                <LogOut className="w-4 h-4 text-[#888]" />
                Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>
    </div>
  );
}
