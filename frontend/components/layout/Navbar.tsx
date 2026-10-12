"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Heart,
  User as UserIcon,
  ShoppingBag,
  Menu,
  Truck,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import BrandLogo from "@/components/common/BrandLogo";
import MegaMenu from "@/components/layout/MegaMenu";
import SmartSearchModal from "@/components/layout/SmartSearchModal";
import MobileNavDrawer from "@/components/layout/MobileNavDrawer";
import NotificationDropdown from "@/components/layout/NotificationDropdown";

export default function Navbar() {
  const { cart } = useCart();
  const { user } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Close menus on page route changes
  useEffect(() => {
    setMegaMenuOpen(false);
    setSearchModalOpen(false);
    setMobileNavOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnterMegaMenu = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    setMegaMenuOpen(true);
  };

  const handleMouseLeaveMegaMenu = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 150);
  };

  // Suppress storefront navbar on admin back-office routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-[#E8E4DF]"
            : "bg-white shadow-xs"
        }`}
      >
        {/* =========================================================
            4.1 TOP ANNOUNCEMENT BAR (Page 04 Blueprint + EN | తెలుగు Toggle)
        ========================================================= */}
        <div className="bg-[#6D001A] text-white text-xs py-2 px-3 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
          <div className="mx-auto max-w-7xl flex items-center justify-between gap-2">
            {/* Left: Free Shipping */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-amber-100/90 font-medium truncate">
              <Truck size={14} className="text-[#D4AF37] shrink-0" />
              <span className="truncate">
                <strong className="text-white font-semibold">{t("nav.freeShipping")}</strong>{" "}
                {t("nav.freeShippingSub")}
              </span>
            </div>

            {/* Center: Lotus + 100% Pure Silk + Easy Returns */}
            <div className="hidden md:flex items-center gap-3 text-[11px] sm:text-xs text-amber-100/90 font-medium">
              <span className="text-[#D4AF37] text-xs">🪷</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#D4AF37]" />
                <span>{t("nav.pureSilk")}</span>
              </span>
              <span className="text-[#D4AF37]/60">|</span>
              <span className="flex items-center gap-1.5">
                <RefreshCw size={13} className="text-[#D4AF37]" />
                <span>{t("nav.easyReturns")}</span>
              </span>
            </div>

            {/* Right: Language Switcher (EN | తెలుగు) + Track Order | Help */}
            <div className="flex items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs text-amber-100/90 font-medium shrink-0">
              {/* Bilingual Switcher: EN | తెలుగు */}
              <div
                className="inline-flex items-center rounded-full bg-black/25 p-0.5 border border-[#D4AF37]/40"
                role="group"
                aria-label="Language switcher"
              >
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                    lang === "en"
                      ? "bg-[#D4AF37] text-[#3B2F2F] shadow-2xs"
                      : "text-amber-100/80 hover:text-white"
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLang("te")}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                    lang === "te"
                      ? "bg-[#D4AF37] text-[#3B2F2F] shadow-2xs"
                      : "text-amber-100/80 hover:text-white"
                  }`}
                >
                  తెలుగు
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2.5">
                <span className="text-[#D4AF37]/60">|</span>
                <Link
                  href="/orders"
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {t("nav.trackOrder")}
                </Link>
                <span className="text-[#D4AF37]/60">|</span>
                <Link
                  href="/contact"
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {t("nav.help")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            MAIN HEADER BAR (Desktop & Mobile)
        ========================================================= */}
        <nav className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Mobile Hamburger & Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[#2D2A26] hover:bg-gray-100 lg:hidden transition"
              aria-label="Open mobile navigation"
            >
              <Menu size={22} />
            </button>

            <BrandLogo
              variant="horizontal"
              theme="light"
              height={44}
              href="/"
            />
          </div>

          {/* Center: Desktop Navigation Links matching Page 04 */}
          <ul className="hidden items-center gap-4 xl:gap-7 text-xs font-semibold uppercase tracking-wider text-[#2D2A26] lg:flex">
            {/* SAREES ▾ with Mega Menu Dropdown */}
            <li
              className="relative py-6"
              onMouseEnter={handleMouseEnterMegaMenu}
              onMouseLeave={handleMouseLeaveMegaMenu}
            >
              <button
                type="button"
                onClick={() => setMegaMenuOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1 transition-colors ${
                  megaMenuOpen
                    ? "text-[#6D001A] font-bold"
                    : "hover:text-[#6D001A]"
                }`}
              >
                <span>{t("nav.sareesCollections")}</span>
                <span className="text-[10px] text-[#D4AF37]">▾</span>
              </button>
            </li>

            <li>
              <Link
                href="/collections?sort=newest"
                className="transition-colors hover:text-[#6D001A]"
              >
                {t("nav.newArrivals")}
              </Link>
            </li>

            <li>
              <Link
                href="/collections?sort=popularity"
                className="transition-colors hover:text-[#6D001A]"
              >
                {t("nav.bestSellers")}
              </Link>
            </li>

            <li>
              <Link
                href="/about"
                className="transition-colors hover:text-[#6D001A]"
              >
                {t("nav.aboutUs")}
              </Link>
            </li>

            <li>
              <Link
                href="/collections?category=Bridal"
                className="font-bold text-[#6D001A] transition-colors hover:text-[#D4AF37]"
              >
                {lang === "te" ? "పెళ్లి పట్టు" : "Bridal Silks"}
              </Link>
            </li>
          </ul>

          {/* Right: Header Action Components (4.4) */}
          <div className="flex items-center gap-1 sm:gap-3 lg:gap-4 text-[#2D2A26]">
            {/* 1. SMART SEARCH (Magnifying glass button) */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-amber-50 hover:text-[#6D001A]"
              aria-label="Open Smart Search"
            >
              <Search size={20} />
            </button>

            {/* 2. WISHLIST */}
            <Link
              href="/wishlist"
              className="hidden md:flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-amber-50 hover:text-[#6D001A]"
              aria-label="Wishlist"
            >
              <Heart size={20} />
            </Link>

            {/* 3. NOTIFICATIONS */}
            <NotificationDropdown />

            {/* 4. USER ACCOUNT (Logout is kept in the Profile/Account area rather than the main Navbar) */}
            <div className="relative hidden md:block">
              {user ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-amber-50 hover:text-[#6D001A]"
                    aria-label="User Account"
                  >
                    <UserIcon size={20} />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-white p-2 shadow-xl border border-[#D4AF37]/30 z-50 text-xs">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <span className="block font-bold text-[#3B2F2F] truncate">
                          {user.name}
                        </span>
                        <span className="block text-[11px] text-gray-500 truncate">
                          {user.email}
                        </span>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-3 py-2 rounded-lg hover:bg-[#F9F5EC] text-[#3B2F2F] font-semibold"
                      >
                        {t("nav.myAccount")}
                      </Link>
                      <Link
                        href="/account/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-3 py-2 rounded-lg hover:bg-[#F9F5EC] text-gray-700 font-medium"
                      >
                        {t("nav.myProfile")}
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-3 py-2 rounded-lg hover:bg-[#F9F5EC] text-gray-700 font-medium"
                      >
                        {t("nav.myOrders")}
                      </Link>
                      <Link
                        href="/account/addresses"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-3 py-2 rounded-lg hover:bg-[#F9F5EC] text-gray-700 font-medium"
                      >
                        {t("nav.savedAddresses")}
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-amber-50 hover:text-[#6D001A]"
                  aria-label="Login"
                >
                  <UserIcon size={20} />
                </Link>
              )}
            </div>

            {/* 4. SHOPPING BAG with live count badge */}
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-amber-50 hover:text-[#6D001A]"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#6D001A] text-[10px] font-bold text-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </nav>

        {/* =========================================================
            5-COLUMN LUXURY MEGA MENU DROPDOWN (Page 04 Blueprint)
        ========================================================= */}
        {megaMenuOpen && (
          <div
            className="absolute left-0 right-0 top-full z-50 hidden lg:flex justify-center px-4 pt-1 animate-in fade-in zoom-in-98 duration-150"
            onMouseEnter={handleMouseEnterMegaMenu}
            onMouseLeave={handleMouseLeaveMegaMenu}
          >
            <MegaMenu onClose={() => setMegaMenuOpen(false)} />
          </div>
        )}
      </header>

      {/* =========================================================
          4.3 MOBILE SLIDE DRAWER
      ========================================================= */}
      <MobileNavDrawer
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        user={user}
        onOpenSearch={() => {
          setMobileNavOpen(false);
          setSearchModalOpen(true);
        }}
      />

      {/* =========================================================
          4.4 SMART SEARCH MODAL (Trending & Recent Searches)
      ========================================================= */}
      <SmartSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}