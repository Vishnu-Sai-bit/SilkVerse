"use client";

import { useState } from "react";
import { SlidersHorizontal, Star, X } from "lucide-react";

interface FilterSidebarProps {
  keyword?: string;
  setKeyword?: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  occasion?: string;
  setOccasion?: (val: string) => void;
  fabric?: string;
  setFabric?: (val: string) => void;
  minPrice: string;
  setMinPrice: (val: string) => void;
  maxPrice: string;
  setMaxPrice: (val: string) => void;
  rating: string;
  setRating: (val: string) => void;
  sort?: string;
  setSort?: (val: string) => void;
  clearFilters: () => void;
  isMobileDrawer?: boolean;
  categoryCounts?: Record<string, number>;
  occasionCounts?: Record<string, number>;
  fabricCounts?: Record<string, number>;
  totalCount?: number;
}

const COLOR_SWATCHES = [
  { name: "Maroon", hex: "#6D001A" },
  { name: "Gold", hex: "#D4AF37" },
  { name: "Green", hex: "#1A5632" },
  { name: "Teal", hex: "#1B2A4A" },
  { name: "Peach", hex: "#F3A683" },
  { name: "Brown", hex: "#2D2A26" },
];

export default function FilterSidebar({
  category,
  setCategory,
  occasion = "",
  setOccasion,
  fabric = "",
  setFabric,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  rating,
  setRating,
  clearFilters,
  isMobileDrawer = false,
  categoryCounts,
  occasionCounts,
  totalCount = 18,
}: FilterSidebarProps) {
  const [sliderPrice, setSliderPrice] = useState<number>(
    maxPrice ? Number(maxPrice) : 50000
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const categories = [
    { name: "All Sarees", query: "", count: totalCount || (categoryCounts?.All ?? 18) },
    { name: "Luxury Silk", query: "Luxury Silk", count: categoryCounts?.["Luxury Silk"] ?? 5 },
    { name: "Festive", query: "Festive", count: categoryCounts?.["Festive"] ?? 4 },
    { name: "Bridal", query: "Bridal", count: categoryCounts?.["Bridal"] ?? 3 },
    { name: "Wedding", query: "Wedding", count: categoryCounts?.["Wedding"] ?? 3 },
    { name: "Soft Silk", query: "Soft Silk", count: categoryCounts?.["Soft Silk"] ?? 3 },
  ];

  const occasions = [
    { name: "Wedding", count: occasionCounts?.["Wedding"] ?? 6 },
    { name: "Festive", count: occasionCounts?.["Festive"] ?? 5 },
    { name: "Party Wear", count: occasionCounts?.["Party Wear"] ?? 3 },
    { name: "Bridal", count: occasionCounts?.["Bridal"] ?? 2 },
    { name: "Traditional", count: occasionCounts?.["Traditional"] ?? 1 },
    { name: "Casual Wear", count: occasionCounts?.["Casual Wear"] ?? 1 },
  ];

  const works = [
    { name: "Zari Brocade", count: 12 },
    { name: "Handloom Weave", count: 6 },
  ];

  const fabrics = [
    { name: "Pure Mulberry Silk", query: "Mulberry", count: 11 },
    { name: "Pure Soft Silk", query: "Soft Silk", count: 4 },
    { name: "Dharmavaram Silk", query: "Dharmavaram", count: 3 },
  ];

  const ratings = [
    { stars: 5, label: "5★ Rating", count: 2 },
    { stars: 4, label: "4★ & above", count: totalCount || 18 },
  ];

  const handleApplyPrice = () => {
    setMaxPrice(sliderPrice.toString());
  };

  const Container = isMobileDrawer ? "div" : "aside";
  const containerClasses = isMobileDrawer
    ? "space-y-6"
    : "rounded-2xl border border-[#E8E4DF] bg-white p-5 sm:p-6 shadow-xs space-y-6";

  return (
    <Container className={containerClasses}>
      {/* 1. CATEGORY Filter matching Page 06 */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#6D001A] border-b border-[#E8E4DF] pb-2 mb-3">
          CATEGORY
        </h3>
        <div className="space-y-2">
          {categories.map((cat) => {
            const isSelected =
              cat.query === ""
                ? category === ""
                : category.toLowerCase() === cat.query.toLowerCase();

            return (
              <label
                key={cat.name}
                className="flex items-center justify-between text-xs text-[#2D2A26] cursor-pointer hover:text-[#6D001A] transition"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="category-radio"
                    checked={isSelected}
                    onChange={() => setCategory(cat.query)}
                    className="accent-[#6D001A]"
                  />
                  <span className={isSelected ? "font-bold text-[#6D001A]" : ""}>
                    {cat.name}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400">({cat.count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. PRICE RANGE matching Page 06 */}
      <div className="pt-4 border-t border-[#E8E4DF]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#6D001A]">
            PRICE RANGE
          </h3>
          <span className="text-xs font-bold text-[#6D001A]">
            ₹{sliderPrice.toLocaleString("en-IN")}
          </span>
        </div>

        <input
          type="range"
          min="1000"
          max="50000"
          step="1000"
          value={sliderPrice}
          onChange={(e) => setSliderPrice(Number(e.target.value))}
          className="w-full accent-[#6D001A] cursor-pointer"
        />

        <div className="flex justify-between text-[11px] text-gray-400 mt-1">
          <span>₹1,000</span>
          <span>₹50,000+</span>
        </div>

        <button
          type="button"
          onClick={handleApplyPrice}
          className="mt-3 w-full rounded-xl bg-[#6D001A] py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#5B0D16] transition cursor-pointer"
        >
          APPLY
        </button>
      </div>

      {/* 3. COLOR SWATCHES matching Page 06 */}
      <div className="pt-4 border-t border-[#E8E4DF]">
        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#6D001A] mb-3">
          COLOR
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {COLOR_SWATCHES.map((col) => {
            const isChosen = selectedColor === col.name;
            return (
              <button
                key={col.name}
                type="button"
                onClick={() => setSelectedColor(isChosen ? null : col.name)}
                className={`h-8 w-8 sm:h-7 sm:w-7 rounded-full border-2 transition ${
                  isChosen
                    ? "ring-2 ring-[#6D001A] scale-110 border-white"
                    : "border-gray-200 hover:scale-108 hover:border-[#D4AF37]"
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            );
          })}
          <span className="text-[11px] font-semibold text-[#6D001A] cursor-pointer hover:underline">
            + More
          </span>
        </div>
      </div>

      {/* 4. OCCASION matching Page 06 */}
      <div className="pt-4 border-t border-[#E8E4DF]">
        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#6D001A] mb-3">
          OCCASION
        </h3>
        <div className="space-y-2">
          {occasions.map((occ) => {
            const isChecked = occasion.toLowerCase() === occ.name.toLowerCase();
            return (
              <label
                key={occ.name}
                className="flex items-center justify-between text-xs text-[#2D2A26] cursor-pointer hover:text-[#6D001A] transition"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setOccasion?.(isChecked ? "" : occ.name)}
                    className="rounded accent-[#6D001A]"
                  />
                  <span className={isChecked ? "font-bold text-[#6D001A]" : ""}>
                    {occ.name}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400">({occ.count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. WORK matching Page 06 */}
      <div className="pt-4 border-t border-[#E8E4DF]">
        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#6D001A] mb-3">
          WORK
        </h3>
        <div className="space-y-2">
          {works.map((item) => (
            <label
              key={item.name}
              className="flex items-center justify-between text-xs text-[#2D2A26] cursor-pointer hover:text-[#6D001A] transition"
            >
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded accent-[#6D001A]" />
                <span>{item.name}</span>
              </div>
              <span className="text-[11px] text-gray-400">({item.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* 6. FABRIC matching Page 06 */}
      <div className="pt-4 border-t border-[#E8E4DF]">
        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#6D001A] mb-3">
          FABRIC
        </h3>
        <div className="space-y-2">
          {fabrics.map((item) => {
            const isChecked = fabric.toLowerCase() === item.query.toLowerCase();
            return (
              <label
                key={item.name}
                className="flex items-center justify-between text-xs text-[#2D2A26] cursor-pointer hover:text-[#6D001A] transition"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setFabric?.(isChecked ? "" : item.query)}
                    className="rounded accent-[#6D001A]"
                  />
                  <span className={isChecked ? "font-bold text-[#6D001A]" : ""}>
                    {item.name}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400">({item.count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 7. RATINGS matching Page 06 */}
      <div className="pt-4 border-t border-[#E8E4DF]">
        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#6D001A] mb-3">
          RATINGS
        </h3>
        <div className="space-y-2">
          {ratings.map((r) => {
            const isSelected = rating === r.stars.toString();
            return (
              <label
                key={r.stars}
                className="flex items-center justify-between text-xs text-[#2D2A26] cursor-pointer hover:text-[#6D001A] transition"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="rating-radio"
                    checked={isSelected}
                    onChange={() => setRating(isSelected ? "" : r.stars.toString())}
                    className="accent-[#6D001A]"
                  />
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    <Star size={12} className="fill-[#D4AF37]" />
                    <span className="text-xs text-gray-700 font-medium">
                      {r.label}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-gray-400">({r.count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 8. CLEAR ALL BUTTON matching Page 06 */}
      {!isMobileDrawer && (
        <div className="pt-4 border-t border-[#E8E4DF]">
          <button
            type="button"
            onClick={clearFilters}
            className="w-full rounded-xl border border-[#6D001A] py-2 text-xs font-bold uppercase tracking-wider text-[#6D001A] hover:bg-[#6D001A] hover:text-white transition cursor-pointer"
          >
            CLEAR ALL
          </button>
        </div>
      )}
    </Container>
  );
}