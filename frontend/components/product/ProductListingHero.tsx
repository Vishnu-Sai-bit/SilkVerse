"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ProductListingHeroProps {
  title?: string;
  subtitle?: string;
  category?: string;
  occasion?: string;
}

export default function ProductListingHero({
  title,
  subtitle,
  category,
  occasion,
}: ProductListingHeroProps) {
  let displayTitle = "All Sarees";
  let displaySubtitle =
    "Explore our complete collection of authentic pure silk sarees handwoven by master artisans.";

  if (category) {
    displayTitle = `${category} Sarees`;
    if (category.toLowerCase() === "wedding") {
      displaySubtitle =
        "Explore our handpicked wedding sarees crafted for your special day.";
    } else if (category.toLowerCase() === "bridal") {
      displaySubtitle =
        "Opulent ceremonial bridal silk sarees designed for your auspicious celebrations.";
    } else if (category.toLowerCase() === "festive") {
      displaySubtitle =
        "Vibrant festive handloom sarees celebrating traditions, pujas, and rituals.";
    } else if (category.toLowerCase() === "luxury silk") {
      displaySubtitle =
        "Exclusive master-artisan silk sarees with dense gold brocade and Silk Mark certification.";
    } else if (category.toLowerCase() === "soft silk") {
      displaySubtitle =
        "Feather-light, lustrous soft silk sarees for effortless elegance and comfort.";
    } else {
      displaySubtitle = `Handpicked ${category} sarees crafted with master artisan heritage.`;
    }
  } else if (occasion) {
    displayTitle = `${occasion} Sarees`;
    displaySubtitle = `Explore our handpicked sarees tailored for ${occasion} celebrations.`;
  } else if (title) {
    displayTitle = title;
    if (subtitle) displaySubtitle = subtitle;
  }

  const isWedding = category?.toLowerCase() === "wedding" || occasion?.toLowerCase() === "wedding";

  return (
    <div className="bg-[#FAF8F5] pt-6 pb-4 border-b border-[#E8E4DF]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 1. Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#6D001A] transition">
            Home
          </Link>
          <ChevronRight size={12} className="text-gray-400" />
          <Link href="/products" className="hover:text-[#6D001A] transition">
            Sarees
          </Link>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="font-semibold text-[#6D001A]">{displayTitle}</span>
        </nav>

        {/* 2. Category Title & Right Promo Banner Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Title & Subtitle */}
          <div className="lg:col-span-8">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#6D001A]">
              {displayTitle}
            </h1>

            {/* Floral Gold Divider */}
            <div className="my-3 flex items-center gap-2 text-[#D4AF37]">
              <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span className="text-xs font-serif italic">✦</span>
              <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>

            <p className="text-xs sm:text-sm text-gray-600 max-w-xl leading-relaxed">
              {displaySubtitle}
            </p>
          </div>

          {/* Right Promo Banner Box */}
          <div className="lg:col-span-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2A0E13] to-[#55111D] p-5 text-white shadow-md border border-[#D4AF37]/30 flex items-center justify-between gap-4">
              <div className="relative z-10">
                <h4 className="font-serif text-base font-bold text-white leading-tight">
                  <span>{isWedding ? "Timeless Beauty" : "Heritage Craft"}</span>
                  <br />
                  <span className="italic font-normal text-[#D4AF37] font-serif">
                    {isWedding ? "For Your Big Day" : "100% Pure Silk"}
                  </span>
                </h4>
                <Link
                  href={isWedding ? "/collections?occasion=Wedding" : "/collections"}
                  className="mt-3 inline-block rounded-lg border border-[#D4AF37] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#2D2A26] transition"
                >
                  EXPLORE NOW
                </Link>
              </div>

              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/20">
                <Image
                  src="/images/banners/banner_1_heritage.png"
                  alt="Pure Silk Sarees"
                  fill
                  className="object-cover object-center"
                  sizes="96px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
