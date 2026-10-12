"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Store,
  Sparkles,
  Heart,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Hide bottom nav on product detail pages (where sticky buy bar is present), checkout, and admin routes
  if (pathname.match(/^\/products\/[^/]+$/) || pathname === "/checkout" || pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      name: "Shop",
      href: "/products",
      icon: Store,
      isActive: pathname.startsWith("/products"),
    },
    {
      name: "Collections",
      href: "/collections",
      icon: Sparkles,
      isActive: pathname.startsWith("/collections"),
    },
    {
      name: "Wishlist",
      href: "/wishlist",
      icon: Heart,
      isActive: pathname === "/wishlist" || pathname === "/account/wishlist",
    },
    {
      name: user ? "Account" : "Sign In",
      href: user ? "/account" : "/login",
      icon: User,
      isActive: pathname.startsWith("/account") || pathname === "/login",
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-stone-200 bg-white/95 px-2 backdrop-blur-md md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center py-1 transition-colors ${
              item.isActive
                ? "text-[#380A0A] font-semibold"
                : "text-stone-500 hover:text-[#380A0A]"
            }`}
          >
            <div className="relative">
              <Icon
                size={20}
                className={item.isActive ? "text-[#380A0A] stroke-[2.2]" : "text-stone-500 stroke-[1.8]"}
              />
            </div>
            <span
              className={`mt-1 text-[10px] tracking-tight ${
                item.isActive ? "text-[#380A0A] font-bold" : "text-stone-500"
              }`}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
