"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import {
  getOrderById,
  cancelOrder,
  createPaymentOrder,
  verifyPayment,
} from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

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
  discount: number;
  couponCode?: string | null;
  totalAmount: number;
  orderStatus: OrderStatus | string;
  paymentMethod:
    | "COD"
    | "Razorpay"
    | string;
  paymentStatus:
    | PaymentStatus
    | string;
  createdAt: string;
  address:
    | Address
    | string
    | null;
};

type CancelResponse = {
  order?: Order;
  refund?: {
    success?: boolean;
    message?: string;
    amount?: number;
  };
};

// =====================================
// Razorpay Types
// =====================================

type RazorpayPaymentResponse = {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;

  handler: (
    response: RazorpayPaymentResponse
  ) => Promise<void>;

  modal?: {
    ondismiss?: () => void;
  };

  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };

  theme?: {
    color?: string;
  };
};

type RazorpayInstance = {
  open: () => void;
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
// Image URL
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

// =====================================
// Format Price
// =====================================

function formatPrice(amount: number) {
  const value = Number(amount);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(
    Number.isFinite(value) ? value : 0
  );
}

// =====================================
// Format Date
// =====================================

function formatDate(date: string) {
  if (!date) {
    return "Date unavailable";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
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

// =====================================
// Payment Status Class
// =====================================

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

// =====================================
// Order Tracking
// =====================================

const TRACKING_STEPS = [
  {
    status: "Pending",
    title: "Order Placed",
    description:
      "Your order has been received.",
  },
  {
    status: "Confirmed",
    title: "Order Confirmed",
    description:
      "Your order has been confirmed and is being prepared.",
  },
  {
    status: "Shipped",
    title: "Shipped",
    description:
      "Your order has been handed over for delivery.",
  },
  {
    status: "Out for Delivery",
    title: "Out for Delivery",
    description:
      "Your order is on the way to your delivery address.",
  },
  {
    status: "Delivered",
    title: "Delivered",
    description:
      "Your order has been delivered successfully.",
  },
] as const;

type TrackingStatus =
  (typeof TRACKING_STEPS)[number]["status"];

function getTrackingStepState(
  currentStatus: string,
  stepStatus: TrackingStatus
) {
  if (currentStatus === "Cancelled") {
    return "inactive";
  }

  const currentIndex =
    TRACKING_STEPS.findIndex(
      (step) =>
        step.status === currentStatus
    );

  const stepIndex =
    TRACKING_STEPS.findIndex(
      (step) =>
        step.status === stepStatus
    );

  if (currentIndex === -1) {
    return "inactive";
  }

  if (stepIndex < currentIndex) {
    return "completed";
  }

  if (stepIndex === currentIndex) {
    return "current";
  }

  return "upcoming";
}

// =====================================
// Load Razorpay Script
// =====================================

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    const razorpayWindow =
      window as typeof window & {
        Razorpay?: new (
          options: RazorpayOptions
        ) => RazorpayInstance;
      };

    if (razorpayWindow.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript =
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

    if (existingScript) {
      if (razorpayWindow.Razorpay) {
        resolve(true);
        return;
      }

      let checks = 0;
      const interval = setInterval(() => {
        checks++;
        if (razorpayWindow.Razorpay) {
          clearInterval(interval);
          resolve(true);
        } else if (checks > 25) {
          clearInterval(interval);
          resolve(Boolean(razorpayWindow.Razorpay));
        }
      }, 100);

      existingScript.addEventListener(
        "load",
        () => {
          clearInterval(interval);
          resolve(Boolean(razorpayWindow.Razorpay));
        },
        { once: true }
      );

      existingScript.addEventListener(
        "error",
        () => {
          clearInterval(interval);
          resolve(false);
        },
        { once: true }
      );

      return;
    }

    const script =
      document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () => {
      resolve(
        Boolean(
          razorpayWindow.Razorpay
        )
      );
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

// =====================================
// Order Details Page
// =====================================

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();

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

  const [cancelling, setCancelling] =
    useState(false);

  const [retryingPayment, setRetryingPayment] =
    useState(false);

  const [error, setError] =
    useState("");

  // ===================================
  // Fetch Order
  // ===================================

  const loadOrder = useCallback(
    async () => {
      if (!orderId) {
        setOrder(null);
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
            `/login?redirect=/orders/${orderId}`
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
            "Order not found."
          );
        }

        setOrder(data as Order);
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load order.";

        if (isSessionError(message)) {
          localStorage.removeItem(
            "silkverse-token"
          );

          router.replace(
            `/login?redirect=/orders/${orderId}`
          );

          return;
        }

        setOrder(null);
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [orderId, router]
  );

  // ===================================
  // Initial Load
  // ===================================

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  // ===================================
  // Retry Razorpay Payment
  // ===================================

  const handleRetryPayment =
    async () => {
      if (
        !order ||
        !orderId ||
        retryingPayment
      ) {
        return;
      }

      if (
        order.paymentMethod ===
          "COD" ||
        order.paymentStatus !==
          "Pending"
      ) {
        return;
      }

      if (
        order.orderStatus ===
          "Cancelled" ||
        order.orderStatus ===
          "Delivered"
      ) {
        return;
      }

      try {
        setRetryingPayment(true);
        setError("");

        const token =
          localStorage.getItem(
            "silkverse-token"
          );

        if (!token) {
          router.replace(
            `/login?redirect=/orders/${orderId}`
          );
          return;
        }

        // =================================
        // Create or recover payment order
        // =================================

        const paymentResult =
          await createPaymentOrder(
            token,
            order._id
          );

        if (!paymentResult?.order) {
          throw new Error(
            "Unable to create the payment order."
          );
        }

        // =================================
        // Payment Already Captured
        // =================================

        if (
          paymentResult.paymentRecovered
        ) {
          toast.success(
            "Payment recovered successfully. Your order is confirmed."
          );

          await loadOrder();
          return;
        }

        // =================================
        // Razorpay Configuration
        // =================================

        const razorpayKey =
          process.env
            .NEXT_PUBLIC_RAZORPAY_KEY_ID;

        if (!razorpayKey) {
          throw new Error(
            "Razorpay configuration is missing."
          );
        }

        // =================================
        // Load Razorpay SDK
        // =================================

        const scriptLoaded =
          await loadRazorpayScript();

        if (!scriptLoaded) {
          throw new Error(
            "Unable to load Razorpay. Please try again."
          );
        }

        const razorpayWindow =
          window as typeof window & {
            Razorpay?: new (
              options: RazorpayOptions
            ) => RazorpayInstance;
          };

        if (!razorpayWindow.Razorpay) {
          throw new Error(
            "Unable to initialize Razorpay. Please try again."
          );
        }

        // =================================
        // Razorpay Order
        // =================================

        const razorpayOrder =
          paymentResult.order;

        const razorpayOrderId =
          razorpayOrder.id;

        const razorpayAmount =
          Number(
            razorpayOrder.amount
          );

        const razorpayCurrency =
          razorpayOrder.currency ||
          "INR";

        // =================================
        // Validate Razorpay Order
        // =================================

        if (
          !razorpayOrderId ||
          !Number.isFinite(
            razorpayAmount
          ) ||
          razorpayAmount <= 0
        ) {
          throw new Error(
            "Invalid Razorpay order details."
          );
        }

        // =================================
        // Razorpay Checkout
        // =================================

        const options: RazorpayOptions = {
          key: razorpayKey,

          amount:
            razorpayAmount,

          currency:
            razorpayCurrency,

          name: "SilkVerse",

          description:
            `Payment for Order #${order._id}`,

          order_id:
            razorpayOrderId,

          // =================================
          // Payment Handler
          // =================================

          handler:
            async (
              response
            ): Promise<void> => {
              try {
                // =================================
                // Validate Payment Response
                // =================================

                const paymentId =
                  response
                    ?.razorpay_payment_id;

                const razorpayOrderIdFromResponse =
                  response
                    ?.razorpay_order_id;

                const signature =
                  response
                    ?.razorpay_signature;

                if (
                  !paymentId ||
                  !razorpayOrderIdFromResponse ||
                  !signature
                ) {
                  throw new Error(
                    "Incomplete payment response received."
                  );
                }

                // =================================
                // Validate Order ID
                // =================================

                if (
                  razorpayOrderIdFromResponse !==
                  razorpayOrderId
                ) {
                  throw new Error(
                    "Payment order mismatch. Please contact support."
                  );
                }

                // =================================
                // Verify Payment
                // =================================

                await verifyPayment(
                  token,
                  {
                    razorpay_order_id:
                      razorpayOrderIdFromResponse,

                    razorpay_payment_id:
                      paymentId,

                    razorpay_signature:
                      signature,

                    orderId:
                      order._id,
                  }
                );

                // =================================
                // Payment Verified
                // =================================

                toast.success(
                  "Payment successful! Your order is confirmed."
                );

                await loadOrder();

                router.push(
                  `/order-success?orderId=${order._id}`
                );
              } catch (
                error: unknown
              ) {
                const message =
                  error instanceof Error
                    ? error.message
                    : "Payment verification failed.";

                if (
                  isSessionError(
                    message
                  )
                ) {
                  localStorage.removeItem(
                    "silkverse-token"
                  );

                  router.replace(
                    `/login?redirect=/orders/${order._id}`
                  );

                  return;
                }

                setError(message);

                toast.error(
                  message
                );

                // Razorpay may have captured
                // payment even if verification
                // failed on the frontend.
                await loadOrder();
              } finally {
                setRetryingPayment(
                  false
                );
              }
            },

          // =================================
          // Razorpay Modal
          // =================================

          modal: {
            ondismiss: () => {
              setRetryingPayment(
                false
              );

              toast.info(
                "Payment was not completed. Your order is still pending."
              );
            },
          },

          // =================================
          // Theme
          // =================================

          theme: {
            color: "#7A1F2B",
          },

          // =================================
          // Prefill
          // =================================

          prefill: {
            name:
              (typeof order.address === "object"
                ? order.address?.fullName
                : "") ||
              user?.name ||
              "",
            email: user?.email || "",
            contact:
              (typeof order.address === "object"
                ? order.address?.mobile
                : "") ||
              user?.mobile ||
              "",
          },
        };

        // =================================
        // Create Razorpay Instance
        // =================================

        const razorpay =
          new razorpayWindow.Razorpay(
            options
          );

        // =================================
        // Open Razorpay
        // =================================

        razorpay.open();
      } catch (
        error: unknown
      ) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to start payment.";

        if (
          isSessionError(message)
        ) {
          localStorage.removeItem(
            "silkverse-token"
          );

          router.replace(
            `/login?redirect=/orders/${orderId}`
          );

          return;
        }

        setError(message);
        toast.error(message);
        setRetryingPayment(false);
      }
    };

  // ===================================
  // Cancel Order
  // ===================================

  const handleCancelOrder =
    async () => {
      if (
        !order ||
        !orderId ||
        cancelling ||
        retryingPayment
      ) {
        return;
      }

      const nonCancellableStatuses = [
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ];

      if (
        nonCancellableStatuses.includes(
          order.orderStatus
        )
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to cancel this order?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setCancelling(true);
        setError("");

        const token =
          localStorage.getItem(
            "silkverse-token"
          );

        if (!token) {
          router.replace(
            `/login?redirect=/orders/${orderId}`
          );
          return;
        }

        const response =
          (await cancelOrder(
            token,
            orderId
          )) as
            | CancelResponse
            | Order
            | null;

        let updatedOrder:
          | Order
          | null = null;

        let refundMessage = "";

        if (
          response &&
          typeof response ===
            "object" &&
          "order" in response
        ) {
          updatedOrder =
            response.order ??
            null;

          if (
            response.refund?.message
          ) {
            refundMessage =
              response.refund.message;
          }
        } else if (response) {
          updatedOrder =
            response as Order;
        }

        if (updatedOrder) {
          setOrder(updatedOrder);
        } else {
          await loadOrder();
        }

        router.refresh();

        if (
          order.paymentMethod !==
            "COD" &&
          order.paymentStatus ===
            "Paid"
        ) {
          toast.success(
            refundMessage
              ? `Order cancelled & stock restored. ${refundMessage}`
              : "Order cancelled & stock restored. Refund processing has been initiated."
          );
        } else {
          toast.success(
            "Order cancelled successfully. Product stock has been restored."
          );
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to cancel order.";

        if (
          isSessionError(message)
        ) {
          localStorage.removeItem(
            "silkverse-token"
          );

          router.replace(
            `/login?redirect=/orders/${orderId}`
          );

          return;
        }

        setError(message);
        toast.error(message);
      } finally {
        setCancelling(false);
      }
    };

  // ===================================
  // Loading
  // ===================================

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-16">
        <div className="flex min-h-60 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#7A1F2B]" />

            <p className="mt-5 font-medium text-gray-500">
              Loading order details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ===================================
  // Order Not Found
  // ===================================

  if (!order) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Order Not Found
          </h1>

          <p className="mt-3 text-gray-600">
            {error ||
              "We could not find this order."}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/orders"
              )
            }
            className="mt-6 rounded-lg bg-[#7A1F2B] px-6 py-3 font-semibold text-white transition hover:bg-[#651923] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2"
          >
            Back to My Orders
          </button>
        </div>
      </main>
    );
  }

  // ===================================
  // Cancel Availability
  // ===================================

  const canCancel =
    order.orderStatus !==
      "Shipped" &&
    order.orderStatus !==
      "Out for Delivery" &&
    order.orderStatus !==
      "Delivered" &&
    order.orderStatus !==
      "Cancelled";

  // ===================================
  // Retry Payment Availability
  // ===================================

  const canRetryPayment =
    order.paymentMethod !==
      "COD" &&
    order.paymentStatus ===
      "Pending" &&
    order.orderStatus !==
      "Cancelled" &&
    order.orderStatus !==
      "Delivered";

  // ===================================
  // Estimated Delivery
  // ===================================

  const createdAt =
    new Date(order.createdAt);

  const hasValidCreatedAt =
    !Number.isNaN(
      createdAt.getTime()
    );

  const estimatedDelivery =
    hasValidCreatedAt
      ? new Date(
          createdAt.getTime() +
            5 *
              24 *
              60 *
              60 *
              1000
        )
      : null;

  const showEstimatedDelivery =
    estimatedDelivery !== null &&
    order.orderStatus !==
      "Cancelled" &&
    order.orderStatus !==
      "Delivered";

  // ===================================
  // Address
  // ===================================

  const address =
    typeof order.address ===
      "object" &&
    order.address !== null
      ? order.address
      : null;

  // ===================================
  // Safe Order Values
  // ===================================

  const items = Array.isArray(
    order.items
  )
    ? order.items
    : [];

  const subtotal =
    Number(order.subtotal) || 0;

  const shippingCharge =
    Number(order.shippingCharge) || 0;

  const tax =
    Number(order.tax) || 0;

  const discount =
    Number(order.discount) || 0;

  const totalAmount =
    Number(order.totalAmount) || 0;

  // ===================================
  // Render
  // ===================================

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-16">
      {/* =================================
          Back
      ================================= */}

      <div className="mb-6 flex flex-wrap items-center gap-2.5">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#7A1F2B] shadow-xs transition hover:border-[#7A1F2B]/30 hover:bg-[#7A1F2B]/5"
        >
          ← Back to My Orders
        </Link>
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-xs font-medium text-stone-600 shadow-xs transition hover:border-stone-300 hover:text-stone-900"
        >
          My Account Dashboard
        </Link>
      </div>

      {/* =================================
          Header
      ================================= */}

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#C9A227]">
          SilkVerse
        </p>

        <h1 className="mt-2 text-2xl sm:text-4xl font-bold text-[#7A1F2B]">
          Order Details
        </h1>

        <p className="mt-2 break-all text-gray-500">
          Order #{order._id}
        </p>
      </div>

      {/* =================================
          Error
      ================================= */}

      {error && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* =================================
          Order Status
      ================================= */}

      <section className="mb-8 rounded-2xl border bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Order Status
            </h2>

            <span
              className={`mt-3 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                order.orderStatus
              )}`}
            >
              {order.orderStatus ||
                "Pending"}
            </span>

            <div className="mt-4 space-y-1 text-sm text-gray-500">
              <p>
                Ordered on{" "}
                {formatDate(
                  order.createdAt
                )}
              </p>

              {showEstimatedDelivery && (
                <p>
                  Estimated Delivery:{" "}
                  <strong className="text-gray-700">
                    {estimatedDelivery.toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </strong>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Retry Payment */}

            {canRetryPayment && (
              <button
                type="button"
                onClick={
                  handleRetryPayment
                }
                disabled={
                  retryingPayment ||
                  cancelling
                }
                className="rounded-lg bg-[#C9A227] px-6 py-3 font-semibold text-white transition hover:bg-[#AE891C] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2"
              >
                {retryingPayment
                  ? "Opening Payment..."
                  : "Retry Payment"}
              </button>
            )}

            {/* Invoice */}

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/orders/${order._id}/invoice`
                )
              }
              className="rounded-lg border border-[#7A1F2B] bg-white px-6 py-3 font-semibold text-[#7A1F2B] transition hover:bg-[#7A1F2B] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2"
            >
              Invoice
            </button>

            {/* Cancel Order */}

            {canCancel && (
              <button
                type="button"
                onClick={
                  handleCancelOrder
                }
                disabled={
                  cancelling ||
                  retryingPayment
                }
                className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2"
              >
                {cancelling
                  ? "Cancelling..."
                  : "Cancel Order"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =================================
          Order Tracking
      ================================= */}

      <section className="mb-8 rounded-2xl border bg-white p-4 sm:p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#7A1F2B]">
            Track Your Order
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Follow your order from placement to delivery.
          </p>
        </div>

        {order.orderStatus ===
        "Cancelled" ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-xl text-red-600">
                ×
              </div>

              <div>
                <h3 className="font-bold text-red-700">
                  Order Cancelled
                </h3>

                <p className="mt-1 text-sm text-red-600">
                  This order has been cancelled and will not be delivered.
                </p>

                {order.paymentStatus ===
                  "Refunded" && (
                  <p className="mt-2 text-sm font-medium text-purple-700">
                    Your Razorpay payment has been refunded.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            {TRACKING_STEPS.map(
              (step, index) => {
                const state =
                  getTrackingStepState(
                    order.orderStatus,
                    step.status
                  );

                const isLast =
                  index ===
                  TRACKING_STEPS.length -
                    1;

                return (
                  <div
                    key={step.status}
                    className="relative flex gap-4"
                  >
                    {!isLast && (
                      <div
                        className={`absolute left-[20px] top-[42px] h-[calc(100%-18px)] w-0.5 ${
                          state ===
                          "completed"
                            ? "bg-[#7A1F2B]"
                            : "bg-gray-200"
                        }`}
                      />
                    )}

                    <div
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                        state ===
                        "completed"
                          ? "border-[#7A1F2B] bg-[#7A1F2B] text-white"
                          : state ===
                              "current"
                            ? "border-[#C9A227] bg-[#C9A227] text-white"
                            : "border-gray-300 bg-white text-gray-400"
                      }`}
                    >
                      {state ===
                      "completed"
                        ? "✓"
                        : state ===
                            "current"
                          ? "•"
                          : index + 1}
                    </div>

                    <div
                      className={`min-w-0 flex-1 ${
                        isLast
                          ? "pb-0"
                          : "pb-8"
                      }`}
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <h3
                          className={`font-bold ${
                            state ===
                            "upcoming"
                              ? "text-gray-400"
                              : "text-gray-900"
                          }`}
                        >
                          {step.title}
                        </h3>

                        {state ===
                          "current" && (
                          <span className="w-fit rounded-full bg-[#7A1F2B]/10 px-3 py-1 text-xs font-semibold text-[#7A1F2B]">
                            Current Status
                          </span>
                        )}

                        {state ===
                          "completed" && (
                          <span className="w-fit text-xs font-medium text-green-600">
                            Completed
                          </span>
                        )}
                      </div>

                      <p
                        className={`mt-1 text-sm ${
                          state ===
                          "upcoming"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        {
                          step.description
                        }
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </section>

      {/* =================================
          Ordered Products
      ================================= */}

      <section className="rounded-2xl border bg-white p-4 sm:p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-[#7A1F2B]">
          Ordered Products
        </h2>

        {items.length > 0 ? (
          <div className="space-y-6">
            {items.map(
              (item, index) => {
                const price =
                  Number(item.price);

                const quantity =
                  Number(item.quantity);

                const safePrice =
                  Number.isFinite(price)
                    ? price
                    : 0;

                const safeQuantity =
                  Number.isFinite(
                    quantity
                  ) &&
                  quantity > 0
                    ? quantity
                    : 0;

                const productId =
                  typeof item.product ===
                  "string"
                    ? item.product
                    : "";

                const productHref =
                  productId
                    ? `/products/${productId}`
                    : "/collections";

                return (
                  <div
                    key={`${productId || "product"}-${index}`}
                    className="flex gap-5 border-b pb-6 last:border-0 last:pb-0"
                  >
                    <Link
                      href={productHref}
                      className="group relative h-28 w-24 shrink-0 overflow-hidden rounded-lg border bg-gray-50"
                      aria-label={`View ${
                        item.name ||
                        "product"
                      }`}
                    >
                      <img
                        src={getImageUrl(
                          item.image
                        )}
                        alt={
                          item.name ||
                          "Product"
                        }
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        onError={(
                          event
                        ) => {
                          event.currentTarget.src =
                            "/images/products/default.jpg";
                        }}
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={productHref}
                        className="group block"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 transition group-hover:text-[#7A1F2B]">
                          {item.name ||
                            "Product"}
                        </h3>

                        <p className="mt-2 text-gray-600">
                          Quantity:{" "}
                          {safeQuantity}
                        </p>

                        <p className="mt-2 font-bold text-[#C9A227]">
                          {formatPrice(
                            safePrice
                          )}
                        </p>

                        <p className="mt-2 text-gray-700">
                          Item Total:{" "}
                          <strong>
                            {formatPrice(
                              safePrice *
                                safeQuantity
                            )}
                          </strong>
                        </p>
                      </Link>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        {productId && (
                          <button
                            type="button"
                            onClick={() => {
                              addToCart({
                                _id: productId,
                                name: item.name || "Silk Saree",
                                price: safePrice,
                                image: getImageUrl(item.image),
                                quantity: 1,
                              });
                              toast.success("Added to your Shopping Bag!");
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#7A1020] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#5E0A17] cursor-pointer shadow-xs"
                          >
                            Buy Again
                          </button>
                        )}

                        {order.orderStatus ===
                          "Delivered" &&
                          productId && (
                            <Link
                              href={`${productHref}#reviews`}
                              className="inline-flex rounded-lg border border-[#7A1F2B] px-4 py-2 text-xs sm:text-sm font-semibold text-[#7A1F2B] transition hover:bg-[#7A1F2B] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2"
                            >
                              Review Product
                            </Link>
                          )}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <p className="text-gray-500">
            No product information
            available.
          </p>
        )}
      </section>

      {/* =================================
          Delivery Address
      ================================= */}

      <section className="mt-8 rounded-2xl border bg-white p-4 sm:p-6 shadow-sm">
        <h2 className="mb-5 text-2xl font-bold text-[#7A1F2B]">
          Delivery Address
        </h2>

        {address ? (
          <div className="space-y-2 text-gray-700">
            <p className="font-semibold text-gray-900">
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
              Pincode:{" "}
              {address.pincode}
            </p>

            <p>
              {address.country}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">
            Delivery address information
            is unavailable.
          </p>
        )}
      </section>

      {/* =================================
          Payment Details
      ================================= */}

      <section className="mt-8 rounded-2xl border bg-white p-4 sm:p-6 shadow-sm">
        <h2 className="mb-5 text-2xl font-bold text-[#7A1F2B]">
          Payment Details
        </h2>

        <div className="space-y-4">
          <div className="flex flex-wrap justify-between gap-3">
            <span className="text-gray-500">
              Payment Method
            </span>

            <span className="font-semibold text-gray-900">
              {order.paymentMethod === "COD"
                ? "Cash on Delivery (COD)"
                : order.paymentMethod === "UPI"
                ? "UPI (Google Pay / PhonePe / QR)"
                : order.paymentMethod === "Card"
                ? "Credit / Debit Card"
                : order.paymentMethod === "NetBanking"
                ? "Net Banking"
                : order.paymentMethod === "Wallet"
                ? "Digital Wallet"
                : "Online Payment (Razorpay)"}
            </span>
          </div>

          <div className="flex flex-wrap justify-between gap-3">
            <span className="text-gray-500">
              Payment Status
            </span>

            <span
              className={`rounded-full px-4 py-1 text-sm font-semibold ${getPaymentStatusClass(
                order.paymentStatus
              )}`}
            >
              {order.paymentStatus ||
                "Pending"}
            </span>
          </div>

          {canRetryPayment && (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm font-medium text-yellow-800">
                Your Razorpay payment is still pending. You can retry the payment without creating a new order.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =================================
          Price Details
      ================================= */}

      <section className="mt-8 rounded-2xl border bg-white p-4 sm:p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-[#7A1F2B]">
          Price Details
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between gap-4">
            <span className="text-gray-600">
              Subtotal
            </span>

            <span className="font-medium">
              {formatPrice(subtotal)}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-600">
              Shipping
            </span>

            <span className="font-medium">
              {shippingCharge === 0
                ? "FREE"
                : formatPrice(
                    shippingCharge
                  )}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-600">
              GST
            </span>

            <span className="font-medium">
              {formatPrice(tax)}
            </span>
          </div>

          {order.couponCode && (
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">
                Coupon
              </span>

              <span className="font-semibold text-green-600">
                {order.couponCode}
              </span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between gap-4 text-green-600">
              <span>
                Discount
              </span>

              <span>
                -{" "}
                {formatPrice(
                  discount
                )}
              </span>
            </div>
          )}

          <hr />

          <div className="flex justify-between gap-4 text-xl font-bold sm:text-2xl">
            <span>
              Total Amount
            </span>

            <span className="text-[#C9A227]">
              {formatPrice(
                totalAmount
              )}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}