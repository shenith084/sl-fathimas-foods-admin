"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart2,
  Star, FileText, Settings, Shield, Box, ChevronRight, MessageSquare,
} from "lucide-react";
import { AppPermissions } from "@/lib/services/roleService";

// Each nav item declares which permission it requires (feature + action)
// Items with no permissionKey are always visible (e.g. Dashboard)
const navItems = [
  { label: "Dashboard",    href: "/admin/dashboard",  icon: LayoutDashboard,  permissionKey: null },
  { label: "Messages",     href: "/admin/messages",   icon: MessageSquare,     permissionKey: "messages" },
  { label: "Products",     href: "/admin/products",   icon: Package,           permissionKey: "products" },
  { label: "Orders",       href: "/admin/orders",     icon: ShoppingCart,      permissionKey: "orders" },
  { label: "Stock",        href: "/admin/stock",      icon: Box,               permissionKey: "products" },
  { label: "Reviews",      href: "/admin/reviews",    icon: Star,              permissionKey: "content" },
  { label: "Reports",      href: "/admin/reports",    icon: BarChart2,         permissionKey: "settings" },
  { label: "Audit Logs",   href: "/admin/audit-logs", icon: FileText,          permissionKey: "settings" },
  { label: "System Users", href: "/admin/users",      icon: Users,             permissionKey: "users" },
  { label: "Roles & Perms",href: "/admin/roles",      icon: Shield,            permissionKey: "roles" },
  { label: "Settings",     href: "/admin/settings",   icon: Settings,          permissionKey: "settings" },
];

interface AdminSidebarProps {
  permissions: AppPermissions | null;
  isAdminPrivileges: boolean;
}

export default function AdminSidebar({ permissions, isAdminPrivileges }: AdminSidebarProps) {
  const pathname = usePathname();

  // Decide if a nav item should be shown
  const canSee = (permissionKey: string | null): boolean => {
    if (!permissionKey) return true;              // Dashboard — always visible
    if (isAdminPrivileges) return true;           // Super Admin — sees everything
    if (!permissions) return false;               // No permissions loaded yet — hide
    const featurePerms = permissions[permissionKey as keyof AppPermissions];
    if (!featurePerms) return false;
    // Show the item if the user can at least READ it
    return featurePerms.read || featurePerms.create || featurePerms.update || featurePerms.delete;
  };

  const visibleItems = navItems.filter(item => canSee(item.permissionKey));

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-[#18181A] flex flex-col z-40 shadow-2xl border-r border-white/5">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/5 flex flex-col items-center justify-center">
        <Link href="/admin/dashboard" className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-black border border-[#D98C1F]/20 relative">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-sm leading-none mb-0.5 tracking-wide">Fathima&apos;s</p>
            <p className="text-[#D98C1F] text-[9px] font-bold tracking-[0.2em] uppercase">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[#666] text-[10px] font-semibold tracking-widest uppercase px-3 mb-3">Menu</p>
        <ul className="space-y-0.5">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-[#B8740F] to-[#D98C1F] text-white shadow-md"
                      : "text-[#888] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-[#666] group-hover:text-white"}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3 h-3 text-white/80" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-[#888] hover:text-white transition-colors"
        >
          <span className="opacity-80">←</span> View Public Site
        </Link>
      </div>
    </aside>
  );
}
