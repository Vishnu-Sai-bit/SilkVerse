"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  RotateCcw,
  Lock,
  Truck,
  ArrowRight,
  Heart,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { toast } from "sonner";
import BrandLogo from "@/components/common/BrandLogo";
import { siteConfig } from "@/lib/siteConfig";
import {
  VerifiedPaymentGatewaysStrip,
} from "@/components/common/TrustLogos";

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Suppress public footer on admin back-office routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubscribed(true);
    toast.success("Welcome to the SilkVerse family! Check your inbox soon.");
    setEmail("");
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#2D060D] text-[#F9F5EB] border-t-2 border-[#D4AF37]/40 selection:bg-[#D4AF37] selection:text-[#2D060D] overflow-hidden">
      {/* Decorative subtle gold gradient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-3/4 rounded-full bg-[#D4AF37]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* ============================================================
            MAIN FOOTER GRID (5 Columns: 3-2-2-2-3)
        ============================================================ */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12 pb-14 border-b border-white/10">
          
          {/* Column 1: BRAND IDENTITY & TRUST PROMISES (3 Cols) */}
          <div className="lg:col-span-3 space-y-5">
            <BrandLogo
              variant="horizontal"
              theme="dark"
              height={44}
              href="/"
            />

            <p className="text-xs sm:text-sm leading-relaxed text-[#F9F5EB]/80 max-w-sm">
              Authentic pure Dharmavaram silk sarees handcrafted by master artisans on traditional pit-looms. Rooted in centuries of heritage, certified with Silk Mark purity.
            </p>

            {/* Key Trust Guarantees */}
            <div className="space-y-2.5 text-xs text-[#F9F5EB]/90 pt-1">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-[#D4AF37] shrink-0" />
                <span>Silk Mark Certified 100% Pure Mulberry Silk</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw size={16} className="text-[#D4AF37] shrink-0" />
                <span>7-Day Hassle-Free Returns &amp; Exchanges</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Lock size={16} className="text-[#D4AF37] shrink-0" />
                <span>256-Bit SSL Encrypted Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck size={16} className="text-[#D4AF37] shrink-0" />
                <span>Free Express Shipping Across India</span>
              </div>
            </div>
          </div>

          {/* Column 2: SHOP SAREES (2 Cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#D4AF37] mb-4">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#F9F5EB]/75">
              <li>
                <Link href="/collections" className="hover:text-[#D4AF37] transition-colors">
                  All Handloom Sarees
                </Link>
              </li>
              <li>
                <Link href="/collections?category=Wedding" className="hover:text-[#D4AF37] transition-colors">
                  Bridal &amp; Wedding Silks
                </Link>
              </li>
              <li>
                <Link href="/collections?category=Festive" className="hover:text-[#D4AF37] transition-colors">
                  Festive Dharmavaram
                </Link>
              </li>
              <li>
                <Link href="/collections?category=Luxury%20Silk" className="hover:text-[#D4AF37] transition-colors">
                  Luxury Heavy Zari
                </Link>
              </li>
              <li>
                <Link href="/collections?category=Soft%20Silk" className="hover:text-[#D4AF37] transition-colors">
                  Lightweight Soft Silks
                </Link>
              </li>
              <li>
                <Link href="/collections?sort=newest" className="hover:text-[#D4AF37] transition-colors">
                  New Festive Arrivals
                </Link>
              </li>
              <li>
                <Link href="/collections?category=Bridal" className="inline-flex items-center gap-1.5 text-amber-300 hover:text-[#D4AF37] transition-colors font-medium">
                  <span>Bridal Muhurtham Silks</span>
                  <span className="rounded bg-[#D4AF37] px-1.5 py-0.2 text-[9px] font-bold text-[#2D060D]">
                    Royal
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: HELP & SUPPORT (2 Cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#D4AF37] mb-4">
              Help &amp; Concierge
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#F9F5EB]/75">
              <li>
                <Link href="/contact" className="hover:text-[#D4AF37] transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <a
                  href={siteConfig.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <FaWhatsapp size={13} />
                  <span>WhatsApp Concierge</span>
                </a>
              </li>
              <li>
                <Link href="/contact#faqs" className="hover:text-[#D4AF37] transition-colors">
                  Ordering &amp; FAQs
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#D4AF37] transition-colors">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-[#D4AF37] transition-colors">
                  Returns &amp; Exchange Portal
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-[#D4AF37] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/about#saree-care" className="hover:text-[#D4AF37] transition-colors">
                  Saree Care &amp; Zari Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: ABOUT SILKVERSE (2 Cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#D4AF37] mb-4">
              Our Heritage
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#F9F5EB]/75">
              <li>
                <Link href="/about#story" className="hover:text-[#D4AF37] transition-colors">
                  The Dharmavaram Story
                </Link>
              </li>
              <li>
                <Link href="/about#artisans" className="hover:text-[#D4AF37] transition-colors">
                  Master Artisans &amp; Looms
                </Link>
              </li>
              <li>
                <Link href="/about#authenticity" className="hover:text-[#D4AF37] transition-colors">
                  Silk Mark India Authenticity
                </Link>
              </li>
              <li>
                <Link href="/about#ethical" className="hover:text-[#D4AF37] transition-colors">
                  Ethical Fair-Trade Weaving
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-[#D4AF37] transition-colors">
                  Customer Testimonials
                </Link>
              </li>
              <li>
                <Link href="/contact#store" className="hover:text-[#D4AF37] transition-colors">
                  Weavers Studio &amp; Store
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: STAY CONNECTED & NEWSLETTER (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
              Stay Connected
            </h4>

            <p className="text-xs text-[#F9F5EB]/70 leading-relaxed">
              Subscribe for private salon invitations, limited festive drop notifications, and bridal styling tips.
            </p>

            {subscribed ? (
              <div className="rounded-xl border border-emerald-400/40 bg-emerald-950/40 p-3 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                <span>Thank you! You are now subscribed to SilkVerse privileges.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-2.5 pr-11 text-xs text-white placeholder:text-white/40 focus:border-[#D4AF37] focus:bg-black/60 focus:outline-none transition shadow-inner"
                    required
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to VIP salon"
                    className="absolute right-1 top-1 bottom-1 flex items-center justify-center rounded-lg bg-[#D4AF37] px-3 text-[#2D060D] transition hover:bg-[#F5E6BE] cursor-pointer shadow-xs font-bold"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
                <p className="text-[10px] text-[#F9F5EB]/50">
                  No spam ever. Unsubscribe anytime with 1 click.
                </p>
              </form>
            )}

            {/* Social Icons Strip */}
            <div className="pt-2">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] mb-2.5">
                Follow Our Journey
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href={siteConfig.social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  title="Follow SilkVerse on Instagram"
                  className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-[#D4AF37] hover:text-[#2D060D] hover:border-[#D4AF37] transition cursor-pointer"
                >
                  <FaInstagram size={14} />
                </a>
                <a
                  href={siteConfig.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Concierge"
                  title="Chat with WhatsApp Concierge"
                  className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition cursor-pointer"
                >
                  <FaWhatsapp size={14} />
                </a>
                <a
                  href={siteConfig.social.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  title="Connect on Facebook"
                  className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-[#D4AF37] hover:text-[#2D060D] hover:border-[#D4AF37] transition cursor-pointer"
                >
                  <FaFacebookF size={12} />
                </a>
                <a
                  href={siteConfig.social.pinterest.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Pinterest"
                  title="Explore SilkVerse on Pinterest"
                  className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-[#D4AF37] hover:text-[#2D060D] hover:border-[#D4AF37] transition cursor-pointer"
                >
                  <FaPinterestP size={13} />
                </a>
                <a
                  href={siteConfig.social.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  title="Watch SilkVerse on YouTube"
                  className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-[#D4AF37] hover:text-[#2D060D] hover:border-[#D4AF37] transition cursor-pointer"
                >
                  <FaYoutube size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            FULL-WIDTH VERIFIED PAYMENT GATEWAYS & SECURITY GUARANTEE STRIP
        ============================================================ */}
        <div className="py-8 border-b border-white/10">
          <VerifiedPaymentGatewaysStrip theme="dark" />
        </div>

        {/* ============================================================
            BOTTOM BAR (Copyright & Legal)
        ============================================================ */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#F9F5EB]/60 text-center md:text-left">
          <div>
            <span>© {currentYear} {siteConfig.legalName}. All Rights Reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 sm:gap-4 text-[11px] sm:text-xs">
            <Link href="/privacy" className="hover:text-[#D4AF37] transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#D4AF37] transition-colors">
              Terms &amp; Conditions
            </Link>
            <span>•</span>
            <Link href="/shipping-policy" className="hover:text-[#D4AF37] transition-colors">
              Shipping Policy
            </Link>
            <span>•</span>
            <Link href="/collections" className="hover:text-[#D4AF37] transition-colors">
              Sitemap
            </Link>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#F9F5EB]/70">
            <span>Handcrafted with</span>
            <Heart size={12} className="text-[#D4AF37] fill-[#D4AF37]" />
            <span>in Dharmavaram, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}