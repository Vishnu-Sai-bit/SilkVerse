"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

interface SlideData {
  id: number;
  badge: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  image: string;
  objectPosition?: string;
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    badge: "ROYAL DHARMAVARAM HERITAGE",
    titleLine1: "Timeless Elegance,",
    titleLine2: "Woven with Heritage",
    subtitle:
      "Explore our exclusive collection of pure silk sarees crafted for every graceful moment.",
    ctaText: "SHOP NOW",
    ctaLink: "/collections",
    secondaryCtaText: "EXPLORE NEW ARRIVALS",
    secondaryCtaLink: "/collections?sort=newest",
    image: "/images/banners/banner_1_heritage.png",
    objectPosition: "object-[center_top]",
  },
  {
    id: 2,
    badge: "WEDDING & BRIDAL SPLENDOR",
    titleLine1: "Royal Bridal Splendor,",
    titleLine2: "Sacred Dharmavaram Heirlooms",
    subtitle:
      "Handcrafted with pure gold and silver tested zari on 100% pure mulberry silk. A treasured heirloom for your sacred vows.",
    ctaText: "EXPLORE BRIDAL EDIT",
    ctaLink: "/collections?category=Bridal",
    secondaryCtaText: "VIEW WEDDING SILKS",
    secondaryCtaLink: "/collections?category=Wedding",
    image: "/images/banners/banner_2_wedding_v2.png",
    objectPosition: "object-[right_top] sm:object-[center_top]",
  },
  {
    id: 3,
    badge: "FESTIVE EDIT 2026",
    titleLine1: "Festive Celebrations,",
    titleLine2: "Pure Handloom Silks",
    subtitle:
      "Fluid drape, gentle shimmer, and vivid heritage hues certified with authentic Silk Mark India. Direct from artisan pit-looms.",
    ctaText: "SHOP FESTIVE WEAVES",
    ctaLink: "/collections?category=Festive",
    secondaryCtaText: "EXPLORE SOFT SILK",
    secondaryCtaLink: "/collections?category=Soft%20Silk",
    image: "/images/banners/banner_4_festive_v2.png",
    objectPosition: "object-[center_top]",
  },
];

export default function HeroBannerCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const slide = SLIDES[current];

  return (
    <div
      className="relative overflow-hidden bg-[#2A0E13] text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Visuals */}
      <div className="relative min-h-[540px] sm:min-h-[600px] lg:min-h-[660px] flex items-center">
        {/* Background Image with Dark Luxury Gradient */}
        <div className="absolute inset-0 z-0">
          <Image
            src={slide.image}
            alt={`${slide.titleLine1} ${slide.titleLine2}`}
            fill
            priority
            quality={95}
            unoptimized
            sizes="100vw"
            className={`object-cover ${slide.objectPosition || "object-[center_top]"} transition-all duration-1000 ease-out brightness-[0.85] contrast-[1.03] scale-100 hover:scale-102`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 via-40% to-transparent/10" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FAF8F5] to-transparent opacity-10" />
        </div>

        {/* Content Container with Safe Padding Away from Side Controls */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-10 md:px-16 lg:px-20 py-12 sm:py-20 lg:py-24">
          <div className="max-w-2xl text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.2em] text-[#D4AF37] border border-[#D4AF37]/30 shadow-sm">
              <Sparkles size={14} className="text-[#D4AF37] shrink-0" />
              <span>{slide.badge}</span>
            </div>

            {/* Title (Page 03 Blueprint: Two-tone serif with gold italic) */}
            <h1 className="mt-3 sm:mt-4 font-serif text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] text-white drop-shadow-md">
              <span>{slide.titleLine1}</span>
              <br />
              <span className="italic font-normal text-[#D4AF37] font-serif">{slide.titleLine2}</span>
            </h1>

            {/* Floral Diamond Gold Divider Motif */}
            <div className="my-4 flex items-center gap-2 text-[#D4AF37]/80">
              <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <Sparkles size={12} className="text-[#D4AF37]" />
              <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed max-w-lg font-normal">
              {slide.subtitle}
            </p>

            {/* Dual CTAs matching Page 03: SHOP NOW (Gold) + EXPLORE COLLECTION (Outline) */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href={slide.ctaLink}
                className="group inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#2D2A26] shadow-lg shadow-[#D4AF37]/30 transition hover:bg-[#E5C158] active:scale-98"
              >
                <span>SHOP NOW</span>
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link
                href={slide.secondaryCtaLink}
                className="inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/10 backdrop-blur-md px-5 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition hover:bg-white/20 hover:border-white"
              >
                <span>EXPLORE COLLECTION</span>
              </Link>
            </div>

            {/* Micro Trust Proof */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:gap-4 text-[11px] sm:text-xs text-gray-300 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#D4AF37] shrink-0" />
                <span>100% Silk Mark India</span>
              </span>
              <span>•</span>
              <span>Complimentary Insured Shipping</span>
              <span>•</span>
              <span>Direct Loom Price</span>
            </div>
          </div>
        </div>

        {/* Carousel Prev/Next Controls - Non-colliding outer positioning */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-[#D4AF37] hover:text-[#380A0A] hover:border-[#D4AF37] border border-white/20 shadow-lg cursor-pointer"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-[#D4AF37] hover:text-[#380A0A] hover:border-[#D4AF37] border border-white/20 shadow-lg cursor-pointer"
        >
          <ChevronRight size={22} />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === idx ? "w-8 bg-[#D4AF37]" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Bottom Right Slide Counter Pill */}
        <div className="absolute bottom-6 right-6 sm:right-10 z-20 hidden sm:flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-mono text-white/90">
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="p-0.5 hover:text-[#D4AF37] transition cursor-pointer"
          >
            <ChevronLeft size={14} />
          </button>
          <span>0{current + 1} / 0{SLIDES.length}</span>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="p-0.5 hover:text-[#D4AF37] transition cursor-pointer"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
