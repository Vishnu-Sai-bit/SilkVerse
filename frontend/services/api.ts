// =====================================
// API Configuration
// =====================================
import catalogData from "@/data/catalog.json";
import { handleCloudApiRequest } from "./cloudCatalogFallback";

function resolveApiBase(): string {
  const raw = (process.env.NEXT_PUBLIC_API_URL || "").trim();
  const isLocalEnvUrl =
    !raw || raw.includes("localhost") || raw.includes("127.0.0.1");

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocalBrowser =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".lvh.me");
    if (!isLocalBrowser && isLocalEnvUrl) {
      return "/api";
    }
  }

  const base = (raw || "http://localhost:5001")
    .replace(/\/+$/, "")
    .replace(/\/api$/, "");
  return `${base}/api`;
}

const API = resolveApiBase();

async function fetch(input: string, init?: RequestInit): Promise<Response> {
  if (typeof window === "undefined") {
    return handleCloudApiRequest(input, init);
  }

  const host = window.location.hostname;
  const isLocalBrowser =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".lvh.me");

  if (!isLocalBrowser && input.startsWith("/api")) {
    return handleCloudApiRequest(input, init);
  }

  try {
    const res = await globalThis.fetch(input, init);
    if ((res.status === 404 || res.status >= 500) && !isLocalBrowser) {
      return handleCloudApiRequest(input, init);
    }
    return res;
  } catch {
    return handleCloudApiRequest(input, init);
  }
}

// =====================================
// Common Types
// =====================================

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  images: string[];
  averageRating: number;
  numReviews: number;
  salesCount?: number;
  isBestSeller?: boolean;
  stock: number;
  colors?: Array<{ name: string; hex?: string } | string>;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  dateOfBirth?: string | null;
}

export interface Address {
  _id: string;
  fullName: string;
  mobile: string;
  pincode: string;
  houseNumber: string;
  area: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  addressType: "Home" | "Work" | "Other";
  isDefault: boolean;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;

  user: string | User | null;

  items: OrderItem[];

  address: string | Address;

  subtotal: number;
  shippingCharge: number;
  tax: number;
  discount: number;
  totalAmount: number;

  couponCode?: string | null;

  paymentMethod:
    | "COD"
    | "Razorpay"
    | "UPI"
    | "Card"
    | "NetBanking"
    | "Wallet";

  paymentStatus:
    | "Pending"
    | "Paid"
    | "Refunded"
    | "Failed";

  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;

  stockRestored?: boolean;
  couponRestored?: boolean;

  orderStatus:
    | "Pending"
    | "Confirmed"
    | "Shipped"
    | "Out for Delivery"
    | "Delivered"
    | "Cancelled";

  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;

  user:
    | string
    | {
        _id?: string;
        id?: string;
        name: string;
      };

  product:
    | string
    | Product;

