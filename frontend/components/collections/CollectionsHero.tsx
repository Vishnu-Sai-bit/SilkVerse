"use client";

import Image from "next/image";

export default function CollectionsHero() {
  return (
    <section className="bg-[#2A0E13]">
      {/* Curated Collections Hero Banner */}
      <div className="bg-gradient-to-r from-[#2A0E13] via-[#4A141D] to-[#2A0E13] text-white overflow-hidden border-b border-[#D4AF37]/30 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[360px] py-10 lg:py-0">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left py-4">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.12] text-white">
                <span>Curated Collections</span>
                <br />
                <span className="italic font-normal text-[#D4AF37] font-serif">
                  For Every Occasion
                </span>
              </h1>

              {/* Floral Gold Ornament Divider */}
              <div className="my-4 flex items-center gap-2 text-[#D4AF37]/80">
                <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                <span className="text-xs font-serif italic">✦</span>
                <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
              </div>

              <p className="text-xs sm:text-sm lg:text-base text-gray-200 leading-relaxed max-w-lg font-light">
                From timeless traditions to modern elegance, find the perfect saree for every you.
              </p>
            </div>

            {/* Right Visual: Bride in Royal Maroon */}
            <div className="lg:col-span-5 relative h-72 sm:h-96 lg:h-[380px] w-full">
              <Image
                src="/images/banners/banner_1_heritage.png"
                alt="Curated Collections for Every Occasion"
                fill
                priority
                className="object-cover object-top lg:object-center drop-shadow-2xl"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-transparent via-transparent to-[#2A0E13]/60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}