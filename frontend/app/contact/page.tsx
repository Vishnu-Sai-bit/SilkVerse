"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Headphones,
  Heart,
  ShieldCheck,
  Smile,
  ChevronRight,
  ChevronDown,
  Sparkles,
  MessageCircle,
  Share2,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Navigation,
  ArrowRight,
} from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Order Inquiry",
    message: "",
    agree: true,
  });

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 4 Hero Badges
  const HERO_BADGES = [
    {
      title: "Quick Response",
      desc: "We reply within 24 hours",
      icon: Headphones,
    },
    {
      title: "Dedicated Support",
      desc: "Real people, real help",
      icon: Heart,
    },
    {
      title: "Safe & Secure",
      desc: "Your privacy is our priority",
      icon: ShieldCheck,
    },
    {
      title: "Customer Happiness",
      desc: "Your satisfaction is our goal",
      icon: Smile,
    },
  ];

  // 5 FAQs from Page 23
  const FAQS = [
    {
      q: "How long does delivery take?",
      a: "Metro deliveries arrive within 2–4 business days. Other serviceable locations across India take 4–6 business days with express tracking.",
    },
    {
      q: "What is your return policy?",
      a: "We offer a 7-day hassle-free doorstep return & exchange policy. The saree must remain unused with its Silk Mark authenticity tag intact.",
    },
    {
      q: "Do you offer international shipping?",
      a: "Yes! SilkVerse ships worldwide to over 45 countries including the USA, UK, UAE, Singapore, and Australia via DHL Express.",
    },
    {
      q: "How can I track my order?",
      a: "As soon as your saree is dispatched from our pit-loom center, you receive an SMS and email with live tracking links and estimated arrival time.",
    },
    {
      q: "How do I care for my silk sarees?",
      a: "We recommend professional dry clean only. Store in breathable muslin bags and change folds every 4 to 6 months to preserve zari brilliance.",
    },
  ];

  // 5 Other Ways to Connect
  const OTHER_WAYS = [
    {
      title: "Live Chat",
      desc: "Chat with our support team in real-time.",
      icon: MessageSquare,
    },
    {
      title: "Feedback",
      desc: "We value your feedback and suggestions.",
      icon: CheckCircle2,
    },
    {
      title: "Bulk Orders",
      desc: "For corporate & wedding enquiries.",
      icon: Heart,
    },
    {
      title: "Press & Media",
      desc: "For press releases and media inquiries.",
      icon: Share2,
    },
    {
      title: "Care & Support",
      desc: "Get help with product care and more.",
      icon: ShieldCheck,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!formData.agree) {
      toast.error("Please agree to the Privacy Policy and Terms.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! Your message has been sent to our concierge team.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Order Inquiry",
        message: "",
        agree: true,
      });
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1F1919]">
      
      {/* 1. TOP BREADCRUMB STRIP */}
      <div className="bg-[#181313] text-[#FFFDF7] border-b border-[#C8985A]/30 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <nav className="flex items-center gap-2 text-stone-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={13} className="text-[#C8985A]" />
            <span className="text-[#C8985A] font-semibold">Contact Us</span>
          </nav>

          <span className="text-[11px] font-medium text-amber-200/80">
            ✦ Direct Weaver Concierge Support
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 sm:space-y-16">
        
        {/* 2. HERO: WE ARE HERE FOR YOU */}
        <section className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-10 shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Still-Life Heritage Saree & Lotus Photo */}
            <div className="lg:col-span-5 relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-lg border border-stone-200">
              <Image
                src="/images/heritage/contact_hero.png"
                alt="SilkVerse Heritage Brass Kalash and Lotus"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-xs text-[#580F1A] border border-[#C8985A]/40 shadow-xs">
                  <Sparkles size={13} className="text-[#C8985A]" />
                  SilkVerse Concierge Desk
                </span>
              </div>
            </div>

            {/* Right: Narrative & 4 Feature Badges */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C8985A]">
                  Client Concierge
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#580F1A] leading-tight mt-1">
                  WE ARE HERE FOR YOU
                </h1>
                <p className="text-sm sm:text-base text-stone-600 mt-2 leading-relaxed font-light">
                  Whether you have a question about our products, an order, or anything else, our team is ready to assist you.
                </p>
                <div className="flex items-center gap-2 text-[#C8985A] my-4 text-xs">
                  <span>—</span>
                  <span>✦</span>
                  <span>—</span>
                </div>
              </div>

              {/* 4 Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {HERO_BADGES.map((b, idx) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#FFF8F3] border border-stone-200/80 shadow-2xs space-y-1.5 text-center flex flex-col items-center justify-center hover:border-[#580F1A]/40 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-white text-[#C8985A] border border-amber-200 flex items-center justify-center shadow-2xs">
                        <Icon size={16} />
                      </div>
                      <div className="font-serif text-xs font-bold text-[#580F1A]">
                        {b.title}
                      </div>
                      <div className="text-[10px] text-stone-500 leading-snug">
                        {b.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* 3. SEND US A MESSAGE & CONTACT INFORMATION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: SEND US A MESSAGE FORM */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-md space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C8985A]">
                Write to Us
              </span>
              <h2 className="font-serif text-2xl font-bold tracking-wide text-[#580F1A] mt-1">
                SEND US A MESSAGE
              </h2>
              <div className="flex items-center gap-1.5 text-[#C8985A] mt-1 text-xs">
                <span>—</span>
                <span>✦</span>
                <span>—</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-10 rounded-xl bg-white border border-stone-300 px-3.5 text-base sm:text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#580F1A] focus:ring-1 focus:ring-[#580F1A] shadow-2xs"
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Email Address *</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-10 rounded-xl bg-white border border-stone-300 px-3.5 text-base sm:text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#580F1A] focus:ring-1 focus:ring-[#580F1A] shadow-2xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-10 rounded-xl bg-white border border-stone-300 px-3.5 text-base sm:text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#580F1A] focus:ring-1 focus:ring-[#580F1A] shadow-2xs"
                  />
                </div>

                {/* Subject Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full h-10 rounded-xl bg-white border border-stone-300 px-3 text-base sm:text-xs text-stone-800 focus:outline-none focus:border-[#580F1A] focus:ring-1 focus:ring-[#580F1A] shadow-2xs"
                    required
                  >
                    <option value="Order Inquiry">Order Inquiry</option>
                    <option value="Product Details">Product Details</option>
                    <option value="Custom Saree Weaving">Custom Saree Weaving</option>
                    <option value="Wholesale / Bulk Inquiry">Wholesale / Bulk Inquiry</option>
                    <option value="Feedback / Suggestions">Feedback / Suggestions</option>
                    <option value="General Support">General Support</option>
                  </select>
                </div>
              </div>

              {/* Message Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Message *</label>
                <textarea
                  rows={4}
                  maxLength={1000}
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl bg-white border border-stone-300 p-3.5 text-base sm:text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#580F1A] focus:ring-1 focus:ring-[#580F1A] resize-none shadow-2xs"
                  required
                />
                <div className="text-right text-[10px] text-stone-400">
                  {formData.message.length} / 1000
                </div>
              </div>

              {/* Privacy Policy Checkbox */}
              <div className="flex items-start gap-2 text-xs text-stone-600">
                <input
                  type="checkbox"
                  id="privacyAgreeMain"
                  checked={formData.agree}
                  onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded border-stone-300 text-[#580F1A] accent-[#580F1A]"
                />
                <label htmlFor="privacyAgreeMain" className="select-none cursor-pointer">
                  I agree to the <span className="text-[#580F1A] font-semibold hover:underline">Privacy Policy</span> and <span className="text-[#580F1A] font-semibold hover:underline">Terms of Service</span>.
                </label>
              </div>

              {/* SEND MESSAGE Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-[#580F1A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#7A1628] active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send size={14} />
                <span>{isSubmitting ? "SENDING..." : "SEND MESSAGE"}</span>
              </button>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-center text-xs text-stone-600 flex items-center justify-center gap-2">
                <Clock size={13} className="text-[#C8985A]" />
                <span>We usually respond within 24 hours on business days.</span>
              </div>
            </form>
          </div>

          {/* Right: CONTACT INFORMATION CARD */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-md space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C8985A]">
                Direct Contacts
              </span>
              <h2 className="font-serif text-2xl font-bold tracking-wide text-[#580F1A] mt-1">
                CONTACT INFORMATION
              </h2>
              <div className="flex items-center gap-1.5 text-[#C8985A] mt-1 text-xs">
                <span>—</span>
                <span>✦</span>
                <span>—</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* 1. Visit Our Store */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FFF8F3] border border-stone-200/80">
                <div className="w-10 h-10 rounded-xl bg-[#580F1A] text-[#C8985A] flex items-center justify-center shrink-0 shadow-2xs">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-800">Visit Our Store</div>
                  <div className="text-xs font-semibold text-[#580F1A] mt-0.5">
                    SilkVerse Experience Store
                  </div>
                  <div className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                    {siteConfig.contact.address.full}
                  </div>
                </div>
              </div>

              {/* 2. Call Us */}
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FFF8F3] border border-stone-200/80 hover:border-[#580F1A] transition"
              >
                <div className="w-10 h-10 rounded-xl bg-[#580F1A] text-[#C8985A] flex items-center justify-center shrink-0 shadow-2xs">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-800">Call Us</div>
                  <div className="text-xs font-semibold text-stone-900 mt-0.5">
                    {siteConfig.contact.phoneDisplay}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    ({siteConfig.contact.hours.display})
                  </div>
                </div>
              </a>

              {/* 3. Email Us */}
              <a
                href={`mailto:${siteConfig.contact.emails.support}`}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FFF8F3] border border-stone-200/80 hover:border-[#580F1A] transition"
              >
                <div className="w-10 h-10 rounded-xl bg-[#580F1A] text-[#C8985A] flex items-center justify-center shrink-0 shadow-2xs">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-stone-800">Email Us</div>
                  <div className="text-xs font-semibold text-[#580F1A] mt-0.5 break-all">
                    {siteConfig.contact.emails.enquiry}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Direct Customer Support &amp; Order Enquiries
                  </div>
                </div>
              </a>

              {/* 4. WhatsApp */}
              <a
                href={siteConfig.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FFF8F3] border border-stone-200/80 hover:border-emerald-600 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-800">WhatsApp</div>
                  <div className="text-xs font-semibold text-emerald-800 mt-0.5">
                    {siteConfig.contact.whatsappDisplay}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    (Direct WhatsApp Chat &amp; Assistance)
                  </div>
                </div>
              </a>
            </div>

            <div className="pt-3 text-center text-xs text-stone-500 border-t border-stone-100 flex items-center justify-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Dedicated artisans &amp; concierge ready to assist.</span>
            </div>
          </div>

        </section>

        {/* 4. FIND US HERE & FREQUENTLY ASKED QUESTIONS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: FIND US HERE MAP CARD */}
          <div id="store" className="scroll-mt-24 lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-md space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C8985A]">
                Location
              </span>
              <h3 className="font-serif text-xl font-bold tracking-wide text-[#580F1A] mt-1">
                FIND US HERE
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Visit our experience store and explore the world of timeless silks.
              </p>
            </div>

            {/* Stylized Illustrated Map */}
            <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-stone-300 bg-[#F5EFE6]">
              {/* Subtle Grid / Roads Pattern */}
              <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#C8985A_1px,transparent_1px),linear-gradient(to_bottom,#C8985A_1px,transparent_1px)] bg-[size:40px_40px]" />
              
              {/* Landmark 1: Kamakshi Temple */}
              <div className="absolute top-8 right-10 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-stone-300 shadow-xs text-center">
                <div className="text-[10px] font-bold text-stone-700">KAMAKSHI TEMPLE</div>
                <div className="text-[8px] text-stone-400">Historic Landmark</div>
              </div>

              {/* Landmark 2: Kanchipuram Bus Stand */}
              <div className="absolute bottom-16 left-8 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-stone-300 shadow-xs text-center">
                <div className="text-[10px] font-bold text-stone-700">KANCHIPURAM</div>
                <div className="text-[8px] text-stone-400">Bus Stand (800m)</div>
              </div>

              {/* SilkVerse Pinpoint Marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-11 h-11 rounded-full bg-[#580F1A] text-[#C8985A] border-2 border-white flex items-center justify-center shadow-lg animate-bounce">
                  <MapPin size={22} />
                </div>
                <div className="mt-1 bg-[#181313] text-[#FFFDF7] px-3 py-1 rounded-full text-[10px] font-serif font-bold shadow-md border border-[#C8985A]/40 whitespace-nowrap">
                  SilkVerse Experience Store
                </div>
              </div>

              {/* Get Directions Floating CTA */}
              <div className="absolute bottom-4 left-4">
                <button
                  type="button"
                  onClick={() => window.open("https://maps.google.com/?q=Kanchipuram+Silk", "_blank")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-semibold shadow-xs hover:bg-stone-50 transition-colors"
                >
                  <Navigation size={13} className="text-[#580F1A]" />
                  <span>GET DIRECTIONS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: FREQUENTLY ASKED QUESTIONS ACCORDION */}
          <div id="faqs" className="scroll-mt-24 lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-md space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C8985A]">
                Common Queries
              </span>
              <h3 className="font-serif text-xl font-bold tracking-wide text-[#580F1A] mt-1">
                FREQUENTLY ASKED QUESTIONS
              </h3>
              <div className="flex items-center gap-1.5 text-[#C8985A] mt-1 text-xs">
                <span>—</span>
                <span>✦</span>
                <span>—</span>
              </div>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-stone-200 overflow-hidden transition-all bg-[#FFF8F3]/50"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-stone-800 hover:text-[#580F1A] transition-colors gap-2"
                    >
                      <span>{faq.q}</span>
                      <span className="text-stone-400 shrink-0 font-bold">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-0 text-xs text-stone-600 leading-relaxed font-light border-t border-stone-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => toast.info("Displaying all 24 verified customer FAQs.")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <HelpCircle size={14} className="text-[#C8985A]" />
                <span>VIEW ALL FAQS</span>
              </button>
            </div>
          </div>

        </section>

        {/* 5. OTHER WAYS TO CONNECT, WORKING HOURS, FOLLOW US */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CARD 1: OTHER WAYS TO CONNECT */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-4">
            <div>
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#580F1A]">
                OTHER WAYS TO CONNECT
              </h3>
              <div className="flex items-center gap-1.5 text-[#C8985A] mt-1 text-xs">
                <span>—</span>
                <span>✦</span>
              </div>
            </div>

            <div className="space-y-3">
              {OTHER_WAYS.map((way, idx) => {
                const Icon = way.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => toast.info(`Connecting to ${way.title}...`)}
                    className="group flex items-center justify-between p-3 rounded-2xl bg-[#FFF8F3]/60 border border-stone-200 hover:border-[#580F1A]/40 hover:shadow-2xs transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-white text-[#580F1A] border border-amber-200 flex items-center justify-center shrink-0">
                        <Icon size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-stone-800 leading-tight">
                          {way.title}
                        </div>
                        <div className="text-[10px] text-stone-500 truncate">
                          {way.desc}
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-stone-300 group-hover:text-[#580F1A] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* CARD 2: WORKING HOURS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#580F1A]">
                  WORKING HOURS
                </h3>
                <div className="flex items-center gap-1.5 text-[#C8985A] mt-1 text-xs">
                  <span>—</span>
                  <span>✦</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-stone-700">
                <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                  <span className="font-medium">Monday – Friday</span>
                  <span className="font-bold text-stone-900">9:30 AM – 6:30 PM</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                  <span className="font-medium">Saturday</span>
                  <span className="font-bold text-stone-900">9:30 AM – 6:30 PM</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                  <span className="font-medium">Sunday</span>
                  <span className="font-bold text-[#580F1A]">10:00 AM – 4:00 PM</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-stone-600 flex items-start gap-2.5">
                <Calendar size={15} className="text-[#C8985A] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-stone-800">Closed on public holidays</div>
                  <div className="text-[11px] text-stone-500">For urgent queries, reach us on WhatsApp.</div>
                </div>
              </div>
            </div>

            <div className="text-center pt-3 border-t border-stone-200">
              <div className="w-8 h-8 mx-auto rounded-full bg-amber-50 border border-[#C8985A]/40 flex items-center justify-center text-[#C8985A] mb-1.5">
                <Sparkles size={14} />
              </div>
              <p className="font-serif text-xs text-[#580F1A] font-semibold italic">
                Thank you for being a part of the SilkVerse family.
              </p>
            </div>
          </div>

          {/* CARD 3: FOLLOW US & NEWSLETTER */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#580F1A]">
                  FOLLOW US
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Stay connected for new arrivals, style tips and more.
                </p>
              </div>

              {/* Social Handles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-2.5 text-xs">
                <a
                  href={siteConfig.social.instagram.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-[#FFF8F3] border border-stone-200 hover:border-[#580F1A] flex items-center gap-2 font-medium text-stone-700 transition-colors shadow-2xs"
                >
                  <span className="w-6 h-6 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-[11px]">IG</span>
                  <span className="truncate min-w-0">{siteConfig.social.instagram.handle}</span>
                </a>
                <a
                  href={siteConfig.social.facebook.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-[#FFF8F3] border border-stone-200 hover:border-[#580F1A] flex items-center gap-2 font-medium text-stone-700 transition-colors shadow-2xs"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[11px]">fb</span>
                  <span className="truncate min-w-0">/{siteConfig.social.facebook.name}</span>
                </a>
                <a
                  href={siteConfig.social.pinterest.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-[#FFF8F3] border border-stone-200 hover:border-[#580F1A] flex items-center gap-2 font-medium text-stone-700 transition-colors shadow-2xs"
                >
                  <span className="w-6 h-6 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-[11px]">P</span>
                  <span className="truncate min-w-0">{siteConfig.social.pinterest.handle}</span>
                </a>
                <a
                  href={siteConfig.social.youtube.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-[#FFF8F3] border border-stone-200 hover:border-[#580F1A] flex items-center gap-2 font-medium text-stone-700 transition-colors shadow-2xs"
                >
                  <span className="w-6 h-6 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-[11px]">YT</span>
                  <span className="truncate min-w-0">{siteConfig.social.youtube.handle}</span>
                </a>
              </div>
            </div>

            {/* Newsletter Card */}
            <div className="p-4 rounded-2xl bg-[#FFF8F3] border border-stone-200/90 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#580F1A]">
                <Mail size={14} className="text-[#C8985A]" />
                <span>Subscribe to our newsletter</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-snug">
                Stay updated with the latest collections and private salon offers.
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="min-w-0 w-full flex-1 h-9 sm:h-8 rounded-xl bg-white border border-stone-300 px-3 text-base sm:text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#580F1A]"
                />
                <button
                  type="button"
                  onClick={() => toast.success("Subscribed to SilkVerse newsletter!")}
                  className="shrink-0 h-9 sm:h-8 px-3 rounded-xl bg-[#580F1A] text-white text-xs font-bold hover:bg-[#7A1628] transition-colors"
                >
                  JOIN
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* 6. BOTTOM CELEBRATION QUOTE BANNER */}
        <div className="rounded-3xl bg-gradient-to-r from-[#181313] via-[#2A1015] to-[#181313] text-[#FFFDF7] p-8 sm:p-12 text-center border border-[#C8985A]/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-2 left-8 text-[#C8985A]/20 font-serif text-7xl select-none">“</div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <p className="font-serif text-lg sm:text-2xl font-medium tracking-wide text-[#FFFDF7] italic leading-relaxed">
              We&apos;re just a message away. We can&apos;t wait to hear from you!
            </p>
            <div className="flex items-center justify-center gap-3 text-[#C8985A] text-xs pt-3">
              <span>—</span>
              <Sparkles size={14} />
              <span>SilkVerse Concierge Standard</span>
              <Sparkles size={14} />
              <span>—</span>
            </div>
          </div>
          <div className="absolute bottom-2 right-8 text-[#C8985A]/20 font-serif text-7xl select-none">”</div>
        </div>

      </div>
    </main>
  );
}