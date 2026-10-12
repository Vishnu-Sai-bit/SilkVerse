"use client";

import Image from "next/image";
import { Star, ShieldCheck, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  city: string;
  avatar: string;
  saree: string;
  quote: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Priya Sharma",
    city: "Hyderabad",
    avatar: "/images/testimonials/avatar_priya.png",
    saree: "Royal Crimson Handloom Dharmavaram Silk Saree",
    quote:
      "The saree is absolutely breathtaking! The fabric is pure Dharmavaram silk with genuine zari work. Received so many compliments at my sister's wedding.",
    rating: 5,
  },
  {
    id: 2,
    name: "Anjali Mehta",
    city: "Bengaluru",
    avatar: "/images/testimonials/avatar_anitha.png",
    saree: "Regal Purple Gold Brocade Dharmavaram Silk Saree",
    quote:
      "SilkVerse has become my go-to for authentic Dharmavaram silk sarees. The packaging was royal and the drape is unmatched. Truly worth every rupee.",
    rating: 5,
  },
  {
    id: 3,
    name: "Neha Reddy",
    city: "Tirupati",
    avatar: "/images/testimonials/avatar_kavya.png",
    saree: "Emerald Green Temple Border Pure Silk Saree",
    quote:
      "I was skeptical buying bridal silk online, but SilkVerse exceeded all expectations. The Silk Mark certification gave me complete confidence.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-[#FFF8F0] py-14 sm:py-18 px-4 sm:px-6 lg:px-8 border-t border-[#E8E4DF]">
      <div className="mx-auto max-w-7xl">
        {/* Header matching Page 03 Blueprint */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex-1 text-center">
            <div className="inline-flex items-center justify-center gap-3 text-[#D4AF37]">
              <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span className="text-[10px] sm:text-xs font-serif italic">✦</span>
              <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-[0.2em] text-[#6D001A]">
                Loved By Our Customers
              </h2>
              <span className="text-[10px] sm:text-xs font-serif italic">✦</span>
              <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>
            <p className="mt-2 text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              Real experiences from our cherished patrons across the country
            </p>
          </div>
        </div>

        {/* Testimonials Cards matching Page 03 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="relative flex flex-col justify-between rounded-2xl bg-white p-5 sm:p-7 shadow-sm border border-[#E8E4DF] transition-all duration-300 hover:shadow-lg hover:border-[#D4AF37]"
            >
              <div>
                {/* 5 Stars and Quote icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-[#D4AF37]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                  <Quote size={24} className="text-[#D4AF37]/40" />
                </div>

                {/* Saree Tag */}
                <span className="inline-block text-[11px] font-bold text-[#6D001A] bg-[#6D001A]/5 px-2.5 py-0.5 rounded-full mb-3 border border-[#6D001A]/15">
                  {item.saree}
                </span>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-[#2D2A26]/85 leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author with Avatar & Verified badge */}
              <div className="mt-6 pt-4 border-t border-[#E8E4DF] flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#D4AF37] shadow-xs">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      unoptimized
                      sizes="40px"
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif text-sm font-bold text-[#2D2A26] truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 truncate">{item.city}</p>
                  </div>
                </div>

                <span className="shrink-0 inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck size={12} />
                  <span>Verified</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
