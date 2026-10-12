"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShieldCheck, Gift } from "lucide-react";
import { PaymentLogos } from "@/components/common/TrustLogos";

export default function CartSummary() {
  const {
    subtotal,
    shipping,
    tax,
    total,
    cartCount,
  } = useCart();

  const isCartEmpty = cartCount === 0;

  return (
    <aside
      className="sticky top-24 rounded-2xl border border-[#D4AF37]/40 bg-white p-6 shadow-2xs"
      aria-label="Order summary"
    >
      {/* Design Book Page 08 Header */}
      <h2 className="border-b border-stone-100 pb-3 font-serif text-base font-bold uppercase tracking-wider text-[#3B2F2F]">
        ORDER SUMMARY
      </h2>

      <div className="mt-4 space-y-3.5 text-xs sm:text-sm">
        {/* Subtotal */}
        <div className="flex justify-between text-stone-600">
          <span>Subtotal ({cartCount} {cartCount === 1 ? "Item" : "Items"})</span>
          <span className="font-semibold text-stone-900 tabular-nums">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-stone-600">
          <span>Insured Express Shipping</span>
          <span className="font-bold text-emerald-700 tabular-nums">
            {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}
          </span>
        </div>

        {/* GST (5%) */}
        <div className="flex justify-between text-stone-600">
          <span>Handloom GST (5%)</span>
          <span className="font-semibold text-stone-900 tabular-nums">
            ₹{tax.toLocaleString("en-IN")}
          </span>
        </div>

        <hr className="border-stone-100" />

        {/* Grand Total */}
        <div>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-base font-bold text-[#3B2F2F]">Grand Total</span>
            <span className="font-serif text-2xl font-bold text-[#7A1020] tabular-nums">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Inclusive of 5% GST &amp; shipping
          </p>
        </div>
      </div>

      {/* Free Shipping Banner (Design Book Page 08) */}
      <div className="mt-3 rounded-xl border border-[#D4AF37]/50 bg-[#F9F5EC] p-3 text-[#3B2F2F]">
        <div className="flex items-start gap-2.5">
          <Gift size={18} className="shrink-0 text-[#D4AF37] mt-0.5" />
          {shipping === 0 ? (
            <p className="text-xs leading-snug">
              <strong className="text-[#7A1020]">Congratulations!</strong> You are eligible for <strong className="text-emerald-700 font-bold">FREE SHIPPING</strong> (orders ₹1,000+).
            </p>
          ) : (
            <p className="text-xs leading-snug">
              Add <strong className="text-[#7A1020]">₹{(1000 - subtotal).toLocaleString("en-IN")}</strong> more to unlock <strong className="text-emerald-700 font-bold">FREE SHIPPING</strong>.
            </p>
          )}
        </div>
      </div>

      {/* Royal Coupon Milestone Unlock Banner */}
      {!isCartEmpty && (
        <div className="mt-2.5 rounded-xl border border-dashed border-[#C9A227] bg-[#FFFBF5] p-3 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold uppercase tracking-wider text-[#6D001A] text-[11px]">
              ✨ Checkout Coupon Unlocked
            </span>
            <span className="rounded bg-[#6D001A] px-2 py-0.5 font-mono text-[10px] font-bold text-[#FFF3B0]">
              {subtotal >= 10000
                ? "ROYAL20 (20% OFF)"
                : subtotal >= 5000
                ? "FESTIVE15 (15% OFF)"
                : "SILK10 (10% OFF)"}
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-stone-600 leading-snug">
            {subtotal >= 10000 ? (
              <>
                Tap <strong className="text-[#6D001A]">ROYAL20</strong> on Checkout to save up to <strong>₹5,000</strong>!
              </>
            ) : subtotal >= 5000 ? (
              <>
                Tap <strong className="text-[#6D001A]">FESTIVE15</strong> on Checkout, or add{" "}
                <strong>₹{(10000 - subtotal).toLocaleString("en-IN")}</strong> more to unlock{" "}
                <strong className="text-[#6D001A]">ROYAL20 (20% OFF)</strong>.
              </>
            ) : (
              <>
                Tap <strong className="text-[#6D001A]">SILK10</strong> on Checkout, or add{" "}
                <strong>₹{(5000 - subtotal).toLocaleString("en-IN")}</strong> more to unlock{" "}
                <strong className="text-[#6D001A]">FESTIVE15 (15% OFF)</strong>.
              </>
            )}
          </p>
        </div>
      )}

      {/* Checkout CTA (Deep Rich Maroon #6D001A) */}
      {isCartEmpty ? (
        <button
          type="button"
          disabled
          className="mt-5 w-full cursor-not-allowed rounded-md bg-stone-200 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-stone-500"
        >
          Cart is Empty
        </button>
      ) : (
        <Link
          href="/checkout"
          className="mt-5 block w-full rounded-md bg-[#6D001A] py-3.5 text-center text-xs sm:text-sm font-bold tracking-wider text-white shadow-xs transition hover:bg-[#520013] active:scale-98 focus:outline-none focus:ring-2 focus:ring-[#6D001A] focus:ring-offset-2 uppercase"
        >
          PROCEED TO CHECKOUT
        </Link>
      )}

      {/* Security Guarantee (Page 08) */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-stone-500">
        <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
        <span>Secure Checkout • 100% Safe</span>
      </div>

      {/* Verified Payment Badges */}
      <div className="mt-3 pt-3 border-t border-stone-200/70">
        <PaymentLogos className="justify-center scale-90" />
      </div>
    </aside>
  );
}