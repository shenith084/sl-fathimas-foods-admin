"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart2,
  Star, FileText, Settings, Shield, Box, ChevronRight, MessageSquare, X
} from "lucide-react";
import { AppPermissions } from "@/lib/services/roleService";

// Each nav item declares which permission it requires (feature + action)
// Items with no permissionKey are always visible (e.g. Dashboard)
const navItems = [
  { label: "Dashboard",    href: "/admin/dashboard",  icon: LayoutDashboard,  permissionKey: null, notificationKey: null },
  { label: "Messages",     href: "/admin/messages",   icon: MessageSquare,     permissionKey: "messages", notificationKey: "messages" },
  { label: "Products",     href: "/admin/products",   icon: Package,           permissionKey: "products", notificationKey: null },
  { label: "Orders",       href: "/admin/orders",     icon: ShoppingCart,      permissionKey: "orders", notificationKey: "orders" },
  { label: "Stock",        href: "/admin/stock",      icon: Box,               permissionKey: "products", notificationKey: null },
  { label: "Reviews",      href: "/admin/reviews",    icon: Star,              permissionKey: "content", notificationKey: "reviews" },
  { label: "Reports",      href: "/admin/reports",    icon: BarChart2,         permissionKey: "settings", notificationKey: null },
  { label: "Audit Logs",   href: "/admin/audit-logs", icon: FileText,          permissionKey: "settings", notificationKey: null },
  { label: "System Users", href: "/admin/users",      icon: Users,             permissionKey: "users", notificationKey: null },
  { label: "Roles & Perms",href: "/admin/roles",      icon: Shield,            permissionKey: "roles", notificationKey: null },
  { label: "Settings",     href: "/admin/settings",   icon: Settings,          permissionKey: "settings", notificationKey: null },
];

interface AdminSidebarProps {
  permissions: AppPermissions | null;
  isAdminPrivileges: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ permissions, isAdminPrivileges, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<Record<string, number>>({
    orders: 0,
    messages: 0,
    reviews: 0
  });

  // Fetch notification counts periodically
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/v1/notifications");
        const json = await res.json();
        if (json.success) {
          setNotifications(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch notification counts", err);
      }
    };

    fetchNotifications();
    
    // Poll every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);
    
    // Listen for manual refresh events
    window.addEventListener('refreshNotifications', fetchNotifications);

    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshNotifications', fetchNotifications);
    };
  }, []);

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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}
      
      <aside className={`fixed top-0 left-0 h-screen w-60 bg-[#18181A] flex flex-col z-50 shadow-2xl border-r border-white/5 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-black border border-[#D98C1F]/20 relative">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm leading-none mb-0.5 tracking-wide">Fathima&apos;s</span>
              <span className="text-[#D98C1F] text-[9px] font-bold tracking-[0.2em] uppercase">Admin Panel</span>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[#666] text-[10px] font-semibold tracking-widest uppercase px-3 mb-3">Menu</p>
        <ul className="space-y-0.5">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const badgeCount = item.notificationKey ? notifications[item.notificationKey] || 0 : 0;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                    isActive
                      ? "bg-gradient-to-r from-[#B8740F] to-[#D98C1F] text-white shadow-md"
                      : "text-[#888] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-[#666] group-hover:text-white"}`} />
                  <span className="flex-1">{item.label}</span>
                  
                  {badgeCount > 0 && (
                    <div className="flex items-center justify-center bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 min-w-[1.25rem] h-5 rounded-full shadow-sm">
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </div>
                  )}
                  
                  {isActive && badgeCount === 0 && <ChevronRight className="w-3 h-3 text-white/80" />}
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
    </>
  );
}
