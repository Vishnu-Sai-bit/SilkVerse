"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Plus,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Tag,
  IndianRupee,
  ShieldAlert,
} from "lucide-react";

import {
  getAdminDashboard,
  getAdminOrders,
  getAdminProducts,
} from "@/services/api";
import { getProductImageUrl } from "@/utils/image";

// ======================================
// Types
// ======================================

interface DashboardData {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}

interface OrderItem {
  _id: string;
  user: {
    name?: string;
    email?: string;
  } | null;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Refunded" | "Failed";
  orderStatus:
    | "Pending"
    | "Confirmed"
    | "Shipped"
    | "Out for Delivery"
    | "Delivered"
    | "Cancelled";
  createdAt: string;
}

interface ProductItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  images?: string[];
}

// ======================================
// Helpers
// ======================================

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const API_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/, "");

const getImageUrl = (image?: string) => getProductImageUrl(image);

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case "Delivered":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          Delivered
        </span>
      );
    case "Shipped":
    case "Out for Delivery":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-800">
          <Truck className="h-3 w-3 text-blue-600" />
          {status}
        </span>
      );
    case "Pending":
    case "Confirmed":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
          <Clock className="h-3 w-3 text-amber-600" />
          {status}
        </span>
      );
    case "Cancelled":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-800">
          <XCircle className="h-3 w-3 text-rose-600" />
          Cancelled
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-medium text-stone-700">
          {status}
        </span>
      );
  }
}

// ======================================
// Main Admin Dashboard Component
// ======================================

