"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Eye,
  ShoppingBag,
  AlertCircle,
  FileText,
} from "lucide-react";

import { toast } from "sonner";
import { getMyOrders, cancelOrder } from "@/services/api";
import { getProductImageUrl } from "@/utils/image";

const getImageUrl = (image?: string) => getProductImageUrl(image);

// =====================================
// Types
// =====================================

type OrderItem = {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

type PaymentStatus =
  | "Pending"
  | "Paid"
  | "Refunded"
  | "Failed";

type Order = {
  _id: string;
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
  discount?: number;
  orderStatus: OrderStatus | string;
  paymentMethod: string;
  paymentStatus?: PaymentStatus | string;
  createdAt: string;
};

// =====================================
// Format Price
// =====================================

function formatPrice(price: number) {
  const amount = Number(price);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

// =====================================
// Session Error Helper
// =====================================

function isSessionError(message: string) {
  const normalized = message.toLowerCase();

  return (
    normalized.includes("token") ||
    normalized.includes("unauthorized") ||
    normalized.includes("authentication") ||
    normalized.includes("not authorized") ||
    normalized.includes("access denied") ||
    normalized.includes("login")
  );
}

// =====================================
// Order Status Class
// =====================================

function getStatusClass(status: string) {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-700";

    case "cancelled":
    case "canceled":
      return "bg-red-100 text-red-700";

    case "shipped":
      return "bg-blue-100 text-blue-700";

    case "out for delivery":
      return "bg-purple-100 text-purple-700";

    case "processing":
      return "bg-purple-100 text-purple-700";

    case "confirmed":
      return "bg-indigo-100 text-indigo-700";

    case "pending":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

// =====================================
// Payment Status Class
// =====================================

function getPaymentStatusClass(
  status?: Order["paymentStatus"]
) {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-700";

    case "Refunded":
      return "bg-purple-100 text-purple-700";

    case "Failed":
      return "bg-red-100 text-red-700";

    case "Pending":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

// =====================================
// Format Status
// =====================================

function formatStatus(status: string) {
  if (!status?.trim()) {
    return "Pending";
  }

  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
}

// =====================================
// Format Date
// =====================================

function formatDate(date: string) {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// =====================================
// Normalize Orders
// =====================================

function normalizeOrders(data: unknown): Order[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter(
    (order): order is Order =>
      Boolean(
        order &&
          typeof order === "object" &&
          "_id" in order &&
          typeof (order as Order)._id === "string"
      )
  );
}

// =====================================
// My Orders Page
// =====================================

export default function MyOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "delivered" | "cancelled">("all");

  async function handleCancelOrder(orderId: string) {
    if (cancellingId) return;
    if (!window.confirm("Are you sure you want to cancel this order? Product stock will be restored immediately.")) {
      return;
    }

    try {
      setCancellingId(orderId);
      const token = localStorage.getItem("silkverse-token");
      if (!token) {
        router.replace("/login?redirect=/account/orders");
        return;
      }

      await cancelOrder(token, orderId);
      await fetchOrders();
      router.refresh();
      toast.success("Order cancelled successfully. Product stock has been restored.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel order.");
    } finally {
      setCancellingId("");
    }
  }

  // ===================================
  // Fetch Orders
  // ===================================

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("silkverse-token");

      if (!token) {
        router.replace(
          "/login?redirect=/account/orders"
        );
        return;
      }

      const data = await getMyOrders(token);

      setOrders(normalizeOrders(data));
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load your orders.";

      if (isSessionError(message)) {
        localStorage.removeItem(
          "silkverse-token"
        );

        router.replace(
          "/login?redirect=/account/orders"
        );

        return;
      }

      setOrders([]);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // ===================================
  // Initial Load
  // ===================================

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  // ===================================
  // Loading
  // ===================================

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package
            size={42}
            className="mb-4 animate-pulse text-[#7A1F2B]"
            aria-hidden="true"
          />

          <h2 className="text-xl font-semibold text-gray-800">
            Loading your orders...
          </h2>

          <p className="mt-2 text-gray-500">
            Please wait while we fetch your
            order history.
          </p>
        </div>
      </main>
    );
  }

  // ===================================
  // Error
  // ===================================

  if (error) {
    return (
      <main className="mx-auto max-w-7xl py-2">
        <div className="mx-auto max-w-xl rounded-2xl border bg-white p-10 text-center shadow-sm">
          <AlertCircle
            size={48}
            className="mx-auto mb-5 text-red-500"
            aria-hidden="true"
          />

          <h1 className="text-2xl font-bold text-[#7A1F2B]">
            Unable to Load Orders
          </h1>

          <p className="mt-3 text-gray-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void fetchOrders()}
            className="mt-6 rounded-lg bg-[#7A1F2B] px-6 py-3 font-medium text-white transition hover:bg-[#5B1620] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // ===================================
  // Empty Orders
  // ===================================

  if (orders.length === 0) {
    return (
      <main className="mx-auto max-w-7xl py-2">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#C9A227]">
            Order History
          </p>

          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-[#7A1F2B]">
            My Orders
          </h1>

          <p className="mt-2 text-gray-500">
            View and track your SilkVerse
            purchases.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">
          <ShoppingBag
            size={64}
            className="mx-auto mb-5 text-gray-300"
            aria-hidden="true"
          />

          <h2 className="text-2xl font-semibold text-gray-800">
            No Orders Found
          </h2>

          <p className="mt-3 text-gray-600">
            You haven't placed an order yet.
          </p>

          <Link
            href="/collections"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#7A1F2B] px-7 py-3 font-medium text-white transition hover:bg-[#5B1620] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2"
          >
            <ShoppingBag
              size={18}
              aria-hidden="true"
            />

            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  // ===================================
  // Orders
  // ===================================

  const filteredOrders = orders.filter((o) => {
    const st = (o.orderStatus || "").toLowerCase();
    if (statusFilter === "delivered") return st === "delivered";
    if (statusFilter === "cancelled") return st === "cancelled" || st === "canceled";
    if (statusFilter === "active")
      return st !== "delivered" && st !== "cancelled" && st !== "canceled";
    return true;
  });

  return (
    <main className="mx-auto max-w-7xl py-2">
      {/* =================================
          Header + Filter Tabs
      ================================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
            Order History
          </p>

          <h1 className="mt-1.5 font-serif text-2xl sm:text-4xl font-bold text-[#7A1020]">
            My Orders
          </h1>

          <p className="mt-1.5 text-sm text-[#3B2F2F]/80">
            View, track, and download invoices for your SilkVerse purchases.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 p-1">
          {[
            { id: "all", label: `All (${orders.length})` },
            {
              id: "active",
              label: `Active (${
                orders.filter(
                  (o) =>
                    !["delivered", "cancelled", "canceled"].includes(
                      (o.orderStatus || "").toLowerCase()
                    )
                ).length
              })`,
            },
            {
              id: "delivered",
              label: `Delivered (${
                orders.filter(
                  (o) => (o.orderStatus || "").toLowerCase() === "delivered"
                ).length
              })`,
            },
            {
              id: "cancelled",
              label: `Cancelled (${
                orders.filter((o) =>
                  ["cancelled", "canceled"].includes(
                    (o.orderStatus || "").toLowerCase()
                  )
                ).length
              })`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as any)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#7A1020] text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* =================================
          Order List
      ================================= */}

      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/60 p-8 text-center">
          <p className="text-sm font-semibold text-stone-700">
            No {statusFilter !== "all" ? statusFilter : ""} orders found.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const safeItems = Array.isArray(order.items) ? order.items : [];
            const orderStatus = order.orderStatus || "Pending";
            const paymentStatus = order.paymentStatus;

            return (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
              >
                {/* =============================
                    Order Header
                ============================= */}

                <div className="border-b bg-[#FDFBF7] p-4 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <Package
                          size={22}
                          className="text-[#7A1F2B]"
                          aria-hidden="true"
                        />

                        <h2 className="text-lg font-bold text-gray-900">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h2>
                      </div>

                      <p className="mt-2 text-sm text-gray-500">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                        orderStatus
                      )}`}
                    >
                      {formatStatus(orderStatus)}
                    </span>
                  </div>
                </div>

                {/* =============================
                    Products with Saree Thumbnails
                ============================= */}

                <div className="p-4 sm:p-6">
                  {safeItems.length > 0 ? (
                    <div className="space-y-4">
                      {safeItems.map((item, index) => {
                        const itemPrice = Number(item.price);
                        const quantity = Number(item.quantity);
                        const safePrice = Number.isFinite(itemPrice)
                          ? itemPrice
                          : 0;
                        const safeQuantity =
                          Number.isFinite(quantity) && quantity > 0
                            ? quantity
                            : 0;
                        const productHref = item.product
                          ? `/products/${item.product}`
                          : "/collections";

                        return (
                          <div
                            key={`${order._id}-${item.product || index}`}
                            className="flex items-center justify-between gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <Link
                                href={productHref}
                                className="shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100"
                              >
                                <img
                                  src={getImageUrl(item.image)}
                                  alt={item.name || "Saree"}
                                  className="h-16 w-14 object-cover transition duration-300 hover:scale-105"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "/images/products/default.jpg";
                                  }}
                                />
                              </Link>

                              <div className="min-w-0">
                                <Link
                                  href={productHref}
                                  className="block truncate font-semibold text-gray-900 hover:text-[#7A1F2B] transition"
                                >
                                  {item.name || "Product"}
                                </Link>

                                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                                  Qty: {safeQuantity} &times;{" "}
                                  {formatPrice(safePrice)}
                                </p>
                              </div>
                            </div>

                            <p className="shrink-0 font-semibold text-gray-900">
                              {formatPrice(safePrice * safeQuantity)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No product information available.
                    </p>
                  )}

                  {/* ===========================
                      Order Footer
                  =========================== */}

                  <div className="mt-6 flex flex-col gap-5 border-t pt-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        Payment Method:
                        <span className="ml-2 font-semibold text-gray-900">
                          {order.paymentMethod || "-"}
                        </span>
                      </p>

                      {paymentStatus && (
                        <p className="text-gray-600">
                          Payment Status:
                          <span
                            className={`ml-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusClass(
                              paymentStatus
                            )}`}
                          >
                            {paymentStatus}
                          </span>
                        </p>
                      )}

                      <p className="pt-1 text-base text-gray-700">
                        Total:
                        <span className="ml-2 text-xl font-bold text-[#7A1020]">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {(orderStatus === "Pending" ||
                        orderStatus === "Confirmed") && (
                        <button
                          type="button"
                          disabled={cancellingId === order._id}
                          onClick={() => handleCancelOrder(order._id)}
                          className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50 cursor-pointer"
                        >
                          {cancellingId === order._id
                            ? "Cancelling..."
                            : "Cancel Order"}
                        </button>
                      )}

                      <Link
                        href={`/orders/${order._id}/invoice`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#D4AF37] bg-[#FFFBF5] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#7A1020] transition hover:bg-[#D4AF37]/15"
                      >
                        <FileText size={16} className="text-[#C9A227]" />
                        <span>Invoice</span>
                      </Link>

                      <Link
                        href={`/orders/${order._id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7A1F2B] px-5 py-2.5 text-xs sm:text-sm font-medium text-white transition hover:bg-[#5B1620] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2"
                      >
                        <Eye size={16} aria-hidden="true" />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =================================
          Continue Shopping
      ================================= */}

      <div className="mt-10 text-center">
        <Link
          href="/collections"
          className="font-medium text-[#7A1F2B] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2"
        >
          Continue Shopping →
        </Link>
      </div>
    </main>
  );
}