"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart2,
  Star, FileText, Settings, Shield, Box, ChevronRight, Tags
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Stock", href: "/admin/stock", icon: Box },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Reports", href: "/admin/reports", icon: BarChart2 },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: FileText },
  { label: "Users & Roles", href: "/admin/users", icon: Shield },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-[#1F1F1F] flex flex-col z-40 shadow-2xl">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D98C1F] to-[#B8740F] flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-bold">SF</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Fathima&apos;s</p>
            <p className="text-[#D98C1F] text-[10px] font-medium tracking-widest uppercase">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[#555] text-[10px] font-semibold tracking-widest uppercase px-3 mb-3">Menu</p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                    isActive
                      ? "bg-[#D98C1F]/15 text-[#D98C1F]"
                      : "text-[#888] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#D98C1F]" : "text-[#666] group-hover:text-[#aaa]"}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-[#555] hover:text-[#888] transition-colors"
        >
          <span>← View Public Site</span>
        </Link>
      </div>
    </aside>
  );
}
