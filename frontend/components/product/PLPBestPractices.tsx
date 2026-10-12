"use client";

import { Filter, LayoutGrid, Eye, Tag, Smartphone, Lightbulb, Quote } from "lucide-react";

export default function PLPBestPractices() {
  const pillars = [
    {
      icon: Filter,
      title: "SMART FILTERS",
      desc: "Narrow down products quickly with multiple filter options.",
    },
    {
      icon: LayoutGrid,
      title: "CLEAN GRID LAYOUT",
      desc: "High quality images in a structured grid for better visual experience.",
    },
    {
      icon: Eye,
      title: "QUICK ACTIONS",
      desc: "Quick view, add to cart and wishlist for faster decisions.",
    },
    {
      icon: Tag,
      title: "OFFERS & RATINGS",
      desc: "Clear pricing, offers and ratings build trust and transparency.",
    },
    {
      icon: Smartphone,
      title: "RESPONSIVE DESIGN",
      desc: "Optimized for a seamless shopping experience on all devices.",
    },
  ];

  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-t border-[#E8E4DF] mt-12">
      <div className="mx-auto max-w-7xl">
        {/* 5 Pillars Row */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 pb-10 border-b border-[#E8E4DF]">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#FFF8F0] border border-[#D4AF37]/30 shadow-xs"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#6D001A] border border-[#D4AF37]/40 shadow-xs mb-2.5">
                  <Icon size={20} className="stroke-[1.75]" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6D001A] mb-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Tip & Quote Cards matching Page 06 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 max-w-3xl mx-auto">
          {/* Tip Card */}
          <div className="flex items-start gap-3 rounded-2xl bg-[#FFF8F0] p-4 border border-[#D4AF37]/40">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#D4AF37] border border-[#D4AF37]/40 shadow-xs">
              <Lightbulb size={18} />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-[#6D001A]">
                TIP
              </span>
              <p className="text-xs text-[#2D2A26] mt-0.5 leading-relaxed">
                Use filters and sorting to help customers find their perfect saree with ease.
              </p>
            </div>
          </div>

          {/* Maroon Quote Card */}
          <div className="flex items-start gap-3 rounded-2xl bg-[#6D001A] text-white p-4 border border-[#D4AF37]/40 shadow-md">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#D4AF37]">
              <Quote size={18} />
            </div>
            <div>
              <p className="font-serif italic text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                "Every saree tells a story, find the one that's meant for you."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
