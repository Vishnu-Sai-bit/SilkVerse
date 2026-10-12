"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  FileText,
  Package,
  Truck,
  ShieldCheck,
  Sparkles,
  MapPin,
  ArrowRight,
} from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";
import { getOrderById } from "@/services/api";
import { getProductImageUrl } from "@/utils/image";

const getImageUrl = (image?: string) => getProductImageUrl(image);

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<any | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  const hasOrderId =
    typeof orderId === "string" && orderId.trim().length > 0;

  const encodedOrderId = hasOrderId ? encodeURIComponent(orderId) : "";

  useEffect(() => {
    if (!hasOrderId || !orderId) return;

    async function fetchOrder() {
      try {
        setLoadingOrder(true);
        const token =
          localStorage.getItem("silkverse-token") ||
          localStorage.getItem("token");
        if (!token) return;
        const data = await getOrderById(token, orderId!);
        if (data) {
          setOrder(data);
        }
      } catch {
        // Fallback to basic order ID display if fetch fails
      } finally {
        setLoadingOrder(false);
      }
    }

    fetchOrder();
  }, [hasOrderId, orderId]);

  const estimatedDeliveryDate = (() => {
    const base = order?.createdAt ? new Date(order.createdAt) : new Date();
    const est = new Date(base.getTime() + 5 * 24 * 60 * 60 * 1000);
    return est.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  })();

  const address =
    order && typeof order.address === "object" && order.address !== null
      ? order.address
      : null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-14">
      <div className="overflow-hidden rounded-3xl border-2 border-[#D4AF37]/50 bg-white shadow-xl">
        {/* Royal Maroon & 24K Gold Header Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#4A0911] via-[#6D001A] to-[#4A0911] px-6 py-8 sm:px-10 sm:py-10 text-center text-white">
          <div className="pointer-events-none absolute inset-0 opacity-15 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#D4AF37] bg-[#FFF8F0] text-emerald-600 shadow-[0_0_30px_rgba(212,175,55,0.5)]">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/15 px-3.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#FFF3B0]">
              <Sparkles className="h-3.5 w-3.5" />
              Royal Order Confirmed
            </span>

            <h1 className="mt-3 font-serif text-2xl sm:text-4xl font-bold tracking-wide text-[#FFF8F0]">
              Thank You for Your Patronage!
            </h1>

            <p className="mt-2 max-w-xl text-xs sm:text-sm text-[#FFF8F0]/85 leading-relaxed">
              Your handwoven silk order has been registered with our master weaver atelier and is being prepared with official Silk Mark certification.
            </p>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-8 md:p-10 space-y-6">
          {/* Top Order Meta Strip */}
          {hasOrderId ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 rounded-2xl border border-[#D4AF37]/40 bg-[#FFFBF7] p-4 sm:p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Order Reference ID
                </p>
                <p className="mt-1 break-all font-mono text-xs sm:text-sm font-bold text-[#6D001A]">
                  #{orderId}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Estimated Insured Delivery
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700">
                  <Truck className="h-4 w-4 shrink-0" />
                  <span>By {estimatedDeliveryDate}</span>
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Payment &amp; Status
                </p>
                <p className="mt-1 text-xs sm:text-sm font-bold text-stone-800">
                  {order?.paymentMethod
                    ? `${order.paymentMethod} • ${order.paymentStatus || "Confirmed"}`
                    : "Verified & Confirmed"}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
              <p className="text-sm font-semibold text-amber-900">
                Your order has been placed! Check My Orders for live tracking updates.
              </p>
            </div>
          )}

          {/* Ordered Sarees & Address Breakdown (if loaded) */}
          {loadingOrder ? (
            <div className="py-6 text-center text-xs text-stone-500">
              Loading your order summary...
            </div>
          ) : (
            order && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Ordered Items List */}
                <div className="lg:col-span-3 rounded-2xl border border-stone-200 p-4 sm:p-5 space-y-3.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                    <Package className="h-4 w-4 text-[#6D001A]" />
                    <span>Ordered Sarees ({order.items?.length || 0})</span>
                  </h2>

                  <div className="divide-y divide-stone-100">
                    {Array.isArray(order.items) &&
                      order.items.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              className="h-14 w-12 shrink-0 rounded-lg border border-stone-200 object-cover bg-stone-100"
                              onError={(e) => {
                                e.currentTarget.src = "/images/products/default.jpg";
                              }}
                            />
                            <div className="min-w-0">
                              <p className="truncate text-xs sm:text-sm font-bold text-stone-800">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-stone-500">
                                Qty: {item.quantity} &times; {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>

                          <p className="shrink-0 text-xs sm:text-sm font-bold text-[#6D001A]">
                            {formatPrice(
                              Number(item.price || 0) * Number(item.quantity || 1)
                            )}
                          </p>
                        </div>
                      ))}
                  </div>

                  <div className="border-t border-dashed border-stone-200 pt-3 space-y-1.5 text-xs">
                    {Number(order.discount) > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Coupon Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                        <span>- {formatPrice(order.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm sm:text-base font-bold text-stone-900 pt-1">
                      <span>Total Order Amount</span>
                      <span className="text-[#6D001A]">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Destination & Assurance */}
                <div className="lg:col-span-2 flex flex-col justify-between gap-4 rounded-2xl border border-stone-200 bg-stone-50/60 p-4 sm:p-5">
                  {address ? (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-[#6D001A]" />
                        <span>Delivery Address</span>
                      </h3>
                      <div className="mt-2.5 text-xs text-stone-700 space-y-1 leading-relaxed">
                        <p className="font-bold text-stone-900 text-sm">
                          {address.fullName}
                        </p>
                        <p>{address.mobile}</p>
                        <p>
                          {address.houseNumber}, {address.area}
                        </p>
                        <p>
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Dispatch Preparation
                      </h3>
                      <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                        Each saree undergoes a 3-stage handloom zari and selvedge inspection before insured air dispatch.
                      </p>
                    </div>
                  )}

                  <div className="rounded-xl border border-[#D4AF37]/40 bg-white p-3 text-[11px] text-stone-600 flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Includes official <strong>Silk Mark Purity Hologram</strong> &amp; breathable pure cotton storage bag.
                    </span>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-stone-100">
            {hasOrderId && (
              <>
                <Link
                  href={`/orders/${encodedOrderId}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D001A] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#520013]"
                >
                  <span>Track &amp; View Order</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href={`/orders/${encodedOrderId}/invoice`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37] bg-[#FFFBF5] px-5 py-3 text-xs sm:text-sm font-bold text-[#6D001A] transition hover:bg-[#D4AF37]/15"
                >
                  <FileText className="h-4 w-4 text-[#C9A227]" />
                  <span>Print GST Invoice</span>
                </Link>
              </>
            )}

            <Link
              href="/account/orders"
              className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              My Account Orders
            </Link>

            <Link
              href="/collections"
              className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-stone-50 px-5 py-3 text-xs sm:text-sm font-semibold text-stone-600 transition hover:bg-stone-100"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6 py-12">
          <div className="w-full rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg sm:p-10">
            <div className="mx-auto mb-4 flex justify-center">
              <BrandLogo variant="horizontal" height={44} href="/" />
            </div>
            <p className="text-gray-600">Loading your royal order confirmation...</p>
          </div>
        </main>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}