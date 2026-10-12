"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Flame, Crown, Gem } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

interface HomeProductShowcaseProps {
  products: any[];
}

const TABS = [
  { id: "all", label: "Featured All" },
  { id: "bestsellers", label: "Best Sellers" },
  { id: "bridal", label: "Bridal & Wedding" },
  { id: "festive", label: "Festive Pattu" },
  { id: "soft", label: "Soft Silk" },
  { id: "new", label: "New Arrivals" },
];

const BUDGET_TIERS = [
  {
    title: "Under ₹12,000",
    subtitle: "Lightweight Soft & Pooja Silks",
    tag: "EVERYDAY ELEGANCE",
    href: "/products?maxPrice=12000",
    icon: Sparkles,
  },
  {
    title: "₹12,000 – ₹18,000",
    subtitle: "Festive Zari & Temple Borders",
    tag: "FESTIVE FAVORITES",
    href: "/products?minPrice=12000&maxPrice=18000",
    icon: Flame,
  },
  {
    title: "₹18,000 – ₹25,000",
    subtitle: "Rich Brocade & Wedding Drapes",
    tag: "WEDDING COLLECTION",
    href: "/products?minPrice=18000&maxPrice=25000",
    icon: Gem,
  },
  {
    title: "Above ₹25,000",
    subtitle: "Pure Gold Zari Bridal Heirlooms",
    tag: "ROYAL BRIDAL",
    href: "/products?minPrice=25000",
    icon: Crown,
  },
];

export default function HomeProductShowcase({ products }: HomeProductShowcaseProps) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    switch (activeTab) {
      case "bestsellers":
        return products
          .filter(
            (p) =>
              p.badge === "BEST SELLER" ||
              p.isBestSeller ||
              (p.numReviews ?? 0) >= 80 ||
              (p.salesCount ?? 0) >= 50
          )
          .slice(0, 10);
      case "bridal":
        return products
          .filter((p) => {
            const cat = (p.category || "").toLowerCase();
            const name = (p.name || "").toLowerCase();
            return (
              cat.includes("bridal") ||
              cat.includes("wedding") ||
              name.includes("bridal") ||
              name.includes("wedding")
            );
          })
          .slice(0, 10);
      case "festive":
        return products
          .filter((p) => {
            const cat = (p.category || "").toLowerCase();
            const name = (p.name || "").toLowerCase();
            return (
              cat.includes("festive") ||
              cat.includes("luxury") ||
              name.includes("festive") ||
              name.includes("pooja")
            );
          })
          .slice(0, 10);
      case "soft":
        return products
          .filter((p) => {
            const cat = (p.category || "").toLowerCase();
            const name = (p.name || "").toLowerCase();
            return cat.includes("soft") || name.includes("soft") || Number(p.price) <= 15000;
          })
          .slice(0, 10);
      case "new":
        return [...products].reverse().slice(0, 10);
      default:
        return products.slice(0, 10);
    }
  }, [products, activeTab]);

  const displayList =
    filteredProducts.length > 0 ? filteredProducts : products.slice(0, 10);

  return (
    <>
      {/* 1. INTERACTIVE FEATURED / BEST SELLERS / BRIDAL SHOWCASE */}
      <section className="bg-white px-4 py-10 sm:py-16 sm:px-6 lg:px-8 border-b border-[#E8E4DF]">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 text-[#D4AF37]">
                <span className="hidden sm:inline h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                <span className="text-xs font-serif italic">✦</span>
                <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-[0.2em] text-[#6D001A]">
                  Featured Sarees
                </h2>
                <span className="text-xs font-serif italic">✦</span>
                <span className="hidden sm:inline h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
              </div>
              <p className="mt-1 text-xs sm:text-sm text-stone-500">
                Handpicked pure Dharmavaram pit-loom weaves curated by occasion &amp; craft
              </p>
            </div>

            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6D001A] hover:text-[#D4AF37] transition-colors group shrink-0"
            >
              <span>VIEW ALL SAREES ({products.length})</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Interactive Category Filter Pills (Amazon / Myntra / Nalli Style) */}
          <div className="mb-8 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#6D001A] text-white shadow-sm border border-[#D4AF37]"
                      : "bg-[#FFF8F0] text-[#3B2F2F] border border-[#D4AF37]/40 hover:border-[#6D001A] hover:text-[#6D001A]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 5-Column Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
            {displayList.map((product: any, idx: number) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                category={product.category}
                price={product.price}
                image={product.image || "/images/products/saree_1_maroon.png"}
                averageRating={product.averageRating ?? 5}
                numReviews={
                  product.numReviews ??
                  (idx === 0
                    ? 128
                    : idx === 1
                    ? 96
                    : idx === 2
                    ? 74
                    : idx === 3
                    ? 82
                    : 63)
                }
                stock={product.stock}
                badge={
                  product.badge ||
                  (idx === 0
                    ? "BEST SELLER"
                    : idx === 1
                    ? "BRIDAL PICK"
                    : idx === 2
                    ? "FESTIVE PICK"
                    : undefined)
                }
              />
            ))}
          </div>

          {/* Center View All Sarees CTA */}
          <div className="mt-10 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37] bg-[#FFF8F0] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#6D001A] hover:bg-[#6D001A] hover:text-white transition-all shadow-xs"
            >
              <span>VIEW ALL SAREES ({products.length})</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY BUDGET / PRICE CURATION (Amazon / Flipkart / Nalli Style) */}
      <section className="bg-[#FAF6EE] py-10 sm:py-12 px-4 sm:px-6 lg:px-8 border-b border-[#E8E4DF]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-7">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C98A2C]">
              Curated For Every Celebration
            </span>
            <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold uppercase tracking-[0.15em] text-[#6D001A]">
              Shop By Budget
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {BUDGET_TIERS.map((tier) => {
              const Icon = tier.icon;
              return (
                <Link
                  key={tier.title}
                  href={tier.href}
                  className="group relative overflow-hidden rounded-2xl border border-[#D4AF37]/50 bg-white p-5 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-[#6D001A] hover:shadow-md flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#C98A2C]">
                      {tier.tag}
                    </span>
                    <h4 className="mt-1 font-serif text-lg sm:text-xl font-bold text-[#6D001A] group-hover:text-[#7A1020]">
                      {tier.title}
                    </h4>
                    <p className="mt-0.5 text-xs text-stone-500 truncate">
                      {tier.subtitle}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF8F0] text-[#6D001A] border border-[#D4AF37]/40 transition-colors group-hover:bg-[#6D001A] group-hover:text-[#D4AF37]">
                    <Icon size={18} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
