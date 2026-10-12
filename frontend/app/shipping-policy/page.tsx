import Link from "next/link";
import { Truck, ChevronRight, Clock, ShieldCheck, MapPin, PackageCheck } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = {
  title: "Shipping & Delivery Policy | SilkVerse Pure Handloom Silks",
  description: "Free insured express delivery across India. Learn about our delivery timelines, tamper-proof keepsake packaging, and tracking.",
};

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1F1919] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-[#580F1A] transition-colors">Home</Link>
          <ChevronRight size={13} className="text-[#C8985A]" />
          <span className="text-[#580F1A] font-semibold">Shipping Policy</span>
        </nav>

        {/* Header Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#2D060D] via-[#4A0C16] to-[#2D060D] text-[#FFFDF7] p-8 sm:p-12 border border-[#D4AF37]/30 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              Express Doorstep Logistics
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              SHIPPING &amp; DELIVERY POLICY
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              We provide free, 100% transit-insured express delivery across all 28 states and union territories in India.
            </p>
          </div>
        </div>

        {/* Content Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-10 border border-stone-200/90 shadow-sm space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#FFF8F3] border border-stone-200/80 space-y-2 text-center">
              <Truck size={22} className="text-[#C8985A] mx-auto" />
              <div className="font-serif font-bold text-[#580F1A] text-xs">Free Shipping</div>
              <p className="text-[11px] text-stone-600">Zero shipping fees on all sarees across India</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFF8F3] border border-stone-200/80 space-y-2 text-center">
              <Clock size={22} className="text-[#C8985A] mx-auto" />
              <div className="font-serif font-bold text-[#580F1A] text-xs">2-5 Business Days</div>
              <p className="text-[11px] text-stone-600">Express air courier via Blue Dart, Delhivery &amp; DTDC</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFF8F3] border border-stone-200/80 space-y-2 text-center">
              <ShieldCheck size={22} className="text-[#C8985A] mx-auto" />
              <div className="font-serif font-bold text-[#580F1A] text-xs">100% Transit Insured</div>
              <p className="text-[11px] text-stone-600">Complete replacement guarantee against damage or loss</p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#580F1A] flex items-center gap-2">
              <PackageCheck size={18} className="text-[#C8985A]" />
              1. Delivery Timelines
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>South India Metros (Bengaluru, Chennai, Hyderabad):</strong> 2–3 business days.</li>
              <li><strong>Other Major Metros (Mumbai, Delhi NCR, Kolkata, Pune):</strong> 3–4 business days.</li>
              <li><strong>Tier 2 &amp; Tier 3 Cities / Rest of India:</strong> 4–6 business days.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#580F1A] flex items-center gap-2">
              <MapPin size={18} className="text-[#C8985A]" />
              2. Order Tracking
            </h2>
            <p>
              Once your saree is dispatched from our Dharmavaram weaving studio, you will receive an automated WhatsApp notification and email with a live tracking link. You can also track your package anytime on our <Link href="/orders" className="text-[#580F1A] font-semibold underline">Order Tracking Page</Link>.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
