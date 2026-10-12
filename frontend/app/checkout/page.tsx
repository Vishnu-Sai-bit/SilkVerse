"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

import {
  addAddress,
  applyCoupon,
  cancelOrder,
  createOrder,
  createPaymentOrder,
  getAddresses,
  verifyPayment,
} from "@/services/api";

import { Address } from "@/types/address";
import AddressForm from "@/components/address/AddressForm";
import {
  UpiLogo,
  GooglePayLogo,
  PhonePeLogo,
  PaytmLogo,
  RupayLogo,
  VisaLogo,
  MastercardLogo,
  RazorpayLogo,
  NetBankingLogo,
  CodBadge,
} from "@/components/common/TrustLogos";
import {
  QrCode,
  CreditCard,
  Building2,
  Wallet as WalletIcon,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Smartphone,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";

// ==========================================
// Razorpay Types
// ==========================================

type RazorpayPaymentResponse = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

type RazorpayFailureResponse = {
  error?: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: {
      order_id?: string;
      payment_id?: string;
    };
  };
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
  modal: {
    ondismiss: () => void;
  };
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
    method?: "upi" | "card" | "netbanking" | "wallet";
    vpa?: string;
    bank?: string;
    wallet?: string;
  };
  theme: {
    color: string;
  };
  modal_options?: {
    confirm_close?: boolean;
  };
};

type RazorpayInstance = {
  open: () => void;
  on: (
    event: string,
    callback: (
      response: RazorpayFailureResponse
    ) => void
  ) => void;
};

declare global {
  interface Window {
    Razorpay?: new (
      options: RazorpayOptions
    ) => RazorpayInstance;
  }
}

// ==========================================
// Types
// ==========================================

export type PaymentMethodType =
  | "UPI"
  | "Card"
  | "NetBanking"
  | "Wallet"
  | "COD";

const POPULAR_BANKS = [
  { code: "HDFC", name: "HDFC Bank", short: "HDFC" },
  { code: "SBIN", name: "State Bank of India", short: "SBI" },
  { code: "ICIC", name: "ICICI Bank", short: "ICICI" },
  { code: "UTIB", name: "Axis Bank", short: "Axis" },
  { code: "KKBK", name: "Kotak Mahindra Bank", short: "Kotak" },
  { code: "PUNB_R", name: "Punjab National Bank", short: "PNB" },
];

const ALL_BANKS = [
  { code: "BARB_R", name: "Bank of Baroda" },
  { code: "CNRB", name: "Canara Bank" },
  { code: "UBIN", name: "Union Bank of India" },
  { code: "INDB", name: "IndusInd Bank" },
  { code: "IBKL", name: "IDBI Bank" },
  { code: "FDRL", name: "Federal Bank" },
  { code: "YESB", name: "Yes Bank" },
  { code: "BKID", name: "Bank of India" },
  { code: "IDFB", name: "IDFC FIRST Bank" },
  { code: "CBIN", name: "Central Bank of India" },
  { code: "IOBA", name: "Indian Overseas Bank" },
  { code: "RATN", name: "RBL Bank" },
  { code: "SCBL", name: "Standard Chartered Bank" },
  { code: "SIBL", name: "South Indian Bank" },
  { code: "KARB", name: "Karnataka Bank" },
  { code: "KVBL", name: "Karur Vysya Bank" },
  { code: "UCBA", name: "UCO Bank" },
];

const WALLETS = [
  { id: "paytm", name: "Paytm Wallet", desc: "Instant checkout with linked Paytm" },
  { id: "phonepe", name: "PhonePe Wallet", desc: "Use PhonePe wallet balance" },
  { id: "mobikwik", name: "MobiKwik", desc: "SuperCash savings & 1-tap OTP" },
  { id: "airtelmoney", name: "Airtel Money", desc: "Airtel Payments Bank balance" },
];

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatCardExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

function getCardBrand(num: string) {
  const clean = num.replace(/\s+/g, "");
  if (/^4/.test(clean)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(clean)) return "Mastercard";
  if (/^(60|65|81|82)/.test(clean)) return "RuPay";
  return null;
}

type AppliedCoupon = {
  _id?: string;
  code: string;
  discountType: "Percentage" | "Flat";
  discountValue: number;
  minimumOrder: number;
  maxDiscount?: number;
  expiryDate?: string;
  active?: boolean;
  discount?: number;
};

const AVAILABLE_CHECKOUT_COUPONS = [
  {
    code: "SILK10",
    label: "10% OFF",
    desc: "10% instant discount up to ₹2,500 (Min ₹1,000)",
    minOrder: 1000,
  },
  {
    code: "FESTIVE15",
    label: "15% OFF",
    desc: "15% festive discount up to ₹3,500 (Min ₹5,000)",
    minOrder: 5000,
  },
  {
    code: "ROYAL20",
    label: "20% OFF",
    desc: "20% bridal discount up to ₹5,000 (Min ₹10,000)",
    minOrder: 10000,
  },
  {
    code: "WELCOME500",
    label: "₹500 OFF",
    desc: "Flat ₹500 off on orders above ₹3,999",
    minOrder: 3999,
  },
];

function getImageUrl(image?: string) {
  const backendUrl = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"
  ).replace(/\/+$/, "");

  if (!image) {
    return "/images/products/default.jpg";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
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

// ==========================================
// Helpers
// ==========================================

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);

function isSessionError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message =
    error.message.toLowerCase();

  return (
    message.includes("unauthorized") ||
    message.includes("authentication") ||
    message.includes("token") ||
    message.includes("session") ||
    message.includes("jwt") ||
    message.includes("login")
  );
}

