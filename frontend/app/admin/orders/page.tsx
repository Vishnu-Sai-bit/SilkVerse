"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  RefreshCw,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
} from "lucide-react";

import {
  getAdminOrders,
  updateAdminOrderStatus,
} from "@/services/api";
import { getProductImageUrl } from "@/utils/image";

// ======================================
// Types
// ======================================

interface OrderItem {
  product?: string;
  name?: string;
  image?: string;
  price?: number;
  quantity?: number;
}

interface Order {
  _id: string;
  user: {
    name?: string;
    email?: string;
    mobile?: string;
  } | null;
  items?: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus:
    | "Pending"
    | "Paid"
    | "Refunded"
    | "Failed";
  orderStatus:
    | "Pending"
    | "Confirmed"
    | "Shipped"
    | "Out for Delivery"
    | "Delivered"
    | "Cancelled";
  createdAt: string;
}

const getImageUrl = (image?: string) => getProductImageUrl(image);

const statuses = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
] as const;

type OrderStatus = (typeof statuses)[number];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);
}

function formatDate(date: string) {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "-";
  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
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
    case "Confirmed":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-800">
          Confirmed
        </span>
      );
    case "Pending":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
          <Clock className="h-3 w-3 text-amber-600" />
          Pending
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

function getPaymentBadge(status: string) {
  switch (status) {
    case "Paid":
      return (
        <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
          Paid
        </span>
      );
    case "Refunded":
      return (
        <span className="inline-block rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-800">
          Refunded
        </span>
      );
    case "Failed":
      return (
        <span className="inline-block rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-800">
          Failed
        </span>
      );
    case "Pending":
    default:
      return (
        <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
          Pending
        </span>
      );
  }
}

