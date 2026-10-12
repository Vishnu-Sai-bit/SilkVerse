"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";

import { getOrderById } from "@/services/api";

// =====================================
// Types
// =====================================

type OrderItem = {
  product: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
};

type Address = {
  _id?: string;
  fullName: string;
  mobile: string;
  houseNumber: string;
  area: string;
  landmark?: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
  country: string;
};

type Order = {
  _id: string;

  items: OrderItem[];

  subtotal: number;
  shippingCharge: number;
  tax: number;
  discount: number;

  couponCode?: string | null;

  totalAmount: number;

  orderStatus: string;

  paymentMethod:
    | "COD"
    | "Razorpay"
    | string;

  paymentStatus:
    | "Pending"
    | "Paid"
    | "Refunded"
    | "Failed"
    | string;

  createdAt: string;

  address:
    | Address
    | string
    | null;
};

// =====================================
// API Configuration
// =====================================

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

const API_URL = RAW_API_URL
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

// =====================================
// Helpers
// =====================================

function getImageUrl(image?: string) {
  if (!image) {
    return "/images/products/default.jpg";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  if (image.startsWith("/uploads/")) {
    const filename = image.replace(/^\/uploads\/(?:products\/)?/, "");
    return `/images/products/${filename}`;
  }

  if (image.startsWith("uploads/")) {
    const filename = image.replace(/^uploads\/(?:products\/)?/, "");
    return `/images/products/${filename}`;
  }

  if (image.startsWith("/")) {
    return image;
  }

  return `/images/products/${image}`;
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

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

function isSessionError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("unauthorized") ||
    message.includes("authentication") ||
    message.includes("token") ||
    message.includes("login") ||
    message.includes("jwt")
  );
}

