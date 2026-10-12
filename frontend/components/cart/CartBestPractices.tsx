"use client";

import {
  ShieldCheck,
  CreditCard,
  UserCheck,
  RotateCcw,
  Headset,
  ClipboardList,
  IndianRupee,
  User,
  Smartphone,
  CheckCircle,
} from "lucide-react";

export default function CartBestPractices() {
  const TRUST_ITEMS = [
    {
      icon: ShieldCheck,
      title: "SSL ENCRYPTED",
      desc: "Your data is 100% secure and protected.",
    },
    {
      icon: CreditCard,
      title: "PCI DSS COMPLIANT",
      desc: "We follow global payment security standards.",
    },
    {
      icon: UserCheck,
      title: "VERIFIED MERCHANT",
      desc: "Trusted by thousands of happy customers.",
    },
    {
      icon: RotateCcw,
      title: "7 DAYS EASY RETURNS",
      desc: "Hassle-free returns for your peace of mind.",
    },
    {
      icon: Headset,
      title: "24/7 CUSTOMER SUPPORT",
      desc: "We're here to help you anytime.",
    },
  ];

  const PILLARS = [
    {
      icon: ClipboardList,
      title: "KEEP IT SIMPLE",
      desc: "Minimize steps and keep forms short for a smooth flow.",
    },
    {
      icon: IndianRupee,
      title: "TRANSPARENT PRICING",
      desc: "Show all charges upfront with no hidden fees.",
    },
    {
      icon: User,
      title: "GUEST CHECKOUT",
      desc: "Allow guest checkout for faster ordering.",
    },
    {
      icon: Smartphone,
      title: "MOBILE OPTIMIZED",
      desc: "Ensure a seamless experience on all devices.",
    },
    {
      icon: CheckCircle,
      title: "CLEAR CONFIRMATION",
      desc: "Provide order confirmation and tracking details.",
    },
  ];

  return (
    <div className="mt-14 space-y-12">
      {/* 1. TRUST & SECURITY (5 Badges in a Row) */}
      <section aria-labelledby="trust-security-heading">
        <h3
          id="trust-security-heading"
          className="font-serif text-lg sm:text-xl font-bold tracking-wider text-[#2D2A26] uppercase mb-5"
        >
          TRUST & SECURITY
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col items-center text-center p-4 rounded-xl border border-stone-200/90 bg-white shadow-2xs hover:border-[#D4AF37]/50 transition"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF8F0] text-[#D4AF37] border border-[#D4AF37]/30 mb-2.5">
                  <Icon size={20} />
                </div>
                <h4 className="text-xs font-bold text-[#2D2A26] tracking-wider uppercase">
                  {item.title}
                </h4>
                <p className="mt-1 text-[11px] text-stone-500 leading-snug">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. CART & CHECKOUT BEST PRACTICES (5 Pillars) */}
      <section aria-labelledby="best-practices-heading">
        <h3
          id="best-practices-heading"
          className="font-serif text-lg sm:text-xl font-bold tracking-wider text-[#2D2A26] uppercase mb-5"
        >
          CART & CHECKOUT BEST PRACTICES
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="flex flex-col items-center text-center p-4 rounded-xl border border-stone-200/90 bg-[#FAF8F5] shadow-2xs hover:bg-white transition"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#6D001A] border border-stone-200 mb-2.5 shadow-2xs">
                  <Icon size={18} />
                </div>
                <h4 className="text-xs font-bold text-[#2D2A26] tracking-wider uppercase">
                  {pillar.title}
                </h4>
                <p className="mt-1 text-[11px] text-stone-500 leading-snug">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Bottom Brand Quote Banner with Lotus Motifs */}
      <div className="flex items-center justify-center gap-4 rounded-2xl border border-amber-200/70 bg-gradient-to-r from-[#FFF8F0] via-white to-[#FFF8F0] px-6 py-5 text-center shadow-2xs">
        <span className="text-xl sm:text-2xl text-[#D4AF37]">🪷</span>
        <p className="font-serif italic text-xs sm:text-sm md:text-base font-medium text-[#2D2A26]">
          &ldquo;A seamless checkout experience turns a purchase into a memorable celebration.&rdquo;
        </p>
        <span className="text-xl sm:text-2xl text-[#D4AF37]">🪷</span>
      </div>
    </div>
  );
}
