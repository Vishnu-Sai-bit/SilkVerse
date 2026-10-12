"use client";

import { useState } from "react";
import {
  ChevronDown,
  ShieldCheck,
  Sparkles,
  Truck,
  RotateCcw,
  Award,
  CheckCircle2,
} from "lucide-react";
import {
  SilkMarkEmblem,
  HandloomMarkEmblem,
} from "@/components/common/TrustLogos";

interface Props {
  product: {
    _id?: string;
    category?: string;
    description?: string;
    name?: string;
    fabric?: string;
    zari?: string;
    weave?: string;
    length?: string;
    color?: string;
    occasion?: string;
    certification?: string;
    stock?: number;
    price?: number;
  };
}

export default function ProductDetailsAccordion({ product }: Props) {
  const [openSection, setOpenSection] = useState<string>("details");

  const toggle = (section: string) => {
    setOpenSection((prev) => (prev === section ? "" : section));
  };

  const isKanchi = (product.name || product.category || "")
    .toLowerCase()
    .includes("kanchipuram");
  const fabricValue =
    product.fabric ||
    (isKanchi
      ? "100% Pure Kanchipuram Silk"
      : `100% Pure ${product.category || "Natural Silk"}`);
  const zariValue = product.zari || "Pure Gold & Silver Tested Zari";
  const weaveValue =
    product.weave || "Master Artisan Traditional Handloom Weave";
  const lengthValue =
    product.length || "6.3 Metres (Includes 0.8m Blouse Piece)";
  const colorValue = product.color || "As Displayed";
  const occasionValue =
    product.occasion || "Wedding, Bridal, Festive & Traditional";
  const certValue = product.certification || "Silk Mark India Certified (SMOI)";

  const ACCORDION_ITEMS = [
    {
      id: "details",
      title: "ARTISAN STORY & WEAVE DETAILS",
      icon: Sparkles,
      content: (
        <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-stone-600">
          <p>
            {product.description ||
              "This exquisite handwoven pure silk saree is crafted by master artisans with pure zari motifs. The rich pallu and opulent border add a majestic touch of heritage to your celebrations."}
          </p>
          <p className="text-stone-500">
            Handcrafted on traditional pitlooms by certified heritage weavers,
            preserving the centuries-old living art of Indian handloom weaving.
          </p>
        </div>
      ),
    },
    {
      id: "care",
      title: "CARE & PRESERVATION GUIDE",
      icon: ShieldCheck,
      content: (
        <ul className="space-y-1.5 text-xs sm:text-sm leading-relaxed text-stone-600 list-disc list-inside">
          <li>Strictly Dry Clean Only for first and subsequent washes.</li>
          <li>
            Store wrapped in a breathable muslin or pure cotton saree cover.
          </li>
          <li>
            Avoid direct contact of perfumes, deodorants, or water with zari
            threads.
          </li>
          <li>
            Periodically refold along different fold-lines to prevent fabric
            creasing.
          </li>
        </ul>
      ),
    },
    {
      id: "shipping",
      title: "SHIPPING & EXPRESS DELIVERY",
      icon: Truck,
      content: (
        <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed text-stone-600">
          <p>
            Dispatched within 24–48 hours in luxury tamper-evident protective box
            packaging.
          </p>
          <p>
            Free insured express shipping across India. Live tracking link is
            shared via SMS and WhatsApp once dispatched.
          </p>
        </div>
      ),
    },
    {
      id: "returns",
      title: "7-DAY DOORSTEP RETURN & EXCHANGE",
      icon: RotateCcw,
      content: (
        <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed text-stone-600">
          <p>
            Enjoy a 7-day hassle-free doorstep return and exchange guarantee
            from the date of delivery.
          </p>
          <p>
            Free reverse pickup arranged with prompt full refund upon inspection
            of original intact tags and Silk Mark seal.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-14 rounded-2xl border border-stone-200/90 bg-[#FAF8F5] p-4 sm:p-6 lg:p-8 shadow-xs">
      {/* Section Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
        <div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#C98A2C]">
            Heritage Craftsmanship & Purity
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2D2A26] mt-0.5">
            Product Details & Technical Specifications
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={13} className="text-emerald-600" />
            100% Handloom Authenticity
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================
            LEFT COLUMN (lg:col-span-7): Technical Specifications Table + Accordion Tabs
        ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* Specifications Key-Value Table */}
          <div className="rounded-xl border border-stone-200 bg-white p-3.5 sm:p-5 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6D001A] border-b border-stone-100 pb-3 mb-3 flex items-center gap-2">
              <Award size={15} className="text-[#C98A2C]" />
              <span>Technical Specifications</span>
            </h3>
            <div className="divide-y divide-stone-100 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-1 sm:gap-3 py-2.5">
                <span className="sm:col-span-2 text-stone-500 font-medium">Fabric</span>
                <span className="sm:col-span-3 font-semibold text-[#2D2A26]">
                  {fabricValue}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-1 sm:gap-3 py-2.5">
                <span className="sm:col-span-2 text-stone-500 font-medium">Zari</span>
                <span className="sm:col-span-3 font-semibold text-[#2D2A26]">
                  {zariValue}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-1 sm:gap-3 py-2.5">
                <span className="sm:col-span-2 text-stone-500 font-medium">Weave</span>
                <span className="sm:col-span-3 font-semibold text-[#2D2A26]">
                  {weaveValue}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-1 sm:gap-3 py-2.5">
                <span className="sm:col-span-2 text-stone-500 font-medium">Blouse Piece</span>
                <span className="sm:col-span-3 font-semibold text-[#2D2A26]">
                  Included (0.8 Metre Unstitched, Matching Border)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-1 sm:gap-3 py-2.5">
                <span className="sm:col-span-2 text-stone-500 font-medium">Saree Color</span>
                <span className="sm:col-span-3 font-semibold text-[#2D2A26]">
                  {colorValue}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-1 sm:gap-3 py-2.5">
                <span className="sm:col-span-2 text-stone-500 font-medium">Occasion</span>
                <span className="sm:col-span-3 font-semibold text-[#2D2A26]">
                  {occasionValue}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-1 sm:gap-3 py-2.5">
                <span className="sm:col-span-2 text-stone-500 font-medium">Border & Pallu</span>
                <span className="sm:col-span-3 font-semibold text-[#2D2A26]">
                  Rich Traditional Brocade with Contrast Zari Work
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-1 sm:gap-3 py-2.5">
                <span className="sm:col-span-2 text-stone-500 font-medium">Purity Certification</span>
                <span className="sm:col-span-3 font-semibold text-[#6D001A]">
                  {certValue}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-1 sm:gap-3 py-2.5">
                <span className="sm:col-span-2 text-stone-500 font-medium">Wash Care</span>
                <span className="sm:col-span-3 font-semibold text-[#2D2A26]">
                  Strictly Dry Clean Only
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-1 sm:gap-3 py-2.5">
                <span className="sm:col-span-2 text-stone-500 font-medium">Country of Origin</span>
                <span className="sm:col-span-3 font-semibold text-[#2D2A26]">
                  India 🇮🇳
                </span>
              </div>
            </div>
          </div>

          {/* Accordion Tabs for Story, Care, Shipping, Returns */}
          <div className="space-y-3">
            {ACCORDION_ITEMS.map((item) => {
              const isOpen = openSection === item.id;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-stone-200 bg-white overflow-hidden transition-all duration-200 shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-stone-50 cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5 text-xs sm:text-sm font-bold tracking-wider text-[#2D2A26]">
                      <Icon size={16} className="text-[#C98A2C] shrink-0" />
                      <span>{item.title}</span>
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-stone-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#6D001A]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-stone-100 px-4 pb-4 pt-3 text-stone-600 bg-stone-50/50">
                      {item.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN (lg:col-span-5): Official Silk Mark & Handloom Certification Showcase
        ======================================================== */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#FFF9F0] p-6 shadow-xs relative overflow-hidden">
            {/* Top Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/70 pb-3 mb-5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100/90 px-2.5 py-1 rounded-md border border-amber-300/60">
                Official Authenticity Guarantee
              </span>
              <span className="text-[11px] font-bold text-[#6D001A]">
                Govt. of India Certified
              </span>
            </div>

            {/* Block 1: Silk Mark India */}
            <div className="space-y-3">
              <div className="flex items-center gap-3.5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white p-1 border border-amber-200 shadow-2xs">
                  <SilkMarkEmblem size={44} />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-[#7A1F2B]">
                    Silk Mark India Certified
                  </h4>
                  <p className="text-xs font-semibold text-amber-900 mt-0.5">
                    100% Pure Natural Silk Guarantee
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Silk Mark Organisation of India (SMOI)
                  </p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-stone-600 bg-white/70 p-3 rounded-xl border border-amber-100">
                Authorized by the Silk Mark Organisation of India (sponsored by
                the Central Silk Board, Ministry of Textiles, Govt. of India).
                Each saree carries an authentic, tamper-evident Silk Mark
                hologram label with a unique serial number for verified 100%
                natural silk purity.
              </p>
            </div>

            {/* Divider */}
            <div className="my-5 border-t border-amber-200/60" />

            {/* Block 2: Handloom Mark */}
            <div className="space-y-3">
              <div className="flex items-center gap-3.5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white p-1 border border-emerald-200 shadow-2xs">
                  <HandloomMarkEmblem size={44} />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-[#044D29]">
                    Handloom Mark Certified
                  </h4>
                  <p className="text-xs font-semibold text-emerald-900 mt-0.5">
                    Authentic Artisan Woven
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Ministry of Textiles, Government of India
                  </p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-stone-600 bg-white/70 p-3 rounded-xl border border-emerald-100">
                Handcrafted on traditional wooden pitlooms by skilled master
                weavers. Preserving India&apos;s living heritage of handloom
                textiles with zero synthetic nylon or powerloom substitutes.
              </p>
            </div>

            {/* Divider */}
            <div className="my-5 border-t border-amber-200/60" />

            {/* Block 3: Verification Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
              <div className="rounded-lg bg-white/80 border border-amber-200/60 py-2.5 px-1.5 shadow-2xs">
                <span className="block text-[11px] font-bold text-[#7A1F2B]">
                  ✓ 100% Pure Silk
                </span>
                <span className="block text-[10px] text-stone-500 mt-0.5">
                  Zero Synthetic Blends
                </span>
              </div>
              <div className="rounded-lg bg-white/80 border border-emerald-200/60 py-2.5 px-1.5 shadow-2xs">
                <span className="block text-[11px] font-bold text-[#044D29]">
                  ✓ Handloom Woven
                </span>
                <span className="block text-[10px] text-stone-500 mt-0.5">
                  Master Artisan Craft
                </span>
              </div>
              <div className="rounded-lg bg-white/80 border border-amber-200/60 py-2.5 px-1.5 shadow-2xs">
                <span className="block text-[11px] font-bold text-amber-900">
                  ✓ Serial Hologram
                </span>
                <span className="block text-[10px] text-stone-500 mt-0.5">
                  Tamper-Proof Seal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