// =====================================
// Invoice Page
// =====================================

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();

  // ===================================
  // Order ID
  // ===================================

  const rawOrderId = params.id;

  const orderId =
    typeof rawOrderId === "string"
      ? rawOrderId
      : Array.isArray(rawOrderId)
        ? rawOrderId[0]
        : "";

  // ===================================
  // State
  // ===================================

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ===================================
  // Fetch Order
  // ===================================

  const loadOrder = useCallback(async () => {
    if (!orderId) {
      setError("Invalid order ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "silkverse-token"
        );

      if (!token) {
        router.replace(
          `/login?redirect=/orders/${orderId}/invoice`
        );
        return;
      }

      const data =
        await getOrderById(
          token,
          orderId
        );

      if (!data) {
        throw new Error(
          "Invoice not found."
        );
      }

      setOrder(data as Order);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load invoice.";

      if (isSessionError(error)) {
        localStorage.removeItem(
          "silkverse-token"
        );

        router.replace(
          `/login?redirect=/orders/${orderId}/invoice`
        );

        return;
      }

      setError(message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId, router]);

  // ===================================
  // Load Invoice
  // ===================================

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  // ===================================
  // Image Error
  // ===================================

  function handleImageError(
    event: React.SyntheticEvent<HTMLImageElement>
  ) {
    event.currentTarget.onerror = null;
    event.currentTarget.src =
      "/images/products/default.jpg";
  }

  // ===================================
  // Loading
  // ===================================

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
        <div className="flex min-h-60 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#7A1F2B]" />

            <p className="mt-5 font-medium text-gray-500">
              Loading invoice...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ===================================
  // Invoice Not Found
  // ===================================

  if (!order) {
    return (
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Invoice Unavailable
          </h1>

          <p className="mt-3 text-gray-600">
            {error ||
              "We could not load this invoice."}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/orders/${orderId}`
                )
              }
              className="rounded-lg bg-[#7A1F2B] px-6 py-3 font-semibold text-white transition hover:bg-[#651923]"
            >
              Back to Order
            </button>

            <button
              type="button"
              onClick={loadOrder}
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ===================================
  // Address
  // ===================================

  const address =
    typeof order.address === "object" &&
    order.address !== null
      ? order.address
      : null;

  // ===================================
  // Safe Items
  // ===================================

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  // ===================================
  // Render
  // ===================================

  return (
    <>
      {/* =================================
          Screen Controls
      ================================= */}

      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 sm:px-6 py-6 print:hidden">
        <button
          type="button"
          onClick={() =>
            router.push(
              `/orders/${order._id}`
            )
          }
          className="text-sm font-semibold text-[#7A1F2B] hover:underline"
        >
          ← Back to Order
        </button>

        <button
          type="button"
          onClick={() =>
            window.print()
          }
          className="rounded-lg bg-[#7A1F2B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#651923]"
        >
          Print Invoice
        </button>
      </div>

      {/* =================================
          Invoice
      ================================= */}

      <main className="mx-auto max-w-5xl px-4 sm:px-6 pb-16 print:max-w-none print:px-0 print:pb-0">
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none">

          {/* =================================
              Invoice Header
          ================================= */}

          <div className="border-b-4 border-[#C9A227] p-4 sm:p-8 md:p-10 print:p-8">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <img
                  src="/logo/logo-horizontal.png"
                  alt="SilkVerse"
                  className="h-12 w-auto object-contain sm:h-14"
                />

                <h1 className="mt-3 text-2xl sm:text-4xl font-bold text-[#7A1F2B]">
                  INVOICE
                </h1>

                <p className="mt-3 text-sm text-gray-500">
                  Premium Dharmavaram Silk Sarees
                </p>
              </div>

              <div className="sm:text-right">
                <p className="text-sm text-gray-500">
                  Invoice Date
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {formatDate(
                    order.createdAt
                  )}
                </p>

                <p className="mt-4 text-sm text-gray-500">
                  Order ID
                </p>

                <p className="mt-1 break-all font-semibold text-gray-900">
                  {order._id}
                </p>
              </div>
            </div>
          </div>

          {/* =================================
              Customer + Payment
          ================================= */}

          <div className="grid gap-8 border-b p-4 sm:grid-cols-2 sm:p-8 md:p-10 print:p-8">

            {/* Customer */}

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#7A1F2B]">
                Bill To
              </h2>

              {address ? (
                <div className="mt-4 space-y-1 text-sm text-gray-700">
                  <p className="font-bold text-gray-900">
                    {address.fullName}
                  </p>

                  <p>
                    Mobile:{" "}
                    {address.mobile}
                  </p>

                  <p>
                    {address.houseNumber}
                  </p>

                  <p>
                    {address.area}
                  </p>

                  {address.landmark && (
                    <p>
                      Landmark:{" "}
                      {address.landmark}
                    </p>
                  )}

                  <p>
                    {[
                      address.city,
                      address.district &&
                      address.district.toLowerCase() !== address.city?.toLowerCase()
                        ? address.district
                        : null,
                      address.state,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  <p>
                    {address.pincode}
                  </p>

                  <p>
                    {address.country}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500">
                  Customer address unavailable.
                </p>
              )}
            </div>

            {/* Payment */}

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#7A1F2B]">
                Payment Information
              </h2>

              <div className="mt-4 space-y-3 text-sm">

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Payment Method
                  </span>

                  <span className="text-right font-semibold text-gray-900">
                    {order.paymentMethod === "COD"
                      ? "Cash on Delivery (COD)"
                      : order.paymentMethod === "UPI"
                      ? "UPI (Unified Payments Interface)"
                      : order.paymentMethod === "Card"
                      ? "Credit / Debit Card"
                      : order.paymentMethod === "NetBanking"
                      ? "Net Banking"
                      : order.paymentMethod === "Wallet"
                      ? "Digital Wallet"
                      : "Online Payment (Razorpay)"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Payment Status
                  </span>

                  <span
                    className={`font-semibold ${
                      order.paymentStatus ===
                      "Paid"
                        ? "text-green-600"
                        : order.paymentStatus ===
                            "Refunded"
                          ? "text-purple-600"
                          : order.paymentStatus ===
                              "Failed"
                            ? "text-red-600"
                            : "text-yellow-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Order Status
                  </span>

                  <span className="text-right font-semibold text-gray-900">
                    {order.orderStatus}
                  </span>
                </div>

              </div>
            </div>

          </div>

          {/* =================================
              Products Table
          ================================= */}

          <div className="p-4 sm:p-8 md:p-10 print:p-8">

            <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-[#7A1F2B]">
              Order Items
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#7A1F2B] text-left text-sm">
                    <th className="pb-3 pr-4 font-bold text-[#7A1F2B]">
                      Product
                    </th>

                    <th className="px-4 pb-3 text-center font-bold text-[#7A1F2B]">
                      Qty
                    </th>

                    <th className="px-4 pb-3 text-right font-bold text-[#7A1F2B]">
                      Price
                    </th>

                    <th className="pb-3 pl-4 text-right font-bold text-[#7A1F2B]">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {items.length > 0 ? (
                    items.map(
                      (item, index) => (
                        <tr
                          key={`${item.product}-${index}`}
                          className="border-b"
                        >
                          <td className="py-5 pr-4">
                            <div className="flex items-center gap-4">

                              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md border bg-gray-50 print:hidden">
                                <img
                                  src={getImageUrl(
                                    item.image
                                  )}
                                  alt={
                                    item.name ||
                                    "Product"
                                  }
                                  onError={
                                    handleImageError
                                  }
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              <div>
                                <p className="font-semibold text-gray-900">
                                  {item.name ||
                                    "Product"}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  SilkVerse Product
                                </p>
                              </div>

                            </div>
                          </td>

                          <td className="px-4 py-5 text-center text-gray-700">
                            {Number(
                              item.quantity
                            ) || 0}
                          </td>

                          <td className="px-4 py-5 text-right text-gray-700">
                            {formatPrice(
                              Number(
                                item.price
                              ) || 0
                            )}
                          </td>

                          <td className="pl-4 py-5 text-right font-semibold text-gray-900">
                            {formatPrice(
                              (Number(
                                item.price
                              ) || 0) *
                                (Number(
                                  item.quantity
                                ) || 0)
                            )}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-10 text-center text-sm text-gray-500"
                      >
                        No order items available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* =================================
                Price Summary
            ================================= */}

            <div className="mt-8 flex justify-end">
              <div className="w-full max-w-md space-y-4">

                <div className="flex justify-between gap-6 text-sm">
                  <span className="text-gray-600">
                    Subtotal
                  </span>

                  <span className="font-medium">
                    {formatPrice(
                      order.subtotal
                    )}
                  </span>
                </div>

                <div className="flex justify-between gap-6 text-sm">
                  <span className="text-gray-600">
                    Shipping
                  </span>

                  <span className="font-medium">
                    {Number(
                      order.shippingCharge
                    ) === 0
                      ? "FREE"
                      : formatPrice(
                          order.shippingCharge
                        )}
                  </span>
                </div>

                <div className="flex justify-between gap-6 text-sm">
                  <span className="text-gray-600">
                    GST
                  </span>

                  <span className="font-medium">
                    {formatPrice(
                      order.tax
                    )}
                  </span>
                </div>

                {order.couponCode && (
                  <div className="flex justify-between gap-6 text-sm">
                    <span className="text-gray-600">
                      Coupon
                    </span>

                    <span className="font-semibold text-green-600">
                      {order.couponCode}
                    </span>
                  </div>
                )}

                {Number(
                  order.discount
                ) > 0 && (
                  <div className="flex justify-between gap-6 text-sm text-green-600">
                    <span>
                      Discount
                    </span>

                    <span>
                      -{" "}
                      {formatPrice(
                        order.discount
                      )}
                    </span>
                  </div>
                )}

                <div className="border-t-2 border-[#7A1F2B] pt-4">
                  <div className="flex justify-between gap-6 text-xl font-bold">
                    <span>
                      Grand Total
                    </span>

                    <span className="text-[#7A1F2B]">
                      {formatPrice(
                        order.totalAmount
                      )}
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* =================================
              Footer
          ================================= */}

          <div className="border-t bg-gray-50 px-4 py-5 sm:px-10 sm:py-8 text-center print:bg-white print:px-8">
            <p className="font-semibold text-[#7A1F2B]">
              Thank you for shopping with SilkVerse.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              We appreciate your trust in our authentic silk collection.
            </p>

            <p className="mt-4 text-xs text-gray-400">
              This is a computer-generated invoice and does not require a signature.
            </p>
          </div>

        </div>
      </main>
    </>
  );
}