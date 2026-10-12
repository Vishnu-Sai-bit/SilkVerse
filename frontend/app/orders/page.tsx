"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getMyOrders, cancelOrder } from "@/services/api";
import { getProductImageUrl } from "@/utils/image";

// ======================================
// Types
// ======================================

type PaymentMethod =
  | "COD"
  | "Razorpay"
  | "UPI"
  | "Card"
  | "NetBanking"
  | "Wallet"
  | string;

type PaymentStatus =
  | "Pending"
  | "Paid"
  | "Refunded"
  | "Failed";

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

type OrderItem = {
  product?: string;
  name?: string;
  image?: string;
  price?: number;
  quantity?: number;
};

type Order = {
  _id: string;
  items?: OrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
};

const getImageUrl = (image?: string) => getProductImageUrl(image);

// ======================================
// Helpers
// ======================================

function formatPrice(amount: number) {
  const safeAmount = Number(amount);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(
    Number.isFinite(safeAmount)
      ? safeAmount
      : 0
  );
}

// ======================================
// Format Date
// ======================================

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// ======================================
// Payment Status Style
// ======================================

function getPaymentStatusClass(
  status: PaymentStatus
) {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-700";

    case "Failed":
      return "bg-red-100 text-red-700";

    case "Pending":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

// ======================================
// Order Status Style
// ======================================

function getOrderStatusClass(
  status: OrderStatus
) {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    case "Shipped":
    case "Out for Delivery":
      return "bg-purple-100 text-purple-700";

    case "Confirmed":
      return "bg-blue-100 text-blue-700";

    case "Pending":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

// ======================================
// Page
// ======================================

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ======================================
  // Load Orders
  // ======================================

  const loadOrders = useCallback(
    async (showToast = true) => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem(
            "silkverse-token"
          );

        // ==================================
        // Authentication
        // ==================================

        if (!token) {
          router.push("/login");
          return;
        }

        // ==================================
        // API Request
        // ==================================

        const data =
          await getMyOrders(token);

        // ==================================
        // Validate Response
        // ==================================

        if (!Array.isArray(data)) {
          throw new Error(
            "Invalid orders response."
          );
        }

        setOrders(data);
      } catch (error: unknown) {
        console.error(
          "Failed to load orders:",
          error
        );

        const message =
          error instanceof Error
            ? error.message
            : "Failed to load your orders.";

        setError(message);

        if (showToast) {
          toast.error(message);
        }
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  // ======================================
  // Initial Load
  // ======================================

  useEffect(() => {
    let cancelled = false;

    async function fetchOrders() {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem(
            "silkverse-token"
          );

        if (!token) {
          if (!cancelled) {
            router.push("/login");
          }

          return;
        }

        const data =
          await getMyOrders(token);

        if (cancelled) {
          return;
        }

        if (!Array.isArray(data)) {
          throw new Error(
            "Invalid orders response."
          );
        }

        setOrders(data);
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load orders:",
          error
        );

        const message =
          error instanceof Error
            ? error.message
            : "Failed to load your orders.";

        setError(message);

        toast.error(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const [cancellingId, setCancellingId] = useState<string>("");

  // ======================================
  // Retry
  // ======================================

  async function handleRetry() {
    await loadOrders(false);
  }

  async function handleCancelOrder(orderId: string) {
    if (cancellingId) return;
    if (!window.confirm("Are you sure you want to cancel this order? Product stock will be restored immediately.")) {
      return;
    }

    try {
      setCancellingId(orderId);
      const token = localStorage.getItem("silkverse-token");
      if (!token) {
        router.push("/login");
        return;
      }

      await cancelOrder(token, orderId);
      await loadOrders(false);
      router.refresh();
      toast.success("Order cancelled successfully. Product stock has been restored.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel order.");
    } finally {
      setCancellingId("");
    }
  }

  // ======================================
  // Loading
  // ======================================

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-16">
        <div className="flex min-h-60 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#7A1F2B]" />

            <p className="mt-4 font-semibold text-gray-600">
              Loading your orders...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ======================================
  // Error
  // ======================================

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Failed to Load Orders
          </h1>

          <p className="mt-3 text-gray-600">
            {error}
          </p>

          <button
            type="button"
            onClick={handleRetry}
            className="mt-6 rounded-lg bg-[#7A1F2B] px-6 py-3 font-semibold text-white transition hover:bg-[#651923]"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // ======================================
  // Render
  // ======================================

  return (
    <main className="min-h-screen bg-[#F9F5EC]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-16">

        {/* ====================================
            Header
        ==================================== */}

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D4AF37]">
              Account
            </p>

            <h1 className="mt-1.5 font-serif text-2xl sm:text-4xl font-bold text-[#7A1020]">
              My Orders
            </h1>

            <p className="mt-1.5 text-sm text-[#3B2F2F]/80">
              View and track your SilkVerse orders.
            </p>
          </div>

          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D4AF37]/60 bg-white px-4 py-2 text-xs font-bold text-[#6D001A] hover:bg-[#6D001A] hover:text-white transition shadow-2xs"
          >
            <span>← Back to My Account</span>
          </Link>
        </div>

        {/* ====================================
            Empty State
        ==================================== */}

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D4AF37]/50 bg-white p-6 sm:p-12 text-center shadow-xs">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F2E8D6]">
              <span className="text-3xl">
                📦
              </span>
            </div>

            <h2 className="mt-5 font-serif text-2xl font-bold text-[#3B2F2F]">
              No Orders Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-[#3B2F2F]/75">
              You haven't placed any orders yet.
              Start shopping and your orders
              will appear here.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex rounded-xl bg-[#7A1020] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5B0D16]"
            >
              Shop Now
            </Link>
          </div>
        ) : (

          /* ====================================
             Orders List
          ==================================== */

          <div className="space-y-6">
            {orders.map((order) => (
              <article
                key={order._id}
                className="rounded-2xl border border-[#D4AF37]/35 bg-white p-4 sm:p-6 shadow-xs transition hover:shadow-md"
              >

                {/* ==================================
                    Order Header
                ================================== */}

                <div className="flex flex-col gap-5 border-b border-gray-200 pb-5 md:flex-row md:items-start md:justify-between">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Order ID
                    </p>

                    <p className="mt-1 break-all font-mono text-sm font-semibold text-[#3B2F2F]">
                      {order._id}
                    </p>

                    <p className="mt-2 text-xs sm:text-sm text-gray-500">
                      Placed on{" "}
                      {formatDate(
                        order.createdAt
                      )}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Order Total
                    </p>

                    <p className="mt-1 font-serif text-2xl font-bold text-[#7A1020]">
                      {formatPrice(
                        order.totalAmount
                      )}
                    </p>
                  </div>
                </div>

                {/* ==================================
                    Ordered Sarees with Thumbnails
                ================================== */}
                {Array.isArray(order.items) && order.items.length > 0 && (
                  <div className="mt-4 divide-y divide-gray-100 border-b border-gray-200 pb-4">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Link
                            href={item.product ? `/products/${item.product}` : "/collections"}
                            className="shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100"
                          >
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name || "Saree"}
                              className="h-14 w-12 object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/images/products/default.jpg";
                              }}
                            />
                          </Link>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#3B2F2F]">
                              {item.name || "Silk Saree"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity || 1} &times; {formatPrice(Number(item.price) || 0)}
                            </p>
                          </div>
                        </div>
                        <p className="shrink-0 text-sm font-bold text-[#7A1020]">
                          {formatPrice((Number(item.price) || 0) * (Number(item.quantity) || 1))}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* ==================================
                    Order Information
                ================================== */}

                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                  {/* Payment Method */}

                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Payment Method
                    </p>

                    <p className="mt-1 font-semibold text-[#3B2F2F]">
                      {order.paymentMethod === "COD"
                        ? "Cash on Delivery"
                        : order.paymentMethod || "Online Payment"}
                    </p>
                  </div>

                  {/* Payment Status */}

                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Payment Status
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusClass(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  {/* Order Status */}

                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Order Status
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getOrderStatusClass(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* Actions */}

                  <div className="flex flex-wrap items-end gap-2 sm:justify-start lg:justify-end">
                    {(order.orderStatus === "Pending" ||
                      order.orderStatus === "Confirmed") && (
                      <button
                        type="button"
                        disabled={cancellingId === order._id}
                        onClick={() => handleCancelOrder(order._id)}
                        className="inline-flex flex-1 sm:flex-initial items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50 cursor-pointer"
                      >
                        {cancellingId === order._id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}

                    <Link
                      href={`/orders/${order._id}/invoice`}
                      className="inline-flex flex-1 sm:flex-initial items-center justify-center rounded-xl border border-[#D4AF37] bg-[#FFFBF5] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#7A1020] transition hover:bg-[#D4AF37]/15"
                    >
                      Invoice
                    </Link>

                    <Link
                      href={`/orders/${order._id}`}
                      className="inline-flex flex-1 sm:flex-initial items-center justify-center rounded-xl bg-[#7A1020] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#5B0D16]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}