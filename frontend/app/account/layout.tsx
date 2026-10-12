"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ChevronRight, LayoutDashboard } from "lucide-react";
import AccountNavSidebar, { ACCOUNT_NAV_ITEMS } from "@/components/account/AccountNavSidebar";

interface AccountLayoutProps {
  children: ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname();

  // The main account dashboard (/account) has its own complete Page 09 blueprint layout
  if (pathname === "/account") {
    return <>{children}</>;
  }

  const activeItem = ACCOUNT_NAV_ITEMS.find(
    (item) => item.href !== "/account" && item.href !== "#logout" && pathname.startsWith(item.href)
  );
  const currentSectionTitle = activeItem ? activeItem.label : "ACCOUNT SECTION";

  return (
    <main className="min-h-screen bg-[#F9F5EC] pb-16">
      {/* Top Account Sub-Page Navigation Bar (Visible on Mobile, Tablet, Laptop & Desktop) */}
      <div className="border-b border-[#E8E4DF] bg-white py-3.5 sm:py-4 shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-stone-500">
            <Link href="/" className="hover:text-[#6D001A] transition-colors">
              Home
            </Link>
            <ChevronRight size={13} className="shrink-0" />
            <Link href="/account" className="hover:text-[#6D001A] transition-colors font-semibold text-stone-700">
              My Account
            </Link>
            <ChevronRight size={13} className="shrink-0" />
            <span className="text-[#6D001A] font-bold uppercase tracking-wider text-[11px]">
              {currentSectionTitle}
            </span>
          </nav>

          {/* Prominent Back to Account Dashboard Button */}
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D4AF37]/60 bg-[#FFF8F0] px-3.5 py-2 text-xs font-bold text-[#6D001A] hover:bg-[#6D001A] hover:text-white transition shadow-2xs"
          >
            <ArrowLeft size={14} />
            <span>Back to My Account</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Account Section Navigation Sidebar / Responsive Grid */}
          <div className="lg:col-span-3">
            <AccountNavSidebar />
          </div>

          {/* Sub-page Content */}
          <div className="lg:col-span-9 min-w-0">
            <div className="rounded-2xl border border-[#D4AF37]/40 bg-white p-4 sm:p-6 lg:p-8 shadow-xs">
              {children}
            </div>

            {/* Bottom Back to Dashboard Link for Mobile/Tablet convenience after scrolling */}
            <div className="mt-5 flex justify-between items-center lg:hidden">
              <Link
                href="/account"
                className="inline-flex items-center gap-2 rounded-xl bg-white border border-stone-200 px-4 py-2.5 text-xs font-bold text-[#6D001A] shadow-2xs hover:bg-[#FFF8F0]"
              >
                <LayoutDashboard size={14} />
                <span>← Back to Account Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}