export default function AdminOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState("");
  const [error, setError] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState<string>("all");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("silkverse-token");
      if (!token) {
        setOrders([]);
        router.replace("/login");
        return;
      }

      const data = await getAdminOrders(token);
      setOrders(data || []);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load orders.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, status: OrderStatus) {
    if (updatingOrder) return;

    const previousOrder = orders.find((o) => o._id === id);
    if (!previousOrder) return;

    try {
      setUpdatingOrder(id);
      setError("");

      const token = localStorage.getItem("silkverse-token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const updatedOrder = await updateAdminOrderStatus(token, id, status);

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id
            ? {
                ...o,
                orderStatus: updatedOrder?.orderStatus ?? status,
                paymentStatus:
                  updatedOrder?.paymentStatus ??
                  (status === "Delivered" &&
                  o.paymentMethod === "COD" &&
                  o.paymentStatus === "Pending"
                    ? "Paid"
                    : o.paymentStatus),
              }
            : o
        )
      );

      toast.success(
        `Order #${id.slice(-6).toUpperCase()} updated to ${status}.`
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update order status.";
      toast.error(message);
      // Revert
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? previousOrder : o))
      );
    } finally {
      setUpdatingOrder("");
    }
  }

  // Counts for tabs
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: orders.length,
      Pending: 0,
      Confirmed: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    orders.forEach((o) => {
      if (counts[o.orderStatus] !== undefined) {
        counts[o.orderStatus]++;
      }
    });
    return counts;
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.user?.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.user?.mobile || "").includes(searchQuery);

      const matchesTab =
        statusTab === "all" || o.orderStatus === statusTab;

      return matchesSearch && matchesTab;
    });
  }, [orders, searchQuery, statusTab]);

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7A1F2B] border-t-transparent" />
        <p className="text-sm font-medium text-stone-500">
          Loading Orders & Dispatches...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[#7A1F2B]/10 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase text-[#7A1F2B]">
              Fulfillment & Sales
            </span>
          </div>
          <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#3B151E] sm:text-3xl">
            Orders & Shipments
          </h1>
          <p className="mt-0.5 text-xs text-stone-500">
            Track customer orders, manage delivery progress, and verify payments.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          className="inline-flex items-center gap-1.5 self-start rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 shadow-xs transition hover:bg-stone-50 sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-xs font-medium text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={loadOrders}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-stone-200 pb-2">
          {[
            { id: "all", label: "All Orders" },
            { id: "Pending", label: "Pending" },
            { id: "Confirmed", label: "Confirmed" },
            { id: "Shipped", label: "Shipped" },
            { id: "Delivered", label: "Delivered" },
            { id: "Cancelled", label: "Cancelled" },
          ].map((tab) => {
            const count = tabCounts[tab.id] || 0;
            const active = statusTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  active
                    ? "bg-[#7A1F2B] text-white shadow-xs"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    active ? "bg-white/20 text-white" : "bg-stone-200 text-stone-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, email, or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-xs text-stone-800 placeholder:text-stone-400 focus:border-[#7A1F2B] focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-400">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h2 className="mt-3 font-serif text-lg font-bold text-stone-800">
            No matching orders found
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            {searchQuery || statusTab !== "all"
              ? "No orders match your search filters."
              : "When customers place orders, they will appear right here."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-stone-200 bg-[#FAF9F6] text-stone-500">
                <tr>
                  <th className="px-5 py-3.5 font-semibold uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-5 py-3.5 font-semibold uppercase tracking-wider">
                    Sarees Ordered
                  </th>
                  <th className="px-5 py-3.5 font-semibold uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-5 py-3.5 font-semibold uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-5 py-3.5 font-semibold uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-5 py-3.5 font-semibold uppercase tracking-wider">
                    Fulfillment Status
                  </th>
                  <th className="px-5 py-3.5 font-semibold uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-5 py-3.5 font-semibold uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredOrders.map((order) => {
                  const isUpdating = updatingOrder === order._id;
                  const isLocked =
                    order.orderStatus === "Delivered" ||
                    order.orderStatus === "Cancelled";
                  const orderItems = Array.isArray(order.items) ? order.items : [];

                  return (
                    <tr
                      key={order._id}
                      className="transition hover:bg-stone-50/70"
                    >
                      {/* Order ID */}
                      <td className="whitespace-nowrap px-5 py-4 font-mono text-[11px] font-bold text-stone-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>

                      {/* Sarees Ordered */}
                      <td className="px-5 py-4">
                        {orderItems.length > 0 ? (
                          <div className="flex items-center gap-2.5 max-w-[230px]">
                            <div className="flex -space-x-2 overflow-hidden shrink-0">
                              {orderItems.slice(0, 3).map((item, idx) => (
                                <img
                                  key={idx}
                                  src={getImageUrl(item.image)}
                                  alt={item.name || "Saree"}
                                  className="h-10 w-8 rounded-md border border-white object-cover shadow-2xs bg-stone-100"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "/images/products/saree_1_kanchipuram_clean.png";
                                  }}
                                />
                              ))}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-stone-800 text-[11px]">
                                {orderItems[0]?.name || "Silk Saree"}
                              </p>
                              <p className="text-[10px] text-stone-400">
                                {orderItems.length > 1
                                  ? `+${orderItems.length - 1} more item(s)`
                                  : `Qty: ${orderItems[0]?.quantity || 1}`}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-stone-900">
                          {order.user?.name || "SilkVerse Customer"}
                        </p>
                        <p className="text-[10px] text-stone-400">
                          {order.user?.email || "—"}
                        </p>
                        {order.user?.mobile && (
                          <p className="text-[10px] text-stone-400">
                            {order.user.mobile}
                          </p>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-stone-900">
                        {formatPrice(order.totalAmount)}
                      </td>

                      {/* Payment */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <p className="font-medium text-stone-800">
                          {order.paymentMethod === "COD"
                            ? "Cash on Delivery"
                            : order.paymentMethod}
                        </p>
                        <div className="mt-1">
                          {getPaymentBadge(order.paymentStatus)}
                        </div>
                      </td>

                      {/* Order Status & Dropdown */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex flex-col gap-1.5">
                          <select
                            value={order.orderStatus}
                            disabled={isUpdating || isLocked}
                            onChange={(e) =>
                              handleStatusChange(
                                order._id,
                                e.target.value as OrderStatus
                              )
                            }
                            className="rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-800 shadow-xs focus:border-[#7A1F2B] focus:outline-none disabled:cursor-not-allowed disabled:bg-stone-50 disabled:opacity-60"
                          >
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>

                          <div>{getStatusBadge(order.orderStatus)}</div>

                          {isUpdating && (
                            <span className="text-[10px] text-stone-400">
                              Updating status...
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-5 py-4 text-stone-600">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/orders/${order._id}/invoice`}
                            className="inline-flex items-center rounded-lg border border-[#D4AF37]/50 bg-[#FBF8F3] px-2.5 py-1.5 text-[11px] font-semibold text-[#7A1F2B] transition hover:bg-[#7A1F2B] hover:text-white"
                          >
                            Invoice
                          </Link>
                          <button
                            type="button"
                            onClick={() => router.push(`/admin/orders/${order._id}`)}
                            className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-xs transition hover:border-[#7A1F2B] hover:text-[#7A1F2B]"
                          >
                            <Eye className="h-3 w-3" />
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}