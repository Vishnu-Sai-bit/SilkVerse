"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  getCoupons,
  getCouponAnalytics,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/services/api";

// ======================================
// Types
// ======================================

type DiscountType = "Percentage" | "Flat";

interface Coupon {
  _id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrder: number;
  maxDiscount?: number;
  expiryDate: string;
  active: boolean;
  usageLimit: number;
  usedCount: number;
}

interface CouponAnalytics {
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
  totalRedemptions: number;
  mostUsedCoupon?: {
    code: string;
    usedCount?: number;
  } | null;
}

interface CouponFormData {
  code: string;
  discountType: DiscountType;
  discountValue: string;
  minimumOrder: string;
  maxDiscount: string;
  expiryDate: string;
  usageLimit: string;
  active: boolean;
}

// ======================================
// Initial Form
// ======================================

const initialFormData: CouponFormData = {
  code: "",
  discountType: "Percentage",
  discountValue: "",
  minimumOrder: "",
  maxDiscount: "",
  expiryDate: "",
  usageLimit: "0",
  active: true,
};

// ======================================
// Helpers
// ======================================

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

function formatDate(date?: string) {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-IN");
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

// ======================================
// Admin Coupons Page
// ======================================

export default function AdminCouponsPage() {
  const router = useRouter();

  const [coupons, setCoupons] = useState<Coupon[]>(
    []
  );

  const [analytics, setAnalytics] =
    useState<CouponAnalytics | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [editingCouponId, setEditingCouponId] =
    useState<string | null>(null);

  const [formData, setFormData] =
    useState<CouponFormData>(
      initialFormData
    );

  // ======================================
  // Load Coupons
  // ======================================

  const loadCoupons = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setLoading(true);
        }

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
          await getCoupons(token);

        setCoupons(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load coupons.";

        if (isSessionError(message)) {
          localStorage.removeItem(
            "silkverse-token"
          );

          router.replace(
            "/login?redirect=/admin/coupons"
          );

          return;
        }

        setCoupons([]);
        setError(message);
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [router]
  );

  // ======================================
  // Load Analytics
  // ======================================

  const loadAnalytics = useCallback(
    async () => {
      try {
        const token =
          localStorage.getItem(
            "silkverse-token"
          );

        if (!token) {
          router.replace("/login");
          return;
        }

        const data =
          await getCouponAnalytics(token);

        if (!data) {
          setAnalytics(null);
          return;
        }

        setAnalytics({
          totalCoupons:
            Number(data.totalCoupons) || 0,
          activeCoupons:
            Number(data.activeCoupons) || 0,
          expiredCoupons:
            Number(data.expiredCoupons) || 0,
          totalRedemptions:
            Number(data.totalRedemptions) || 0,
          mostUsedCoupon:
            data.mostUsedCoupon || null,
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load coupon analytics.";

        if (isSessionError(message)) {
          localStorage.removeItem(
            "silkverse-token"
          );

          router.replace(
            "/login?redirect=/admin/coupons"
          );

          return;
        }

        setAnalytics(null);
      }
    },
    [router]
  );

  // ======================================
  // Initial Load
  // ======================================

  useEffect(() => {
    async function loadPage() {
      await Promise.all([
        loadCoupons(),
        loadAnalytics(),
      ]);
    }

    loadPage();
  }, [loadCoupons, loadAnalytics]);

  // ======================================
  // Reset Form
  // ======================================

  function resetForm() {
    setFormData({
      ...initialFormData,
    });

    setEditingCouponId(null);
    setShowForm(false);
  }

  // ======================================
  // Form Validation
  // ======================================

  function validateForm() {
    const code =
      formData.code.trim().toUpperCase();

    if (!code) {
      return "Coupon code is required.";
    }

    if (code.length < 3) {
      return "Coupon code must contain at least 3 characters.";
    }

    const discountValue =
      Number(formData.discountValue);

    if (
      !Number.isFinite(discountValue) ||
      discountValue < 0
    ) {
      return "Discount value must be a valid non-negative number.";
    }

    if (
      formData.discountType ===
        "Percentage" &&
      discountValue > 100
    ) {
      return "Percentage discount cannot exceed 100%.";
    }

    const minimumOrder =
      Number(formData.minimumOrder);

    if (
      !Number.isFinite(minimumOrder) ||
      minimumOrder < 0
    ) {
      return "Minimum order must be a valid non-negative number.";
    }

    if (
      formData.discountType ===
        "Percentage"
    ) {
      const maxDiscount =
        Number(formData.maxDiscount);

      if (
        !Number.isFinite(maxDiscount) ||
        maxDiscount < 0
      ) {
        return "Maximum discount must be a valid non-negative number.";
      }
    }

    const usageLimit =
      Number(formData.usageLimit);

    if (
      !Number.isInteger(usageLimit) ||
      usageLimit < 0
    ) {
      return "Usage limit must be a non-negative whole number.";
    }

    if (!formData.expiryDate) {
      return "Expiry date is required.";
    }

    const expiryDate = new Date(
      formData.expiryDate
    );

    if (
      Number.isNaN(
        expiryDate.getTime()
      )
    ) {
      return "Invalid expiry date.";
    }

    return null;
  }

  // ======================================
  // Create / Update Coupon
  // ======================================

  async function handleSaveCoupon() {
    if (saving || deletingId) {
      return;
    }

    const validationError =
      validateForm();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem(
          "silkverse-token"
        );

      if (!token) {
        router.replace(
          `/login?redirect=/admin/coupons`
        );
        return;
      }

      const couponData = {
        code: formData.code
          .trim()
          .toUpperCase(),

        discountType:
          formData.discountType,

        discountValue:
          Number(formData.discountValue),

        minimumOrder:
          Number(formData.minimumOrder),

        maxDiscount:
          formData.discountType ===
          "Percentage"
            ? Number(
                formData.maxDiscount
              )
            : 0,

        expiryDate:
          formData.expiryDate,

        usageLimit:
          Number(formData.usageLimit),

        active:
          formData.active,
      };

      if (editingCouponId) {
        await updateCoupon(
          token,
          editingCouponId,
          couponData
        );

        toast.success(
          "Coupon updated successfully."
        );
      } else {
        await createCoupon(
          token,
          couponData
        );

        toast.success(
          "Coupon created successfully."
        );
      }

      resetForm();

      await Promise.all([
        loadCoupons(false),
        loadAnalytics(),
      ]);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : editingCouponId
          ? "Failed to update coupon."
          : "Failed to create coupon.";

      if (isSessionError(message)) {
        localStorage.removeItem(
          "silkverse-token"
        );

        router.replace(
          `/login?redirect=/admin/coupons`
        );

        return;
      }

      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  // ======================================
  // Delete Coupon
  // ======================================

  async function handleDeleteCoupon(
    id: string
  ) {
    if (saving || deletingId) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this coupon?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const token =
        localStorage.getItem(
          "silkverse-token"
        );

      if (!token) {
        router.replace(
          `/login?redirect=/admin/coupons`
        );
        return;
      }

      await deleteCoupon(
        token,
        id
      );

      if (editingCouponId === id) {
        resetForm();
      }

      toast.success(
        "Coupon deleted successfully."
      );

      await Promise.all([
        loadCoupons(false),
        loadAnalytics(),
      ]);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete coupon.";

      if (isSessionError(message)) {
        localStorage.removeItem(
          "silkverse-token"
        );

        router.replace(
          `/login?redirect=/admin/coupons`
        );

        return;
      }

      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  }

  // ======================================
  // Edit Coupon
  // ======================================

  function handleEditCoupon(
    coupon: Coupon
  ) {
    setEditingCouponId(
      coupon._id
    );

    setFormData({
      code:
        coupon.code || "",

      discountType:
        coupon.discountType,

      discountValue:
        String(
          coupon.discountValue ?? ""
        ),

      minimumOrder:
        String(
          coupon.minimumOrder ?? ""
        ),

      maxDiscount:
        String(
          coupon.maxDiscount ?? ""
        ),

      expiryDate:
        coupon.expiryDate
          ? coupon.expiryDate.split(
              "T"
            )[0]
          : "",

      usageLimit:
        String(
          coupon.usageLimit ?? 0
        ),

      active:
        Boolean(coupon.active),
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ======================================
  // Loading
  // ======================================

  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#7A1F2B] border-t-transparent" />

          <p className="mt-4 text-lg font-semibold text-gray-600">
            Loading Coupons...
          </p>
        </div>
      </div>
    );
  }

  // ======================================
  // Error
  // ======================================

  if (error) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center shadow-md">
        <h2 className="text-xl font-semibold text-red-600">
          Failed to load coupons.
        </h2>

        <p className="mt-2 text-gray-500">
          {error}
        </p>

        <button
          type="button"
          onClick={() => {
            loadCoupons();
            loadAnalytics();
          }}
          className="mt-5 rounded-lg bg-[#7A1F2B] px-6 py-3 font-semibold text-white transition hover:bg-[#651923]"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ======================================
  // Render
  // ======================================

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
            SilkVerse Administration
          </p>

          <h1 className="mt-2 text-2xl sm:text-4xl font-bold text-[#7A1F2B]">
            Coupons
          </h1>

          <p className="mt-2 text-gray-500">
            Create, manage, and monitor
            your store coupons.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          disabled={
            saving || deletingId !== null
          }
          className="rounded-lg bg-[#7A1F2B] px-5 py-3 font-semibold text-white transition hover:bg-[#651923] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {showForm
            ? "Close Form"
            : "+ Add Coupon"}
        </button>
      </div>

      {/* Analytics */}

      {analytics && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div className="rounded-2xl border bg-white p-5 shadow-md">
            <p className="text-sm text-gray-500">
              Total Coupons
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#7A1F2B]">
              {analytics.totalCoupons}
            </h2>
          </div>

          <div className="rounded-2xl border bg-green-50 p-5 shadow-md">
            <p className="text-sm text-gray-500">
              Active
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {analytics.activeCoupons}
            </h2>
          </div>

          <div className="rounded-2xl border bg-red-50 p-5 shadow-md">
            <p className="text-sm text-gray-500">
              Expired
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {analytics.expiredCoupons}
            </h2>
          </div>

          <div className="rounded-2xl border bg-yellow-50 p-5 shadow-md">
            <p className="text-sm text-gray-500">
              Redemptions
            </p>

            <h2 className="mt-2 text-3xl font-bold text-yellow-600">
              {analytics.totalRedemptions}
            </h2>
          </div>

          <div className="rounded-2xl border bg-blue-50 p-5 shadow-md">
            <p className="text-sm text-gray-500">
              Most Used
            </p>

            <h2 className="mt-2 truncate text-xl font-bold text-blue-600">
              {analytics
                .mostUsedCoupon
                ? analytics
                    .mostUsedCoupon
                    .code
                : "-"}
            </h2>
          </div>
        </div>
      )}

      {/* Coupon Form */}

      {showForm && (
        <div className="rounded-2xl border bg-white p-4 sm:p-6 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#7A1F2B]">
                {editingCouponId
                  ? "Edit Coupon"
                  : "Create Coupon"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Configure the coupon rules
                and validity.
              </p>
            </div>

            {editingCouponId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="text-sm font-semibold text-gray-500 hover:text-[#7A1F2B] disabled:opacity-50"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Code */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Coupon Code
              </label>

              <input
                type="text"
                placeholder="WELCOME10"
                disabled={saving}
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value
                      .toUpperCase(),
                  })
                }
                className="w-full rounded-lg border p-3 outline-none transition focus:border-[#7A1F2B]"
              />
            </div>

            {/* Discount Type */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Discount Type
              </label>

              <select
                disabled={saving}
                value={
                  formData.discountType
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountType:
                      e.target.value as DiscountType,
                  })
                }
                className="w-full rounded-lg border p-3 outline-none transition focus:border-[#7A1F2B]"
              >
                <option value="Percentage">
                  Percentage
                </option>

                <option value="Flat">
                  Flat
                </option>
              </select>
            </div>

            {/* Discount Value */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Discount Value {formData.discountType === "Percentage" ? "(%)" : "(₹ INR)"}
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder={
                  formData.discountType ===
                  "Percentage"
                    ? "10"
                    : "100"
                }
                disabled={saving}
                value={
                  formData.discountValue
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountValue:
                      e.target.value,
                  })
                }
                className="w-full rounded-lg border p-3 outline-none transition focus:border-[#7A1F2B]"
              />
            </div>

            {/* Minimum Order */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Minimum Order Value (₹ INR)
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="1000"
                disabled={saving}
                value={
                  formData.minimumOrder
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minimumOrder:
                      e.target.value,
                  })
                }
                className="w-full rounded-lg border p-3 outline-none transition focus:border-[#7A1F2B]"
              />
            </div>

            {/* Maximum Discount */}

            {formData.discountType ===
              "Percentage" && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Maximum Discount Cap (₹ INR)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="500"
                  disabled={saving}
                  value={
                    formData.maxDiscount
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxDiscount:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-lg border p-3 outline-none transition focus:border-[#7A1F2B]"
                />
              </div>
            )}

            {/* Usage Limit */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Usage Limit
              </label>

              <input
                type="number"
                min="0"
                step="1"
                placeholder="0 = Unlimited"
                disabled={saving}
                value={
                  formData.usageLimit
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    usageLimit:
                      e.target.value,
                  })
                }
                className="w-full rounded-lg border p-3 outline-none transition focus:border-[#7A1F2B]"
              />

              <p className="mt-1 text-xs text-gray-500">
                Use 0 for unlimited usage.
              </p>
            </div>

            {/* Expiry */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Expiry Date
              </label>

              <input
                type="date"
                disabled={saving}
                value={
                  formData.expiryDate
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expiryDate:
                      e.target.value,
                  })
                }
                className="w-full rounded-lg border p-3 outline-none transition focus:border-[#7A1F2B]"
              />
            </div>
          </div>

          {/* Active */}

          <label className="mt-5 flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              disabled={saving}
              checked={formData.active}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  active:
                    e.target.checked,
                })
              }
              className="h-4 w-4"
            />

            <span className="text-sm font-semibold text-gray-700">
              Active Coupon
            </span>
          </label>

          {/* Save */}

          <button
            type="button"
            onClick={handleSaveCoupon}
            disabled={
              saving ||
              deletingId !== null
            }
            className="mt-6 rounded-lg bg-[#7A1F2B] px-6 py-3 font-semibold text-white transition hover:bg-[#651923] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? editingCouponId
                ? "Updating..."
                : "Creating..."
              : editingCouponId
              ? "Update Coupon"
              : "Save Coupon"}
          </button>
        </div>
      )}

      {/* Coupons Table */}

      <div className="overflow-x-auto rounded-2xl border bg-white shadow-md">
        <table className="min-w-[1000px] w-full">
          <thead className="bg-[#FDFBF7]">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Code
              </th>

              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Type
              </th>

              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Discount
              </th>

              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Min Order
              </th>

              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Usage
              </th>

              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Expiry
              </th>

              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Status
              </th>

              <th className="p-4 text-center text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="p-10 text-center text-gray-500"
                >
                  No coupons found.
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr
                  key={coupon._id}
                  className="border-t transition hover:bg-[#FDFBF7]"
                >
                  <td className="p-4 font-semibold text-[#7A1F2B]">
                    {coupon.code}
                  </td>

                  <td className="p-4 text-gray-700">
                    {coupon.discountType}
                  </td>

                  <td className="p-4 font-medium text-gray-700">
                    {coupon.discountType ===
                    "Percentage"
                      ? `${coupon.discountValue}%`
                      : formatPrice(
                          coupon.discountValue
                        )}
                  </td>

                  <td className="p-4 text-gray-700">
                    {formatPrice(
                      Number(
                        coupon.minimumOrder
                      ) || 0
                    )}
                  </td>

                  <td className="p-4 text-gray-700">
                    {Number(
                      coupon.usedCount
                    ) || 0}
                    {" / "}
                    {Number(
                      coupon.usageLimit
                    ) === 0
                      ? "∞"
                      : Number(
                          coupon.usageLimit
                        ) || 0}
                  </td>

                  <td className="p-4 text-gray-700">
                    {formatDate(
                      coupon.expiryDate
                    )}
                  </td>

                  <td className="p-4">
                    <span
                      className={
                        coupon.active
                          ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                          : "rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600"
                      }
                    >
                      {coupon.active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleEditCoupon(
                            coupon
                          )
                        }
                        disabled={
                          saving ||
                          deletingId !==
                            null
                        }
                        className="rounded-lg bg-[#C9A227] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#B28D1F] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteCoupon(
                            coupon._id
                          )
                        }
                        disabled={
                          saving ||
                          deletingId !==
                            null
                        }
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId ===
                        coupon._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}