// ==========================================
// Checkout Page
// ==========================================

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();

  // ========================================
  // Cart
  // ========================================

  const {
    cart,
    subtotal,
    shipping,
    tax,
    finalAmount: cartFinalAmount,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  // ========================================
  // Address State
  // ========================================

  const [addresses, setAddresses] =
    useState<Address[]>([]);

  const [selectedAddress, setSelectedAddress] =
    useState("");

  const [showAddAddressForm, setShowAddAddressForm] =
    useState(false);

  // ========================================
  // Loading State
  // ========================================

  const [loading, setLoading] =
    useState(true);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [applyingCoupon, setApplyingCoupon] =
    useState(false);

  // ========================================
  // Payment
  // ========================================

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodType>("UPI");

  // Payment Sub-options State
  const [upiOption, setUpiOption] = useState<"qr" | "gpay" | "phonepe" | "paytm" | "id">("qr");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [selectedBank, setSelectedBank] = useState<string>("HDFC");
  const [selectedWallet, setSelectedWallet] = useState<string>("paytm");

  // ========================================
  // Coupon
  // ========================================

  const [couponCode, setCouponCode] =
    useState("");

  const [discount, setDiscount] =
    useState(0);

  const [finalAmount, setFinalAmount] =
    useState(cartFinalAmount);

  const [appliedCoupon, setAppliedCoupon] =
    useState<AppliedCoupon | null>(null);

  // ========================================
  // Redirect Empty Cart
  // ========================================

  useEffect(() => {
    if (cart.length === 0) {
      router.replace("/cart");
    }
  }, [cart.length, router]);

  // ========================================
  // Fetch Addresses
  // ========================================

  const loadAddresses = useCallback(
    async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem(
            "silkverse-token"
          );

        if (!token) {
          router.replace(
            "/login?redirect=/checkout"
          );
          return;
        }

        const data =
          await getAddresses(token);

        const userAddresses: Address[] =
          Array.isArray(data)
            ? data
            : [];

        setAddresses(userAddresses);

        const defaultAddress =
          userAddresses.find(
            (address) =>
              address.isDefault
          ) ??
          userAddresses[0];

        if (defaultAddress?._id) {
          setSelectedAddress(
            defaultAddress._id
          );
        } else {
          setSelectedAddress("");
        }
      } catch (error: unknown) {
        if (isSessionError(error)) {
          localStorage.removeItem(
            "silkverse-token"
          );

          toast.error(
            "Your session has expired. Please login again."
          );

          router.replace(
            "/login?redirect=/checkout"
          );

          return;
        }

        setAddresses([]);
        setSelectedAddress("");

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load your addresses."
        );
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  // ========================================
  // Keep Coupon Total In Sync
  // ========================================

  useEffect(() => {
    if (!appliedCoupon) {
      setFinalAmount(
        cartFinalAmount
      );

      setDiscount(0);
    }
  }, [
    cartFinalAmount,
    appliedCoupon,
  ]);

  // ========================================
  // Reset Coupon When Cart Changes
  // ========================================

  useEffect(() => {
    if (!appliedCoupon) {
      return;
    }

    setAppliedCoupon(null);
    setCouponCode("");
    setDiscount(0);
    setFinalAmount(
      cartFinalAmount
    );
  }, [
    subtotal,
    cartFinalAmount,
  ]);

  // ========================================
  // Apply Coupon
  // ========================================

  async function handleApplyCoupon(overrideCode?: string) {
    const codeToUse = typeof overrideCode === "string" ? overrideCode : couponCode;
    const normalizedCode =
      (codeToUse ?? "")
        .trim()
        .toUpperCase();

    if (!normalizedCode) {
      toast.error(
        "Please enter a coupon code."
      );
      return;
    }

    if (
      applyingCoupon ||
      placingOrder
    ) {
      return;
    }

    if (
      !Number.isFinite(subtotal) ||
      subtotal <= 0
    ) {
      toast.error(
        "Your cart total is invalid."
      );
      return;
    }

    try {
      setApplyingCoupon(true);

      const token =
        localStorage.getItem(
          "silkverse-token"
        );

      if (!token) {
        router.replace(
          "/login?redirect=/checkout"
        );
        return;
      }

      const coupon =
        await applyCoupon(
          token,
          normalizedCode,
          subtotal
        );

      if (!coupon) {
        throw new Error(
          "Invalid coupon response."
        );
      }

      const couponDiscount =
        Math.max(
          Number(
            coupon.discount || 0
          ),
          0
        );

      const newFinalAmount =
        Math.max(
          cartFinalAmount -
            couponDiscount,
          0
        );

      setDiscount(
        couponDiscount
      );

      setFinalAmount(
        newFinalAmount
      );

      const safeCoupon: AppliedCoupon =
        {
          ...coupon,
          code:
            coupon.code ||
            normalizedCode,
        };

      setAppliedCoupon(
        safeCoupon
      );

      setCouponCode(
        normalizedCode
      );

      toast.success(
        `Coupon ${normalizedCode} applied successfully.`
      );
    } catch (error: unknown) {
      if (isSessionError(error)) {
        localStorage.removeItem(
          "silkverse-token"
        );

        toast.error(
          "Your session has expired. Please login again."
        );

        router.replace(
          "/login?redirect=/checkout"
        );

        return;
      }

      setDiscount(0);

      setFinalAmount(
        cartFinalAmount
      );

      setAppliedCoupon(null);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to apply coupon."
      );
    } finally {
      setApplyingCoupon(false);
    }
  }

  // ========================================
  // Remove Coupon
  // ========================================

  function handleRemoveCoupon() {
    if (
      placingOrder ||
      applyingCoupon
    ) {
      return;
    }

    setAppliedCoupon(null);
    setCouponCode("");
    setDiscount(0);

    setFinalAmount(
      cartFinalAmount
    );

    toast.info(
      "Coupon removed."
    );
  }

  // ========================================
  // Load Razorpay SDK
  // ========================================

  function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve(false);
        return;
      }

      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const scriptSrc = "https://checkout.razorpay.com/v1/checkout.js";
      const existingScript = document.querySelector<HTMLScriptElement>(
        `script[src="${scriptSrc}"]`
      );

      if (existingScript) {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        let checks = 0;
        const interval = setInterval(() => {
          checks++;
          if (window.Razorpay) {
            clearInterval(interval);
            resolve(true);
          } else if (checks > 25) {
            clearInterval(interval);
            resolve(Boolean(window.Razorpay));
          }
        }, 100);

        existingScript.addEventListener(
          "load",
          () => {
            clearInterval(interval);
            resolve(true);
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

      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  }

  // ========================================
  // Cancel Unstarted Payment Order
  // ========================================

  async function cancelUnstartedOrder(
    token: string,
    orderId: string
  ) {
    try {
      await cancelOrder(
        token,
        orderId
      );
    } catch {
      // Best-effort cleanup.
    }
  }

  // ========================================
  // Place Order
  // ========================================

  async function placeOrder() {
    if (
      placingOrder ||
      applyingCoupon
    ) {
      return;
    }

    // ======================================
    // Validate Address
    // ======================================

    if (!selectedAddress) {
      toast.error(
        "Please select a delivery address."
      );
      return;
    }

    const selectedAddressExists =
      addresses.some(
        (address) =>
          address._id ===
          selectedAddress
      );

    if (!selectedAddressExists) {
      toast.error(
        "The selected address is no longer available. Please select another address."
      );

      setSelectedAddress("");
      return;
    }

    // ======================================
    // Validate Cart
    // ======================================

    if (cart.length === 0) {
      toast.error(
        "Your cart is empty."
      );

      router.replace("/cart");
      return;
    }

    // ======================================
    // Validate Amount
    // ======================================

    if (
      !Number.isFinite(subtotal) ||
      subtotal <= 0 ||
      !Number.isFinite(finalAmount) ||
      finalAmount <= 0
    ) {
      toast.error(
        "Unable to calculate the order total. Please refresh and try again."
      );

      return;
    }

    try {
      setPlacingOrder(true);

      // ====================================
      // Authentication
      // ====================================

      const token =
        localStorage.getItem(
          "silkverse-token"
        );

      if (!token) {
        router.replace(
          "/login?redirect=/checkout"
        );
        return;
      }

      // ====================================
      // Razorpay Pre-check
      // ====================================

      const razorpayKey =
        process.env
          .NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (
        paymentMethod !==
        "COD"
      ) {
        if (!razorpayKey) {
          throw new Error(
            "Razorpay key is not configured."
          );
        }

        const razorpayLoaded =
          await loadRazorpayScript();

        if (!razorpayLoaded) {
          throw new Error(
            "Unable to load Razorpay SDK. Please check your internet connection."
          );
        }

        if (!window.Razorpay) {
          throw new Error(
            "Razorpay SDK is not loaded."
          );
        }
      }

      // ====================================
      // Prepare Items
      // ====================================

      const items = cart.map(
        (item) => ({
          product: item._id,
          quantity:
            Number(item.quantity) || 0,
        })
      );

      // ====================================
      // Prepare Order Data
      // ====================================

      const orderPayload = {
        items,
        address: selectedAddress,
        paymentMethod,
        ...(appliedCoupon?.code
          ? {
              couponCode:
                appliedCoupon.code,
            }
          : {}),
      };

      // ====================================
      // Create Database Order
      // ====================================

      const order =
        await createOrder(
          token,
          orderPayload
        );

      if (!order?._id) {
        throw new Error(
          "Invalid order response."
        );
      }

      // ====================================
      // COD
      // ====================================

      if (
        paymentMethod ===
        "COD"
      ) {
        clearCart();

        toast.success(
          "Order placed successfully."
        );

        router.push(
          `/orders/${order._id}`
        );

        return;
      }

      // ====================================
      // Razorpay Payment Order
      // ====================================

      let paymentResult;

      try {
        paymentResult = await createPaymentOrder(
          token,
          order._id
        );
      } catch (paymentOrderError) {
        /*
        * Do not immediately cancel the database order here.
        *
        * createPaymentOrder() performs Razorpay-side recovery
        * checks. If that check fails because of a temporary
        * network/API problem, cancelling the order immediately
        * could make a legitimate payment harder to recover.
        *
        * Keep the order pending so it can be retried safely
        * from the order page.
        */
        throw paymentOrderError;
      }

      // ====================================
      // Validate Payment Response
      // ====================================

      if (
        !paymentResult?.order
      ) {
        await cancelUnstartedOrder(
          token,
          order._id
        );

        throw new Error(
          "Unable to create the payment order."
        );
      }

      // ====================================
      // Payment Recovery
      // ====================================
      //
      // The payment may already have been
      // captured by Razorpay even if the
      // frontend did not receive the normal
      // verification response.
      //
      // In that case, NEVER open Razorpay
      // again. The backend has already
      // confirmed the order.
      // ====================================

      if (
        paymentResult.paymentRecovered
      ) {
        clearCart();

        toast.success(
          "Payment recovered successfully. Your order is confirmed."
        );

        router.push(
          `/order-success?orderId=${order._id}`
        );

        return;
      }

      // ====================================
      // Extract Razorpay Order
      // ====================================

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

      // ====================================
      // Validate Razorpay Order
      // ====================================

      if (
        !razorpayOrderId ||
        !Number.isFinite(
          razorpayAmount
        ) ||
        razorpayAmount <= 0
      ) {
        await cancelUnstartedOrder(
          token,
          order._id
        );

        throw new Error(
          "Invalid Razorpay order details."
        );
      }

      // ====================================
      // Razorpay Options
      // ====================================

      const options: RazorpayOptions =
        {
          key: razorpayKey as string,

          amount:
            razorpayAmount,

          currency:
            razorpayCurrency,

          name: "SilkVerse",

          description:
            `Payment for Order ${order._id}`,

          order_id:
            razorpayOrderId,

          // ==================================
          // Payment Handler
          // ==================================

          handler:
            async function (
              response
            ) {
              try {
                // =================================
                // Validate Razorpay Response
                // =================================

                if (
                  !response?.razorpay_order_id ||
                  !response?.razorpay_payment_id ||
                  !response?.razorpay_signature
                ) {
                  throw new Error(
                    "Invalid Razorpay payment response."
                  );
                }

                // =================================
                // Validate Razorpay Order ID
                // =================================

                if (
                  response.razorpay_order_id !==
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
                      response.razorpay_order_id,

                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_signature:
                      response.razorpay_signature,

                    orderId:
                      order._id,
                  }
                );

                // =================================
                // Payment Verified
                // =================================

                clearCart();

                toast.success(
                  "Payment successful!"
                );

                router.push(
                  `/order-success?orderId=${order._id}`
                );
              } catch (
                error: unknown
              ) {
                if (
                  isSessionError(
                    error
                  )
                ) {
                  localStorage.removeItem(
                    "silkverse-token"
                  );

                  setPlacingOrder(
                    false
                  );

                  toast.error(
                    "Your session has expired. Please login again."
                  );

                  router.replace(
                    `/login?redirect=/orders/${order._id}`
                  );

                  return;
                }

                setPlacingOrder(false);

                toast.error(
                  error instanceof Error
                    ? error.message
                    : "Payment verification failed. If money was deducted, please contact support."
                );
              }
            },

          // ==================================
          // Razorpay Modal
          // ==================================

          modal: {
            ondismiss:
              function () {
                setPlacingOrder(false);

                toast.info(
                  "Payment was cancelled. Your order remains pending. You can retry the payment from your order."
                );
              },
          },

          // ==================================
          // Prefill
          // ==================================

          prefill: {
            name:
              addresses.find((a) => a._id === selectedAddress)?.fullName ||
              user?.name ||
              "",
            email: user?.email || "",
            contact:
              addresses.find((a) => a._id === selectedAddress)?.mobile ||
              user?.mobile ||
              "",
            method:
              paymentMethod === "UPI"
                ? "upi"
                : paymentMethod === "Card"
                ? "card"
                : paymentMethod === "NetBanking"
                ? "netbanking"
                : paymentMethod === "Wallet"
                ? "wallet"
                : undefined,
            ...(paymentMethod === "UPI" && upiId.trim() ? { vpa: upiId.trim() } : {}),
            ...(paymentMethod === "NetBanking" && selectedBank ? { bank: selectedBank } : {}),
            ...(paymentMethod === "Wallet" && selectedWallet ? { wallet: selectedWallet } : {}),
          },

          // ==================================
          // Theme
          // ==================================

          theme: {
            color: "#7A1F2B",
          },

          // ==================================
          // Prevent Escape Accidental Close
          // ==================================

          modal_options: {
            confirm_close: true,
          },
        };

      // ====================================
      // Create Razorpay Instance
      // ====================================

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay SDK is not loaded."
        );
      }

      const razorpay =
        new window.Razorpay(
          options
        );

      // ====================================
      // Payment Failed Event
      // ====================================

      razorpay.on(
        "payment.failed",
        function (
          response
        ) {
          setPlacingOrder(false);

          toast.error(
            response?.error
              ?.description ||
              "Payment failed. Please try again."
          );
        }
      );

      // ====================================
      // Open Razorpay
      // ====================================

      razorpay.open();
    } catch (
      error: unknown
    ) {
      setPlacingOrder(false);

      if (
        isSessionError(error)
      ) {
        localStorage.removeItem(
          "silkverse-token"
        );

        toast.error(
          "Your session has expired. Please login again."
        );

        router.replace(
          "/login?redirect=/checkout"
        );

        return;
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to place order."
      );
    }
  }

  // ========================================
  // Loading
  // ========================================

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#7A1F2B]" />

            <p className="mt-4 font-medium text-gray-500">
              Loading checkout...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ========================================
  // Savings & Price Breakdown (Flipkart Style)
  // ========================================

  const totalItemsCount = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const totalSavings =
    discount +
    (shipping === 0 && subtotal > 0 ? 149 : 0);

  // ========================================
  // Page
  // ========================================

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      {/* 5-Step Stepper (Design Book Page 08) */}
      <div className="mb-8 rounded-2xl bg-white p-4 sm:p-5 border border-stone-200/90 shadow-2xs">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Link href="/cart" className="flex items-center gap-1.5 group">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37] text-xs font-bold text-white shadow-2xs">
              ✓
            </span>
            <span className="text-[11px] sm:text-sm font-semibold text-stone-700 group-hover:text-[#6D001A]">1. Bag</span>
          </Link>
          <div className="h-0.5 flex-1 mx-1 sm:mx-3 bg-[#D4AF37]" />
          <div className="flex items-center gap-1.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6D001A] text-xs font-bold text-white shadow-xs">
              2
            </span>
            <span className="text-[11px] sm:text-sm font-bold text-[#6D001A]">2. Address</span>
          </div>
          <div className="h-0.5 flex-1 mx-1 sm:mx-3 bg-stone-200" />
          <div className="flex items-center gap-1.5 text-stone-400">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-500">
              3
            </span>
            <span className="text-[11px] sm:text-sm font-medium hidden sm:inline">3. Shipping</span>
          </div>
          <div className="h-0.5 flex-1 mx-1 sm:mx-3 bg-stone-200" />
          <div className="flex items-center gap-1.5 text-stone-400">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-500">
              4
            </span>
            <span className="text-[11px] sm:text-sm font-medium hidden sm:inline">4. Payment</span>
          </div>
          <div className="h-0.5 flex-1 mx-1 sm:mx-3 bg-stone-200" />
          <div className="flex items-center gap-1.5 text-stone-400">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-500">
              5
            </span>
            <span className="text-[11px] sm:text-sm font-medium hidden sm:inline">5. Confirmation</span>
          </div>
        </div>
      </div>

      {/* ==================================
          Heading
      ================================== */}

      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
          SilkVerse Secure Checkout
        </p>

        <h1 className="font-serif text-3xl font-bold text-[#2D2A26] sm:text-4xl">
          Complete Your Order
        </h1>

        <p className="mt-1.5 text-xs sm:text-sm text-stone-500">
          Review your delivery details and complete your order securely.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
        {/* ==================================
            LEFT SECTION
        ================================== */}

        <div className="min-w-0 space-y-8 lg:col-span-2">
          {/* ==================================
              Delivery Address
          ================================== */}

          <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">
                  Delivery Address
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Choose where you want your saree delivered.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={placingOrder}
                  onClick={() => setShowAddAddressForm((prev) => !prev)}
                  className="rounded-lg border border-[#7A1F2B] bg-[#7A1F2B] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#5B1620] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  {showAddAddressForm ? "Close Form" : "+ Add New Address"}
                </button>

                <button
                  type="button"
                  disabled={placingOrder}
                  onClick={() => router.push("/account/addresses")}
                  className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-[#7A1F2B] transition hover:bg-[#FFF9F5] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  Manage All
                </button>
              </div>
            </div>

            {showAddAddressForm && (
              <div className="mb-6">
                <AddressForm
                  initialData={null}
                  onCancel={() => setShowAddAddressForm(false)}
                  onSubmit={async (newAddrData) => {
                    const token = localStorage.getItem("silkverse-token");
                    if (!token) {
                      router.replace("/login?redirect=/checkout");
                      return;
                    }
                    const created = await addAddress(token, newAddrData);
                    await loadAddresses();
                    if (created?._id) {
                      setSelectedAddress(created._id);
                    }
                    setShowAddAddressForm(false);
                    toast.success("Delivery address added & selected!");
                  }}
                />
              </div>
            )}

            {addresses.length === 0 && !showAddAddressForm ? (
              <div className="rounded-xl border border-dashed p-8 text-center">
                <p className="font-medium text-gray-700">
                  No delivery address found.
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Add an address right here before placing your order.
                </p>

                <button
                  type="button"
                  disabled={placingOrder}
                  onClick={() => setShowAddAddressForm(true)}
                  className="mt-5 rounded-lg bg-[#7A1F2B] px-6 py-3 font-medium text-white transition hover:bg-[#5B1620] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  + Add Delivery Address
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map(
                  (address) => {
                    const isSelected =
                      selectedAddress ===
                      address._id;

                    return (
                      <label
                        key={
                          address._id
                        }
                        className={`block cursor-pointer rounded-xl border p-4 transition sm:p-5 ${
                          isSelected
                            ? "border-[#7A1F2B] bg-[#FFF9F5] shadow-sm"
                            : "border-gray-200 hover:border-[#C9A227]"
                        }`}
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name="address"
                            className="mr-4 mt-1 h-4 w-4 accent-[#7A1F2B]"
                            checked={
                              isSelected
                            }
                            onChange={() =>
                              setSelectedAddress(
                                address._id
                              )
                            }
                            disabled={
                              placingOrder
                            }
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-semibold sm:text-lg">
                                {
                                  address.fullName
                                }
                              </h3>

                              {address.isDefault && (
                                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                                  Default
                                </span>
                              )}

                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                                {
                                  address.addressType
                                }
                              </span>
                            </div>

                            <p className="mt-2 text-sm font-medium text-gray-700">
                              {
                                address.mobile
                              }
                            </p>

                            <div className="mt-2 text-sm leading-6 text-gray-600">
                              <p>
                                {
                                  address.houseNumber
                                }
                              </p>

                              <p>
                                {
                                  address.area
                                }
                              </p>

                              {address.landmark && (
                                <p>
                                  <span className="font-medium">
                                    Landmark:
                                  </span>{" "}
                                  {
                                    address.landmark
                                  }
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
                                {
                                  address.pincode
                                }
                              </p>

                              <p>
                                {
                                  address.country
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </label>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* ==================================
              Payment Method
          ================================== */}

          <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="text-xl font-bold sm:text-2xl">
                Payment Method
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select your preferred payment option.
              </p>
            </div>

            <div className="space-y-4">
              {/* ==================================
                  1. UPI (Instant & Free)
              ================================== */}
              <div
                className={`overflow-hidden rounded-2xl border transition-all ${
                  paymentMethod === "UPI"
                    ? "border-[#7A1F2B] bg-[#FFFBF8] shadow-sm ring-1 ring-[#7A1F2B]"
                    : "border-gray-200 bg-white hover:border-[#C9A227]"
                }`}
              >
                <label className="flex cursor-pointer items-start gap-3.5 p-4 sm:p-5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "UPI"}
                    onChange={() => setPaymentMethod("UPI")}
                    disabled={placingOrder}
                    className="mt-1 h-4 w-4 accent-[#7A1F2B] cursor-pointer shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-base sm:text-lg">
                          UPI
                        </span>
                        <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                          (Google Pay, PhonePe, Paytm, BHIM &amp; QR)
                        </span>
                      </div>
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                        ⚡ 0% Fee • Instant
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      Pay instantly via any UPI app or scan the dynamic QR code for quick approval.
                    </p>

                    {/* Quick App Badges */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-100">
                      <div className="flex h-6 items-center rounded border border-gray-200 bg-white px-1 shadow-2xs">
                        <UpiLogo className="h-4 w-auto" />
                      </div>
                      <div className="flex h-6 items-center rounded border border-gray-200 bg-white px-1 shadow-2xs">
                        <GooglePayLogo className="h-4 w-auto" />
                      </div>
                      <div className="flex h-6 items-center rounded border border-gray-200 bg-white px-1 shadow-2xs">
                        <PhonePeLogo className="h-4 w-auto" />
                      </div>
                      <div className="flex h-6 items-center rounded border border-gray-200 bg-white px-1 shadow-2xs">
                        <PaytmLogo className="h-4 w-auto" />
                      </div>
                      <span className="ml-auto text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Verified NPCI Network
                      </span>
                    </div>
                  </div>
                </label>

                {/* UPI Sub-option Accordion */}
                {paymentMethod === "UPI" && (
                  <div className="border-t border-[#7A1F2B]/10 bg-white px-4 py-4 sm:px-6 sm:py-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">
                      Select UPI Mode
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => setUpiOption("qr")}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold transition cursor-pointer ${
                          upiOption === "qr"
                            ? "border-[#7A1F2B] bg-[#7A1F2B]/5 text-[#7A1F2B] ring-1 ring-[#7A1F2B]"
                            : "border-gray-200 bg-gray-50/60 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <QrCode className="h-4 w-4" />
                        <span>Scan QR Code</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUpiOption("gpay")}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold transition cursor-pointer ${
                          upiOption === "gpay"
                            ? "border-[#7A1F2B] bg-[#7A1F2B]/5 text-[#7A1F2B] ring-1 ring-[#7A1F2B]"
                            : "border-gray-200 bg-gray-50/60 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <GooglePayLogo className="h-3.5 w-auto" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setUpiOption("phonepe")}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold transition cursor-pointer ${
                          upiOption === "phonepe"
                            ? "border-[#7A1F2B] bg-[#7A1F2B]/5 text-[#7A1F2B] ring-1 ring-[#7A1F2B]"
                            : "border-gray-200 bg-gray-50/60 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <PhonePeLogo className="h-3.5 w-auto" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setUpiOption("id")}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold transition cursor-pointer ${
                          upiOption === "id"
                            ? "border-[#7A1F2B] bg-[#7A1F2B]/5 text-[#7A1F2B] ring-1 ring-[#7A1F2B]"
                            : "border-gray-200 bg-gray-50/60 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span>@ UPI ID</span>
                      </button>
                    </div>

                    {/* QR Details */}
                    {upiOption === "qr" && (
                      <div className="flex items-center gap-3.5 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 p-3.5 text-xs text-emerald-900">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                          <QrCode className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-bold">Instant UPI QR on Checkout</p>
                          <p className="text-[11px] text-emerald-700 mt-0.5">
                            Click &quot;Pay via UPI&quot; below to generate a secure dynamic QR. Scan and pay directly using any app (Google Pay, PhonePe, Paytm, BHIM, CRED).
                          </p>
                        </div>
                      </div>
                    )}

                    {/* App Direct Notification */}
                    {(upiOption === "gpay" || upiOption === "phonepe" || upiOption === "paytm") && (
                      <div className="flex items-center gap-3.5 rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 text-xs text-blue-900">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
                          <Smartphone className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold">
                            Direct {upiOption === "gpay" ? "Google Pay" : upiOption === "phonepe" ? "PhonePe" : "Paytm"} Launch
                          </p>
                          <p className="text-[11px] text-blue-700 mt-0.5">
                            You will be redirected to approve the payment request of {formatPrice(finalAmount)} inside your {upiOption === "gpay" ? "Google Pay" : upiOption === "phonepe" ? "PhonePe" : "Paytm"} app.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* UPI ID Input */}
                    {upiOption === "id" && (
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-700">
                          Enter your UPI ID / VPA
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="username@okhdfcbank or mobile@paytm"
                          className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-base sm:text-xs text-gray-900 outline-none transition focus:border-[#7A1F2B] focus:ring-1 focus:ring-[#7A1F2B]"
                        />
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-gray-400">Quick handles:</span>
                          {["@oksbi", "@okhdfcbank", "@okaxis", "@paytm", "@ybl"].map((suffix) => (
                            <button
                              key={suffix}
                              type="button"
                              onClick={() => {
                                const base = upiId.split("@")[0] || "";
                                setUpiId(`${base}${suffix}`);
                              }}
                              className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                            >
                              {suffix}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ==================================
                  2. Credit / Debit Cards
              ================================== */}
              <div
                className={`overflow-hidden rounded-2xl border transition-all ${
                  paymentMethod === "Card"
                    ? "border-[#7A1F2B] bg-[#FFFBF8] shadow-sm ring-1 ring-[#7A1F2B]"
                    : "border-gray-200 bg-white hover:border-[#C9A227]"
                }`}
              >
                <label className="flex cursor-pointer items-start gap-3.5 p-4 sm:p-5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "Card"}
                    onChange={() => setPaymentMethod("Card")}
                    disabled={placingOrder}
                    className="mt-1 h-4 w-4 accent-[#7A1F2B] cursor-pointer shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-base sm:text-lg">
                          Credit / Debit Cards
                        </span>
                        <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                          (Visa, MasterCard, RuPay, Maestro)
                        </span>
                      </div>
                      <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-blue-800">
                        🔒 3D Secure OTP
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      All domestic and international cards supported. Zero surcharge on RuPay debit cards.
                    </p>

                    {/* Card Logos */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-100">
                      <div className="flex h-6 items-center rounded border border-gray-200 bg-white px-1 shadow-2xs">
                        <VisaLogo className="h-4 w-auto" />
                      </div>
                      <div className="flex h-6 items-center rounded border border-gray-200 bg-white px-1 shadow-2xs">
                        <MastercardLogo className="h-4 w-auto" />
                      </div>
                      <div className="flex h-6 items-center rounded border border-gray-200 bg-white px-1 shadow-2xs">
                        <RupayLogo className="h-4 w-auto" />
                      </div>
                      <span className="ml-auto text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        PCI-DSS Level 1 Encrypted
                      </span>
                    </div>
                  </div>
                </label>

                {/* Card Form */}
                {paymentMethod === "Card" && (
                  <div className="border-t border-[#7A1F2B]/10 bg-white px-4 py-4 sm:px-6 sm:py-5">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
                        Card Information
                      </p>
                      <span className="text-[11px] font-medium text-gray-500">
                        100% RBI Compliant
                      </span>
                    </div>

                    <div className="space-y-3 max-w-md">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            placeholder="4532 •••• •••• 8892"
                            maxLength={19}
                            className="w-full rounded-xl border border-gray-300 pl-3.5 pr-14 py-2.5 text-base sm:text-xs text-gray-900 tracking-wider font-mono outline-none transition focus:border-[#7A1F2B] focus:ring-1 focus:ring-[#7A1F2B]"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            {getCardBrand(cardNumber) === "Visa" && <VisaLogo className="h-3.5 w-auto" />}
                            {getCardBrand(cardNumber) === "Mastercard" && <MastercardLogo className="h-3.5 w-auto" />}
                            {getCardBrand(cardNumber) === "RuPay" && <RupayLogo className="h-3.5 w-auto" />}
                            {!getCardBrand(cardNumber) && <CreditCard className="h-4 w-4 text-gray-400" />}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.toUpperCase())}
                          placeholder="NAME AS PRINTED ON CARD"
                          className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-base sm:text-xs text-gray-900 tracking-wide outline-none transition focus:border-[#7A1F2B] focus:ring-1 focus:ring-[#7A1F2B]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Valid Thru (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
                            placeholder="MM / YY"
                            maxLength={5}
                            className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-base sm:text-xs text-gray-900 font-mono tracking-wider outline-none transition focus:border-[#7A1F2B] focus:ring-1 focus:ring-[#7A1F2B]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            CVV / CVC
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                              placeholder="•••"
                              maxLength={4}
                              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-base sm:text-xs text-gray-900 font-mono tracking-widest outline-none transition focus:border-[#7A1F2B] focus:ring-1 focus:ring-[#7A1F2B]"
                            />
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-[11px] text-gray-500 flex items-center gap-1.5">
                      <Lock className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span>Card details processed securely via Razorpay with bank OTP verification. SilkVerse never stores CVVs.</span>
                    </p>
                  </div>
                )}
              </div>

              {/* ==================================
                  3. Net Banking
              ================================== */}
              <div
                className={`overflow-hidden rounded-2xl border transition-all ${
                  paymentMethod === "NetBanking"
                    ? "border-[#7A1F2B] bg-[#FFFBF8] shadow-sm ring-1 ring-[#7A1F2B]"
                    : "border-gray-200 bg-white hover:border-[#C9A227]"
                }`}
              >
                <label className="flex cursor-pointer items-start gap-3.5 p-4 sm:p-5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "NetBanking"}
                    onChange={() => setPaymentMethod("NetBanking")}
                    disabled={placingOrder}
                    className="mt-1 h-4 w-4 accent-[#7A1F2B] cursor-pointer shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-base sm:text-lg">
                          Net Banking
                        </span>
                        <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                          (All Indian Banks Supported)
                        </span>
                      </div>
                      <span className="rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-purple-800">
                        50+ Indian Banks
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      Direct debit from your bank account via official retail &amp; corporate net banking.
                    </p>

                    <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-gray-100">
                      <div className="flex h-6 items-center rounded border border-gray-200 bg-white px-1 shadow-2xs">
                        <NetBankingLogo className="h-4 w-auto" />
                      </div>
                    </div>
                  </div>
                </label>

                {/* Popular Banks + Dropdown */}
                {paymentMethod === "NetBanking" && (
                  <div className="border-t border-[#7A1F2B]/10 bg-white px-4 py-4 sm:px-6 sm:py-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">
                      Popular Banks
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
                      {POPULAR_BANKS.map((bank) => (
                        <button
                          key={bank.code}
                          type="button"
                          onClick={() => setSelectedBank(bank.code)}
                          className={`flex items-center justify-between rounded-xl border p-2.5 text-xs font-bold transition cursor-pointer text-left ${
                            selectedBank === bank.code
                              ? "border-[#7A1F2B] bg-[#7A1F2B]/5 text-[#7A1F2B] ring-1 ring-[#7A1F2B]"
                              : "border-gray-200 bg-gray-50/50 text-gray-800 hover:bg-gray-100"
                          }`}
                        >
                          <span className="truncate">{bank.name}</span>
                          {selectedBank === bank.code && (
                            <CheckCircle2 className="h-4 w-4 text-[#7A1F2B] shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700">
                        Or Select Other Bank
                      </label>
                      <select
                        value={POPULAR_BANKS.some((b) => b.code === selectedBank) ? "" : selectedBank}
                        onChange={(e) => {
                          if (e.target.value) setSelectedBank(e.target.value);
                        }}
                        className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-base sm:text-xs text-gray-900 outline-none transition focus:border-[#7A1F2B] focus:ring-1 focus:ring-[#7A1F2B] cursor-pointer bg-white"
                      >
                        <option value="">-- Choose From All Other Banks --</option>
                        {ALL_BANKS.map((b) => (
                          <option key={b.code} value={b.code}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <p className="mt-3 text-[11px] text-gray-500">
                      You will be securely redirected to your bank&apos;s net banking login to authorize this transaction.
                    </p>
                  </div>
                )}
              </div>

              {/* ==================================
                  4. Digital Wallets
              ================================== */}
              <div
                className={`overflow-hidden rounded-2xl border transition-all ${
                  paymentMethod === "Wallet"
                    ? "border-[#7A1F2B] bg-[#FFFBF8] shadow-sm ring-1 ring-[#7A1F2B]"
                    : "border-gray-200 bg-white hover:border-[#C9A227]"
                }`}
              >
                <label className="flex cursor-pointer items-start gap-3.5 p-4 sm:p-5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "Wallet"}
                    onChange={() => setPaymentMethod("Wallet")}
                    disabled={placingOrder}
                    className="mt-1 h-4 w-4 accent-[#7A1F2B] cursor-pointer shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-base sm:text-lg">
                          Wallets
                        </span>
                        <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                          (Paytm, PhonePe, MobiKwik, Airtel Money)
                        </span>
                      </div>
                      <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                        1-Click Checkout
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      Pay using your linked digital wallet balance.
                    </p>
                  </div>
                </label>

                {/* Wallet Selection Grid */}
                {paymentMethod === "Wallet" && (
                  <div className="border-t border-[#7A1F2B]/10 bg-white px-4 py-4 sm:px-6 sm:py-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">
                      Select Wallet
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {WALLETS.map((wallet) => (
                        <button
                          key={wallet.id}
                          type="button"
                          onClick={() => setSelectedWallet(wallet.id)}
                          className={`flex items-center justify-between rounded-xl border p-3 text-xs font-bold transition cursor-pointer text-left ${
                            selectedWallet === wallet.id
                              ? "border-[#7A1F2B] bg-[#7A1F2B]/5 text-[#7A1F2B] ring-1 ring-[#7A1F2B]"
                              : "border-gray-200 bg-gray-50/50 text-gray-800 hover:bg-gray-100"
                          }`}
                        >
                          <div>
                            <p className="font-bold">{wallet.name}</p>
                            <p className="text-[10px] text-gray-500 font-normal mt-0.5">{wallet.desc}</p>
                          </div>
                          {selectedWallet === wallet.id && (
                            <CheckCircle2 className="h-4 w-4 text-[#7A1F2B] shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ==================================
                  5. Cash on Delivery (COD)
              ================================== */}
              <div
                className={`overflow-hidden rounded-2xl border transition-all ${
                  paymentMethod === "COD"
                    ? "border-[#7A1F2B] bg-[#FFFBF8] shadow-sm ring-1 ring-[#7A1F2B]"
                    : "border-gray-200 bg-white hover:border-[#C9A227]"
                }`}
              >
                <label className="flex cursor-pointer items-start gap-3.5 p-4 sm:p-5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    disabled={placingOrder}
                    className="mt-1 h-4 w-4 accent-[#7A1F2B] cursor-pointer shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-base sm:text-lg">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                          (Cash or Courier QR at Doorstep)
                        </span>
                      </div>
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        Doorstep Delivery
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      Pay at your doorstep with Cash or scan courier UPI QR when your order arrives.
                    </p>

                    <div className="mt-3 flex items-center gap-2 pt-2 border-t border-gray-100">
                      <CodBadge className="h-5 w-auto" />
                      <span className="text-[11px] text-gray-500">
                        Inspection and Silk Mark verification at delivery
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================
            RIGHT SECTION (Flipkart / Amazon Style Price Details)
        ================================== */}

        <div className="min-w-0 h-fit rounded-2xl border bg-white p-4 shadow-sm sm:p-6 lg:sticky lg:top-24">
          <div className="mb-5 border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
              Price Details ({totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"})
            </h2>
          </div>

          <div className="space-y-4">
            {/* Cart Items with Saree Product Images */}
            <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3.5"
                >
                  {/* Saree Thumbnail Image */}
                  <Link
                    href={`/products/${item._id}`}
                    className="shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100"
                  >
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="h-16 w-14 object-cover transition duration-300 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/images/products/default.jpg";
                      }}
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item._id}`}
                      className="block truncate text-sm font-semibold text-gray-800 hover:text-[#7A1F2B] transition"
                    >
                      {item.name}
                    </Link>
                    {item.color && (
                      <p className="text-[11px] text-gray-500 capitalize">
                        Color: {item.color}
                      </p>
                    )}
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">Qty:</span>
                      <div className="inline-flex h-7 items-center rounded-md border border-gray-200 bg-gray-50/50 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity <= 1) {
                              removeFromCart(item._id);
                            } else {
                              decreaseQuantity(item._id);
                            }
                          }}
                          className="flex h-full w-7 items-center justify-center text-gray-600 hover:bg-gray-200 active:bg-gray-300 rounded-l-md transition cursor-pointer text-xs font-bold"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-gray-800 bg-white h-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item._id)}
                          disabled={item.stock !== undefined && item.quantity >= item.stock}
                          className="flex h-full w-7 items-center justify-center text-gray-600 hover:bg-gray-200 active:bg-gray-300 rounded-r-md disabled:opacity-40 transition cursor-pointer text-xs font-bold"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {formatPrice(
                        (Number(item.price) || 0) * (Number(item.quantity) || 0)
                      )}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {formatPrice(Number(item.price) || 0)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ==================================
                APPLY COUPON & AVAILABLE OFFERS
            ================================== */}
            <div className="rounded-xl border border-[#D4AF37]/40 bg-[#FFFBF7] p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7A1F2B] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#C9A227]" />
                  <span>Apply Coupon Code</span>
                </p>
                {appliedCoupon && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Saved {formatPrice(discount)}
                  </span>
                )}
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between gap-2 rounded-lg border border-emerald-300 bg-emerald-50/90 px-3 py-2.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="font-mono text-xs font-extrabold tracking-wider text-emerald-900">
                        {appliedCoupon.code}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] font-medium text-emerald-700">
                      {formatPrice(discount)} instant discount applied
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    disabled={placingOrder || applyingCoupon}
                    className="shrink-0 rounded-md border border-red-200 bg-white px-2.5 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code (e.g. SILK10)"
                      disabled={applyingCoupon || placingOrder}
                      className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-base sm:text-xs font-mono font-bold uppercase tracking-wider text-gray-900 outline-none focus:border-[#7A1F2B] focus:ring-1 focus:ring-[#7A1F2B]"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      disabled={applyingCoupon || placingOrder || !couponCode.trim()}
                      className="shrink-0 rounded-lg bg-[#7A1F2B] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#5B1620] disabled:opacity-50 cursor-pointer"
                    >
                      {applyingCoupon ? "Applying..." : "Apply"}
                    </button>
                  </div>

                  {/* Quick 1-Click Available Coupons */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                      Available Coupons (Tap to Apply):
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {AVAILABLE_CHECKOUT_COUPONS.map((c) => {
                        const isEligible = subtotal >= c.minOrder;
                        return (
                          <button
                            key={c.code}
                            type="button"
                            disabled={!isEligible || applyingCoupon || placingOrder}
                            onClick={() => handleApplyCoupon(c.code)}
                            title={c.desc}
                            className={`flex flex-col items-start rounded-lg border p-2 text-left transition ${
                              isEligible
                                ? "border-dashed border-[#C9A227] bg-white hover:border-[#7A1F2B] hover:bg-[#7A1F2B]/5 cursor-pointer"
                                : "border-stone-200 bg-stone-100/70 opacity-55 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex w-full items-center justify-between gap-1">
                              <span className="font-mono text-[11px] font-extrabold text-[#7A1F2B]">
                                {c.code}
                              </span>
                              <span className="rounded bg-[#D4AF37]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#6D001A]">
                                {c.label}
                              </span>
                            </div>
                            <span className="mt-0.5 line-clamp-1 text-[10px] text-stone-500">
                              {isEligible
                                ? c.desc
                                : `Add ${formatPrice(c.minOrder - subtotal)} more`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Price Details Breakdown */}
            <div className="space-y-3 pt-2 text-sm">
              {/* Subtotal */}
              <div className="flex justify-between gap-4 text-gray-700">
                <span>Subtotal</span>
                <span className="font-medium tabular-nums">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between gap-4 text-gray-700">
                <span>Delivery Charges</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400 line-through">₹149</span>
                  {shipping === 0 ? (
                    <span className="font-bold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-medium tabular-nums">
                      {formatPrice(shipping)}
                    </span>
                  )}
                </div>
              </div>

              {/* GST */}
              <div className="flex justify-between gap-4 text-gray-700">
                <span>Applicable GST (5%)</span>
                <span className="font-medium tabular-nums">
                  {formatPrice(tax)}
                </span>
              </div>

              {/* Discount */}
              {discount > 0 && (
                <div className="flex justify-between gap-4 text-emerald-600">
                  <span>
                    Coupon Discount {appliedCoupon?.code ? `(${appliedCoupon.code})` : ""}
                  </span>
                  <span className="font-bold tabular-nums">
                    - {formatPrice(discount)}
                  </span>
                </div>
              )}
            </div>

            {/* Wedding & Festive Gift Packaging / Heirloom Care Summary */}
            <div className="rounded-xl border border-[#D4AF37]/40 bg-[#FFF8F0]/70 p-3.5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#6D001A] flex items-center gap-1.5">
                  <span>🎁</span>
                  <span>Heirloom Packaging &amp; Gifting</span>
                </p>
                <Link
                  href="/cart"
                  className="text-[11px] font-bold text-[#6D001A] underline hover:text-[#D4AF37]"
                >
                  Edit in Bag
                </Link>
              </div>
              {(() => {
                if (typeof window !== "undefined") {
                  try {
                    const raw = localStorage.getItem("silkverse_gift_note");
                    if (raw) {
                      const parsed = JSON.parse(raw);
                      if (parsed?.isGift) {
                        return (
                          <div className="rounded-lg border border-[#D4AF37]/50 bg-white p-2.5 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#6D001A]">
                                {parsed.boxStyle === "velvet"
                                  ? "✨ Royal Velvet Trousseau Box"
                                  : "🪡 Handwoven Zari Silk Potli"}
                              </span>
                              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                FREE
                              </span>
                            </div>
                            {(parsed.recipient || parsed.sender) && (
                              <p className="text-[11px] text-stone-600">
                                {parsed.recipient ? `To: ${parsed.recipient}` : ""}
                                {parsed.recipient && parsed.sender ? " • " : ""}
                                {parsed.sender ? `From: ${parsed.sender}` : ""}
                              </p>
                            )}
                            {parsed.message && (
                              <p className="text-[11px] italic text-stone-700 line-clamp-2 border-l-2 border-[#D4AF37] pl-2 mt-1">
                                &ldquo;{parsed.message}&rdquo;
                              </p>
                            )}
                          </div>
                        );
                      }
                    }
                  } catch {
                    // ignore
                  }
                }
                return (
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Packed in a breathable pure cotton protective bag with official <strong>Silk Mark hologram tag</strong>. Want a complimentary Zari Potli &amp; Shubha Lekha blessing card?{" "}
                    <Link href="/cart" className="font-bold text-[#6D001A] underline">
                      Add in Shopping Bag
                    </Link>
                  </p>
                );
              })()}
            </div>

            <hr className="border-dashed border-gray-200" />

            {/* Final Total */}
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-base font-bold text-gray-900">Total Amount</span>
              <span className="text-2xl font-extrabold text-[#7A1F2B] tabular-nums">
                {formatPrice(finalAmount)}
              </span>
            </div>

            {/* Flipkart Green Savings Banner */}
            {totalSavings > 0 && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-emerald-800">
                <p className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                  <span>🎉</span>
                  <span>You will save {formatPrice(totalSavings)} on this order!</span>
                </p>
              </div>
            )}
          </div>

          {/* ==================================
              Place Order
          ================================== */}

          <button
            type="button"
            onClick={
              placeOrder
            }
            disabled={
              placingOrder ||
              applyingCoupon ||
              cart.length === 0 ||
              addresses.length === 0 ||
              !selectedAddress
            }
            className="mt-8 w-full rounded-xl bg-[#7A1F2B] py-4 font-semibold text-white transition hover:bg-[#5B1620] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {placingOrder
              ? paymentMethod !== "COD"
                ? "Opening Payment Gateway..."
                : "Placing Order..."
              : paymentMethod === "UPI"
              ? `Pay ${formatPrice(finalAmount)} via UPI`
              : paymentMethod === "Card"
              ? `Pay ${formatPrice(finalAmount)} via Card`
              : paymentMethod === "NetBanking"
              ? `Pay ${formatPrice(finalAmount)} via Net Banking`
              : paymentMethod === "Wallet"
              ? `Pay ${formatPrice(finalAmount)} via Wallet`
              : "Place Order (Cash on Delivery)"}
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-gray-500">
            <span aria-hidden="true">
              🔒
            </span>

            <span>
              Your payment and order details are processed
              securely.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}