"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import { toast } from "sonner";

import {
  getAdminOrder,
  updateAdminOrderStatus,
} from "@/services/api";

// ======================================
// API URL
// ======================================

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

const API_URL = RAW_API_URL
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

// ======================================
// Order Statuses
// ======================================

const statuses = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
] as const;

type OrderStatus =
  (typeof statuses)[number];

// ======================================
// Types
// ======================================

interface OrderUser {
  name: string;
  email: string;
  mobile?: string;
}

interface OrderAddress {
  fullName: string;
  mobile: string;
  houseNumber: string;
  area: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;

  user: OrderUser | null;

  address: OrderAddress | null;

  items: OrderItem[];

  subtotal: number;

  shippingCharge: number;

  tax: number;

  discount: number;

  couponCode?: string | null;

  paymentMethod:
    | "COD"
    | "Razorpay";

  paymentStatus:
    | "Pending"
    | "Paid"
    | "Refunded"
    | "Failed";

  orderStatus: OrderStatus;

  totalAmount: number;

  createdAt: string;

  updatedAt?: string;
}

// ======================================
// Format Price
// ======================================

function formatPrice(price: number) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(Number(price) || 0);
}

// ======================================
// Format Date
// ======================================

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "-";
  }

  return parsedDate.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

// ======================================
// Product Image URL
// ======================================

