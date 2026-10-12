import Link from "next/link";
import { Scale, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = {
  title: "Terms & Conditions | SilkVerse Pure Handloom Silks",
  description: "Terms and conditions governing the purchase of authentic handloom silk sarees, delivery, and services on SilkVerse.",
};

export default function TermsPage() {
  const lastUpdated = "October 2026";

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1F1919] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-[#580F1A] transition-colors">Home</Link>
          <ChevronRight size={13} className="text-[#C8985A]" />
          <span className="text-[#580F1A] font-semibold">Terms &amp; Conditions</span>
        </nav>

        {/* Header Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#2D060D] via-[#4A0C16] to-[#2D060D] text-[#FFFDF7] p-8 sm:p-12 border border-[#D4AF37]/30 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              Customer Agreement
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              TERMS &amp; CONDITIONS
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Please review the following terms and conditions that govern your use of and purchase of products from the SilkVerse website.
            </p>
            <div className="text-[11px] text-[#D4AF37] pt-2">
              Last Updated: {lastUpdated} • Governing Law: Jurisdiction of Dharmavaram, Andhra Pradesh, India
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-10 border border-stone-200/90 shadow-sm space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
          
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#580F1A] flex items-center gap-2">
              <Scale size={18} className="text-[#C8985A]" />
              1. Authentic Handloom Craftsmanship &amp; Natural Variations
            </h2>
            <p>
              Every saree featured on SilkVerse is individually handcrafted on traditional pit-looms by master artisans. Subtle irregularities in weave, slub, selvedge, or zari interlock are natural hallmarks of authentic hand-weaving, not manufacturing defects.
            </p>
            <p>
              We photograph all sarees under balanced natural studio lighting. Slight color shifts may occur depending on your device screen calibration.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#580F1A] flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#C8985A]" />
              2. Silk Mark Certification &amp; Pricing
            </h2>
            <p>
              All pure silk products carry official Silk Mark India tags certifying 100% natural mulberry silk. All prices displayed are in Indian Rupees (₹ INR) inclusive of all applicable Goods and Services Tax (GST). We do not levy hidden processing surcharges.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#580F1A] flex items-center gap-2">
              <AlertCircle size={18} className="text-[#C8985A]" />
              3. Order Cancellations &amp; Doorstep Delivery
            </h2>
            <p>
              Orders may be cancelled before dispatch directly from your account or by contacting WhatsApp Concierge. Once dispatched with an airway bill (AWB), the return and exchange policy applies.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
