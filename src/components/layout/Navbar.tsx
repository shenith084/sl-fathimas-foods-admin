"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search, ShoppingCart, User, LayoutDashboard, Package, LogOut } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Gift Packs", href: "/gift-packs" },
  { label: "Custom Orders", href: "/custom-orders" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

import { useCartStore } from "@/store/cartStore";
import { auth, db } from "@/lib/firebase/client";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { getUserRoleData } from "@/lib/services/userService";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userRoleName, setUserRoleName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authDropdown, setAuthDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  
  const items = useCartStore((state) => state.items);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const roleData = await getUserRoleData(user.uid, user.email);
        setUserRoleName(roleData?.name || "Customer");
        setIsAdmin(roleData ? (roleData.isAdminPrivileges || roleData.isActive) : false);
      } else {
        setUserRoleName(null);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setAuthDropdown(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setAuthDropdown(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setShowSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setCartCount(items.reduce((acc, item) => acc + item.qty, 0));
  }, [items]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Top Announcement Bar */}
      <div className="bg-[#2C4631] text-white text-xs py-2 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-6 md:gap-12 flex-wrap text-center">
            {[
              { icon: "🌿", text: "Made with Natural Ingredients" },
              { icon: "🏠", text: "100% Homemade" },
              { icon: "✅", text: "No Artificial Preservatives" },
              { icon: "🚚", text: "Delivery Across Sri Lanka & Overseas" },
            ].map((item) => (
              <span key={item.text} className="flex items-center gap-1.5 font-medium whitespace-nowrap">
                <span>{item.icon}</span>
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`bg-white border-b transition-all duration-300 ${
          isScrolled ? "shadow-md border-gray-200" : "border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="w-1/4 flex justify-start">
              <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center bg-[#FAF7F2] p-1 border border-[#B8740F]/30 shadow-sm">
                    <img src="/logo.png" alt="Fathima's" className="w-full h-full object-cover rounded-full" />
                  </div>
                </div>
                <div className="leading-none">
                  <div className="font-display font-bold text-[#B8740F] text-base md:text-lg tracking-wide">
                    SL FATHIMA&apos;S
                  </div>
                  <div className="font-display font-semibold text-[#D98C1F] text-[10px] md:text-[11px] tracking-[0.25em] mt-1.5">
                    FOODS
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex flex-1 justify-center items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors relative group ${
                      isActive ? "text-[#D98C1F]" : "text-[#222222] hover:text-[#D98C1F]"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#D98C1F] rounded-full" />
                    )}
                    {!isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#D98C1F] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Actions */}
            <div className="w-1/4 flex justify-end items-center gap-2">
              <div ref={searchContainerRef} className="relative">
                <button
                  id="navbar-search-btn"
                  aria-label="Search"
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 rounded-lg text-[#555] hover:text-[#D98C1F] hover:bg-[#FAF7F2] transition-colors flex items-center justify-center"
                >
                  <Search className="w-5 h-5" />
                </button>
                {showSearch && (
                  <div className="absolute right-0 top-[calc(100%+0.5rem)] w-72 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-3 z-50 animate-fade-in origin-top-right">
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <input
                        type="text"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D98C1F]/30 focus:border-[#D98C1F] transition-all"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </form>
                  </div>
                )}
              </div>

              {currentUser ? (
                <div ref={dropdownRef} className="relative">
                  <button
                    id="navbar-account-btn"
                    onClick={() => setAuthDropdown(!authDropdown)}
                    className="p-2 rounded-lg text-[#555] hover:text-[#D98C1F] hover:bg-[#FAF7F2] transition-colors flex items-center justify-center"
                    aria-label="User account menu"
                  >
                    <div className={`w-7 h-7 rounded-full ${isAdmin ? "bg-[#D98C1F]" : "bg-[#2C4631]"} hover:opacity-90 text-white flex items-center justify-center text-xs font-bold transition-colors shadow-sm`}>
                      {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : currentUser.email ? currentUser.email[0].toUpperCase() : "U"}
                    </div>
                  </button>
                  {authDropdown && (
                    <div className="absolute right-0 top-[calc(100%+0.5rem)] w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-50 animate-fade-in overflow-hidden">
                      <div className="px-5 py-4 border-b border-gray-50 bg-[#FAF7F2]/50">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#D98C1F] font-bold mb-1">{isAdmin ? `Crown Admin` : `Valued Customer`}</p>
                        <p className="text-sm font-display font-semibold text-[#222] truncate">{currentUser.displayName || currentUser.email}</p>
                      </div>
                      
                      <div className="py-2 px-2">
                        {isAdmin ? (
                          <>
                            <Link
                              href="/admin/dashboard"
                              onClick={() => setAuthDropdown(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#555] hover:text-[#D98C1F] hover:bg-[#FAF7F2] transition-colors font-medium group"
                            >
                              <LayoutDashboard className="w-4 h-4 text-[#888] group-hover:text-[#D98C1F] transition-colors" /> Admin Panel
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              href="/account"
                              onClick={() => setAuthDropdown(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#555] hover:text-[#D98C1F] hover:bg-[#FAF7F2] transition-colors font-medium group"
                            >
                              <User className="w-4 h-4 text-[#888] group-hover:text-[#D98C1F] transition-colors" /> My Account
                            </Link>
                            <Link
                              href="/account/orders"
                              onClick={() => setAuthDropdown(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#555] hover:text-[#D98C1F] hover:bg-[#FAF7F2] transition-colors font-medium group"
                            >
                              <Package className="w-4 h-4 text-[#888] group-hover:text-[#D98C1F] transition-colors" /> My Orders
                            </Link>
                          </>
                        )}
                      </div>
                      
                      <div className="border-t border-gray-50 mt-1 pt-2 px-2 pb-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium group"
                        >
                          <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-500 transition-colors" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth"
                  id="navbar-account-btn"
                  aria-label="Account"
                  className="p-2 rounded-lg text-[#555] hover:text-[#D98C1F] hover:bg-[#FAF7F2] transition-colors"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              <Link
                href="/cart"
                id="navbar-cart-btn"
                aria-label="Shopping cart"
                className="relative p-2 rounded-lg text-[#555] hover:text-[#D98C1F] hover:bg-[#FAF7F2] transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D98C1F] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile hamburger */}
              <button
                id="navbar-mobile-menu-btn"
                aria-label="Open menu"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-[#555] hover:text-[#D98C1F] hover:bg-[#FAF7F2] transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-[#222] hover:text-[#D98C1F] hover:bg-[#FAF7F2] rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {currentUser && (
                <div className="pt-2 border-t border-gray-100 space-y-1">
                  {isAdmin ? (
                    <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#D98C1F] hover:bg-[#FAF7F2] rounded-lg">
                      <LayoutDashboard className="w-4 h-4" /> Admin Panel
                    </Link>
                  ) : (
                    <>
                      <Link href="/account" onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#222] hover:bg-[#FAF7F2] rounded-lg">
                        <User className="w-4 h-4" /> My Account
                      </Link>
                      <Link href="/account/orders" onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#222] hover:bg-[#FAF7F2] rounded-lg">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                    </>
                  )}
                  <button onClick={() => { handleSignOut(); setMobileOpen(false); }}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg w-full">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
              <div className="pt-3 border-t border-gray-100">
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#D98C1F] text-white font-semibold rounded-xl text-sm hover:bg-[#B8740F] transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  View Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
