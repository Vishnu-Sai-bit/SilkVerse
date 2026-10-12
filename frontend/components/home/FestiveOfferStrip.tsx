"use client";

import Link from "next/link";
import { Sparkles, ShieldCheck, Video, Gift, ArrowRight } from "lucide-react";

const HERITAGE_PILLARS = [
  {
    badge: "SILK MARK CERTIFIED",
    title: "100% Pure Mulberry & Zari",
    desc: "Every saree includes an official Silk Mark India purity hologram",
    icon: ShieldCheck,
  },
  {
    badge: "LIVE VIDEO SHOWROOM",
    title: "1-on-1 Live Drape Viewing",
    desc: "Inspect real zari sheen on WhatsApp Video in Telugu or English",
    icon: Video,
  },
  {
    badge: "SHUBHA LEKHA GIFTING",
    title: "Complimentary Bridal Packaging",
    desc: "Handwoven Zari Potli wrap & custom wedding blessing card",
    icon: Gift,
  },
];

export default function FestiveOfferStrip() {
  return (
    <section className="bg-gradient-to-r from-[#2D060D] via-[#4A0B17] to-[#2D060D] py-8 px-4 sm:px-6 lg:px-8 border-y border-[#D4AF37]/40 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Heading */}
          <div className="space-y-1.5 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              <Sparkles size={14} className="text-[#D4AF37] shrink-0" />
              <span>Royal Dharmavaram Heritage</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#F9F5EC]">
              Bridal &amp; Festive Handloom Excellence
            </h3>
            <p className="text-xs text-[#F9F5EC]/75">
              Woven directly by master pit-loom artisans with authentic 24K tested gold zari.
            </p>
          </div>

          {/* Center: 3 Heritage Pillar Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 max-w-3xl">
            {HERITAGE_PILLARS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.badge}
                  className="flex flex-col justify-between rounded-xl border border-[#D4AF37]/45 bg-white/10 backdrop-blur-xs p-3 text-left"
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF37]">
                      {item.badge}
                    </span>
                    <Icon size={14} className="text-[#D4AF37] shrink-0" />
                  </div>
                  <p className="mt-1 text-xs font-bold text-white">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#F9F5EC]/80 leading-snug">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: Explore Bridal Collection CTA */}
          <div className="text-center lg:text-right shrink-0">
            <Link
              href="/collections?category=Bridal"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#D4AF37] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#2D060D] shadow-md hover:bg-[#E5C158] transition"
            >
              <Sparkles size={14} />
              <span>Explore Bridal Silks</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
