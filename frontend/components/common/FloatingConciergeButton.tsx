"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { X, Video, Compass, Package, Sparkles, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export default function FloatingConciergeButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Hide on admin, checkout, and product detail pages (where mobile sticky action bar is present)
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/orders/") ||
    pathname.match(/^\/products\/[^/]+$/)
  ) {
    return null;
  }

  return (
    <div className="fixed left-3 sm:left-4 bottom-[74px] md:bottom-6 z-40 print:hidden">
      {open && (
        <div className="mb-3 w-72 sm:w-80 rounded-2xl border border-[#D4AF37]/60 bg-[#FAF7F2] p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-200">
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#C98A2C]">
                <Sparkles size={11} />
                <span>SilkVerse Concierge</span>
              </div>
              <h4 className="font-serif text-base font-bold text-[#6D001A]">
                How May We Assist You?
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close concierge"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-stone-500 hover:bg-[#6D001A] hover:text-white transition cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <a
              href={siteConfig.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-3.5 py-2.5 text-white font-semibold transition shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <FaWhatsapp size={16} className="shrink-0" />
                <div>
                  <div className="font-bold">WhatsApp Weaver Desk</div>
                  <div className="text-[10px] text-emerald-100">Instant saree &amp; order help</div>
                </div>
              </div>
              <ArrowRight size={13} />
            </a>

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-2.5 rounded-xl border border-[#D4AF37]/50 bg-white hover:bg-[#FFF8F0] px-3.5 py-2.5 text-[#3B2F2F] transition"
            >
              <div className="flex items-center gap-2.5">
                <Video size={15} className="text-[#6D001A] shrink-0" />
                <div>
                  <div className="font-bold text-[#6D001A]">Live Video Saree Shopping</div>
                  <div className="text-[10px] text-stone-500">Preview bridal drapes on video call</div>
                </div>
              </div>
              <ArrowRight size={13} className="text-stone-400" />
            </Link>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/collections"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white py-2 px-2.5 text-[11px] font-bold text-[#6D001A] hover:border-[#6D001A] transition"
              >
                <Compass size={13} className="text-[#D4AF37]" />
                <span>Collections</span>
              </Link>
              <Link
                href="/orders"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white py-2 px-2.5 text-[11px] font-bold text-[#3B2F2F] hover:border-[#6D001A] transition"
              >
                <Package size={13} className="text-[#6D001A]" />
                <span>Track Order</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open SilkVerse Weaver Concierge"
        className="group flex h-9 w-9 sm:h-auto sm:w-auto items-center justify-center gap-2 rounded-full border border-[#D4AF37] bg-[#6D001A] sm:px-3.5 sm:py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#520013] hover:shadow-xl active:scale-95 cursor-pointer"
      >
        <FaWhatsapp size={16} className="text-[#D4AF37]" />
        <span className="hidden sm:inline">Weaver Concierge</span>
      </button>
    </div>
  );
}
