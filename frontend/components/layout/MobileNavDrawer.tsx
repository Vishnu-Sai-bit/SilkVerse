"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  Plus,
  Minus,
  Package,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Flame,
} from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";
import { useLanguage } from "@/context/LanguageContext";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onOpenSearch: () => void;
}

export default function MobileNavDrawer({
  isOpen,
  onClose,
  user,
  onOpenSearch,
}: MobileNavDrawerProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("sarees");
  const { lang, setLang } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] lg:hidden">
      {/* Dark backdrop covering full screen including bottom nav */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 z-[71] w-[85%] max-w-sm bg-[#6D001A] text-white p-6 pb-8 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
        <div>
          {/* Header with Logo and Close */}
          <div className="flex items-center justify-between pb-6 border-b border-white/15">
            <BrandLogo variant="horizontal" theme="dark" height={40} href="/" />
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links Accordion */}
          <nav className="mt-6 space-y-1">
            {/* UNIFIED SAREES & COLLECTIONS ACCORDION */}
            <div className="border-b border-white/10">
              <button
                type="button"
                onClick={() => toggleSection("sarees")}
                className="flex w-full items-center justify-between py-3 text-sm font-semibold uppercase tracking-wider text-white hover:text-[#D4AF37] transition text-left cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>SHOP SAREES</span>
                  <span className="rounded-full bg-[#D4AF37]/20 px-2 py-0.5 text-[10px] font-bold text-[#D4AF37]">
                    Handloom
                  </span>
                </span>
                <span className="text-[#D4AF37]">
                  {expandedSection === "sarees" ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>

              {expandedSection === "sarees" && (
                <div className="pl-3 pb-4 pt-1 space-y-3.5 text-xs text-amber-100/90 animate-in fade-in">
                  {/* Shop All Sarees CTA */}
                  <Link
                    href="/products"
                    onClick={onClose}
                    className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 font-bold text-[#D4AF37] hover:bg-white/20 hover:text-white transition"
                  >
                    <span>Browse All Sarees</span>
                    <ArrowRight size={13} />
                  </Link>

                  {/* By Fabric & Craft */}
                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]/80">
                      By Silk & Weave
                    </span>
                    <div className="space-y-1 pl-2 border-l border-white/20">
                      <Link href="/products?fabric=Kanchipuram%20Silk" onClick={onClose} className="block py-1 hover:text-white transition">Kanchipuram Silk</Link>
                      <Link href="/products?fabric=Banarasi%20Silk" onClick={onClose} className="block py-1 hover:text-white transition">Banarasi Brocade</Link>
                      <Link href="/products?fabric=Paithani%20Silk" onClick={onClose} className="block py-1 hover:text-white transition">Paithani Silk</Link>
                      <Link href="/products?category=Soft%20Silk" onClick={onClose} className="block py-1 hover:text-white transition">Soft Lightweight Silk</Link>
                      <Link href="/products?category=Luxury%20Silk" onClick={onClose} className="block py-1 hover:text-white transition">Luxury Heavy Zari</Link>
                    </div>
                  </div>

                  {/* By Occasion & Curation */}
                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]/80">
                      By Occasion
                    </span>
                    <div className="space-y-1 pl-2 border-l border-white/20">
                      <Link href="/collections?occasion=Wedding" onClick={onClose} className="block py-1 hover:text-white transition">Wedding Silk Sarees</Link>
                      <Link href="/collections?occasion=Bridal" onClick={onClose} className="block py-1 hover:text-white transition">Bridal Trousseau</Link>
                      <Link href="/collections?occasion=Festive" onClick={onClose} className="block py-1 hover:text-white transition">Festive Celebrations</Link>
                      <Link href="/collections?occasion=Party%20Wear" onClick={onClose} className="block py-1 hover:text-white transition">Party & Evening Wear</Link>
                      <Link href="/collections" onClick={onClose} className="block pt-1 font-semibold text-[#D4AF37] hover:text-amber-200 transition">
                        View All Curated Collections →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* NEW ARRIVALS */}
            <Link
              href="/collections?sort=newest"
              onClick={onClose}
              className="flex items-center justify-between py-3 text-sm font-semibold uppercase tracking-wider text-white hover:text-[#D4AF37] transition border-b border-white/10"
            >
              <span>NEW ARRIVALS</span>
              <Sparkles size={14} className="text-[#D4AF37]" />
            </Link>

            {/* BEST SELLERS */}
            <Link
              href="/collections?sort=popularity"
              onClick={onClose}
              className="flex items-center justify-between py-3 text-sm font-semibold uppercase tracking-wider text-white hover:text-[#D4AF37] transition border-b border-white/10"
            >
              <span>BEST SELLERS</span>
              <Flame size={14} className="text-amber-300" />
            </Link>

            {/* BRIDAL TROUSSEAU */}
            <Link
              href="/collections?category=Bridal"
              onClick={onClose}
              className="flex items-center justify-between py-3 text-sm font-bold uppercase tracking-wider text-[#D4AF37] hover:text-amber-200 transition border-b border-white/10"
            >
              <span>BRIDAL TROUSSEAU</span>
              <span className="rounded bg-[#D4AF37] px-2 py-0.5 text-[10px] font-bold text-[#6D001A]">
                ROYAL
              </span>
            </Link>

            {/* ABOUT US + */}
            <div className="border-b border-white/10">
              <button
                type="button"
                onClick={() => toggleSection("about")}
                className="flex w-full items-center justify-between py-3 text-sm font-semibold uppercase tracking-wider text-white hover:text-[#D4AF37] transition text-left cursor-pointer"
              >
                <span>OUR HERITAGE</span>
                <span className="text-[#D4AF37]">
                  {expandedSection === "about" ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
              {expandedSection === "about" && (
                <div className="pl-4 pb-3 space-y-2 text-xs text-amber-100/80 animate-in fade-in">
                  <Link href="/about#story" onClick={onClose} className="block py-1 hover:text-white transition">The Dharmavaram Story</Link>
                  <Link href="/about#authenticity" onClick={onClose} className="block py-1 hover:text-white transition">Silk Mark India Certification</Link>
                  <Link href="/about#artisans" onClick={onClose} className="block py-1 hover:text-white transition">Artisan Pit-Looms &amp; Weavers</Link>
                </div>
              )}
            </div>

            {/* BLOG */}
            <Link
              href="/about"
              onClick={onClose}
              className="block py-3 text-sm font-semibold uppercase tracking-wider text-white hover:text-[#D4AF37] transition border-b border-white/10"
            >
              BLOG &amp; CARE GUIDE
            </Link>

            {/* CONTACT US */}
            <Link
              href="/contact"
              onClick={onClose}
              className="block py-3 text-sm font-semibold uppercase tracking-wider text-white hover:text-[#D4AF37] transition border-b border-white/10"
            >
              CONTACT US
            </Link>
          </nav>
        </div>

        {/* Bottom Quick Access Bar */}
        <div className="pt-5 border-t border-white/15 space-y-3">
          {/* Mobile Language Switcher (EN | తెలుగు) */}
          <div className="flex items-center justify-between rounded-xl bg-black/25 px-3 py-2 border border-[#D4AF37]/30">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-100/90">
              Language / భాష
            </span>
            <div className="inline-flex items-center rounded-full bg-black/30 p-0.5 border border-[#D4AF37]/40">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                  lang === "en"
                    ? "bg-[#D4AF37] text-[#3B2F2F] shadow-2xs"
                    : "text-amber-100/80 hover:text-white"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang("te")}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                  lang === "te"
                    ? "bg-[#D4AF37] text-[#3B2F2F] shadow-2xs"
                    : "text-amber-100/80 hover:text-white"
                }`}
              >
                తెలుగు
              </button>
            </div>
          </div>

          {/* Service Links (Track Orders & Help) */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <Link
              href="/orders"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition cursor-pointer"
            >
              <Package size={16} className="text-[#D4AF37]" />
              <span className="text-[11px] font-medium leading-tight">Track Orders</span>
            </Link>

            <Link
              href="/contact"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition cursor-pointer"
            >
              <HelpCircle size={16} className="text-[#D4AF37]" />
              <span className="text-[11px] font-medium leading-tight">Help &amp; FAQs</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
