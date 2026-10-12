"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Crown,
  Gift,
  ArrowRight,
  Clock,
  CheckCircle2,
  Share2,
  ShoppingBag,
  Award,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getMyOrders } from "@/services/api";

interface PointHistoryItem {
  id: string;
  title: string;
  points: number;
  type: "credit" | "debit";
  date: string;
  reference: string;
}

const REDEEMED_STORAGE_KEY = "silkverse-redeemed-points-history";

export default function RewardPointsPage() {
  const { user } = useAuth();
  const [copiedReferral, setCopiedReferral] = useState(false);

  const [history, setHistory] = useState<PointHistoryItem[]>([
    {
      id: "pt_welcome",
      title: "Royal Welcome Sign-Up Bonus",
      points: 500,
      type: "credit",
      date: "Account Activated",
      reference: "Welcome Privilege #WELCOME500",
    },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("silkverse-token");
    const items: PointHistoryItem[] = [
      {
        id: "pt_welcome",
        title: "Royal Welcome Sign-Up Bonus",
        points: 500,
        type: "credit",
        date: "Account Activated",
        reference: "Welcome Privilege #WELCOME500",
      },
    ];

    try {
      const rawRev = localStorage.getItem("silkverse-my-published-reviews");
      if (rawRev) {
        const revs = JSON.parse(rawRev);
        if (Array.isArray(revs)) {
          revs.forEach((r: any, idx: number) => {
            items.unshift({
              id: `pt_rev_${r.id || idx}`,
              title: `Silk Mark Review: ${r.productName || "Handloom Saree"}`,
              points: 150,
              type: "credit",
              date: r.date || "Recent",
              reference: "Verified Patron Review",
            });
          });
        }
      }
    } catch {}

    try {
      const rawRedeemed = localStorage.getItem(REDEEMED_STORAGE_KEY);
      if (rawRedeemed) {
        const red = JSON.parse(rawRedeemed);
        if (Array.isArray(red)) {
          items.unshift(...red);
        }
      }
    } catch {}

    if (!token) {
      setHistory(items);
      return;
    }

    getMyOrders(token)
      .then((orders) => {
        if (Array.isArray(orders)) {
          orders.forEach((o: any) => {
            if (o.orderStatus === "Cancelled") return;
            const earned = Math.max(100, Math.round(Number(o.totalAmount || 0) / 20));
            const firstItemName = o.items?.[0]?.name || "Handloom Silk Saree";
            items.unshift({
              id: `pt_ord_${o._id}`,
              title: `Purchase Bonus: ${firstItemName}`,
              points: earned,
              type: "credit",
              date: o.createdAt
                ? new Date(o.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Recent Order",
              reference: `Order #${String(o._id).slice(-8).toUpperCase()}`,
            });
          });
        }
        setHistory([...items]);
      })
      .catch(() => {
        setHistory([...items]);
      });
  }, []);

  const points = history.reduce(
    (sum, item) => (item.type === "credit" ? sum + item.points : sum - item.points),
    0
  );
  const tier = points >= 2000 ? "Platinum Loom Patron" : "Gold Weave Connoisseur";
  const nextTierPoints = 2000;
  const progressPercent = Math.min(100, Math.round((points / nextTierPoints) * 100));

  const handleRedeem = (cost: number, value: string) => {
    if (points < cost) {
      toast.error(`You need at least ${cost} points to redeem this voucher.`);
      return;
    }
    const newDebit: PointHistoryItem = {
      id: `pt_redeem_${Date.now()}`,
      title: `Redeemed ${value} Checkout Voucher`,
      points: cost,
      type: "debit",
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      reference: `Voucher Code: SILK10`,
    };
    setHistory((prev) => [newDebit, ...prev]);
    try {
      const existing = JSON.parse(localStorage.getItem(REDEEMED_STORAGE_KEY) || "[]");
      localStorage.setItem(REDEEMED_STORAGE_KEY, JSON.stringify([newDebit, ...existing]));
    } catch {}
    toast.success(`Redeemed ${cost} points for ${value} voucher! Use code SILK10 at checkout.`);
  };

  const handleCopyReferral = () => {
    const code = user?.name ? `SILK-${user.name.split(" ")[0].toUpperCase()}500` : "SILK-ROYAL500";
    navigator.clipboard.writeText(code);
    setCopiedReferral(true);
    toast.success(`Referral code ${code} copied!`);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6D001A]">
            <Sparkles size={15} />
            <span>Royal Loyalty Program</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2A26] mt-1">
            Reward Points &amp; Privileges
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Earn Silk Points on every handloom acquisition and redeem for instant checkout discounts.
          </p>
        </div>

        <Link
          href="/collections"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#6D001A] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#520013] transition shadow-xs self-start sm:self-auto"
        >
          <ShoppingBag size={14} />
          <span>Shop &amp; Earn 10% Back</span>
        </Link>
      </div>

      {/* ROYAL TIER CARD HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#450010] via-[#6D001A] to-[#2B000A] p-6 sm:p-8 text-white shadow-xl border border-[#D4AF37]/40">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/60 px-3 py-1 text-[11px] font-bold tracking-wider uppercase text-[#D4AF37]">
              <Crown size={13} />
              <span>{tier}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {points.toLocaleString("en-IN")}{" "}
              <span className="text-lg font-sans font-normal text-amber-200">
                Silk Points
              </span>
            </h2>
            <p className="text-xs text-amber-100/80 max-w-sm">
              Equivalent to <strong className="text-[#D4AF37]">₹{points.toLocaleString("en-IN")}</strong> in checkout savings across authentic pure silk sarees.
            </p>
          </div>

          <div className="md:text-right bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 shrink-0 max-w-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-200 block">
              Tier Progression
            </span>
            <div className="flex items-center justify-between gap-4 text-xs font-semibold mt-1">
              <span>Gold Weave</span>
              <span className="text-[#D4AF37] font-bold">Platinum Loom (2,000 pts)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/20 mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-amber-200 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-white/70 mt-2">
              Only {Math.max(0, nextTierPoints - points)} points to unlock Free Luxury Gift Box &amp; Personal Stylist.
            </p>
          </div>
        </div>
      </div>

      {/* QUICK REDEEM VOUCHERS */}
      <div className="space-y-4">
        <h3 className="font-serif text-base font-bold text-[#2D2A26] flex items-center gap-2">
          <Gift size={18} className="text-[#6D001A]" />
          <span>Instant Checkout Vouchers</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Tier 1 Voucher
              </span>
              <h4 className="font-serif text-lg font-bold text-[#6D001A] mt-0.5">
                ₹500 OFF Voucher
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Redeem 500 Silk Points for ₹500 off on any purchase above ₹3,999.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleRedeem(500, "₹500 OFF")}
              disabled={points < 500}
              className={`w-full rounded-xl py-2 text-xs font-bold uppercase tracking-wider transition ${
                points >= 500
                  ? "bg-[#6D001A] text-white hover:bg-[#520013] cursor-pointer"
                  : "bg-stone-100 text-stone-400 cursor-not-allowed"
              }`}
            >
              Redeem 500 Pts
            </button>
          </div>

          <div className="rounded-2xl border border-[#D4AF37]/60 bg-amber-50/20 p-5 shadow-2xs space-y-3 flex flex-col justify-between relative overflow-hidden">
            <span className="absolute top-2 right-2 bg-[#D4AF37] text-[#450010] text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
              Most Popular
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Tier 2 Voucher
              </span>
              <h4 className="font-serif text-lg font-bold text-[#6D001A] mt-0.5">
                ₹1,000 OFF Voucher
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Redeem 1,000 Silk Points for ₹1,000 flat discount on bridal &amp; wedding silks.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleRedeem(1000, "₹1,000 OFF")}
              disabled={points < 1000}
              className={`w-full rounded-xl py-2 text-xs font-bold uppercase tracking-wider transition ${
                points >= 1000
                  ? "bg-[#6D001A] text-white hover:bg-[#520013] cursor-pointer"
                  : "bg-stone-100 text-stone-400 cursor-not-allowed"
              }`}
            >
              Redeem 1,000 Pts
            </button>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Tier 3 Voucher
              </span>
              <h4 className="font-serif text-lg font-bold text-[#6D001A] mt-0.5">
                ₹2,000 OFF Voucher
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Exclusive Platinum Loom voucher for heirloom Dharmavaram masterpieces.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleRedeem(2000, "₹2,000 OFF")}
              disabled={points < 2000}
              className={`w-full rounded-xl py-2 text-xs font-bold uppercase tracking-wider transition ${
                points >= 2000
                  ? "bg-[#6D001A] text-white hover:bg-[#520013] cursor-pointer"
                  : "bg-stone-100 text-stone-400 cursor-not-allowed"
              }`}
            >
              Redeem 2,000 Pts
            </button>
          </div>
        </div>
      </div>

      {/* HOW TO EARN POINTS */}
      <div className="rounded-2xl border border-stone-200 bg-[#FAF9F6] p-6 space-y-4">
        <h3 className="font-serif text-base font-bold text-[#2D2A26]">
          Ways to Accelerate Your Silk Points
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#6D001A] flex items-center justify-center font-bold">
              1
            </div>
            <h5 className="font-bold text-[#2D2A26]">Order Handloom Silks</h5>
            <p className="text-stone-500 leading-relaxed">
              Earn 10 Silk Points for every ₹100 spent on any saree in our catalog.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#6D001A] flex items-center justify-center font-bold">
              2
            </div>
            <h5 className="font-bold text-[#2D2A26]">Silk Mark Reviews</h5>
            <p className="text-stone-500 leading-relaxed">
              Earn 150 points for every verified customer review with saree photographs.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#6D001A] flex items-center justify-center font-bold">
              3
            </div>
            <h5 className="font-bold text-[#2D2A26]">Refer a Connoisseur</h5>
            <p className="text-stone-500 leading-relaxed">
              Share your code. Give ₹500 off to friends and get 500 points when they buy.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-200/80">
          <div className="text-xs text-stone-600">
            <span>Your Exclusive Referral Code: </span>
            <span className="font-mono font-bold text-[#6D001A]">
              {user?.name ? `SILK-${user.name.split(" ")[0].toUpperCase()}500` : "SILK-VISHNU500"}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyReferral}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-stone-300 px-3 py-1.5 text-xs font-bold text-stone-700 hover:border-[#6D001A] hover:text-[#6D001A] transition cursor-pointer self-start sm:self-auto"
          >
            {copiedReferral ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            <span>{copiedReferral ? "Copied!" : "Copy Code"}</span>
          </button>
        </div>
      </div>

      {/* ACTIVITY HISTORY LEDGER */}
      <div className="space-y-3">
        <h3 className="font-serif text-base font-bold text-[#2D2A26] flex items-center gap-2">
          <Clock size={16} className="text-[#6D001A]" />
          <span>Points History</span>
        </h3>

        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div className="divide-y divide-stone-100">
            {history.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between p-4 text-xs transition hover:bg-stone-50/60"
              >
                <div>
                  <h5 className="font-bold text-stone-800">{h.title}</h5>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {h.date} • {h.reference}
                  </p>
                </div>
                <span
                  className={`font-mono font-bold text-sm ${
                    h.type === "credit" ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {h.type === "credit" ? "+" : "-"}
                  {h.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
