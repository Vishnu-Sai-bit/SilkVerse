import Link from "next/link";
import { ShieldCheck, ChevronRight, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = {
  title: "Privacy Policy | SilkVerse Pure Handloom Silks",
  description: "Learn how SilkVerse protects your personal information, ensures safe payments, and maintains data privacy in compliance with Indian IT regulations.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 2026";

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1F1919] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-[#580F1A] transition-colors">Home</Link>
          <ChevronRight size={13} className="text-[#C8985A]" />
          <span className="text-[#580F1A] font-semibold">Privacy Policy</span>
        </nav>

        {/* Header Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#2D060D] via-[#4A0C16] to-[#2D060D] text-[#FFFDF7] p-8 sm:p-12 border border-[#D4AF37]/30 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              Legal &amp; Data Security
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              PRIVACY POLICY
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              At {siteConfig.legalName} (&quot;SilkVerse&quot;), we are committed to safeguarding your privacy, personal information, and online transaction security.
            </p>
            <div className="text-[11px] text-[#D4AF37] pt-2">
              Last Updated: {lastUpdated} • Compliant with Information Technology Act, 2000 (India)
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-10 border border-stone-200/90 shadow-sm space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
          
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#580F1A] flex items-center gap-2">
              <Eye size={18} className="text-[#C8985A]" />
              1. Information We Collect
            </h2>
            <p>
              When you purchase a saree, register an account, or contact our concierge, we collect personal information you provide, such as your full name, shipping and billing address, email address, phone number, and measurement preferences.
            </p>
            <p>
              We do not store your full debit/credit card numbers or UPI PINs. All financial transactions are securely processed by authorized third-party payment gateways (Razorpay, NPCI-certified UPI, and RBI-licensed banking partners).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#580F1A] flex items-center gap-2">
              <Lock size={18} className="text-[#C8985A]" />
              2. How We Use Your Data
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Processing, weaving coordination, quality inspection, and express delivery of your handloom sarees.</li>
              <li>Sending live SMS and WhatsApp notifications for order dispatch, shipping tracking, and doorstep delivery.</li>
              <li>Providing dedicated post-sales customer care and facilitating returns or exchanges.</li>
              <li>Sending VIP festive previews and private salon invitations (only if you opt-in to our newsletter).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#580F1A] flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#C8985A]" />
              3. Data Protection &amp; SSL Encryption
            </h2>
            <p>
              All customer sessions and payment exchanges are encrypted using 256-Bit Secure Socket Layer (SSL) technology. We enforce stringent physical, electronic, and procedural safeguards in accordance with Indian IT security rules.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#580F1A] flex items-center gap-2">
              <FileText size={18} className="text-[#C8985A]" />
              4. Contact Grievance Officer
            </h2>
            <p>
              For questions concerning your personal data or to request data erasure, please reach out to our Grievance Officer:
            </p>
            <div className="p-4 rounded-2xl bg-[#FFF8F3] border border-stone-200/80 space-y-1 text-xs">
              <div className="font-bold text-[#580F1A]">{siteConfig.legalName}</div>
              <div>Email: {siteConfig.contact.emails.support}</div>
              <div>Phone: {siteConfig.contact.phone}</div>
              <div>Address: {siteConfig.contact.address.full}</div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
