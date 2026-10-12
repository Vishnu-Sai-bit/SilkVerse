"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp,
  IndianRupee,
  ShoppingBag,
  Package,
  Users,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  PieChart,
  BarChart2,
  ArrowRight,
} from "lucide-react";

import {
  getAnalytics,
  getAdminOrders,
  getAdminProducts,
} from "@/services/api";

interface Analytics {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  revenue: number;
}

interface Order {
  _id: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

interface Product {
  _id: string;
  category: string;
  price: number;
  stock: number;
}

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);

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

export default function AnalyticsPage() {
  const router = useRouter();

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError("");

      const token = localStorage.getItem("silkverse-token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const [analyticsRes, ordersRes, productsRes] = await Promise.allSettled([
        getAnalytics(token),
        getAdminOrders(token),
        getAdminProducts(token),
      ]);

      if (analyticsRes.status === "fulfilled" && analyticsRes.value) {
        const data = analyticsRes.value;
        setAnalytics({
          totalUsers: Number(data.totalUsers) || 0,
          totalProducts: Number(data.totalProducts) || 0,
          totalOrders: Number(data.totalOrders) || 0,
          revenue: Number(data.revenue) || 0,
        });
      } else {
        throw new Error("Unable to retrieve store analytics.");
      }

      if (ordersRes.status === "fulfilled" && Array.isArray(ordersRes.value)) {
        setOrders(ordersRes.value);
      }

      if (productsRes.status === "fulfilled" && Array.isArray(productsRes.value)) {
        setProducts(productsRes.value);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load analytics.";

      if (isSessionError(message)) {
        localStorage.removeItem("silkverse-token");
        router.replace("/login?redirect=/admin/analytics");
        return;
      }

      setError(message);
      setAnalytics(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derived Analytics Computations
  const computedMetrics = useMemo(() => {
    const totalRevenue = analytics?.revenue || 0;
    const totalOrders = analytics?.totalOrders || 0;
    const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Payment Methods breakdown
    const paymentMethods: Record<string, { count: number; total: number }> = {};
    orders.forEach((o) => {
      const method = o.paymentMethod || "COD";
      if (!paymentMethods[method]) {
        paymentMethods[method] = { count: 0, total: 0 };
      }
      paymentMethods[method].count++;
      paymentMethods[method].total += o.totalAmount || 0;
    });

    // Order status breakdown
    const orderStatuses: Record<string, number> = {
      Pending: 0,
      Confirmed: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    orders.forEach((o) => {
      if (orderStatuses[o.orderStatus] !== undefined) {
        orderStatuses[o.orderStatus]++;
      }
    });

    // Category breakdown
    const categoryBreakdown: Record<string, { count: number; stock: number; inventoryValue: number }> = {};
    products.forEach((p) => {
      const cat = p.category || "Traditional";
      if (!categoryBreakdown[cat]) {
        categoryBreakdown[cat] = { count: 0, stock: 0, inventoryValue: 0 };
      }
      categoryBreakdown[cat].count++;
      categoryBreakdown[cat].stock += p.stock || 0;
      categoryBreakdown[cat].inventoryValue += (p.price || 0) * (p.stock || 0);
    });

    // Total Inventory Value
    let totalInventoryValue = 0;
    let totalStockUnits = 0;
    products.forEach((p) => {
      totalStockUnits += p.stock || 0;
      totalInventoryValue += (p.price || 0) * (p.stock || 0);
    });

    return {
      aov,
      paymentMethods,
      orderStatuses,
      categoryBreakdown,
      totalInventoryValue,
      totalStockUnits,
    };
  }, [analytics, orders, products]);

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7A1F2B] border-t-transparent" />
        <p className="text-sm font-medium text-stone-500">
          Generating SilkVerse Business Intelligence...
        </p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-12 text-center shadow-xs">
        <h2 className="font-serif text-xl font-bold text-stone-900">
          Unable to Load Analytics
        </h2>
        <p className="mt-1 text-xs text-stone-500">
          {error || "Analytics service could not be reached."}
        </p>
        <button
          type="button"
          onClick={() => loadData(true)}
          className="mt-5 rounded-lg bg-[#7A1F2B] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#5E141F]"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[#7A1F2B]/10 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase text-[#7A1F2B]">
              Intelligence & Trends
            </span>
          </div>
          <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#3B151E] sm:text-3xl">
            Sales & Operational Analytics
          </h1>
          <p className="mt-0.5 text-xs text-stone-500">
            Real-time financial performance, product category shares, and fulfillment trends.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadData(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 self-start rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 shadow-xs transition hover:bg-stone-50 sm:self-auto disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-[#7A1F2B]" : ""}`} />
          Refresh Data
        </button>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Gross Revenue */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-white via-white to-amber-50/40 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Gross Revenue
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37]/20 text-[#8C6D1F]">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-serif text-2xl font-bold text-[#3B151E]">
            {formatPrice(analytics.revenue)}
          </p>
          <p className="mt-2 text-[11px] text-stone-500">
            From verified paid transactions
          </p>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Average Order Value
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-serif text-2xl font-bold text-[#3B151E]">
            {formatPrice(computedMetrics.aov)}
          </p>
          <p className="mt-2 text-[11px] text-stone-500">
            Per completed checkout order
          </p>
        </div>

        {/* Total Warehoused Value */}
        <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Inventory Value
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-serif text-2xl font-bold text-[#3B151E]">
            {formatPrice(computedMetrics.totalInventoryValue)}
          </p>
          <p className="mt-2 text-[11px] text-stone-500">
            Across {computedMetrics.totalStockUnits} pure silk units
          </p>
        </div>

        {/* Customer Base */}
        <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Registered Accounts
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-serif text-2xl font-bold text-[#3B151E]">
            {analytics.totalUsers}
          </p>
          <p className="mt-2 text-[11px] text-stone-500">
            Shoppers & store operators
          </p>
        </div>
      </div>

      {/* Two Column Section: Category Distribution & Payment Channels */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Category Share & Inventory */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900">
                Weave & Category Distribution
              </h3>
              <p className="text-xs text-stone-500">
                Saree counts, units in stock, and inventory asset valuation
              </p>
            </div>
            <BarChart2 className="h-4 w-4 text-stone-400" />
          </div>

          <div className="mt-4 divide-y divide-stone-100">
            {Object.keys(computedMetrics.categoryBreakdown).length === 0 ? (
              <p className="py-6 text-center text-xs text-stone-400">
                No product categories available.
              </p>
            ) : (
              Object.entries(computedMetrics.categoryBreakdown).map(
                ([cat, info]) => {
                  const sharePct =
                    analytics.totalProducts > 0
                      ? Math.round((info.count / analytics.totalProducts) * 100)
                      : 0;

                  return (
                    <div key={cat} className="py-3.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-900 text-xs">
                          {cat}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#7A1F2B]">
                          {formatPrice(info.inventoryValue)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-stone-400">
                        <span>
                          {info.count} design variants • {info.stock} units total
                        </span>
                        <span>{sharePct}% of catalog</span>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                        <div
                          style={{ width: `${sharePct}%` }}
                          className="h-full bg-[#7A1F2B] rounded-full"
                        />
                      </div>
                    </div>
                  );
                }
              )
            )}
          </div>
        </div>

        {/* Payment Channels & Method Breakdown */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900">
                Payment Channel Breakdown
              </h3>
              <p className="text-xs text-stone-500">
                Order volume and revenue by transaction gateway
              </p>
            </div>
            <CreditCard className="h-4 w-4 text-stone-400" />
          </div>

          <div className="mt-4 space-y-4">
            {Object.keys(computedMetrics.paymentMethods).length === 0 ? (
              <p className="py-6 text-center text-xs text-stone-400">
                No orders recorded yet.
              </p>
            ) : (
              Object.entries(computedMetrics.paymentMethods).map(
                ([method, info]) => {
                  const totalOrdersCount = Math.max(1, orders.length);
                  const orderShare = Math.round(
                    (info.count / totalOrdersCount) * 100
                  );

                  return (
                    <div
                      key={method}
                      className="rounded-xl border border-stone-100 bg-stone-50/60 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-800 text-xs">
                            {method === "COD" ? "Cash on Delivery (COD)" : method}
                          </span>
                          <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-bold text-stone-700">
                            {info.count} orders ({orderShare}%)
                          </span>
                        </div>
                        <span className="font-serif font-bold text-stone-900 text-sm">
                          {formatPrice(info.total)}
                        </span>
                      </div>
                      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
                        <div
                          style={{ width: `${orderShare}%` }}
                          className="h-full bg-amber-600 rounded-full"
                        />
                      </div>
                    </div>
                  );
                }
              )
            )}
          </div>

          {/* Quick link */}
          <div className="mt-6 border-t border-stone-100 pt-4">
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A1F2B] hover:underline"
            >
              <span>Inspect all order receipts</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}