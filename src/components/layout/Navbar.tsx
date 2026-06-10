"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ShoppingCart, User, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  {
    label: "Categories",
    href: "/categories",
    children: [
      { label: "All Categories", href: "/categories" },
      { label: "Biriyani Kit", href: "/products?category=biriyani-kit" },
      { label: "Ghee Rice Combo", href: "/products?category=ghee-rice-combo-kit" },
      { label: "Sambals", href: "/products?category=sambals" },
      { label: "Pickles", href: "/products?category=pickles" },
      { label: "Seenima", href: "/products?category=seenima" },
      { label: "Umbalakada", href: "/products?category=umbalakada" },
      { label: "Beef Products", href: "/products?category=beef-products" },
    ],
  },
  { label: "Gift Packs", href: "/gift-packs" },
  { label: "Custom Orders", href: "/custom-orders" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

import { useCartStore } from "@/store/cartStore";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authDropdown, setAuthDropdown] = useState(false);
  const pathname = usePathname();
  
  const items = useCartStore((state) => state.items);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
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
    setCartCount(items.reduce((acc, item) => acc + item.qty, 0));
  }, [items]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Top Announcement Bar */}
      <div className="bg-[#556B4F] text-white text-xs py-2 overflow-hidden">
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
                    <svg className="w-full h-full text-[#B8740F]" viewBox="0 0 100 100" fill="currentColor">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
                      <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                      <path d="M48 76 L52 76 L52 48 C52 43, 55 38, 60 36 C55 35, 51 40, 50 43 C49 40, 45 35, 40 36 C45 38, 48 43, 48 48 Z" />
                      <circle cx="50" cy="28" r="8" />
                      <circle cx="39" cy="37" r="7" />
                      <circle cx="61" cy="37" r="7" />
                      <circle cx="44" cy="46" r="5" />
                      <circle cx="56" cy="46" r="5" />
                      <path d="M48 76 L42 81 M52 76 L58 81 M50 76 L50 83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
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
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors relative group ${
                        isActive ? "text-[#D98C1F]" : "text-[#222222] hover:text-[#D98C1F]"
                      }`}
                    >
                      {link.label}
                      {link.children && (
                        <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                      )}
                      {isActive && (
                        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#D98C1F] rounded-full" />
                      )}
                      {!isActive && (
                        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#D98C1F] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
                      )}
                    </Link>

                    {/* Dropdown */}
                    {link.children && activeDropdown === link.label && (
                      <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-[#444] hover:text-[#D98C1F] hover:bg-[#FAF7F2] transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="w-1/4 flex justify-end items-center gap-2">
              <button
                id="navbar-search-btn"
                aria-label="Search"
                className="p-2 rounded-lg text-[#555] hover:text-[#D98C1F] hover:bg-[#FAF7F2] transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {currentUser ? (
                <div className="relative" onMouseEnter={() => setAuthDropdown(true)} onMouseLeave={() => setAuthDropdown(false)}>
                  <button
                    id="navbar-account-btn"
                    className="p-2 rounded-lg text-[#555] hover:text-[#D98C1F] hover:bg-[#FAF7F2] transition-colors flex items-center justify-center"
                    aria-label="User account menu"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#556B4F] hover:bg-[#D98C1F] text-white flex items-center justify-center text-xs font-bold transition-colors shadow-sm">
                      {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : currentUser.email ? currentUser.email[0].toUpperCase() : "U"}
                    </div>
                  </button>
                  {authDropdown && (
                    <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 text-xs text-[#999] border-b border-gray-100 font-medium truncate">
                        Signed in as:<br />
                        <span className="font-semibold text-[#222] block mt-0.5">{currentUser.email}</span>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
                      >
                        Sign Out
                      </button>
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
                <div key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-[#222] hover:text-[#D98C1F] hover:bg-[#FAF7F2] rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="pl-6 space-y-0.5">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2 text-sm text-[#666] hover:text-[#D98C1F] rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
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
