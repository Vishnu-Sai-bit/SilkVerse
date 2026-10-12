"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import {
  Mail,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Bell,
  Award,
  Gift,
} from "lucide-react";
import { toast } from "sonner";
import { siteConfig } from "@/lib/siteConfig";

const INSTA_PREVIEWS = [
  { id: 1, image: "/images/instagram/insta_1.png", tag: "Bridal" },
  { id: 2, image: "/images/instagram/insta_2.png", tag: "Festive" },
  { id: 3, image: "/images/instagram/insta_3.png", tag: "Pit-Loom" },
  { id: 4, image: "/images/instagram/insta_4.png", tag: "Royal" },
];

export default function InstagramGalleryStrip() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubscribed(true);
    toast.success("Welcome to SilkVerse Privileges! Check your inbox for your welcome privilege.");
    setEmail("");
  };

  return (
    <section className="bg-[#FAF7F2] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E8E2D9]">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          
          {/* ============================================================
              LEFT CARD: COMMUNITY & SOCIAL SPOTLIGHT
          ============================================================ */}
          <div className="rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF6F0] to-[#F5EFE6] p-5 sm:p-8 lg:p-10 border border-[#D4AF37]/40 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="space-y-5">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#C8985A]">
                <Sparkles size={14} className="text-[#D4AF37]" />
                <span>Community &amp; Social</span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#580F1A]">
                  Follow Us On Instagram
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Join our vibrant community for daily handloom saree styling lookbooks, behind-the-scenes pit-loom artisan reels, and first previews of festive drops.
                </p>
              </div>

              {/* Instagram Main Feature Spotlight Box */}
              <div className="rounded-2xl bg-white/95 backdrop-blur-xs p-3.5 sm:p-5 border border-[#D4AF37]/35 shadow-xs space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shadow-sm shrink-0">
                      <FaInstagram size={24} />
                    </div>
                    <div>
                      <div className="font-serif text-sm font-bold text-stone-900 flex items-center gap-1.5">
                        <span>SilkVerse Silks</span>
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold">✓</span>
                      </div>
                      <div className="text-xs text-[#580F1A] font-semibold">
                        {siteConfig.social.instagram.handle}
                      </div>
                    </div>
                  </div>

                  <span className="hidden sm:inline-block text-[11px] font-semibold text-[#8C6D1F] bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#D4AF37]/40 shadow-xs">
                    Official Page
                  </span>
                </div>

                {/* 4 Mini Saree Photo Thumbnails */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {INSTA_PREVIEWS.map((tile) => (
                    <a
                      key={tile.id}
                      href={siteConfig.social.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square overflow-hidden rounded-xl border border-stone-200 bg-stone-100"
                    >
                      <Image
                        src={tile.image}
                        alt={tile.tag}
                        fill
                        unoptimized
                        sizes="100px"
                        className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <FaInstagram size={14} className="text-white" />
                      </div>
                    </a>
                  ))}
                </div>

                {/* Primary Instagram CTA */}
                <a
                  href={siteConfig.social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm hover:opacity-95 hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
                >
                  <FaInstagram size={17} />
                  <span>Follow {siteConfig.social.instagram.handle}</span>
                  <ArrowRight size={14} className="ml-1" />
                </a>
              </div>
            </div>

            {/* Other Official Social Links Row */}
            <div className="pt-6 mt-6 border-t border-stone-200/80">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-3">
                Also Connect With Us On:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <a
                  href={siteConfig.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 hover:text-emerald-700 text-stone-700 text-xs font-semibold transition-all hover:-translate-y-0.5 shadow-2xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
                    <FaWhatsapp size={14} />
                  </div>
                  <span className="truncate">WhatsApp</span>
                </a>

                <a
                  href={siteConfig.social.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-stone-200 hover:border-blue-600 hover:text-blue-700 text-stone-700 text-xs font-semibold transition-all hover:-translate-y-0.5 shadow-2xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                    <FaFacebookF size={13} />
                  </div>
                  <span className="truncate">Facebook</span>
                </a>

                <a
                  href={siteConfig.social.pinterest.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-stone-200 hover:border-red-600 hover:text-red-700 text-stone-700 text-xs font-semibold transition-all hover:-translate-y-0.5 shadow-2xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition">
                    <FaPinterestP size={13} />
                  </div>
                  <span className="truncate">Pinterest</span>
                </a>

                <a
                  href={siteConfig.social.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-stone-200 hover:border-red-600 hover:text-red-700 text-stone-700 text-xs font-semibold transition-all hover:-translate-y-0.5 shadow-2xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition">
                    <FaYoutube size={14} />
                  </div>
                  <span className="truncate">YouTube</span>
                </a>
              </div>
            </div>
          </div>

          {/* ============================================================
              RIGHT CARD: STAY IN THE LOOP (NEWSLETTER & EXCLUSIVE OFFERS)
          ============================================================ */}
          <div className="rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF6F0] to-[#F5EFE6] p-5 sm:p-8 lg:p-10 border border-[#D4AF37]/40 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="space-y-5">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#C8985A]">
                <Bell size={14} className="text-[#D4AF37]" />
                <span>SilkVerse Privileges</span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#580F1A]">
                  Stay in the Loop
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Subscribe to receive curated invitations to limited-edition Dharmavaram weave drops, festive seasonal discounts, and bridal styling guides.
                </p>
              </div>

              {/* Instant Welcome Perk Highlight */}
              <div className="inline-flex items-center gap-2 rounded-xl bg-[#FFF8F0] border border-[#D4AF37]/50 px-3.5 py-2 text-xs font-bold text-[#6D001A]">
                <Gift size={16} className="text-[#D4AF37] shrink-0" />
                <span>Get Flat ₹500 OFF instant coupon on your first silk order!</span>
              </div>

              {/* Newsletter Form */}
              {subscribed ? (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                  <CheckCircle2 size={22} className="shrink-0 text-emerald-600" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold">You are now subscribed!</div>
                    <div className="text-[11px] text-emerald-700">Use coupon code <span className="font-mono font-bold text-[#6D001A]">WELCOME500</span> at checkout for ₹500 off.</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <div className="relative flex-1">
                      <Mail
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                      />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full rounded-xl border border-stone-300 bg-white pl-10 pr-4 py-3.5 text-base sm:text-sm text-stone-800 placeholder-stone-400 focus:border-[#580F1A] focus:outline-none focus:ring-1 focus:ring-[#580F1A] transition shadow-2xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="rounded-xl bg-[#580F1A] hover:bg-[#721523] px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-sm hover:shadow-md transition-all active:scale-[0.99] border border-[#D4AF37]/40 shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>SUBSCRIBE</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>

                  <p className="text-[11px] text-stone-500 flex items-center gap-1.5 pt-0.5">
                    <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                    <span>We respect your privacy. No spam, unsubscribe anytime.</span>
                  </p>
                </form>
              )}
            </div>

            {/* Subscriber Benefits Strip */}
            <div className="pt-6 mt-6 border-t border-stone-200/80">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-3">
                <Award size={13} className="text-[#C8985A]" />
                <span>Exclusive Subscriber Privileges:</span>
              </span>
              <div className="space-y-2.5 text-xs text-stone-700">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#8C6D1F] text-[10px] font-bold">
                    ✦
                  </span>
                  <span>Early access to limited festive &amp; bridal silk collections</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#8C6D1F] text-[10px] font-bold">
                    ✦
                  </span>
                  <span>Special VIP discounts &amp; private festive salon invitations</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#8C6D1F] text-[10px] font-bold">
                    ✦
                  </span>
                  <span>Direct master weaver heritage stories &amp; silk care handbook</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