  rating: number;
  comment: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface Coupon {
  _id: string;

  code: string;

  description?: string;

  discountType:
    | "Percentage"
    | "Flat";

  discountValue: number;

  minimumOrder: number;

  maxDiscount?: number;

  expiryDate: string;

  active: boolean;

  usageLimit?: number;

  usedCount?: number;

  usedBy?: string[];

  createdAt?: string;
  updatedAt?: string;
}

// =====================================
// Product Query
// =====================================

export type GetProductsParams = {
  keyword?: string;
  category?: string;
  occasion?: string;
  weave?: string;
  fabric?: string;

  minPrice?: number;
  maxPrice?: number;

  rating?: number;

  sort?:
    | "newest"
    | "priceAsc"
    | "priceDesc"
    | "rating"
    | "bestseller"
    | "popularity"
    | string;

  page?: number;
  limit?: number;
};

// =====================================
// API Response Helper
// =====================================

async function parseResponse(
  response: Response
) {
  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  if (
    !contentType.includes(
      "application/json"
    )
  ) {
    throw new Error(
      `Invalid server response (${response.status}).`
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Request failed with status ${response.status}`
    );
  }

  if (data?.success === false) {
    throw new Error(
      data?.message ||
        "Request failed."
    );
  }

  return data;
}

// =====================================
// Products
// =====================================

export interface CategoryResponse {
  success: boolean;
  categories: string[];
  counts: Record<string, number>;
  occasionCounts?: Record<string, number>;
  fabricCounts?: Record<string, number>;
  total: number;
}

// Get Dynamic Categories with Counts
export async function getCategories(): Promise<CategoryResponse> {
  const response = await fetch(`${API}/products/categories`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

// Get All Products
export async function getProducts(
  params: GetProductsParams = {}
) {
  const searchParams =
    new URLSearchParams();

  if (params.keyword) {
    searchParams.set(
      "keyword",
      params.keyword
    );
  }

  if (params.category) {
    searchParams.set(
      "category",
      params.category
    );
  }

  if (params.occasion) {
    searchParams.set(
      "occasion",
      params.occasion
    );
  }

  if (params.weave) {
    searchParams.set(
      "weave",
      params.weave
    );
  }

  if (params.fabric) {
    searchParams.set(
      "fabric",
      params.fabric
    );
  }

  if (
    params.minPrice !== undefined
  ) {
    searchParams.set(
      "minPrice",
      String(params.minPrice)
    );
  }

  if (
    params.maxPrice !== undefined
  ) {
    searchParams.set(
      "maxPrice",
      String(params.maxPrice)
    );
  }

  if (
    params.rating !== undefined
  ) {
    searchParams.set(
      "rating",
      String(params.rating)
    );
  }

  if (params.sort) {
    searchParams.set(
      "sort",
      params.sort
    );
  }

  if (
    params.page !== undefined
  ) {
    searchParams.set(
      "page",
      String(params.page)
    );
  }

  if (
    params.limit !== undefined
  ) {
    searchParams.set(
      "limit",
      String(params.limit)
    );
  }

  const queryString =
    searchParams.toString();

  const response = await fetch(
    `${API}/products${
      queryString
        ? `?${queryString}`
        : ""
    }`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return parseResponse(response);
}

// Get Products With Pagination Metadata
export async function getProductsWithPagination(
  params: GetProductsParams = {}
) {
  const searchParams =
    new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        searchParams.set(
          key,
          String(value)
        );
      }
    }
  );

  const queryString =
    searchParams.toString();

  const response = await fetch(
    `${API}/products${
      queryString
        ? `?${queryString}`
        : ""
    }`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return parseResponse(response);
}

// Get Single Product
export async function getProductById(
  id: string
) {
  try {
    const response = await fetch(
      `${API}/products/${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data =
      await parseResponse(response);

    return data.product;
  } catch {
    const list = (catalogData as any).products || [];
    return list.find((p: any) => p._id === id) || list[0] || null;
  }
}

// Get Related Products
export async function getRelatedProducts(
  id: string
) {
  try {
    const response = await fetch(
      `${API}/products/${id}/related`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data =
      await parseResponse(response);

    return data.products || [];
  } catch {
    const list = (catalogData as any).products || [];
    const target = list.find((p: any) => p._id === id);
    return list
      .filter((p: any) => p._id !== id && (!target || p.category === target.category))
      .slice(0, 5);
  }
}

// =====================================
// Get Product Categories
// =====================================

export async function getProductCategories(): Promise<string[]> {
  const response = await fetch(
    `${API}/products/categories`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const data = await parseResponse(response);

  return data.categories || [];
}

// =====================================
// Authentication
// =====================================

// Register
export async function registerUser(
  userData: {
    name: string;
    email: string;
    mobile: string;
    password: string;
  }
) {
  const response = await fetch(
    `${API}/auth/register`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        userData
      ),
    }
  );

  return parseResponse(response);
}

// Verify Registration Email OTP
export async function verifyRegistrationOTP(
  data: {
    email: string;
    otp: string;
  }
) {
  const response = await fetch(
    `${API}/auth/verify-registration-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return parseResponse(response);
}

// Resend Registration Email OTP
export async function resendRegistrationOTP(
  email: string
) {
  const response = await fetch(
    `${API}/auth/resend-registration-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    }
  );

  return parseResponse(response);
}

// Login
export async function loginUser(
  credentials: {
    identifier: string;
    password: string;
  }
) {
  const response = await fetch(
    `${API}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        credentials
      ),
    }
  );

  return parseResponse(response);
}

// Google OAuth Login
export async function googleLoginUser(data: {
  credential?: string;
  accessToken?: string;
}) {
  const response = await fetch(`${API}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return parseResponse(response);
}

// Facebook OAuth Login
export async function facebookLoginUser(data: {
  accessToken: string;
  userID?: string;
}) {
  const response = await fetch(`${API}/auth/facebook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return parseResponse(response);
}

// Apple Sign-In
export async function appleLoginUser(data: {
  id_token: string;
  code?: string;
  user?: {
    name?: { firstName?: string; lastName?: string };
    email?: string;
  };
}) {
  const response = await fetch(`${API}/auth/apple`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return parseResponse(response);
}

// Demo Social Login
export async function demoSocialLoginUser(provider: "google" | "facebook" | "apple") {
  const response = await fetch(`${API}/auth/demo-social`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ provider }),
  });

  return parseResponse(response);
}

// Current User
export async function getCurrentUser(
  token: string
) {
  const response = await fetch(
    `${API}/auth/me`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      cache: "no-store",
    }
  );

  const data =
    await parseResponse(response);

  return data.user;
}

// Update Profile
export async function updateProfile(
  token: string,
  userData: {
    name?: string;
    email?: string;
    mobile?: string;
    dateOfBirth?: string | null;
    district?: string;
    state?: string;
    country?: string;
  }
) {
  const response = await fetch(
    `${API}/auth/profile`,
    {
      method: "PUT",

      headers: {
        Authorization:
          `Bearer ${token}`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        userData
      ),
    }
  );

  const data =
    await parseResponse(response);

  return data.user;
}

// Change Password
export async function changePassword(
  token: string,
  passwordData: {
    currentPassword: string;
    newPassword: string;
  }
) {
  const response = await fetch(
    `${API}/auth/change-password`,
    {
      method: "PUT",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify(passwordData),
    }
  );

  return parseResponse(response);
}

// =====================================
// Password Recovery
// =====================================

// Send Password Reset OTP
export async function forgotPassword(
  data: {
    method: "email" | "mobile";
    identifier: string;
  }
) {
  const response = await fetch(
    `${API}/auth/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return parseResponse(response);
}

// Verify Password Reset OTP
export async function verifyResetOTP(
  data: {
    method: "email" | "mobile";
    identifier: string;
    otp: string;
  }
) {
  const response = await fetch(
    `${API}/auth/verify-reset-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return parseResponse(response);
}

// Reset Password
export async function resetPassword(
  data: {
    resetToken: string;
    newPassword: string;
    confirmPassword: string;
  }
) {
  const response = await fetch(
    `${API}/auth/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return parseResponse(response);
}

// =====================================
// Address APIs
// =====================================

// Get Addresses
export async function getAddresses(
  token: string
) {
  const response = await fetch(
    `${API}/addresses`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      cache: "no-store",
    }
  );

  const data =
    await parseResponse(response);

  return data.addresses || [];
}

// Add Address
export async function addAddress(
  token: string,
  addressData: {
    fullName: string;
    mobile: string;
    pincode: string;
    houseNumber: string;
    area: string;
    landmark?: string;
    city: string;
    state: string;
    country: string;

    addressType:
      | "Home"
      | "Work"
      | "Other";

    isDefault: boolean;
  }
) {
  const response = await fetch(
    `${API}/addresses`,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${token}`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        addressData
      ),
    }
  );

  const data =
    await parseResponse(response);

  return data.address;
}

// Update Address
export async function updateAddress(
  token: string,
  id: string,
  addressData: {
    fullName: string;
    mobile: string;
    pincode: string;
    houseNumber: string;
    area: string;
    landmark?: string;
    city: string;
    state: string;
    country: string;

    addressType:
      | "Home"
      | "Work"
      | "Other";

    isDefault: boolean;
  }
) {
  const response = await fetch(
    `${API}/addresses/${id}`,
    {
      method: "PUT",

      headers: {
        Authorization:
          `Bearer ${token}`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        addressData
      ),
    }
  );

  const data =
    await parseResponse(response);

  return data.address;
}

// Delete Address
export async function deleteAddress(
  token: string,
  id: string
) {
  const response = await fetch(
    `${API}/addresses/${id}`,
    {
      method: "DELETE",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  return parseResponse(response);
}

// Set Default Address
export async function setDefaultAddress(
  token: string,
  id: string
) {
  const response = await fetch(
    `${API}/addresses/${id}/default`,
    {
      method: "PATCH",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  const data =
    await parseResponse(response);

  return data.address;
}

// =====================================
// Orders
// =====================================

// Create Order
export async function createOrder(
  token: string,
  orderData: {
    items: {
      product: string;
      quantity: number;
    }[];
    address: string;
    paymentMethod?: "COD" | "Razorpay" | "UPI" | "Card" | "NetBanking" | "Wallet";
    couponCode?: string | null;
  }
) {
  const response = await fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  const data = await parseResponse(response);

  return data.order;
}

// Get My Orders
export async function getMyOrders(
  token: string
) {
  const response = await fetch(
    `${API}/orders`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      cache: "no-store",
    }
  );

  const data =
    await parseResponse(response);

  return data.orders || [];
}

// Get My Single Order
export async function getOrderById(
  token: string,
  id: string
) {
  const response = await fetch(
    `${API}/orders/${id}`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      cache: "no-store",
    }
  );

  const data =
    await parseResponse(response);

  return data.order || data;
}

// Cancel Order
export async function cancelOrder(
  token: string,
  id: string
) {
  const response = await fetch(
    `${API}/orders/${id}/cancel`,
    {
      method: "PATCH",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  const data =
    await parseResponse(response);

  return data.order;
}

// ======================================
// Create Razorpay Payment Order
// POST /api/payment/create-order
// ======================================

export interface PaymentOrderResponse {
  id?: string;
  amount?: number;
  currency?: string;

  _id?: string;
  paymentStatus?: string;
  orderStatus?: string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  totalAmount?: number;
}

export interface CreatePaymentOrderResult {
  order: PaymentOrderResponse;
  paymentRecovered: boolean;
}

export async function createPaymentOrder(
  token: string,
  orderId: string
): Promise<CreatePaymentOrderResult> {
  const response = await fetch(
    `${API}/payment/create-order`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      /*
       * IMPORTANT:
       *
       * Do NOT send the payment amount
       * from the frontend.
       *
       * The backend gets order.totalAmount
       * directly from the database and uses
       * that amount to create or recover
       * the Razorpay payment order.
       */
      body: JSON.stringify({
        orderId,
      }),
    }
  );

  const data =
    await parseResponse(response);

  if (!data.order) {
    throw new Error(
      "Invalid payment order response."
    );
  }

  return {
    order: data.order,
    paymentRecovered:
      data.paymentRecovered === true,
  };
}

// =====================================
// Verify Razorpay Payment
// POST /api/payment/verify
// =====================================

export async function verifyPayment(
  token: string,
  paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderId: string;
  }
) {
  const response = await fetch(
    `${API}/payment/verify`,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${token}`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        paymentData
      ),
    }
  );

  const data =
    await parseResponse(response);

  return data.order || data;
}

// =====================================
// Coupons
// =====================================

// Get Public Coupons
export async function getPublicCoupons(): Promise<Coupon[]> {
  const response = await fetch(`${API}/coupons/public`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await parseResponse(response);
  return data.coupons || [];
}

// Get Coupons
export async function getCoupons(
  token: string
) {
  const response = await fetch(
    `${API}/coupons`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      cache: "no-store",
    }
  );

  const data =
    await parseResponse(response);

  return data.coupons || [];
}

// Create Coupon
export async function createCoupon(
  token: string,
  couponData: {
    code: string;

    description?: string;

    discountType:
      | "Percentage"
      | "Flat";

    discountValue: number;

    minimumOrder: number;

    maxDiscount?: number;

    expiryDate: string;

    active?: boolean;

    usageLimit?: number;
  }
) {
  const response = await fetch(
    `${API}/coupons`,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${token}`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        couponData
      ),
    }
  );

  const data =
    await parseResponse(response);

  return data.coupon;
}

// Update Coupon
export async function updateCoupon(
  token: string,
  id: string,
  couponData: {
    code?: string;

    description?: string;

    discountType?:
      | "Percentage"
      | "Flat";

    discountValue?: number;

    minimumOrder?: number;

    maxDiscount?: number;

    expiryDate?: string;

    active?: boolean;

    usageLimit?: number;
  }
) {
  const response = await fetch(
    `${API}/coupons/${id}`,
    {
      method: "PUT",

      headers: {
        Authorization:
          `Bearer ${token}`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        couponData
      ),
    }
  );

  const data =
    await parseResponse(response);

  return data.coupon;
}

// Delete Coupon
export async function deleteCoupon(
  token: string,
  id: string
) {
  const response = await fetch(
    `${API}/coupons/${id}`,
    {
      method: "DELETE",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  return parseResponse(response);
}

// Apply Coupon
export async function applyCoupon(
  token: string,
  code: string,
  subtotal: number
) {
  const response = await fetch(
    `${API}/coupons/apply`,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${token}`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        code: code
          .trim()
          .toUpperCase(),
        subtotal,
      }),
    }
  );

  return parseResponse(response);
}

