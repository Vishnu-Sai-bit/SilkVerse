"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Ticket,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Gift,
  Truck,
  Percent,
  ArrowRight,
  Tag,
  Clock,
  ChevronRight,
  Flame,
  Award,
} from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { getPublicCoupons, getProducts, Product, Coupon } from "@/services/api";

const DEFAULT_COUPONS = [
  {
    _id: "default-1",
    code: "SILK10",
    description: "10% Instant Discount on all Pure Handloom Mulberry Silk Sarees",
    discountType: "Percentage" as const,
    discountValue: 10,
    minimumOrder: 2000,
    maxDiscount: 2000,
    category: "Storewide",
  },
  {
    _id: "default-2",
    code: "FESTIVE15",
    description: "15% Festive Celebration Discount on orders above ₹5,000",
    discountType: "Percentage" as const,
    discountValue: 15,
    minimumOrder: 5000,
    maxDiscount: 3000,
    category: "Festive",
  },
  {
    _id: "default-3",
    code: "ROYAL20",
    description: "20% Royal Bridal & Wedding Heirloom Discount on orders above ₹10,000",
    discountType: "Percentage" as const,
    discountValue: 20,
    minimumOrder: 10000,
    maxDiscount: 4000,
    category: "Bridal",
  },
  {
    _id: "default-4",
    code: "WELCOME500",
    description: "Flat ₹500 Instant Discount on your first SilkVerse order",
    discountType: "Flat" as const,
    discountValue: 500,
    minimumOrder: 3999,
    maxDiscount: 500,
    category: "New User",
  },
  {
    _id: "default-5",
    code: "FREESHIP",
    description: "Free Insured Express Delivery across India on all orders above ₹2,999",
    discountType: "Flat" as const,
    discountValue: 250,
    minimumOrder: 2999,
    maxDiscount: 250,
    category: "Shipping",
  },
];

