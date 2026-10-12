"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Ticket,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Plus,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { getCurrentUser } from "@/services/api";
import BrandLogo from "@/components/common/BrandLogo";

interface AdminUser {
  name: string;
  email: string;
  role: string;
}

interface NavSection {
  title: string;
  items: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        name: "Analytics & Trends",
        href: "/admin/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Catalog & Sales",
    items: [
      {
        name: "Sarees & Inventory",
        href: "/admin/products",
        icon: Package,
      },
      {
        name: "Orders & Shipments",
        href: "/admin/orders",
        icon: ShoppingBag,
      },
      {
        name: "Coupons & Offers",
        href: "/admin/coupons",
        icon: Ticket,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        name: "Customers & Admins",
        href: "/admin/users",
        icon: Users,
      },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    async function checkAdminAccess() {
      try {
        const token = localStorage.getItem("silkverse-token");

        if (!token) {
          router.replace("/login");
          return;
        }

        const user = await getCurrentUser(token);

        if (!user || user.role !== "admin") {
          router.replace("/");
          return;
        }

        setAdminUser(user);
        setCheckingAuth(false);
      } catch {
        localStorage.removeItem("silkverse-token");
        router.replace("/login");
      }
    }

    checkAdminAccess();
  }, [router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("silkverse-token");
    localStorage.removeItem("silkverse-user");
    router.replace("/login");
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F7F5]">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#EBE4DC] bg-white p-8 shadow-sm">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-[#E5D5C5]" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-[#7A1F2B] border-t-transparent" />
          </div>
          <div className="text-center">
            <h3 className="font-serif text-lg font-bold text-[#3B151E]">
              Authenticating Admin Console
            </h3>
            <p className="text-xs text-stone-500">
              Verifying security credentials & session permissions...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Helper to determine active route
  const isItemActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  // Get current breadcrumb
  const getCurrentPageTitle = () => {
    for (const section of navSections) {
      for (const item of section.items) {
        if (isItemActive(item.href)) {
          return item.name;
        }
      }
    }
    if (pathname.includes("/products/new")) return "Add New Saree";
    if (pathname.includes("/products/")) return "Edit Saree";
    if (pathname.includes("/orders/")) return "Order Details";
    return "Dashboard";
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* Brand Header */}
        <div className="border-b border-[#5F1420] px-5 py-5">
          <div className="flex items-center justify-between pr-10 lg:pr-0">
            <BrandLogo variant="horizontal" theme="dark" height={32} href="/admin" />
            <span className="flex items-center gap-1 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#F5E6BE]">
              <ShieldCheck className="h-2.5 w-2.5 text-[#D4AF37]" />
              Console
            </span>
          </div>
          <p className="mt-2 text-[10px] uppercase tracking-wider text-rose-200/60">
            SilkVerse Enterprise Portal
          </p>
        </div>

        {/* Navigation Sections */}
        <nav className="mt-4 space-y-6 px-3">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-rose-200/50">
                {section.title}
              </p>
              <div className="mt-2 space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                        active
                          ? "border-l-4 border-[#D4AF37] bg-[#61121E] font-semibold text-white shadow-sm"
                          : "text-rose-100/75 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                            active ? "text-[#D4AF37]" : "text-rose-200/70"
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="rounded-full bg-[#D4AF37] px-1.5 py-0.5 text-[9px] font-bold text-black">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Profile & Utilities */}
      <div className="border-t border-[#5F1420] p-4">
        {/* Live Storefront Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-rose-100 transition hover:bg-white/10 hover:text-white"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5 text-[#D4AF37]" />
            Live Storefront
          </span>
          <span className="text-[10px] text-rose-300">↗</span>
        </Link>

        {/* User Card */}
        <div className="flex items-center justify-between rounded-xl bg-[#390A12] p-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37] text-xs font-bold text-[#450C16]">
              {adminUser?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">
                {adminUser?.name || "Administrator"}
              </p>
              <p className="truncate text-[10px] text-rose-300/80">
                {adminUser?.email || "admin@silkverse.com"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Log Out"
            className="rounded-lg p-1.5 text-rose-300/70 transition hover:bg-white/10 hover:text-rose-100"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8F7F5] text-stone-800 antialiased">
      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[#380911] bg-[#490D17] text-white shadow-xl lg:flex">
        <SidebarContent />
      </aside>

      {/* =========================================================
          MOBILE SLIDE-OVER SIDEBAR
      ========================================================= */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 flex h-full w-72 flex-col bg-[#490D17] text-white shadow-2xl">
            <div className="absolute right-3 top-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="rounded-lg p-1.5 text-rose-200 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* =========================================================
          MAIN APPLICATION AREA
      ========================================================= */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E8E2DA] bg-white/95 px-4 backdrop-blur-md sm:px-8 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="rounded-lg border border-stone-200 p-2 text-stone-600 hover:bg-stone-100 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-stone-400">Admin</span>
              <ChevronRight className="h-3 w-3 text-stone-400" />
              <span className="font-bold text-[#490D17]">{getCurrentPageTitle()}</span>
            </div>
          </div>

          {/* Quick Actions & Live Indicator */}
          <div className="flex items-center gap-3">
            {/* Store Status Indicator */}
            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Storefront Online
            </div>

            {/* Direct Link to Store */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-xs transition hover:border-[#D4AF37] hover:text-[#490D17] md:flex"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Store
            </Link>

            {/* Add Saree Quick Action */}
            <Link
              href="/admin/products/new"
              className="flex items-center gap-1.5 rounded-lg bg-[#7A1F2B] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#5E141F]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add</span> Saree
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}