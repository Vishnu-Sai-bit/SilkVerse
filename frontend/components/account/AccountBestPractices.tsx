"use client";

import {
  RotateCcw,
  ShieldCheck,
  Truck,
  Headphones,
  User,
  ArrowLeftRight,
  Globe,
  Lock,
  Star,
  Smartphone,
} from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";

export default function AccountBestPractices() {
  const WHY_SHOP_POINTS = [
    {
      icon: (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-[#C9A227] border border-amber-200/60 shadow-2xs">
          <BrandLogo variant="icon" height={20} />
        </span>
      ),
      title: "100% Pure Silk",
      subtitle: "Assured Quality",
    },
    {
      icon: (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-[#C9A227] border border-amber-200/60 shadow-2xs">
          <RotateCcw size={20} className="text-[#C9A227]" />
        </span>
      ),
      title: "Easy Returns",
      subtitle: "within 7 days",
    },
    {
      icon: (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-[#C9A227] border border-amber-200/60 shadow-2xs">
          <ShieldCheck size={20} className="text-[#C9A227]" />
        </span>
      ),
      title: "Secure Payments",
      subtitle: "100% Safe",
    },
    {
      icon: (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-[#C9A227] border border-amber-200/60 shadow-2xs">
          <Truck size={20} className="text-[#C9A227]" />
        </span>
      ),
      title: "Free Shipping",
      subtitle: "above ₹2,999",
    },
    {
      icon: (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-[#C9A227] border border-amber-200/60 shadow-2xs">
          <Headphones size={20} className="text-[#C9A227]" />
        </span>
      ),
      title: "Customer Support",
      subtitle: "24/7 Support",
    },
  ];

  const DASHBOARD_PILLARS = [
    {
      icon: User,
      title: "PERSONALIZED",
      desc: "Show relevant info at a glance.",
    },
    {
      icon: ArrowLeftRight,
      title: "EASY NAVIGATION",
      desc: "Clear menu for quick access to features.",
    },
    {
      icon: Globe,
      title: "ORDER TRACKING",
      desc: "Real-time status and updates.",
    },
    {
      icon: Lock,
      title: "SECURE & PRIVATE",
      desc: "Protect customer data with best security.",
    },
    {
      icon: Star,
      title: "REWARDS & LOYALTY",
      desc: "Encourage engagement with rewards.",
    },
    {
      icon: Smartphone,
      title: "MOBILE FRIENDLY",
      desc: "Optimized experience on all devices.",
    },
  ];

  return (
    <div className="space-y-8 mt-10">
      {/* 1. WHY SHOP WITH SILKVERSE STRIP (Page 09 Blueprint) */}
      <div className="rounded-2xl border border-amber-200/80 bg-[#FFFDF9] p-6 shadow-xs">
        <h3 className="text-center font-serif text-sm font-bold uppercase tracking-[0.2em] text-[#6D001A] mb-5">
          Why Shop With SilkVerse
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {WHY_SHOP_POINTS.map((pt, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-amber-50/50"
            >
              {pt.icon}
              <div className="text-left">
                <p className="text-xs font-bold text-[#2D2A26]">{pt.title}</p>
                <p className="text-[11px] text-gray-500 font-medium">{pt.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. ACCOUNT DASHBOARD BEST PRACTICES (6 Pillars) */}
      <div className="rounded-2xl border border-amber-200/60 bg-white p-6 sm:p-8 shadow-xs">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-amber-300" />
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#C9A227] uppercase">
              SilkVerse Experience
            </span>
            <span className="h-px w-8 bg-amber-300" />
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#6D001A] mt-1 uppercase">
            Account Dashboard Best Practices
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {DASHBOARD_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-3 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all duration-200 group"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-[#6D001A] border border-amber-200/60 group-hover:bg-[#6D001A] group-hover:text-amber-300 transition-colors mb-3">
                  <Icon size={18} />
                </div>
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#2D2A26] group-hover:text-[#6D001A] transition-colors">
                  {pillar.title}
                </h4>
                <p className="text-[10px] text-gray-500 leading-snug mt-1.5 font-medium">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. BRAND CELEBRATION QUOTE BANNER */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/80 via-[#FFFDF9] to-amber-50/80 py-8 px-6 text-center shadow-xs">
        <div className="relative z-10 max-w-2xl mx-auto flex items-center justify-center gap-3">
          <span className="font-serif text-3xl sm:text-4xl text-[#C9A227] leading-none select-none">
            “
          </span>
          <p className="font-serif text-base sm:text-lg md:text-xl italic font-semibold text-[#6D001A] tracking-wide">
            Your account, your style. Curated just for you.
          </p>
          <span className="font-serif text-3xl sm:text-4xl text-[#C9A227] leading-none select-none">
            ”
          </span>
        </div>
      </div>
    </div>
  );
}
