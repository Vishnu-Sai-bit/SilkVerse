"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  Heart,
  Star,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/services/api";

type CollectionProduct = {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  colors?: string[];
  category?: string;
  price: number;
  image: string;
  averageRating?: number;
  numReviews?: number;
  stock?: number;
  badge?: string;
  salesCount?: number;
  isBestSeller?: boolean;
};

const COLOR_PALETTE_FILTERS = [
  { id: "", label: "All Shades", hex: "conic-gradient(#8B001D, #0F5132, #1D3557, #C5A049, #B51763, #8B001D)", keywords: [] },
  { id: "red", label: "Crimson & Red", hex: "#8B001D", keywords: ["crimson", "red", "sindoor", "kumkum", "maroon", "ruby", "vermilion"] },
  { id: "green", label: "Emerald & Green", hex: "#0F5132", keywords: ["emerald", "green", "panna", "jade", "mint", "olive", "pistachio", "forest", "leaf", "mehendi"] },
  { id: "blue", label: "Royal Blue & Teal", hex: "#1D3557", keywords: ["blue", "sapphire", "navy", "indigo", "peacock", "teal", "cerulean", "aqua", "turquoise"] },
  { id: "pink", label: "Rani Pink & Peach", hex: "#B51763", keywords: ["pink", "rani", "magenta", "fuchsia", "peach", "coral", "rose", "apricot", "blush"] },
  { id: "purple", label: "Purple & Wine", hex: "#4A154B", keywords: ["purple", "violet", "amethyst", "plum", "jamun", "wine", "burgundy", "lilac", "lavender", "mauve", "orchid", "bordeaux", "sangria"] },
  { id: "gold", label: "Gold & Mustard", hex: "#C5A049", keywords: ["gold", "mustard", "yellow", "haldi", "tissue", "swarna", "mango", "orange", "copper", "rust", "marigold", "terracotta"] },
  { id: "ivory", label: "Ivory & Pastel", hex: "#F3EFE6", keywords: ["ivory", "cream", "pearl", "white", "pastel", "powder", "champagne"] },
];