function getImageUrl(
  image?: string
) {
  if (!image) {
    return "/images/products/saree_1_kanchipuram_clean.png";
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

// ======================================
// Session Error Helper
// ======================================

function isSessionError(
  error: unknown
) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message =
    error.message.toLowerCase();

  return (
    message.includes("token") ||
    message.includes("unauthorized") ||
    message.includes("session") ||
    message.includes("expired")
  );
}

// ======================================
// Order Status Badge
// ======================================

function getStatusClass(
  status: string
) {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    case "Shipped":
      return "bg-blue-100 text-blue-700";

    case "Out for Delivery":
      return "bg-purple-100 text-purple-700";

    case "Confirmed":
      return "bg-indigo-100 text-indigo-700";

    case "Pending":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

// ======================================
// Payment Status Badge
// ======================================

function getPaymentStatusClass(
  status: string
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

// ======================================
// Order Details Page
// ======================================

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const [loading, setLoading] =
    useState(true);

  const [order, setOrder] =
    useState<Order | null>(null);

  const [updating, setUpdating] =
    useState(false);

  const [error, setError] =
    useState("");

  // ======================================
  // Load Order
  // ======================================

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    loadOrder();
  }, [id]);

  async function loadOrder() {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "silkverse-token"
        );

      if (!token) {
        router.replace("/login");
        return;
      }

      const data =
        await getAdminOrder(
          token,
          id
        );

      setOrder(data || null);
    } catch (error: unknown) {
      if (isSessionError(error)) {
        localStorage.removeItem(
          "silkverse-token"
        );

        toast.error(
          "Your session has expired."
        );

        router.replace("/login");
        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : "Failed to load order.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  // ======================================
  // Update Order Status
  // ======================================

  async function handleStatusChange(
    status: OrderStatus
  ) {
    if (!order || updating) {
      return;
    }

    if (
      order.orderStatus ===
        "Delivered" ||
      order.orderStatus ===
        "Cancelled"
    ) {
      toast.error(
        "This order status cannot be changed."
      );

      return;
    }

    if (
      status === order.orderStatus
    ) {
      return;
    }

    const previousOrder =
      order;

    try {
      setUpdating(true);
      setError("");

      const token =
        localStorage.getItem(
          "silkverse-token"
        );

      if (!token) {
        router.replace("/login");
        return;
      }

      const updatedOrder =
        await updateAdminOrderStatus(
          token,
          order._id,
          status
        );

      setOrder(
        (currentOrder) => {
          if (!currentOrder) {
            return null;
          }

          return {
            ...currentOrder,
            orderStatus:
              updatedOrder?.orderStatus ??
              status,
            paymentStatus:
              updatedOrder?.paymentStatus ??
              (
                status === "Delivered" &&
                currentOrder.paymentMethod ===
                  "COD" &&
                currentOrder.paymentStatus ===
                  "Pending"
                  ? "Paid"
                  : currentOrder.paymentStatus
              ),
          };
        }
      );

      toast.success(
        "Order status updated successfully."
      );
    } catch (error: unknown) {
      if (isSessionError(error)) {
        localStorage.removeItem(
          "silkverse-token"
        );

        toast.error(
          "Your session has expired."
        );

        router.replace("/login");
        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : "Failed to update order status.";

      setOrder(previousOrder);

      toast.error(message);
    } finally {
      setUpdating(false);
    }
  }

  // ======================================
  // Loading
  // ======================================

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#7A1F2B] border-t-transparent" />

          <p className="mt-4 font-semibold text-gray-600">
            Loading Order...
          </p>
        </div>
      </div>
    );
  }

  // ======================================
  // Invalid ID
  // ======================================

  if (!id) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Invalid Order
        </h1>

        <p className="text-gray-500">
          The order ID is invalid.
        </p>

        <button
          type="button"
          onClick={() =>
            router.push(
              "/admin/orders"
            )
          }
          className="rounded-lg bg-[#7A1F2B] px-6 py-3 text-white transition hover:bg-[#651923]"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  // ======================================
  // Order Not Found
  // ======================================

  if (!order) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Order Not Found
        </h1>

        <p className="text-gray-500">
          {error ||
            "The requested order could not be found."}
        </p>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={loadOrder}
            className="rounded-lg bg-[#7A1F2B] px-6 py-3 text-white transition hover:bg-[#651923]"
          >
            Try Again
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/orders"
              )
            }
            className="rounded-lg bg-gray-600 px-6 py-3 text-white transition hover:bg-gray-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  // ======================================
  // Page
  // ======================================

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
            Administration
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[#7A1F2B]">
            Order Details
          </h1>

          <p className="mt-2 break-all font-mono text-sm text-gray-500">
            #{order._id}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/orders/${order._id}/invoice`
              )
            }
            className="w-fit rounded-lg border border-[#7A1F2B] bg-white px-5 py-2.5 font-semibold text-[#7A1F2B] transition hover:bg-[#7A1F2B] hover:text-white"
          >
            Print GST Invoice
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/orders"
              )
            }
            className="w-fit rounded-lg bg-gray-600 px-5 py-2.5 font-medium text-white transition hover:bg-gray-700"
          >
            ← Back to Orders
          </button>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>

          <button
            type="button"
            onClick={loadOrder}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Order Information */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Order Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Placed on{" "}
              {formatDate(
                order.createdAt
              )}
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
              order.orderStatus
            )}`}
          >
            {order.orderStatus}
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Order Status */}

          <div>
            <label
              htmlFor="orderStatus"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Order Status
            </label>

            <select
              id="orderStatus"
              value={
                order.orderStatus
              }
              disabled={
                updating ||
                order.orderStatus ===
                  "Delivered" ||
                order.orderStatus ===
                  "Cancelled"
              }
              onChange={(event) =>
                handleStatusChange(
                  event.target
                    .value as OrderStatus
                )
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#7A1F2B] disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              {statuses.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                )
              )}
            </select>

            {updating && (
              <p className="mt-2 text-sm text-gray-500">
                Updating order status...
              </p>
            )}

            {(order.orderStatus ===
              "Delivered" ||
              order.orderStatus ===
                "Cancelled") && (
              <p className="mt-2 text-xs text-gray-500">
                This order status cannot
                be changed.
              </p>
            )}
          </div>

          {/* Order ID */}

          <div>
            <p className="text-sm font-semibold text-gray-700">
              Order ID
            </p>

            <p className="mt-2 break-all font-mono text-sm text-gray-600">
              {order._id}
            </p>
          </div>

          {/* Payment Method */}

          <div>
            <p className="text-sm font-semibold text-gray-700">
              Payment Method
            </p>

            <p className="mt-2 font-medium text-gray-900">
              {order.paymentMethod === "COD"
                ? "Cash on Delivery"
                : order.paymentMethod || "Online Payment"}
            </p>
          </div>

          {/* Payment Status */}

          <div>
            <p className="text-sm font-semibold text-gray-700">
              Payment Status
            </p>

            <span
              className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${getPaymentStatusClass(
                order.paymentStatus
              )}`}
            >
              {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Information */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-bold text-gray-900">
          Customer Information
        </h2>

        {order.user ? (
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {order.user.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1 break-all font-semibold text-gray-900">
                {order.user.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Mobile
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {order.user.mobile ||
                  "-"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">
            Customer information is no
            longer available.
          </p>
        )}
      </div>

      {/* Shipping Address */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-bold text-gray-900">
          Shipping Address
        </h2>

        {order.address ? (
          <div className="space-y-1 text-gray-700">
            <p className="font-semibold text-gray-900">
              {order.address.fullName}
            </p>

            <p>
              {order.address.mobile}
            </p>

            <p>
              {
                order.address
                  .houseNumber
              }
              ,{" "}
              {
                order.address.area
              }
            </p>

            {order.address
              .landmark && (
              <p>
                Landmark:{" "}
                {
                  order.address
                    .landmark
                }
              </p>
            )}

            <p>
              {order.address.city}
              ,{" "}
              {order.address.state}
            </p>

            <p>
              {
                order.address.country
              }{" "}
              -{" "}
              {
                order.address
                  .pincode
              }
            </p>
          </div>
        ) : (
          <p className="text-gray-500">
            Shipping address is not
            available.
          </p>
        )}
      </div>

      {/* Ordered Products */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Ordered Products
          </h2>

          <span className="text-sm text-gray-500">
            {order.items.length}{" "}
            {order.items.length === 1
              ? "item"
              : "items"}
          </span>
        </div>

        {order.items.length ===
        0 ? (
          <p className="py-6 text-center text-gray-500">
            No products found in this
            order.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Product
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Quantity
                  </th>

                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {order.items.map(
                  (
                    item,
                    index
                  ) => (
                    <tr
                      key={`${item.product}-${index}`}
                      className="border-b last:border-b-0"
                    >
                      {/* Product */}

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={getImageUrl(
                              item.image
                            )}
                            alt={
                              item.name ||
                              "Product"
                            }
                            className="h-16 w-14 rounded-lg border object-cover"
                            onError={(
                              event
                            ) => {
                              event.currentTarget.src =
                                "/images/products/default.jpg";
                            }}
                          />

                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                        </div>
                      </td>

                      {/* Price */}

                      <td className="px-4 py-4 text-gray-700">
                        {formatPrice(
                          item.price
                        )}
                      </td>

                      {/* Quantity */}

                      <td className="px-4 py-4 text-gray-700">
                        {item.quantity}
                      </td>

                      {/* Total */}

                      <td className="px-4 py-4 text-right font-semibold text-gray-900">
                        {formatPrice(
                          item.price *
                            item.quantity
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bill Summary */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-bold text-gray-900">
          Bill Summary
        </h2>

        <div className="ml-auto max-w-md space-y-4">
          {/* Subtotal */}

          <div className="flex justify-between text-gray-600">
            <span>
              Subtotal
            </span>

            <span className="font-medium text-gray-900">
              {formatPrice(
                order.subtotal
              )}
            </span>
          </div>

          {/* Shipping */}

          <div className="flex justify-between text-gray-600">
            <span>
              Shipping
            </span>

            <span className="font-medium text-gray-900">
              {order.shippingCharge ===
              0
                ? "FREE"
                : formatPrice(
                    order.shippingCharge
                  )}
            </span>
          </div>

          {/* Tax */}

          <div className="flex justify-between text-gray-600">
            <span>
              Tax
            </span>

            <span className="font-medium text-gray-900">
              {formatPrice(
                order.tax
              )}
            </span>
          </div>

          {/* Discount */}

          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>
                Discount

                {order.couponCode && (
                  <span className="ml-2 text-xs">
                    (
                    {
                      order.couponCode
                    }
                    )
                  </span>
                )}
              </span>

              <span className="font-medium">
                -{" "}
                {formatPrice(
                  order.discount
                )}
              </span>
            </div>
          )}

          {/* Total */}

          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span className="text-lg font-bold text-gray-900">
                Total
              </span>

              <span className="text-xl font-bold text-[#C9A227]">
                {formatPrice(
                  order.totalAmount
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}