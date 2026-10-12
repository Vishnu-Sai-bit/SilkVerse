"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, ShieldCheck } from "lucide-react";

interface ColorFilter {
  name: string;
  hex: string;
}

const COLOR_SWATCHES: ColorFilter[] = [
  { name: "Royal Maroon", hex: "#6D001A" },
  { name: "Mustard Gold", hex: "#D4AF37" },
  { name: "Emerald Green", hex: "#1A5632" },
  { name: "Peacock Blue", hex: "#1B2A4A" },
  { name: "Blush Peach", hex: "#F3A683" },
  { name: "Dark Brown", hex: "#2D2A26" },
];

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("category") || searchParams.get("occasion") || "";

  const [price, setPrice] = useState<number>(50000);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const categories = [
    { label: "All Sarees", query: "" },
    { label: "Wedding Collection", query: "Wedding" },
    { label: "Bridal Collection", query: "Bridal" },
    { label: "Festive Collection", query: "Festive" },
    { label: "Party Wear", query: "Party Wear" },
    { label: "Traditional Wear", query: "Traditional" },
    { label: "Soft Silk", query: "Soft Silk" },
    { label: "Luxury Silk", query: "Luxury Silk" },
    { label: "Handloom Silk", query: "Handloom" },
  ];

  return (
    <aside className="rounded-2xl border border-[#E8E4DF] bg-white p-6 shadow-xs">
      {/* Sidebar Header matching Page 05 */}
      <div className="flex items-center gap-2 pb-4 border-b border-[#E8E4DF]">
        <SlidersHorizontal size={17} className="text-[#6D001A]" />
        <h2 className="font-serif text-base font-bold uppercase tracking-wider text-[#6D001A]">
          CATEGORIES
        </h2>
      </div>

      {/* CATEGORIES matching Page 05 */}
      <div className="mt-4 space-y-1.5">
        {categories.map((cat) => {
          const isActive =
            cat.query === ""
              ? currentFilter === ""
              : currentFilter.toLowerCase() === cat.query.toLowerCase();

          return (
            <Link
              key={cat.label}
              href={cat.query ? `/collections?category=${encodeURIComponent(cat.query)}` : "/collections"}
              className={`flex items-center justify-between rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                isActive
                  ? "bg-[#6D001A] text-white shadow-xs"
                  : "text-[#2D2A26] hover:bg-[#FFF8F0] hover:text-[#6D001A]"
              }`}
            >
              <span>{cat.label}</span>
              {isActive && <span className="text-[10px] text-[#D4AF37]">✦</span>}
            </Link>
          );
        })}
      </div>

      {/* PRICE RANGE matching Page 05 */}
      <div className="mt-8 pt-6 border-t border-[#E8E4DF]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6D001A]">
            PRICE RANGE
          </h3>
          <span className="text-xs font-bold text-[#6D001A]">
            Up to ₹{price.toLocaleString("en-IN")}
          </span>
        </div>

        <input
          type="range"
          min="5000"
          max="50000"
          step="2500"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full accent-[#6D001A] cursor-pointer"
        />

        <div className="flex justify-between text-[11px] text-gray-500 mt-1.5">
          <span>₹0</span>
          <span>₹50,000+</span>
        </div>
      </div>

      {/* COLOR SWATCHES matching Page 05 */}
      <div className="mt-8 pt-6 border-t border-[#E8E4DF]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#6D001A] mb-3">
          COLOR
        </h3>
        <div className="flex flex-wrap items-center gap-2.5">
          {COLOR_SWATCHES.map((color) => {
            const isChosen = selectedColor === color.name;
            return (
              <button
                key={color.name}
                type="button"
                title={color.name}
                onClick={() => setSelectedColor(isChosen ? null : color.name)}
                className={`h-7 w-7 rounded-full border-2 transition-all duration-200 ${
                  isChosen
                    ? "ring-2 ring-[#6D001A] scale-110 border-white"
                    : "border-gray-200 hover:scale-108 hover:border-[#D4AF37]"
                }`}
                style={{ backgroundColor: color.hex }}
              />
            );
          })}
          <span className="text-[11px] font-semibold text-[#6D001A] cursor-pointer hover:underline">
            + More
          </span>
        </div>
      </div>

      {/* Purity Guarantee Stamp */}
      <div className="mt-8 pt-6 border-t border-[#E8E4DF]">
        <div className="rounded-xl bg-[#FFF8F0] p-3.5 border border-[#D4AF37]/40 text-center">
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-[#6D001A] text-[#D4AF37] mb-1.5 shadow-xs">
            <ShieldCheck size={16} />
          </div>
          <h4 className="text-xs font-bold text-[#6D001A]">
            100% Pure Silk Mark
          </h4>
          <p className="mt-1 text-[10px] text-gray-600 leading-tight">
            Certified authentic handloom sarees direct from master weaving pit-looms.
          </p>
        </div>
      </div>
    </aside>
  );
}