export default function ProductGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || "";
  const occasion = searchParams.get("occasion") || "";
  const rawSort = searchParams.get("sort");
  const sortParam =
    rawSort === "bestseller" || rawSort === "bestsellers"
      ? "popularity"
      : rawSort || "popularity";
  const keyword = searchParams.get("keyword") || "";
  const fabricParam = searchParams.get("fabric") || "";
  const weaveParam = searchParams.get("weave") || "";

  const [products, setProducts] = useState<CollectionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [colorFamily, setColorFamily] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [totalProducts, setTotalProducts] = useState(0);

  const API =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5001";

  // Helper to update search params in URL
  const updateQueryParam = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (!val || val === "All") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `/collections?${qs}` : "/collections");
  };

  // Load All Matching Products on a Single Page
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);

        const apiSort =
          sortParam === "popularity" || sortParam === "bestseller" || sortParam === "bestsellers"
            ? "popularity"
            : sortParam === "rating"
            ? "rating"
            : sortParam === "priceAsc"
            ? "priceAsc"
            : sortParam === "priceDesc"
            ? "priceDesc"
            : "newest";

        const data = await getProducts({
          category: category || undefined,
          occasion: occasion || undefined,
          weave: weaveParam || undefined,
          fabric: fabricParam || undefined,
          keyword: keyword || undefined,
          sort: apiSort,
          page: 1,
          limit: 200,
        });

        const list = (data.products ?? []) as CollectionProduct[];

        const enriched = list.map((prod, idx) => ({
          ...prod,
          badge:
            prod.isBestSeller || ((sortParam === "popularity" || sortParam === "bestseller") && idx < 6)
              ? "BEST SELLER"
              : idx === 0 || idx === 2
              ? "NEW"
              : undefined,
        }));

        setProducts(enriched);
        setTotalProducts(data.totalProducts ?? list.length);
      } catch (error) {
        console.error("Failed to load products:", error);
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [category, occasion, sortParam, keyword, fabricParam, weaveParam]);

  const displayedProducts = useMemo(() => {
    return products.filter((p) => {
      if (minPrice !== "" && p.price < Number(minPrice)) return false;
      if (maxPrice !== "" && p.price > Number(maxPrice)) return false;
      if (colorFamily) {
        const selected = COLOR_PALETTE_FILTERS.find((c) => c.id === colorFamily);
        if (selected) {
          const textToMatch = `${p.name || ""} ${p.color || ""} ${(p.colors || []).join(" ")}`.toLowerCase();
          const matched = selected.keywords.some((kw) => textToMatch.includes(kw));
          if (!matched) return false;
        }
      }
      return true;
    });
  }, [products, minPrice, maxPrice, colorFamily]);

  const hasActiveFilters = Boolean(
    category || occasion || keyword || fabricParam || weaveParam || colorFamily || minPrice || maxPrice || (searchParams.get("sort") && searchParams.get("sort") !== "popularity" && searchParams.get("sort") !== "bestseller")
  );

  return (
    <div className="space-y-4">
      {/* Best Sellers Highlight Banner */}
      {(searchParams.get("sort") === "popularity" || searchParams.get("sort") === "bestseller" || searchParams.get("sort") === "bestsellers") && (
        <div className="rounded-2xl bg-gradient-to-r from-[#6D001A] via-[#85182a] to-[#4A0012] p-4 text-white shadow-md flex items-center justify-between gap-4 border border-[#D4AF37]/50 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-[#D4AF37]/60 flex items-center justify-center text-xl text-[#D4AF37] shrink-0">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-base sm:text-lg font-bold text-white">
                  Popular & Best Sellers Collection
                </h2>
                <span className="text-[10px] uppercase font-sans tracking-wider bg-[#D4AF37] text-[#4A0012] px-2 py-0.5 rounded-full font-bold">
                  Top Sales & 5★ Rated
                </span>
              </div>
              <p className="text-xs text-[#FAF8F5]/85 mt-0.5">
                Our most celebrated sarees ranked by both verified customer sales volume and stellar 5-star reviews.
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-right text-xs text-[#D4AF37] font-semibold shrink-0">
            {displayedProducts.length} Sarees Found
          </div>
        </div>
      )}

      {/* =========================================================
          VISUAL COLOR SWATCH & QUICK BUDGET PILLS BAR
      ========================================================= */}
      <div className="rounded-2xl border border-[#E8E4DF] bg-white p-3.5 sm:p-4 shadow-xs space-y-3">
        {/* Row 1: Visual Color Swatches */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 shrink-0 mr-1">
            Shade:
          </span>
          {COLOR_PALETTE_FILTERS.map((swatch) => {
            const active = colorFamily === swatch.id;
            return (
              <button
                key={swatch.id}
                type="button"
                onClick={() => setColorFamily(active ? "" : swatch.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition shrink-0 cursor-pointer border ${
                  active
                    ? "border-[#6D001A] bg-[#FFF8F0] text-[#6D001A] shadow-2xs ring-1 ring-[#6D001A]/30"
                    : "border-stone-200 bg-stone-50/70 text-stone-700 hover:border-[#D4AF37] hover:bg-white"
                }`}
              >
                <span
                  className="h-3.5 w-3.5 rounded-full border border-black/15 shrink-0 shadow-2xs"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span>{swatch.label}</span>
              </button>
            );
          })}
          {colorFamily && (
            <button
              type="button"
              onClick={() => setColorFamily("")}
              className="text-[11px] font-bold text-[#6D001A] underline shrink-0 ml-1 cursor-pointer"
            >
              Reset Shade
            </button>
          )}
        </div>

        {/* Row 2: Quick Budget & Occasion Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-stone-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 shrink-0 mr-1">
            Quick Pick:
          </span>
          <button
            type="button"
            onClick={() => {
              if (maxPrice === "12000" && !minPrice) {
                setMaxPrice("");
              } else {
                setMinPrice("");
                setMaxPrice("12000");
              }
            }}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition shrink-0 cursor-pointer border ${
              maxPrice === "12000" && !minPrice
                ? "bg-[#6D001A] text-white border-[#6D001A]"
                : "bg-stone-50 text-stone-700 border-stone-200 hover:border-[#D4AF37]"
            }`}
          >
            Under ₹12,000
          </button>
          <button
            type="button"
            onClick={() => {
              if (minPrice === "12000" && maxPrice === "20000") {
                setMinPrice("");
                setMaxPrice("");
              } else {
                setMinPrice("12000");
                setMaxPrice("20000");
              }
            }}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition shrink-0 cursor-pointer border ${
              minPrice === "12000" && maxPrice === "20000"
                ? "bg-[#6D001A] text-white border-[#6D001A]"
                : "bg-stone-50 text-stone-700 border-stone-200 hover:border-[#D4AF37]"
            }`}
          >
            ₹12,000 – ₹20,000
          </button>
          <button
            type="button"
            onClick={() => {
              if (minPrice === "20000" && !maxPrice) {
                setMinPrice("");
              } else {
                setMinPrice("20000");
                setMaxPrice("");
              }
            }}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition shrink-0 cursor-pointer border ${
              minPrice === "20000" && !maxPrice
                ? "bg-[#6D001A] text-white border-[#6D001A]"
                : "bg-stone-50 text-stone-700 border-stone-200 hover:border-[#D4AF37]"
            }`}
          >
            Heirloom ₹20,000+
          </button>
          <button
            type="button"
            onClick={() => updateQueryParam({ category: category === "Bridal" ? null : "Bridal" })}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition shrink-0 cursor-pointer border ${
              category === "Bridal"
                ? "bg-[#6D001A] text-white border-[#6D001A]"
                : "bg-[#FFF8F0] text-[#6D001A] border-[#D4AF37]/40 hover:border-[#6D001A]"
            }`}
          >
            👑 Muhurtham Bridal
          </button>
          <button
            type="button"
            onClick={() => updateQueryParam({ category: category === "Soft Silk" ? null : "Soft Silk" })}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition shrink-0 cursor-pointer border ${
              category === "Soft Silk"
                ? "bg-[#6D001A] text-white border-[#6D001A]"
                : "bg-[#FFF8F0] text-[#6D001A] border-[#D4AF37]/40 hover:border-[#6D001A]"
            }`}
          >
            ✨ Featherlight Soft Silk
          </button>
        </div>
      </div>

      {/* =========================================================
          HORIZONTAL FILTER & SORT BAR (Page 05 Blueprint)
      ========================================================= */}
      <div className="rounded-2xl border border-[#E8E4DF] bg-white p-3.5 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left filters strip */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* FILTERS Button */}
            <div className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#6D001A] px-2.5 py-1.5 bg-[#FFF8F0] rounded-xl border border-[#D4AF37]/40">
              <SlidersHorizontal size={14} />
              <span>FILTERS</span>
            </div>

            {/* CATEGORY Dropdown */}
            <div className="flex items-center gap-1">
              <span className="text-gray-500 font-medium">CATEGORY</span>
              <select
                value={category || "All"}
                onChange={(e) => updateQueryParam({ category: e.target.value === "All" ? null : e.target.value })}
                className="rounded-lg border border-[#E8E4DF] bg-white px-2 py-1 font-semibold text-[#2D2A26] focus:border-[#6D001A] focus:outline-none"
              >
                <option value="All">All Categories ▾</option>
                <option value="Wedding">Wedding</option>
                <option value="Bridal">Bridal</option>
                <option value="Festive">Festive</option>
                <option value="Soft Silk">Soft Silk</option>
                <option value="Luxury Silk">Luxury Silk</option>
                <option value="Kanchipuram">Kanchipuram Silk</option>
                <option value="Banarasi">Banarasi Silk</option>
                <option value="Paithani">Paithani Silk</option>
                <option value="Dharmavaram">Dharmavaram Silk</option>
                <option value="Handloom">Handloom Silk</option>
              </select>
            </div>

            {/* OCCASION Dropdown */}
            <div className="flex items-center gap-1">
              <span className="text-gray-500 font-medium">OCCASION</span>
              <select
                value={occasion || "All"}
                onChange={(e) => updateQueryParam({ occasion: e.target.value === "All" ? null : e.target.value })}
                className="rounded-lg border border-[#E8E4DF] bg-white px-2 py-1 font-semibold text-[#2D2A26] focus:border-[#6D001A] focus:outline-none"
              >
                <option value="All">All Occasions ▾</option>
                <option value="Festive">Festive</option>
                <option value="Wedding">Wedding</option>
                <option value="Bridal">Bridal</option>
                <option value="Party Wear">Party Wear</option>
                <option value="Traditional">Traditional</option>
                <option value="Casual Wear">Casual Wear</option>
                <option value="Office Wear">Office Wear</option>
              </select>
            </div>

            {/* FABRIC Dropdown */}
            <div className="hidden md:flex items-center gap-1">
              <span className="text-gray-500 font-medium">FABRIC</span>
              <select
                value={fabricParam || "All"}
                onChange={(e) => updateQueryParam({ fabric: e.target.value === "All" ? null : e.target.value })}
                className="rounded-lg border border-[#E8E4DF] bg-white px-2 py-1 font-semibold text-[#2D2A26] focus:border-[#6D001A] focus:outline-none"
              >
                <option value="All">All Fabrics ▾</option>
                <option value="Mulberry">100% Pure Mulberry Silk</option>
                <option value="Soft Silk">Pure Soft Silk</option>
                <option value="Organza">Organza Silk</option>
              </select>
            </div>
          </div>

          {/* Right: SORT BY & Grid/List toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="hidden sm:inline text-gray-500 font-medium">SORT BY</span>
              <select
                value={sortParam === "bestseller" || sortParam === "bestsellers" ? "popularity" : sortParam}
                onChange={(e) => updateQueryParam({ sort: e.target.value })}
                className="rounded-lg border border-[#E8E4DF] bg-white px-2.5 py-1 font-semibold text-[#2D2A26] focus:border-[#6D001A] focus:outline-none cursor-pointer"
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest Arrivals</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>

            {/* View Switcher matching Page 05 */}
            <div className="hidden sm:flex items-center gap-1 border-l border-gray-200 pl-2">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid View"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-[#6D001A] text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="List View"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "list"
                    ? "bg-[#6D001A] text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Indicator Banner */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl bg-[#FFF8F0] border border-[#D4AF37]/40 px-4 py-2.5 text-xs text-[#6D001A]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[11px] text-[#6D001A]">
              Filtered By:
            </span>
            {category && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#D4AF37]/50 px-2.5 py-1 font-semibold text-[#6D001A] shadow-2xs">
                <span>Category: {category}</span>
                <button
                  type="button"
                  onClick={() => updateQueryParam({ category: null })}
                  className="hover:text-red-700 font-bold ml-0.5"
                  title="Remove category filter"
                >
                  ×
                </button>
              </span>
            )}
            {occasion && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#D4AF37]/50 px-2.5 py-1 font-semibold text-[#6D001A] shadow-2xs">
                <span>Occasion: {occasion}</span>
                <button
                  type="button"
                  onClick={() => updateQueryParam({ occasion: null })}
                  className="hover:text-red-700 font-bold ml-0.5"
                  title="Remove occasion filter"
                >
                  ×
                </button>
              </span>
            )}
            {fabricParam && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#D4AF37]/50 px-2.5 py-1 font-semibold text-[#6D001A] shadow-2xs">
                <span>Fabric: {fabricParam}</span>
                <button
                  type="button"
                  onClick={() => updateQueryParam({ fabric: null })}
                  className="hover:text-red-700 font-bold ml-0.5"
                  title="Remove fabric filter"
                >
                  ×
                </button>
              </span>
            )}
            {colorFamily && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#D4AF37]/50 px-2.5 py-1 font-semibold text-[#6D001A] shadow-2xs">
                <span>Shade: {COLOR_PALETTE_FILTERS.find((c) => c.id === colorFamily)?.label}</span>
                <button
                  type="button"
                  onClick={() => setColorFamily("")}
                  className="hover:text-red-700 font-bold ml-0.5"
                  title="Remove shade filter"
                >
                  ×
                </button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#D4AF37]/50 px-2.5 py-1 font-semibold text-[#6D001A] shadow-2xs">
                <span>Budget: ₹{minPrice || "0"} – {maxPrice ? `₹${maxPrice}` : "Any"}</span>
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                  className="hover:text-red-700 font-bold ml-0.5"
                  title="Remove budget filter"
                >
                  ×
                </button>
              </span>
            )}
            {keyword && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#D4AF37]/50 px-2.5 py-1 font-semibold text-[#6D001A] shadow-2xs">
                <span>Search: &quot;{keyword}&quot;</span>
                <button
                  type="button"
                  onClick={() => updateQueryParam({ keyword: null })}
                  className="hover:text-red-700 font-bold ml-0.5"
                  title="Clear search"
                >
                  ×
                </button>
              </span>
            )}
            {sortParam && sortParam !== "popularity" && sortParam !== "bestseller" && sortParam !== "bestsellers" && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#D4AF37]/50 px-2.5 py-1 font-semibold text-[#6D001A] shadow-2xs">
                <span>
                  Sort:{" "}
                  {sortParam === "newest"
                    ? "New Arrivals"
                    : sortParam === "rating"
                    ? "Customer Rating"
                    : sortParam === "priceAsc"
                    ? "Price: Low to High"
                    : "Price: High to Low"}
                </span>
                <button
                  type="button"
                  onClick={() => updateQueryParam({ sort: null })}
                  className="hover:text-red-700 font-bold ml-0.5"
                  title="Reset sort"
                >
                  ×
                </button>
              </span>
            )}
            <span className="text-gray-500 font-medium ml-1">
              ({displayedProducts.length} {displayedProducts.length === 1 ? "saree" : "sarees"} found)
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setColorFamily("");
              setMinPrice("");
              setMaxPrice("");
              router.push("/collections");
            }}
            className="font-bold underline text-[#6D001A] hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-2xl bg-white border border-[#E8E4DF]"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && displayedProducts.length === 0 && (
        <div className="rounded-2xl border border-[#E8E4DF] bg-white p-12 text-center shadow-xs">
          <h3 className="font-serif text-xl font-bold text-[#6D001A]">
            No Sarees Found
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            Try resetting your shade, budget, or category filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setColorFamily("");
              setMinPrice("");
              setMaxPrice("");
              router.push("/collections");
            }}
            className="mt-4 inline-block rounded-xl bg-[#6D001A] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Product Display: Grid View vs List View */}
      {!loading && displayedProducts.length > 0 && (
        <>
          {viewMode === "grid" ? (
            /* 4-Column Grid View matching Page 05 */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-5">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  category={product.category}
                  price={product.price}
                  image={
                    product.image || "/images/products/saree_1_maroon.png"
                  }
                  averageRating={product.averageRating ?? 5}
                  numReviews={product.numReviews ?? 96}
                  stock={product.stock}
                  badge={product.badge}
                  salesCount={product.salesCount}
                />
              ))}
            </div>
          ) : (
            /* List View matching Page 05 Mobile View / List Mode */
            <div className="space-y-3">
              {displayedProducts.map((product) => (
                <div
                  key={product._id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E8E4DF] shadow-xs hover:border-[#D4AF37] hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto min-w-0">
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-xl bg-gray-100 shrink-0 border border-gray-100">
                      <Image
                        src={
                          product.image
                            ? product.image.startsWith("http")
                              ? product.image
                              : product.image.startsWith("/images/")
                              ? product.image
                              : `${API}${product.image.startsWith("/") ? "" : "/"}${product.image}`
                            : "/images/products/saree_1_maroon.png"
                        }
                        alt={product.name}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition"
                        sizes="96px"
                      />
                      {product.badge && (
                        <span className="absolute top-1 left-1 rounded-sm bg-white px-1.5 py-0.5 text-[9px] font-extrabold text-[#2D2A26] shadow-xs border border-gray-200">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${product._id}`}
                        className="font-serif text-sm sm:text-base font-bold text-[#2D2A26] hover:text-[#6D001A] transition"
                      >
                        {product.name}
                      </Link>
                      <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                        {product.category || "Authentic Silk"}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-[#D4AF37] flex-wrap">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className="fill-[#D4AF37] text-[#D4AF37]"
                            />
                          ))}
                        </div>
                        {product.salesCount && product.salesCount > 0 ? (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                            {product.salesCount}+ Sold
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <span className="block font-serif text-sm sm:text-lg font-bold text-[#6D001A]">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    <Link
                      href={`/products/${product._id}`}
                      className="inline-block shrink-0 rounded-lg bg-[#6D001A] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#5B0D16] transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =========================================================
              CONTINUOUS SINGLE-PAGE CATALOG SUMMARY FOOTER
          ========================================================= */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#E8E4DF] bg-white px-5 py-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF8F0] border border-[#D4AF37]/50 text-[#6D001A] text-xs font-serif">
                ✦
              </span>
              <div>
                <p className="text-xs sm:text-sm font-medium text-stone-700">
                  Showing all{" "}
                  <span className="font-bold text-[#6D001A]">{products.length}</span>{" "}
                  of{" "}
                  <span className="font-bold text-stone-900">{totalProducts || products.length}</span>{" "}
                  handcrafted sarees
                </p>
                <div className="mt-1.5 h-1.5 w-44 sm:w-56 overflow-hidden rounded-full bg-stone-100 mx-auto sm:mx-0">
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-[#6D001A] to-[#D4AF37]" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D4AF37]/60 bg-[#FFF8F0] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#6D001A] hover:bg-[#6D001A] hover:text-white transition cursor-pointer"
            >
              <span>Back to Top ↑</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}