// Coupon Analytics
export async function getCouponAnalytics(
  token: string
) {
  const response = await fetch(
    `${API}/coupons/analytics`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      cache: "no-store",
    }
  );

  const data =
    await parseResponse(response);

  return data.analytics || data;
}

// =====================================
// Reviews
// =====================================

// Get Product Reviews
export async function getReviews(
  productId: string
) {
  const response = await fetch(
    `${API}/reviews/product/${productId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const data =
    await parseResponse(response);

  return data.reviews || [];
}

// Create Review
export async function createReview(
  token: string,
  reviewData: {
    productId: string;
    rating: number;
    comment: string;
  }
) {
  const response = await fetch(
    `${API}/reviews`,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${token}`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        product:
          reviewData.productId,

        rating:
          reviewData.rating,

        comment:
          reviewData.comment,
      }),
    }
  );

  const data =
    await parseResponse(response);

  return data.review;
}

// Update Review
export async function updateReview(
  token: string,
  reviewId: string,
  reviewData: {
    rating: number;
    comment: string;
  }
) {
  const response = await fetch(
    `${API}/reviews/${reviewId}`,
    {
      method: "PUT",

      headers: {
        Authorization:
          `Bearer ${token}`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        rating:
          reviewData.rating,

        comment:
          reviewData.comment,
      }),
    }
  );

  const data =
    await parseResponse(response);

  return data.review;
}

