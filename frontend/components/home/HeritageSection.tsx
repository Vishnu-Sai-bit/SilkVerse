"use client";

import Image from "next/image";
import Link from "next/link";
import { Award, ArrowRight, CheckCircle2 } from "lucide-react";
import { SilkMarkLogo, HandloomMarkLogo } from "@/components/common/TrustLogos";

export default function HeritageSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] border-t border-[#E8E4DF]">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Artisan Weaving Visual (Clean, Unobstructed, HD) */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#D4AF37]/40 shadow-2xl bg-white p-2">
              <div className="relative aspect-[4/3] sm:aspect-[5/4] w-full overflow-hidden rounded-2xl bg-[#1A0A0A]">
                <Image
                  src="/images/heritage/loom_artisan_clean.png"
                  alt="The SilkVerse Story - Master Artisan Handloom Weaving"
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Narrative, Pillars & CTA */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Tag matching Page 03 */}
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-[#D4AF37] mb-3">
              <span>— THE SILKVERSE STORY —</span>
            </div>

            {/* Heading matching Page 03 */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#6D001A] leading-[1.18]">
              Crafted with Passion, Worn with Pride
            </h2>

            {/* Body matching Page 03 */}
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#2D2A26]/85">
              SilkVerse is born from a love for India's rich weaving heritage. Each saree is a masterpiece, handcrafted with precision, passion and timeless tradition directly on heritage pit-looms.
            </p>

            {/* 3 Core Heritage Highlights */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#6D001A]">
                  <CheckCircle2 size={14} className="text-[#D4AF37]" />
                </span>
                <span>Authentic Dharmavaram pit-loom weaving with certified tested zari</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#6D001A]">
                  <CheckCircle2 size={14} className="text-[#D4AF37]" />
                </span>
                <span>Ethically sourced pure mulberry silk directly supporting artisan clusters</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#6D001A]">
                  <CheckCircle2 size={14} className="text-[#D4AF37]" />
                </span>
                <span>Every drape individually inspected for heirloom quality and longevity</span>
              </div>
            </div>

            {/* Action CTA & Authentic Trust Marks */}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#6D001A] px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#6D001A]/20 transition hover:bg-[#5B0D16] border border-[#D4AF37]/40 active:scale-98"
              >
                <span>DISCOVER OUR STORY</span>
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <div className="flex items-center gap-3">
                <SilkMarkLogo size="md" />
                <HandloomMarkLogo size="md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
