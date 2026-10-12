"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  Heart,
  ShieldCheck,
  RotateCcw,
  Lock,
  Truck,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { addToWishlist } from "@/services/api";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import GiftPackagingCard from "@/components/cart/GiftPackagingCard";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import { SilkMarkLogo, PaymentLogos } from "@/components/common/TrustLogos";

export default function CartPage() {
  const router = useRouter();
  const { cart, cartCount, clearCart } = useCart();
  const { token } = useAuth();
  const [isMoving, setIsMoving] = useState(false);

  // Move All to Wishlist handler
  const handleMoveAllToWishlist = async () => {
    if (!token) {
      toast.error("Please sign in to save items to your wishlist.");
      router.push("/login?redirect=/cart");
      return;
    }

    if (cart.length === 0) return;

    try {
      setIsMoving(true);
      let successCount = 0;

      for (const item of cart) {
        try {
          await addToWishlist(token, item._id);
          successCount++;
        } catch {
          // ignore duplicate or single item errors
        }
      }

      clearCart();
      toast.success(
        `Moved ${successCount} saree${successCount > 1 ? "s" : ""} to your wishlist!`
      );
      router.push("/wishlist");
    } catch {
      toast.error("Failed to move items to wishlist. Please try again.");
    } finally {
      setIsMoving(false);
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to remove all items from your cart?")) {
      clearCart();
      toast.info("Your shopping cart has been cleared.");
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-stone-500">
          <Link href="/" className="hover:text-[#6D001A] transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/collections" className="hover:text-[#6D001A] transition-colors">
            Collections
          </Link>
          <ChevronRight size={14} />
          <span className="text-[#6D001A] font-semibold">Shopping Bag</span>
        </nav>

        {/* Section 1: YOUR CART & ORDER SUMMARY */}
        {cart.length === 0 ? (
          /* Clean Luxury Empty Cart View */
          <div className="rounded-2xl border border-stone-200 bg-white p-8 sm:p-14 text-center shadow-xs mb-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FAF5EE] border border-[#E7D7C1] text-[#6D001A]">
              <ShoppingBag size={38} strokeWidth={1.5} />
            </div>

            <h1 className="mt-5 font-serif text-2xl sm:text-3xl font-bold text-[#2D2A26]">
              Your Shopping Bag is Empty
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
              Explore our authentic handwoven Pure Kanchipuram, Banarasi &amp; Mysore Silk Sarees crafted directly by master artisans.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 rounded-xl bg-[#6D001A] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#520013] transition"
              >
                <Sparkles size={15} />
                <span>EXPLORE COLLECTIONS</span>
              </Link>

              <Link
                href="/wishlist"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-stone-700 hover:bg-stone-50 transition"
              >
                <Heart size={15} />
                <span>VIEW WISHLIST</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Active Cart Grid */
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2A26] uppercase tracking-wide">
                YOUR BAG ({cartCount} {cartCount === 1 ? "ITEM" : "ITEMS"})
              </h1>

              <Link
                href="/collections"
                className="text-xs text-[#6D001A] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Continue Shopping</span>
                <ChevronRight size={13} />
              </Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-12 items-start">
              {/* Left Column: Cart Items List + Gift Packaging + Actions Toolbar */}
              <div className="lg:col-span-8 space-y-4">
                {cart.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}

                {/* Traditional Wedding & Festive Gift Packaging Card */}
                <GiftPackagingCard />

                {/* Bottom Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                  <Link
                    href="/collections"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-700 hover:bg-stone-50 hover:border-stone-400 transition"
                  >
                    <ArrowLeft size={14} />
                    CONTINUE SHOPPING
                  </Link>

                  <div className="flex flex-wrap w-full sm:w-auto items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-700 hover:bg-stone-50 hover:border-stone-400 transition cursor-pointer"
                    >
                      <Trash2 size={14} />
                      CLEAR BAG
                    </button>

                    <button
                      type="button"
                      onClick={handleMoveAllToWishlist}
                      disabled={isMoving}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-700 hover:bg-stone-50 hover:border-stone-400 transition disabled:opacity-50 cursor-pointer"
                    >
                      <Heart size={14} className="text-[#6D001A]" />
                      {isMoving ? "MOVING..." : "SAVE ALL TO WISHLIST"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: ORDER SUMMARY */}
              <div className="lg:col-span-4">
                <CartSummary />
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Pure Silk Heritage & Customer Trust Guarantee Strip */}
        <section className="mt-12 rounded-2xl border border-stone-200/90 bg-white p-4 sm:p-6 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#FAF8F5] border border-stone-100">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF8F0] text-[#D4AF37] border border-amber-200/60">
                <ShieldCheck size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#2D2A26] truncate">100% Pure Silk</p>
                <p className="text-[11px] text-stone-500 truncate">Silk Mark India Certified</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#FAF8F5] border border-stone-100">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF8F0] text-[#D4AF37] border border-amber-200/60">
                <Truck size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#2D2A26] truncate">Free Insured Shipping</p>
                <p className="text-[11px] text-stone-500 truncate">Across India on all sarees</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#FAF8F5] border border-stone-100">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF8F0] text-[#D4AF37] border border-amber-200/60">
                <RotateCcw size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#2D2A26] truncate">7-Day Easy Exchange</p>
                <p className="text-[11px] text-stone-500 truncate">Hassle-free doorstep pickup</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#FAF8F5] border border-stone-100">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF8F0] text-[#D4AF37] border border-amber-200/60">
                <Lock size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#2D2A26] truncate">100% Secure Checkout</p>
                <p className="text-[11px] text-stone-500 truncate">UPI, Cards &amp; Cash on Delivery</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Recently Viewed Sarees */}
        <RecentlyViewed />
      </div>
    </main>
  );
}