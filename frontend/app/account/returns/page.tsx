"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  PackageCheck,
  HelpCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getMyOrders } from "@/services/api";
import { getProductImageUrl } from "@/utils/image";

const getImageUrl = (image?: string) => getProductImageUrl(image);

interface ReturnRequest {
  id: string;
  orderId: string;
  productName: string;
  productImage: string;
  amount: number;
  reason: string;
  status: "Refund Processed" | "Pickup Scheduled" | "Under Inspection";
  steps: { title: string; completed: boolean; date?: string }[];
  refundDestination: string;
}

interface OrderOption {
  orderId: string;
  productName: string;
  productImage: string;
  amount: number;
}

const RETURNS_STORAGE_KEY = "silkverse-my-returns";

export default function ReturnsAndRefundsPage() {
  const { user } = useAuth();

  const [returnHistory, setReturnHistory] = useState<ReturnRequest[]>([]);
  const [orderOptions, setOrderOptions] = useState<OrderOption[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [resolutionType, setResolutionType] = useState<"bank" | "credit">("bank");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RETURNS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setReturnHistory(parsed);
      }
    } catch {
      // ignore storage error
    }

    const token = localStorage.getItem("silkverse-token");
    if (!token) return;

    getMyOrders(token)
      .then((orders) => {
        if (!Array.isArray(orders)) return;
        const opts: OrderOption[] = [];
        for (const order of orders) {
          if (order.orderStatus === "Cancelled") continue;
          const firstItem = Array.isArray(order.items) && order.items[0] ? order.items[0] : null;
          opts.push({
            orderId: String(order._id).slice(-8).toUpperCase(),
            productName: firstItem?.name || "Handloom Pure Silk Saree",
            productImage: getImageUrl(firstItem?.image),
            amount: Number(firstItem?.price || order.totalAmount || 12999),
          });
        }
        setOrderOptions(opts);
      })
      .catch(() => {});
  }, []);

  const handleInitiateReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) {
      toast.error("Please select an order.");
      return;
    }
    if (!returnReason) {
      toast.error("Please select a reason for return.");
      return;
    }

    const matched = orderOptions.find((o) => o.orderId === selectedOrder);
    const todayStr = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newRequest: ReturnRequest = {
      id: `RET-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: selectedOrder,
      productName: matched?.productName || "Handloom Pure Silk Saree",
      productImage: matched?.productImage || "/images/products/saree_1_kanchipuram_clean.png",
      amount: matched?.amount || 12999,
      reason: returnReason,
      status: "Pickup Scheduled",
      refundDestination:
        resolutionType === "credit"
          ? "Instant SilkVerse Store Credit Wallet"
          : "Refund to Original Payment Source (3-5 Business Days)",
      steps: [
        { title: "Return Request Approved", completed: true, date: todayStr },
        { title: "Doorstep Pickup Scheduled", completed: true, date: "Within 24-48 hrs" },
        { title: "Silk Mark Quality Inspection", completed: false },
        { title: "Refund / Exchange Settlement", completed: false },
      ],
    };

    setReturnHistory((prev) => {
      const updated = [newRequest, ...prev];
      try {
        localStorage.setItem(RETURNS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setIsModalOpen(false);
    setSelectedOrder("");
    setReturnReason("");
    toast.success("Return request submitted! Doorstep pickup scheduled within 24-48 hours.");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6D001A]">
            <RotateCcw size={15} />
            <span>Hassle-Free Assurance</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2A26] mt-1">
            Returns &amp; Refunds
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Enjoy our 7-day doorstep return policy with tamper-proof Silk Mark protection.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#6D001A] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#520013] transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw size={14} />
          <span>Request Return / Exchange</span>
        </button>
      </div>

      {/* 7-DAY POLICY HIGHLIGHT BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#6D001A] flex items-center justify-center">
            <Truck size={18} />
          </div>
          <h4 className="font-serif text-sm font-bold text-[#2D2A26]">
            Free Doorstep Pickup
          </h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            Our insured courier partners collect the saree directly from your residence at no additional charge.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#6D001A] flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <h4 className="font-serif text-sm font-bold text-[#2D2A26]">
            Silk Mark Intact Inspection
          </h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            We ensure sarees are unworn with original tags and authentication ribbons intact.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#6D001A] flex items-center justify-center">
            <CheckCircle2 size={18} />
          </div>
          <h4 className="font-serif text-sm font-bold text-[#2D2A26]">
            Swift Bank Refunds
          </h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            Refunds are credited back to your original source account or card within 3-5 business days.
          </p>
        </div>
      </div>

      {/* PAST & ACTIVE RETURN REQUESTS */}
      <div className="space-y-4">
        <h3 className="font-serif text-base font-bold text-[#2D2A26] flex items-center gap-2">
          <span>Return &amp; Refund History</span>
        </h3>

        {returnHistory.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-200 p-10 text-center text-xs text-stone-500">
            No active return or refund requests found.
          </div>
        ) : (
          <div className="space-y-4">
            {returnHistory.map((ret) => (
              <div
                key={ret.id}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
                      <Image
                        src={ret.productImage}
                        alt={ret.productName}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#6D001A]">
                          Return #{ret.id}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                          {ret.status}
                        </span>
                      </div>
                      <h4 className="font-serif text-sm sm:text-base font-bold text-[#2D2A26] mt-0.5">
                        {ret.productName}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        Associated Order: <span className="font-mono">{ret.orderId}</span>
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                      Refund Amount
                    </span>
                    <span className="font-serif text-lg font-bold text-[#6D001A]">
                      ₹{ret.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Progress Steps Timeline */}
                <div className="py-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {ret.steps.map((st, i) => (
                      <div
                        key={st.title}
                        className="rounded-xl border border-stone-100 bg-stone-50/70 p-3 space-y-1 relative"
                      >
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-[11px]">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                          <span>Step {i + 1}</span>
                        </div>
                        <p className="font-semibold text-stone-800 text-xs">{st.title}</p>
                        {st.date && (
                          <span className="text-[10px] text-stone-400 block font-mono">
                            {st.date}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 text-xs text-stone-500 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100">
                  <span>{ret.refundDestination}</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck size={14} /> Closed &amp; Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RETURN POLICY FAQ ACCORDION */}
      <div className="rounded-2xl border border-stone-200 bg-[#FAF9F6] p-6 space-y-4 text-xs">
        <h3 className="font-serif text-base font-bold text-[#2D2A26] flex items-center gap-2">
          <HelpCircle size={16} className="text-[#6D001A]" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-3 text-stone-600">
          <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1">
            <h5 className="font-bold text-stone-800">What is the return window for silk sarees?</h5>
            <p className="leading-relaxed">
              You can initiate a return or exchange within 7 days of receiving the delivery parcel. The saree must remain unwashed, unstitched, with the Silk Mark tag and blouse piece intact.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1">
            <h5 className="font-bold text-stone-800">Can I exchange for a different color or silk variety?</h5>
            <p className="leading-relaxed">
              Yes. If you prefer a different shade or weave (e.g. Banarasi instead of Kanchipuram), choose &ldquo;Exchange&rdquo; when submitting your return request.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1">
            <h5 className="font-bold text-stone-800">How long does the refund take to reflect?</h5>
            <p className="leading-relaxed">
              Once our artisan weavers verify the saree authenticity at our fulfillment center, refunds are processed within 24 hours and reflect in your bank account in 3-5 business days.
            </p>
          </div>
        </div>
      </div>

      {/* REQUEST RETURN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5 border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#2D2A26]">
                Initiate Saree Return
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInitiateReturn} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700">Select Order</label>
                <select
                  required
                  value={selectedOrder}
                  onChange={(e) => setSelectedOrder(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 p-2.5 focus:border-[#6D001A] focus:outline-none"
                >
                  <option value="">-- Choose order --</option>
                  {orderOptions.length > 0 ? (
                    orderOptions.map((opt) => (
                      <option key={opt.orderId} value={opt.orderId}>
                        Order #{opt.orderId} - {opt.productName}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No eligible orders found
                    </option>
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Reason for Return</label>
                <select
                  required
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 p-2.5 focus:border-[#6D001A] focus:outline-none"
                >
                  <option value="">-- Select reason --</option>
                  <option value="Color differed slightly from screen photography">Color differed slightly from screen photography</option>
                  <option value="Looking for softer silk drape / soft silk">Looking for softer silk drape / soft silk</option>
                  <option value="Wish to exchange for a bridal heirloom piece">Wish to exchange for a bridal heirloom piece</option>
                  <option value="Other reason">Other reason</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Preferred Resolution</label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="inline-flex items-center gap-1.5 font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="res"
                      checked={resolutionType === "bank"}
                      onChange={() => setResolutionType("bank")}
                      className="accent-[#6D001A]"
                    />
                    <span>Refund to Bank / Card</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="res"
                      checked={resolutionType === "credit"}
                      onChange={() => setResolutionType("credit")}
                      className="accent-[#6D001A]"
                    />
                    <span>Store Credit (Instant)</span>
                  </label>
                </div>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5 text-amber-700" />
                <span>Please ensure the saree is packed in its original SilkVerse box with the authentication tag intact.</span>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#6D001A] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#520013] transition shadow-xs cursor-pointer"
              >
                Submit Return Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
