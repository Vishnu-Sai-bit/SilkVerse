import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Award,
  Heart,
  ShieldCheck,
  Leaf,
  HandHeart,
  Diamond,
  Users,
  Crown,
  Check,
  ChevronRight,
  Shield,
  Feather,
  ArrowRight,
} from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";

export const metadata = {
  title: "About Us | SilkVerse — Crafted by Tradition. Chosen by You.",
  description: "Learn about SilkVerse, our Dharmavaram heritage, master artisans, authentic pure silk mark, and our commitment to ethical craftsmanship.",
};

export default function AboutPage() {
  const HERO_FEATURES = [
    {
      title: "Authentic Weaves",
      desc: "Handpicked from trusted weaving communities.",
      icon: Crown,
    },
    {
      title: "Premium Quality",
      desc: "Finest silk, carefully selected for you.",
      icon: Award,
    },
    {
      title: "Made with Love",
      desc: "Crafted with passion, perfection and pride.",
      icon: Heart,
    },
    {
      title: "Trusted Always",
      desc: "Transparent, ethical and customer-focused.",
      icon: ShieldCheck,
    },
  ];

  const STORY_CARDS = [
    {
      tag: "HERITAGE",
      image: "/images/heritage/master_weaver_artisan.jpg",
      caption: "Rooted in centuries of Indian weaving tradition.",
    },
    {
      tag: "CRAFTSMANSHIP",
      image: "/images/heritage/weaver_hands.png",
      caption: "Skilled artisans weaving magic into every thread.",
    },
    {
      tag: "ELEGANCE",
      image: "/images/products/saree_2_emerald_clean.png",
      caption: "Timeless designs for every occasion and generation.",
    },
    {
      tag: "YOU",
      image: "/images/collections/bridal.png",
      caption: "Made for you, to be treasured for a lifetime.",
    },
  ];

  const VALUES = [
    {
      title: "SUSTAINABLE",
      desc: "We care for our planet and practice responsible sourcing.",
      icon: Leaf,
    },
    {
      title: "ETHICAL",
      desc: "We empower artisans and ensure fair wages and respect.",
      icon: HandHeart,
    },
    {
      title: "AUTHENTIC",
      desc: "Every product is genuine, original and made with integrity.",
      icon: Shield,
    },
    {
      title: "EXCELLENCE",
      desc: "We aim for the highest standards in quality and service.",
      icon: Diamond,
    },
    {
      title: "CUSTOMER FIRST",
      desc: "Your happiness inspires us to do better every day.",
      icon: Users,
    },
  ];

  const CRAFT_STEPS = [
    {
      title: "Finest Yarns",
      desc: "Sourced from trusted suppliers.",
      icon: Feather,
    },
    {
      title: "Handwoven with Care",
      desc: "Woven on traditional looms.",
      icon: Crown,
    },
    {
      title: "Quality Check",
      desc: "Every piece is carefully inspected.",
      icon: ShieldCheck,
    },
    {
      title: "Perfect for You",
      desc: "Delivered with love and care.",
      icon: Heart,
    },
  ];

  const PROMISES = [
    "Authentic products with premium quality",
    "Transparent pricing with no hidden costs",
    "Secure shopping and fast delivery",
    "Hassle-free returns and friendly support",
  ];

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1F1919]">
      
      {/* 1. TOP BREADCRUMB STRIP */}
      <div className="bg-[#181313] text-[#FFFDF7] border-b border-[#C8985A]/30 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <nav className="flex items-center gap-2 text-stone-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={13} className="text-[#C8985A]" />
            <span className="text-[#C8985A] font-semibold">About Us</span>
          </nav>

          <span className="text-[11px] font-medium text-amber-200/80">
            ✦ Certified Dharmavaram Handloom Heritage
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16 sm:space-y-20">
        
        {/* 2. HERO: CRAFTED BY TRADITION. CHOSEN BY YOU. */}
        <section className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-10 lg:p-12 shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Editorial Draped Saree Photograph */}
            <div className="lg:col-span-5 relative h-96 sm:h-[480px] rounded-2xl overflow-hidden shadow-xl border border-stone-200">
              <Image
                src="/images/heritage/hero_drape.png"
                alt="Crafted by Tradition"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-xs text-[#580F1A] border border-[#C8985A]/40 shadow-sm">
                  <Sparkles size={13} className="text-[#C8985A]" />
                  Pure Dharmavaram Handloom
                </span>
              </div>
            </div>

            {/* Right: Narrative & 4 Feature Strip */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C8985A]">
                  Our Philosophy
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#580F1A] leading-tight mt-1">
                  CRAFTED BY TRADITION.<br />
                  <span className="text-[#C8985A]">CHOSEN BY YOU.</span>
                </h1>
                <div className="flex items-center gap-2 text-[#C8985A] my-4 text-xs">
                  <span>—</span>
                  <span>✦</span>
                  <span>—</span>
                </div>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-stone-600 leading-relaxed font-light">
                <p>
                  SilkVerse was born from a deep love for India&apos;s rich weaving heritage and a desire to bring authentic silk craftsmanship to modern lives.
                </p>
                <p>
                  We work closely with skilled artisans and weaving communities to create sarees and fabrics that are timeless, luxurious and meaningful.
                </p>
              </div>

              {/* 4 Feature Strip Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                {HERO_FEATURES.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-[#FFF8F3] border border-stone-200/80 shadow-2xs space-y-2 text-center flex flex-col items-center justify-center transition-all hover:border-[#580F1A]/40 hover:shadow-xs"
                    >
                      <div className="w-9 h-9 rounded-full bg-white text-[#C8985A] border border-amber-200 flex items-center justify-center shadow-2xs">
                        <Icon size={16} />
                      </div>
                      <div className="font-serif text-xs font-bold text-[#580F1A]">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-stone-500 leading-snug">
                        {item.desc}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#580F1A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#7A1628] transition-colors shadow-md"
                >
                  <span>Explore Handloom Sarees</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* 3. OUR STORY & 4 PHOTO STORY CARDS */}
        <section id="story" className="scroll-mt-24 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C8985A]">
                The Heritage Journey
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#580F1A]">
                OUR STORY
              </h2>
              <div className="flex items-center gap-1.5 text-[#C8985A] text-xs">
                <span>—</span>
                <span>✦</span>
                <span>—</span>
              </div>

              <p className="text-sm text-stone-600 leading-relaxed font-light">
                Silk has always been a symbol of grace, culture and celebration. From ancient royal courts to modern wardrobes, it continues to inspire generations.
              </p>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                SilkVerse is our tribute to this timeless legacy — blending heritage with contemporary elegance to create pieces that become a part of your most beautiful moments.
              </p>

              <div className="pt-4 border-t border-stone-200">
                <p className="font-serif text-2xl sm:text-3xl text-[#580F1A] italic">
                  “Every thread has a story.”
                </p>
              </div>
            </div>

            {/* Right: 4 Photo Story Cards */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STORY_CARDS.map((card, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm flex flex-col justify-between group hover:border-[#580F1A]/50 transition-all"
                >
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-stone-100">
                    <Image
                      src={card.image}
                      alt={card.tag}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-2.5 left-3 font-serif text-xs font-bold uppercase tracking-wider text-white drop-shadow-sm">
                      {card.tag}
                    </span>
                  </div>
                  <div className="p-3 text-[11px] text-stone-600 leading-snug bg-[#FFF8F3]/60">
                    {card.caption}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 4. OUR VALUES (5 PURE PILLARS) */}
        <section id="ethical" className="scroll-mt-24 space-y-8 rounded-3xl bg-white p-8 sm:p-10 border border-stone-200/90 shadow-sm">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C8985A]">
              Guiding Principles
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#580F1A]">
              OUR VALUES
            </h2>
            <div className="flex items-center justify-center gap-2 text-[#C8985A] text-xs">
              <span>—</span>
              <span>✦</span>
              <span>—</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500">
              The ethical commitments that anchor every single thread we weave.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {VALUES.map((val, i) => {
              const Icon = val.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-[#FFF8F3] border border-stone-200/90 shadow-2xs space-y-2.5 text-center flex flex-col items-center justify-between hover:border-[#C8985A] hover:shadow-xs transition-all"
                >
                  <div className="w-11 h-11 rounded-full bg-white text-[#C8985A] border border-[#C8985A]/40 flex items-center justify-center shadow-2xs">
                    <Icon size={20} />
                  </div>
                  <div className="font-serif text-xs font-bold uppercase tracking-wider text-[#580F1A]">
                    {val.title}
                  </div>
                  <div className="text-[11px] text-stone-600 leading-relaxed font-light">
                    {val.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. CRAFTSMANSHIP STEPPER & OUR PROMISE */}
        <section id="artisans" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: The Art of Craftsmanship */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C8985A]">
                The Process
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#580F1A] mt-1">
                THE ART OF CRAFTSMANSHIP
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed font-light">
                From selecting the finest yarns to the final weave, every step is a labor of love. Our artisans bring generations of expertise, ensuring each piece is a masterpiece.
              </p>
            </div>

            {/* 4-Step Stepper */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {CRAFT_STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <div key={idx} className="relative flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF8F3] text-[#580F1A] border-2 border-[#C8985A]/40 flex items-center justify-center shadow-xs">
                      <StepIcon size={20} />
                    </div>
                    <div className="font-serif text-xs font-bold text-stone-800">
                      {step.title}
                    </div>
                    <div className="text-[10px] text-stone-500 leading-snug">
                      {step.desc}
                    </div>
                    {idx < CRAFT_STEPS.length - 1 && (
                      <div className="hidden sm:block absolute top-5 -right-2 text-stone-300">
                        →
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <Crown size={14} className="text-[#C8985A]" />
                100% Traditional Pit-Looms
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#580F1A]" />
                Silk Mark Organisation Certified
              </span>
            </div>
          </div>

          {/* Right: Our Promise (Luxury Maroon Card) */}
          <div id="authenticity" className="scroll-mt-24 lg:col-span-5 bg-gradient-to-br from-[#4A0C16] via-[#580F1A] to-[#2E070D] text-[#FFFDF7] rounded-3xl p-6 sm:p-8 border-2 border-[#C8985A]/40 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold tracking-wider text-amber-200 uppercase">
                  OUR PROMISE
                </h3>
                <div className="w-9 h-9 rounded-full bg-white/10 border border-[#C8985A]/40 flex items-center justify-center text-[#C8985A]">
                  <Crown size={16} />
                </div>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-[#FFFDF7]/90 font-light">
                {PROMISES.map((promise, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#C8985A] text-[#580F1A] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Check size={13} className="stroke-[3]" />
                    </div>
                    <span className="leading-snug">{promise}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Keepsake Packaging Pill */}
            <div className="relative z-10 p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#580F1A] border border-[#C8985A] flex items-center justify-center shrink-0 shadow-md overflow-hidden p-1.5">
                <BrandLogo variant="icon" height={32} />
              </div>
              <div>
                <div className="font-serif text-xs font-bold text-[#FFFDF7]">
                  SilkVerse Keepsake Box Packaging
                </div>
                <div className="text-[10px] text-amber-200/80">
                  Rigid luxury wooden boxes with breathable fabric linings.
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* 6. SAREE CARE & ZARI MAINTENANCE GUIDE */}
        <section id="saree-care" className="scroll-mt-24 rounded-3xl bg-white p-8 sm:p-10 border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C8985A]">
                Preserving Heirloom Treasures
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#580F1A] mt-1">
                SAREE CARE &amp; ZARI GUIDE
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#580F1A] bg-[#FFF8F3] border border-[#C8985A]/40 px-3.5 py-1.5 rounded-full">
              <ShieldCheck size={16} className="text-[#C8985A]" />
              <span>Silk Mark India Guidelines</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#FFF8F3] border border-stone-200/80 space-y-2">
              <div className="font-serif text-sm font-bold text-[#580F1A]">1. Storage in Muslin</div>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Wrap your pure silk saree in unbleached pure cotton or muslin fabric. Never use plastic covers which trap moisture and tarnish metallic zari.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#FFF8F3] border border-stone-200/80 space-y-2">
              <div className="font-serif text-sm font-bold text-[#580F1A]">2. Refold Periodically</div>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Unfold and change the crease lines every 4 to 6 months. This prevents sharp creases from permanently cutting the delicate pure silk warp yarns.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#FFF8F3] border border-stone-200/80 space-y-2">
              <div className="font-serif text-sm font-bold text-[#580F1A]">3. Dry Clean Only</div>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Always opt for professional dry-cleaning with certified saree specialists. Never hand-wash or machine-wash tested zari handloom silks.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#FFF8F3] border border-stone-200/80 space-y-2">
              <div className="font-serif text-sm font-bold text-[#580F1A]">4. Zari Protection</div>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Never spray perfumes, deodorants, or hairspray directly onto zari borders or pallu. Roll zari inward to shield it from ambient oxidation.
              </p>
            </div>
          </div>
        </section>

        {/* 6. BOTTOM CELEBRATION QUOTE BANNER */}
        <div className="rounded-3xl bg-gradient-to-r from-[#181313] via-[#2A1015] to-[#181313] text-[#FFFDF7] p-8 sm:p-12 text-center border border-[#C8985A]/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-2 left-8 text-[#C8985A]/20 font-serif text-7xl select-none">“</div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <p className="font-serif text-lg sm:text-2xl font-medium tracking-wide text-[#FFFDF7] italic leading-relaxed">
              We don&apos;t just sell silk. We weave relationships, trust and timeless memories.
            </p>
            <div className="flex items-center justify-center gap-3 text-[#C8985A] text-xs pt-3">
              <span>—</span>
              <Sparkles size={14} />
              <span>SilkVerse Heritage Standard</span>
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