"use client";

import { Image as ImageIcon, Filter, LayoutGrid, Smartphone, Heart } from "lucide-react";

export default function CollectionsBestPractices() {
  const practices = [
    {
      icon: ImageIcon,
      title: "USE HIGH QUALITY IMAGERY",
      description: "Showcase the texture, shine and drape beautifully.",
    },
    {
      icon: Filter,
      title: "SMART FILTERS",
      description: "Help users narrow down choices quickly and effortlessly.",
    },
    {
      icon: LayoutGrid,
      title: "CONSISTENT CARDS",
      description: "Maintain uniform product cards for a clean and premium look.",
    },
    {
      icon: Smartphone,
      title: "MOBILE OPTIMIZED",
      description: "Ensure smooth browsing and easy navigation on all screen sizes.",
    },
    {
      icon: Heart,
      title: "CURATED EXPERIENCE",
      description: "Group sarees meaningfully to inspire and convert visitors.",
    },
  ];

  return (
    <section className="bg-white py-14 px-4 sm:px-6 lg:px-8 border-t border-[#E8E4DF]">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading matching Page 05 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-3 text-[#D4AF37]">
            <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[10px] sm:text-xs font-serif italic">✦</span>
            <h3 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-[0.2em] text-[#6D001A]">
              Collections – Best Practices
            </h3>
            <span className="text-[10px] sm:text-xs font-serif italic">✦</span>
            <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
        </div>

        {/* 5 Best Practice Pillars */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {practices.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#FFF8F0] border border-[#D4AF37]/30 shadow-xs"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#6D001A] border border-[#D4AF37]/40 shadow-xs mb-3">
                  <Icon size={22} className="stroke-[1.75]" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6D001A] mb-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Lotus Quote matching Page 05 */}
        <div className="mt-10 rounded-2xl bg-[#FFF8F0] p-4 sm:p-5 border border-[#D4AF37]/40 flex items-center justify-center gap-3 text-center">
          <span className="text-xl">🪷</span>
          <p className="text-xs sm:text-sm text-[#2D2A26] font-medium leading-relaxed max-w-2xl">
            Our collections reflect the rich heritage of silk and the modern elegance of today. Designed to inspire, crafted to perfection.
          </p>
          <span className="text-xl hidden sm:inline">🪷</span>
        </div>
      </div>
    </section>
  );
}