export default function AdminDashboardPage() {
  const router = useRouter();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "catalog">("orders");

  async function loadData(showToast = false) {
    try {
      if (showToast) setRefreshing(true);
      else setLoading(true);

      const token = localStorage.getItem("silkverse-token");
      if (!token) {
        router.replace("/login");
        return;
      }

      // Fetch dashboard counts, recent orders, and products in parallel
      const [dashRes, ordersRes, productsRes] = await Promise.allSettled([
        getAdminDashboard(token),
        getAdminOrders(token),
        getAdminProducts(token),
      ]);

      if (dashRes.status === "fulfilled" && dashRes.value) {
        setDashboard(dashRes.value);
      } else {
        throw new Error("Unable to retrieve dashboard metrics.");
      }

      if (ordersRes.status === "fulfilled" && Array.isArray(ordersRes.value)) {
        setOrders(ordersRes.value);
      }

      if (productsRes.status === "fulfilled" && Array.isArray(productsRes.value)) {
        setProducts(productsRes.value);
      }

      if (showToast) {
        toast.success("Dashboard metrics refreshed successfully");
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to load dashboard data.";
      toast.error(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Low stock products (< 6 units)
  const lowStockProducts = useMemo(() => {
    return products
      .filter((p) => typeof p.stock === "number" && p.stock <= 5)
      .sort((a, b) => a.stock - b.stock);
  }, [products]);

  // Recent 6 orders
  const recentOrders = useMemo(() => {
    return orders.slice(0, 6);
  }, [orders]);

  // Featured / Top 8 Products
  const topProducts = useMemo(() => {
    return products.slice(0, 8);
  }, [products]);

  // Average Order Value
  const averageOrderValue = useMemo(() => {
    if (!dashboard || dashboard.totalOrders === 0) return 0;
    return Math.round(dashboard.totalRevenue / Math.max(1, dashboard.totalOrders));
  }, [dashboard]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7A1F2B] border-t-transparent" />
        <p className="text-sm font-medium text-stone-500">
          Loading SilkVerse executive metrics...
        </p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-serif text-xl font-bold text-stone-900">
          Unable to Load Store Overview
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Please check your admin session or database connection.
        </p>
        <button
          type="button"
          onClick={() => loadData(true)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#7A1F2B] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#5E141F]"
        >
          <RefreshCw className="h-4 w-4" />
          Retry Connection
        </button>
      </div>
    );
  }

  // Calculate order fulfillment percentages
  const totalOrds = Math.max(1, dashboard.totalOrders);
  const pendingPct = Math.round((dashboard.pendingOrders / totalOrds) * 100);
  const shippedPct = Math.round((dashboard.shippedOrders / totalOrds) * 100);
  const deliveredPct = Math.round((dashboard.deliveredOrders / totalOrds) * 100);
  const cancelledPct = Math.round((dashboard.cancelledOrders / totalOrds) * 100);

  return (
    <div className="space-y-8">
      {/* =========================================================
          PAGE HERO & REFRESH ACTION
      ========================================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[#7A1F2B]/10 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase text-[#7A1F2B]">
              Executive Overview
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs text-stone-500">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#3B151E] sm:text-3xl">
            Store Performance & Operations
          </h1>
          <p className="mt-0.5 text-xs text-stone-500">
            Real-time analytics, order dispatch pipeline, and inventory status in ₹ (INR).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 shadow-xs transition hover:bg-stone-50 disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-[#7A1F2B]" : ""}`} />
            Refresh
          </button>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#7A1F2B] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#5E141F]"
          >
            <Plus className="h-3.5 w-3.5" />
            New Saree
          </Link>
        </div>
      </div>

      {/* =========================================================
          KEY PERFORMANCE INDICATORS (4-CARD GRID)
      ========================================================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue - Indian Rupee */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-white via-white to-amber-50/40 p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Total Revenue
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37]/20 text-[#8C6D1F]">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-serif text-2xl font-bold text-[#3B151E]">
            {formatPrice(dashboard.totalRevenue)}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500">
            <span>Verified Paid Orders</span>
            <span className="font-semibold text-emerald-700">AOV: {formatPrice(averageOrderValue)}</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Total Orders
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7A1F2B]/10 text-[#7A1F2B]">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-serif text-2xl font-bold text-[#3B151E]">
            {dashboard.totalOrders}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-stone-500">Pending Dispatch:</span>
            <span className="font-bold text-amber-700">{dashboard.pendingOrders} to pack</span>
          </div>
        </div>

        {/* Saree Catalog */}
        <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Saree Catalog
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-serif text-2xl font-bold text-[#3B151E]">
            {products.length || dashboard.totalProducts}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-stone-500">Inventory Status:</span>
            <Link
              href="/admin/products"
              className="font-semibold text-[#7A1F2B] hover:underline"
            >
              View all {products.length} →
            </Link>
          </div>
        </div>

        {/* Registered Customers */}
        <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Customer Base
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-serif text-2xl font-bold text-[#3B151E]">
            {dashboard.totalUsers}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500">
            <span>SilkVerse Patrons</span>
            <Link
              href="/admin/users"
              className="font-medium text-[#7A1F2B] hover:underline"
            >
              View list →
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================
          ORDER FULFILLMENT FUNNEL
      ========================================================= */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-base font-bold text-stone-900">
              Fulfillment & Dispatch Pipeline
            </h2>
            <p className="text-xs text-stone-500">
              Current stage distribution across all {dashboard.totalOrders} registered orders
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#7A1F2B] hover:underline"
          >
            Manage all orders
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Multi-segment progress bar */}
        <div className="mt-4 h-3.5 w-full overflow-hidden rounded-full bg-stone-100 flex shadow-inner">
          <div
            style={{ width: `${pendingPct}%` }}
            className="bg-amber-400 transition-all duration-500"
            title={`Pending: ${dashboard.pendingOrders} (${pendingPct}%)`}
          />
          <div
            style={{ width: `${shippedPct}%` }}
            className="bg-blue-500 transition-all duration-500"
            title={`Shipped: ${dashboard.shippedOrders} (${shippedPct}%)`}
          />
          <div
            style={{ width: `${deliveredPct}%` }}
            className="bg-emerald-500 transition-all duration-500"
            title={`Delivered: ${dashboard.deliveredOrders} (${deliveredPct}%)`}
          />
          <div
            style={{ width: `${cancelledPct}%` }}
            className="bg-rose-400 transition-all duration-500"
            title={`Cancelled: ${dashboard.cancelledOrders} (${cancelledPct}%)`}
          />
        </div>

        {/* Breakdown chips */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/50 p-3 transition hover:bg-amber-50"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-600">Pending</p>
              <p className="text-lg font-bold text-amber-900">
                {dashboard.pendingOrders}{" "}
                <span className="text-[10px] font-normal text-amber-700">
                  ({pendingPct}%)
                </span>
              </p>
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3 transition hover:bg-blue-50"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-600">Shipped</p>
              <p className="text-lg font-bold text-blue-900">
                {dashboard.shippedOrders}{" "}
                <span className="text-[10px] font-normal text-blue-700">
                  ({shippedPct}%)
                </span>
              </p>
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 transition hover:bg-emerald-50"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-600">Delivered</p>
              <p className="text-lg font-bold text-emerald-900">
                {dashboard.deliveredOrders}{" "}
                <span className="text-[10px] font-normal text-emerald-700">
                  ({deliveredPct}%)
                </span>
              </p>
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50/50 p-3 transition hover:bg-rose-50"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-800">
              <XCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-600">Cancelled</p>
              <p className="text-lg font-bold text-rose-900">
                {dashboard.cancelledOrders}{" "}
                <span className="text-[10px] font-normal text-rose-700">
                  ({cancelledPct}%)
                </span>
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* =========================================================
          MAIN TWO-COLUMN WORKSPACE: TABS FOR ORDERS & CATALOG
      ========================================================= */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Tabbed Section (Recent Orders OR All Sarees Catalog) (2 Cols) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Card Shell with Toggleable Tabs */}
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
            {/* Header Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-stone-200 px-4 sm:px-6 py-3.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    activeTab === "orders"
                      ? "bg-[#7A1F2B] text-white shadow-xs"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  Recent Orders ({orders.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("catalog")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    activeTab === "catalog"
                      ? "bg-[#7A1F2B] text-white shadow-xs"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  Saree Catalog ({products.length})
                </button>
              </div>

              {activeTab === "orders" ? (
                <Link
                  href="/admin/orders"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#7A1F2B] hover:underline"
                >
                  View All Orders
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <Link
                  href="/admin/products"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#7A1F2B] hover:underline"
                >
                  Manage All {products.length} Sarees
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

            {/* TAB 1: RECENT ORDERS */}
            {activeTab === "orders" && (
              <div>
                {recentOrders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-500">
                    No orders received yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF9F6] text-stone-500">
                        <tr>
                          <th className="px-5 py-3 font-semibold uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-5 py-3 font-semibold uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-5 py-3 font-semibold uppercase tracking-wider">
                            Amount (₹)
                          </th>
                          <th className="px-5 py-3 font-semibold uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-5 py-3 font-semibold uppercase tracking-wider text-right">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-stone-700">
                        {recentOrders.map((ord) => (
                          <tr
                            key={ord._id}
                            className="transition hover:bg-stone-50/70"
                          >
                            <td className="whitespace-nowrap px-5 py-3.5 font-mono text-[11px] font-bold text-stone-900">
                              #{ord._id.slice(-6).toUpperCase()}
                              <div className="text-[10px] font-normal text-stone-400">
                                {formatDate(ord.createdAt)}
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <p className="font-medium text-stone-900">
                                {ord.user?.name || "SilkVerse Patron"}
                              </p>
                              <p className="text-[10px] text-stone-400 truncate max-w-[140px]">
                                {ord.user?.email || "—"}
                              </p>
                            </td>
                            <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-stone-900">
                              {formatPrice(ord.totalAmount)}
                              <div className="text-[10px] font-normal text-stone-400">
                                {ord.paymentMethod}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-5 py-3.5">
                              {getStatusBadge(ord.orderStatus)}
                            </td>
                            <td className="whitespace-nowrap px-5 py-3.5 text-right">
                              <Link
                                href={`/admin/orders/${ord._id}`}
                                className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-medium text-stone-700 hover:border-[#7A1F2B] hover:text-[#7A1F2B]"
                              >
                                Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SAREE CATALOG OVERVIEW */}
            {activeTab === "catalog" && (
              <div>
                {topProducts.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-500">
                    No sarees catalogued yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF9F6] text-stone-500">
                        <tr>
                          <th className="px-5 py-3 font-semibold uppercase tracking-wider">
                            Saree
                          </th>
                          <th className="px-5 py-3 font-semibold uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-5 py-3 font-semibold uppercase tracking-wider">
                            Price (₹)
                          </th>
                          <th className="px-5 py-3 font-semibold uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-5 py-3 font-semibold uppercase tracking-wider text-right">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-stone-700">
                        {topProducts.map((p) => {
                          const pImg = p.image || p.images?.[0];
                          const imgSrc = getImageUrl(pImg);

                          return (
                            <tr
                              key={p._id}
                              className="transition hover:bg-stone-50/70"
                            >
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="relative h-11 w-9 shrink-0 overflow-hidden rounded-md border border-stone-200 bg-stone-100">
                                    <img
                                      src={imgSrc}
                                      alt={p.name}
                                      className="h-full w-full object-cover"
                                      onError={(e) => {
                                        const target = e.currentTarget;
                                        const filename = (pImg || "").replace(/^.*[\\\/]/, "");
                                        if (filename && !target.src.includes(`/images/products/${filename}`)) {
                                          target.src = `/images/products/${filename}`;
                                        } else {
                                          target.src = "/images/products/saree_1_maroon.png";
                                        }
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-stone-900 line-clamp-1">
                                      {p.name}
                                    </p>
                                    <p className="font-mono text-[10px] text-stone-400">
                                      #{p._id.slice(-6).toUpperCase()}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="whitespace-nowrap px-5 py-3 text-stone-600">
                                <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-medium">
                                  {p.category}
                                </span>
                              </td>

                              <td className="whitespace-nowrap px-5 py-3 font-semibold text-stone-900">
                                {formatPrice(p.price)}
                              </td>

                              <td className="whitespace-nowrap px-5 py-3">
                                {p.stock === 0 ? (
                                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                                    Out of Stock
                                  </span>
                                ) : p.stock <= 5 ? (
                                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                                    {p.stock} left (Low)
                                  </span>
                                ) : (
                                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                                    {p.stock} units
                                  </span>
                                )}
                              </td>

                              <td className="whitespace-nowrap px-5 py-3 text-right">
                                <Link
                                  href={`/admin/products/${p._id}`}
                                  className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-medium text-stone-700 hover:border-[#7A1F2B] hover:text-[#7A1F2B]"
                                >
                                  Edit
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Operations Strip */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href="/admin/products/new"
              className="group flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition hover:border-[#D4AF37] hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7A1F2B]/10 text-[#7A1F2B] transition group-hover:scale-110">
                  <Package className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-stone-400 transition group-hover:translate-x-1 group-hover:text-[#7A1F2B]" />
              </div>
              <div className="mt-4">
                <h4 className="font-serif text-sm font-bold text-stone-900">
                  Add New Saree
                </h4>
                <p className="mt-0.5 text-xs text-stone-500">
                  Upload silk imagery, set price in ₹, weave, and stock.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/coupons"
              className="group flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition hover:border-[#D4AF37] hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 transition group-hover:scale-110">
                  <Tag className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-stone-400 transition group-hover:translate-x-1 group-hover:text-[#7A1F2B]" />
              </div>
              <div className="mt-4">
                <h4 className="font-serif text-sm font-bold text-stone-900">
                  Coupons & Promos
                </h4>
                <p className="mt-0.5 text-xs text-stone-500">
                  Create festive discounts, min cart limits in ₹, and codes.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/analytics"
              className="group flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition hover:border-[#D4AF37] hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 transition group-hover:scale-110">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-stone-400 transition group-hover:translate-x-1 group-hover:text-[#7A1F2B]" />
              </div>
              <div className="mt-4">
                <h4 className="font-serif text-sm font-bold text-stone-900">
                  Deep Analytics
                </h4>
                <p className="mt-0.5 text-xs text-stone-500">
                  Review revenue, average order value in ₹, and payment trends.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Right: Low Stock Alerts & Store Health (1 Col) */}
        <div className="space-y-6">
          {/* Low Stock Watch */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-stone-900">
                    Low Stock Alerts
                  </h3>
                  <p className="text-[10px] text-stone-400">
                    Sarees with 5 or fewer items remaining
                  </p>
                </div>
              </div>
              <Link
                href="/admin/products"
                className="text-xs font-semibold text-[#7A1F2B] hover:underline"
              >
                View Catalog
              </Link>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
                <p className="mt-2 text-xs font-semibold text-stone-700">
                  Inventory is Healthy
                </p>
                <p className="text-[11px] text-stone-400">
                  All active sarees have more than 5 pieces in stock.
                </p>
              </div>
            ) : (
              <div className="mt-3 divide-y divide-stone-100">
                {lowStockProducts.map((p) => {
                  const pImg = p.image || p.images?.[0];
                  const imgSrc = getImageUrl(pImg);

                  return (
                    <div
                      key={p._id}
                      className="flex items-center justify-between py-3 transition hover:bg-stone-50/50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                          <img
                            src={imgSrc}
                            alt={p.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget;
                              const filename = (pImg || "").replace(/^.*[\\\/]/, "");
                              if (filename && !target.src.includes(`/images/products/${filename}`)) {
                                target.src = `/images/products/${filename}`;
                              } else {
                                target.src = "/images/products/saree_1_maroon.png";
                              }
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-stone-900">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-stone-400">
                            {p.category} • {formatPrice(p.price)}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            p.stock === 0
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {p.stock === 0 ? "Out of Stock" : `${p.stock} left`}
                        </span>
                        <div>
                          <Link
                            href={`/admin/products/${p._id}`}
                            className="text-[10px] font-semibold text-[#7A1F2B] hover:underline"
                          >
                            Restock →
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick System & Security Status */}
          <div className="rounded-2xl border border-stone-200 bg-gradient-to-br from-[#4A0E17] to-[#30080F] p-5 text-white shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-200/80">
                System & Security
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                Healthy
              </span>
            </div>

            <h4 className="mt-3 font-serif text-base font-bold text-[#F9F5EB]">
              SilkVerse Production Cluster
            </h4>
            <p className="mt-1 text-xs text-rose-100/70">
              MongoDB, JWT Auth, and CDN Media delivery operating with full integrity.
            </p>

            <div className="mt-4 border-t border-white/10 pt-3">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-xs font-medium text-[#D4AF37] hover:text-[#F5E6BE]"
              >
                <span>Browse Storefront as Shopper</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}