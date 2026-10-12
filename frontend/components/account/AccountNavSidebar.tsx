"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  Ticket,
  Sparkles,
  User,
  Bell,
  Star,
  RotateCcw,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface AccountNavSidebarProps {
  activeTab?: string;
  onSelectTab?: (tabKey: string) => void;
}

export const ACCOUNT_NAV_ITEMS = [
  {
    key: "dashboard",
    label: "DASHBOARD",
    href: "/account",
    icon: LayoutDashboard,
  },
  {
    key: "orders",
    label: "MY ORDERS",
    href: "/account/orders",
    icon: ShoppingBag,
  },
  {
    key: "wishlist",
    label: "WISHLIST",
    href: "/account/wishlist",
    icon: Heart,
  },
  {
    key: "addresses",
    label: "ADDRESSES",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    key: "profile",
    label: "PROFILE DETAILS",
    href: "/account/profile",
    icon: User,
  },
  {
    key: "rewards",
    label: "REWARD POINTS",
    href: "/account/rewards",
    icon: Sparkles,
  },
  {
    key: "reviews",
    label: "MY REVIEWS",
    href: "/account/reviews",
    icon: Star,
  },
  {
    key: "returns",
    label: "RETURNS & REFUNDS",
    href: "/account/returns",
    icon: RotateCcw,
  },
  {
    key: "security",
    label: "SECURITY",
    href: "/account/security",
    icon: LockIcon,
  },
  {
    key: "logout",
    label: "LOGOUT",
    href: "#logout",
    icon: LogOut,
    isAction: true,
  },
];

function LockIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function AccountNavSidebar({
  activeTab,
  onSelectTab,
}: AccountNavSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out of your account");
    router.push("/");
  };

  return (
    <aside className="w-full">
      <div className="overflow-hidden rounded-2xl border border-amber-200/60 bg-white shadow-xs">
        <nav className="p-2 grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col gap-1.5 lg:gap-0 lg:space-y-1">
          {ACCOUNT_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isLogout = item.isAction;

            // Determine if active
            const isActive = activeTab
              ? activeTab === item.key
              : item.key === "dashboard"
              ? pathname === "/account"
              : item.href !== "#" &&
                !isLogout &&
                (pathname === item.href || pathname.startsWith(`${item.href}/`));

            if (isLogout) {
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 lg:gap-3.5 rounded-xl px-3 py-2.5 lg:px-4 lg:py-3 text-[11px] lg:text-xs font-bold uppercase tracking-wider text-rose-700 hover:bg-rose-50/80 transition-colors text-left cursor-pointer"
                >
                  <Icon size={15} className="text-rose-600 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            }

            const handleClick = (e: React.MouseEvent) => {
              if (onSelectTab) {
                onSelectTab(item.key);
              }
              if (item.href.startsWith("#")) {
                e.preventDefault();
                const el = document.getElementById(item.href.slice(1));
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }
            };

            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={handleClick}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 lg:px-4 lg:py-3 text-[11px] lg:text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                  isActive
                    ? "bg-[#6D001A] text-white shadow-sm"
                    : "text-[#2D2A26] bg-stone-50/60 lg:bg-transparent hover:bg-[#FAF6EE] hover:text-[#6D001A]"
                }`}
              >
                <div className="flex items-center gap-2.5 lg:gap-3.5 min-w-0">
                  <Icon
                    size={15}
                    className={`shrink-0 transition-colors ${
                      isActive
                        ? "text-amber-300"
                        : "text-[#7A1F2B]/70 group-hover:text-[#6D001A]"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                <ChevronRight
                  size={14}
                  className={`hidden lg:block shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 ${
                    isActive ? "text-amber-300" : "text-gray-300 group-hover:text-[#6D001A]"
                  }`}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