export default function OffersPage() {
  const [coupons, setCoupons] = useState<any[]>(DEFAULT_COUPONS);
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "percentage" | "flat">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [couponsData, productsData] = await Promise.all([
          getPublicCoupons().catch(() => []),
          getProducts({ sort: "bestseller", limit: 8 }).catch(() => ({ products: [] })),
        ]);

        if (couponsData && couponsData.length > 0) {
          // Merge API coupons with our rich defaults to ensure the best display
          const merged = [...couponsData];
          DEFAULT_COUPONS.forEach((dc) => {
            if (!merged.some((c) => c.code === dc.code)) {
              merged.push(dc as any);
            }
          });
          setCoupons(merged);
        }

        if (productsData?.products) {
          setDiscountedProducts(productsData.products);
        }
      } catch (e) {
        console.error("Error loading offers data:", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied!`, {
      description: "Paste it at checkout or cart to apply your discount.",
      icon: <Ticket className="text-[#D4AF37]" size={16} />,
    });
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const filteredCoupons = coupons.filter((c) => {
    if (activeTab === "percentage") return c.discountType === "Percentage";
    if (activeTab === "flat") return c.discountType === "Flat";
    return true;
  });

  return (
    <main className="min-h-screen bg-[#FAF8F5] pb-20">
      {/* =========================================================
          1. LUXURY HERO BANNER
      ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#4A0012] via-[#6D001A] to-[#2E000A] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-black/30 backdrop-blur-md px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
            <Sparkles size={13} className="text-[#D4AF37]" />
            <span>Festive & Wedding Season Privileges 2026</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Exclusive Coupons, Best Offers &amp; Handloom Privileges
          </h1>

          <p className="text-sm sm:text-base text-[#FAF8F5]/85 max-w-2xl mx-auto leading-relaxed">
            Experience genuine Dharmavaram &amp; Kanchipuram pure silk sarees handwoven direct from master artisan looms with authentic Silk Mark certification and complimentary express delivery.
          </p>

          {/* Quick Perks Strip */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-xs text-white/90">
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
              <Ticket size={16} className="text-[#D4AF37]" />
              <span>Instant Discounts</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
              <Truck size={16} className="text-[#D4AF37]" />
              <span>Free Delivery &gt; ₹2,999</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
              <ShieldCheck size={16} className="text-[#D4AF37]" />
              <span>100% Silk Mark Certified</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
              <Gift size={16} className="text-[#D4AF37]" />
              <span>Free Blouse Piece</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. ACTIVE COUPONS & PROMO CODES
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-[#E8E4DF] space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6D001A]">
                <Tag size={15} />
                <span>Active Coupon Codes</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#2D2A26] mt-0.5">
                Click Any Code to Copy &amp; Apply
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex w-full sm:w-auto overflow-x-auto items-center gap-1.5 p-1 rounded-xl bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-600">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`flex-1 sm:flex-initial whitespace-nowrap px-2.5 sm:px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === "all" ? "bg-[#6D001A] text-white shadow-2xs" : "hover:text-stone-900"
                }`}
              >
                All Offers ({coupons.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("percentage")}
                className={`flex-1 sm:flex-initial whitespace-nowrap px-2.5 sm:px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === "percentage" ? "bg-[#6D001A] text-white shadow-2xs" : "hover:text-stone-900"
                }`}
              >
                % Discounts
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("flat")}
                className={`flex-1 sm:flex-initial whitespace-nowrap px-2.5 sm:px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === "flat" ? "bg-[#6D001A] text-white shadow-2xs" : "hover:text-stone-900"
                }`}
              >
                Flat Off
              </button>
            </div>
          </div>

          {/* Vouchers Grid */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredCoupons.map((coupon) => {
              const isCopied = copiedCode === coupon.code;
              const isPercentage = coupon.discountType === "Percentage";

              return (
                <div
                  key={coupon._id || coupon.code}
                  className="group relative flex flex-col justify-between rounded-2xl border-2 border-dashed border-[#D4AF37]/60 bg-gradient-to-br from-[#FFFDF9] to-[#FFF8F0] p-5 shadow-xs hover:border-[#6D001A] hover:shadow-md transition-all duration-200"
                >
                  {/* Decorative ticket notch indicators */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block rounded-full bg-[#6D001A]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#6D001A]">
                          {coupon.category || (isPercentage ? "Percentage Off" : "Flat Discount")}
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#6D001A] mt-1 tracking-tight">
                          {isPercentage ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                        </h3>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-white border border-[#D4AF37]/40 flex items-center justify-center text-[#6D001A] shadow-2xs group-hover:scale-105 transition-transform">
                        <Ticket size={20} />
                      </div>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed font-medium">
                      {coupon.description}
                    </p>

                    <div className="space-y-1 text-[11px] text-stone-500 pt-2 border-t border-dashed border-[#D4AF37]/30">
                      <div className="flex items-center justify-between">
                        <span>Minimum Order:</span>
                        <span className="font-semibold text-stone-700">₹{coupon.minimumOrder?.toLocaleString("en-IN") || 0}</span>
                      </div>
                      {coupon.maxDiscount > 0 && isPercentage && (
                        <div className="flex items-center justify-between">
                          <span>Max Savings:</span>
                          <span className="font-semibold text-stone-700">Up to ₹{coupon.maxDiscount.toLocaleString("en-IN")}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Copy Button */}
                  <div className="mt-5 pt-3 flex items-center gap-2">
                    <div className="flex-1 flex items-center justify-between rounded-xl bg-white border border-[#D4AF37]/60 px-3 py-2 font-mono text-xs font-bold text-[#6D001A] shadow-inner">
                      <span>{coupon.code}</span>
                      <span className="text-[10px] uppercase font-sans text-stone-400">Coupon</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyCode(coupon.code)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
                        isCopied
                          ? "bg-emerald-600 text-white"
                          : "bg-[#6D001A] hover:bg-[#5B0D16] text-white"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check size={14} />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action Footer */}
          <div className="rounded-2xl bg-[#FFF8F0] border border-[#D4AF37]/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#6D001A] text-white flex items-center justify-center shrink-0">
                <Sparkles size={18} className="text-[#D4AF37]" />
              </div>
              <div className="text-left">
                <h4 className="font-serif text-sm sm:text-base font-bold text-[#2D2A26]">
                  Ready to use your coupon discount?
                </h4>
                <p className="text-xs text-stone-600">
                  Select your desired pure silk saree and paste the code on checkout for instant price deduction.
                </p>
              </div>
            </div>

            <Link
              href="/collections"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D001A] hover:bg-[#5B0D16] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all active:scale-98 shrink-0"
            >
              <span>Explore Sarees</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. SPECIAL VALUE OFFERS & TROUSSEAU PACKS
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-14">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6D001A]">
            Curated Privileges
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2A26]">
            Special Handloom Bundles &amp; Services
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Enjoy additional complimentary value on every pure Dharmavaram silk purchase.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-3xl bg-white p-6 border border-[#E8E4DF] shadow-sm hover:border-[#D4AF37] transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#D4AF37]/50 flex items-center justify-center text-[#6D001A]">
              <Gift size={24} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2D2A26]">
              Bridal Trousseau Box
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Order 2 or more pure silk sarees to receive a complimentary velvet preservation chest and a luxury scented cedar sachet to protect your heirlooms.
            </p>
            <div className="pt-2 text-xs font-bold text-[#6D001A] flex items-center gap-1">
              <span>Automatic on 2+ Sarees</span>
              <Check size={14} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl bg-white p-6 border border-[#E8E4DF] shadow-sm hover:border-[#D4AF37] transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#D4AF37]/50 flex items-center justify-center text-[#6D001A]">
              <Sparkles size={24} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2D2A26]">
              Complimentary Fall &amp; Picot
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every saree order above ₹12,999 includes complimentary master artisan fall attachment and hand-knotted zari tassel finish so your saree is ready to wear.
            </p>
            <div className="pt-2 text-xs font-bold text-[#6D001A] flex items-center gap-1">
              <span>Included on Luxury Orders</span>
              <Check size={14} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl bg-white p-6 border border-[#E8E4DF] shadow-sm hover:border-[#D4AF37] transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#D4AF37]/50 flex items-center justify-center text-[#6D001A]">
              <Truck size={24} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2D2A26]">
              Express Insured Shipping
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              All orders are hand-packaged in moisture-resistant tamper-proof boxes with 100% transit insurance and door-step tracking across India.
            </p>
            <div className="pt-2 text-xs font-bold text-[#6D001A] flex items-center gap-1">
              <span>Free on Orders &gt; ₹2,999</span>
              <Check size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. BEST SELLER SAREES WITH SPECIAL PRICING
      ========================================================= */}
      {discountedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6D001A]">
                <Flame size={15} className="text-red-500" />
                <span>Featured Offer Sarees</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2A26] mt-0.5">
                Top Rated Sarees Eligible For Coupon Codes
              </h2>
            </div>

            <Link
              href="/collections?sort=popularity"
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#6D001A] hover:text-[#D4AF37] transition"
            >
              <span>View All Best Sellers</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-2 xl:grid-cols-4">
            {discountedProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                category={product.category}
                price={product.price}
                image={product.image || "/images/products/saree_1_maroon.png"}
                averageRating={product.averageRating ?? 5}
                numReviews={product.numReviews ?? 56}
                stock={product.stock}
                badge={product.isBestSeller ? "BEST SELLER" : "SPECIAL OFFER"}
                salesCount={product.salesCount}
              />
            ))}
          </div>
        </section>
      )}

      {/* =========================================================
          5. HOW TO REDEEM COUPONS (3 SIMPLE STEPS)
      ========================================================= */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-16">
        <div className="rounded-3xl bg-gradient-to-r from-[#FFF8F0] via-[#FAF5EE] to-[#FFF8F0] border border-[#D4AF37]/40 p-6 sm:p-10 text-center space-y-6">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2D2A26]">
            How to Redeem Your Offers in 3 Simple Steps
          </h3>

          <div className="grid sm:grid-cols-3 gap-6 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#6D001A] text-white flex items-center justify-center font-bold text-sm shrink-0">
                1
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[#2D2A26]">
                  Copy Your Code
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  Choose your desired coupon above and click the &ldquo;COPY&rdquo; button.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#6D001A] text-white flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[#2D2A26]">
                  Select Your Saree
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  Explore our handloom pure silk catalog and add your saree to cart.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#6D001A] text-white flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[#2D2A26]">
                  Instant Savings
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  Paste the code in your cart or checkout to see the price drop instantly!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