// Delete Review
export async function deleteReview(
  token: string,
  reviewId: string
) {
  const response = await fetch(
    `${API}/reviews/${reviewId}`,
    {
      method: "DELETE",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  return parseResponse(response);
}

// =====================================
// Wishlist
// =====================================

// Get Wishlist
export async function getWishlist(
  token: string
) {
  const response = await fetch(
    `${API}/wishlist`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      cache: "no-store",
    }
  );

  const data =
    await parseResponse(response);

  return (
    data.wishlist ||
    data.products ||
    []
  );
}

// =====================================
// Add To Wishlist
// =====================================
export async function addToWishlist(
  token: string,
  productId: string
) {
  const response = await fetch(
    `${API}/wishlist`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        product: productId,
      }),
    }
  );

  return parseResponse(response);
}

// Alias used by some existing pages
export async function addWishlist(
  token: string,
  productId: string
) {
  return addToWishlist(
    token,
    productId
  );
}

// =====================================
// Remove From Wishlist
// =====================================
export async function removeFromWishlist(
  token: string,
  wishlistId: string
) {
  const response = await fetch(
    `${API}/wishlist/${wishlistId}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return parseResponse(response);
}

// Alias used by older page code
export async function removeWishlistItem(
  token: string,
  wishlistId: string
) {
  return removeFromWishlist(
    token,
    wishlistId
  );
}

// =====================================
// Admin Dashboard
// =====================================

export async function getAdminDashboard(
  token: string
) {
  const response = await fetch(
    `${API}/admin/dashboard`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      cache: "no-store",
    }
  );

  const data =
    await parseResponse(response);

  return data.dashboard;
}

// =====================================
// Admin Analytics
// =====================================

export async function getAnalytics(
  token: string
) {
  const response = await fetch(
    `${API}/admin/analytics`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      cache: "no-store",
    }
  );

  const data =
    await parseResponse(response);

  return data.analytics;
}

// =====================================
// Admin Products
// =====================================

// Get All Products
export async function getAdminProducts(
  token: string
) {
  const response = await fetch(
    `${API}/admin/products`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      cache: "no-store",
    }
  );

  const data =
    await parseResponse(response);

  return data.products || [];
}

// Create Product
export async function createAdminProduct(
  token: string,
  formData: FormData
) {
  const response = await fetch(
    `${API}/admin/products`,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      body: formData,
    }
  );

  const data =
    await parseResponse(response);

  return data.product;
}

// Get Single Product
export async function getAdminProduct(
  token: string,
  id: string
) {
  const response = await fetch(
    `${API}/admin/products/${id}`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      cache: "no-store",
    }
  );

  const data =
    await parseResponse(response);

  return data.product;
}

// Update Product
export async function updateAdminProduct(
  token: string,
  id: string,
  formData: FormData
) {
  const response = await fetch(
    `${API}/admin/products/${id}`,
    {
      method: "PUT",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      body: formData,
    }
  );

  const data =
    await parseResponse(response);

  return data.product;
}

// Delete Product
export async function deleteAdminProduct(
  token: string,
  id: string
) {
  const response = await fetch(
    `${API}/admin/products/${id}`,
    {
      method: "DELETE",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  return parseResponse(response);
}

// =====================================
// Admin Orders
// =====================================

// Get All Orders
export async function getAdminOrders(
  token: string
) {
  const response = await fetch(
    `${API}/admin/orders`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      cache: "no-store",
    }
  );

  const data =
    await parseResponse(response);

  return data.orders || [];
}

// Get Single Order
export async function getAdminOrder(
  token: string,
  id: string
) {
  const response = await fetch(
    `${API}/admin/orders/${id}`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      cache: "no-store",
    }
  );

  const data =
    await parseResponse(response);

  return data.order;
}

// Update Order Status
export async function updateAdminOrderStatus(
  token: string,
  id: string,
  orderStatus: string
) {
  const response = await fetch(
    `${API}/admin/orders/${id}`,
    {
      method: "PATCH",

      headers: {
        Authorization:
          `Bearer ${token}`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        orderStatus,
      }),
    }
  );

  const data =
    await parseResponse(response);

  return data.order;
}

// =====================================
// Admin Users
// =====================================

// Get All Users
export async function getAdminUsers(
  token: string
) {
  const response = await fetch(
    `${API}/admin/users`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      cache: "no-store",
    }
  );

  const data =
    await parseResponse(response);

  return data.users || [];
}

// Update User Role
export async function updateUserRole(
  token: string,
  id: string,
  role: "user" | "admin" | string
) {
  const response = await fetch(
    `${API}/admin/users/${id}/role`,
    {
      method: "PATCH",

      headers: {
        Authorization:
          `Bearer ${token}`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        role,
      }),
    }
  );

  const data =
    await parseResponse(response);

  return data.user;
}

// Delete User
export async function deleteUser(
  token: string,
  id: string
) {
  const response = await fetch(
    `${API}/admin/users/${id}`,
    {
      method: "DELETE",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  return parseResponse(response);
}