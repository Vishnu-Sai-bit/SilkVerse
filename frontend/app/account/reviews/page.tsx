"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Upload,
  X,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getMyOrders, createReview } from "@/services/api";
import { getProductImageUrl } from "@/utils/image";

const getImageUrl = (image?: string) => getProductImageUrl(image);

interface ReviewItem {
  id: string;
  productId?: string;
  productName: string;
  productImage: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
  helpfulCount: number;
}

interface PendingReviewItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  orderId: string;
  deliveredDate: string;
}

const REVIEWS_STORAGE_KEY = "silkverse-my-published-reviews";

export default function MyReviewsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"published" | "pending">("published");

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [pendingItems, setPendingItems] = useState<PendingReviewItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Modal State for Writing Review
  const [selectedPending, setSelectedPending] = useState<PendingReviewItem | null>(null);
  const [modalRating, setModalRating] = useState(5);
  const [modalTitle, setModalTitle] = useState("");
  const [modalComment, setModalComment] = useState("");

  useEffect(() => {
    let savedReviews: ReviewItem[] = [];
    try {
      const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (raw) {
        savedReviews = JSON.parse(raw);
        setReviews(savedReviews);
      }
    } catch {
      // ignore storage error
    }

    const token = localStorage.getItem("silkverse-token");
    if (!token) return;

    getMyOrders(token)
      .then((orders) => {
        if (!Array.isArray(orders)) return;
        const reviewedProductIds = new Set(
          savedReviews.map((r) => r.productId).filter(Boolean)
        );
        const pendingMap = new Map<string, PendingReviewItem>();

        for (const order of orders) {
          if (order.orderStatus === "Cancelled") continue;
          const items = Array.isArray(order.items) ? order.items : [];
          for (const item of items) {
            const pid =
              typeof item.product === "string"
                ? item.product
                : item.product?._id || "";
            const key = pid || item.name;
            if (!key || reviewedProductIds.has(key) || pendingMap.has(key)) continue;

            pendingMap.set(key, {
              id: `${order._id}_${key}`,
              productId: pid,
              productName: item.name || "Handloom Pure Silk Saree",
              productImage: getImageUrl(item.image),
              orderId: String(order._id).slice(-8).toUpperCase(),
              deliveredDate: order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Recent Order",
            });
          }
        }

        const list = Array.from(pendingMap.values());
        setPendingItems(list);
        if (savedReviews.length === 0 && list.length > 0) {
          setActiveTab("pending");
        }
      })
      .catch(() => {
        // ignore fetch error
      });
  }, []);

  const handleHelpful = (id: string) => {
    setReviews((prev) => {
      const updated = prev.map((r) =>
        r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
      );
      try {
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    toast.success("Thank you for your feedback!");
  };

  const handleOpenWriteModal = (item: PendingReviewItem) => {
    setSelectedPending(item);
    setModalRating(5);
    setModalTitle("");
    setModalComment("");
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPending || submitting) return;
    if (!modalTitle.trim() || !modalComment.trim()) {
      toast.error("Please fill in both the review headline and detailed comments.");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("silkverse-token");

    if (token && selectedPending.productId) {
      try {
        await createReview(token, {
          productId: selectedPending.productId,
          rating: modalRating,
          comment: `${modalTitle.trim()} — ${modalComment.trim()}`,
        });
      } catch {
        // Even if already reviewed on backend, still record in user's Published tab
      }
    }

    const newRev: ReviewItem = {
      id: `rev_${Date.now()}`,
      productId: selectedPending.productId,
      productName: selectedPending.productName,
      productImage: selectedPending.productImage,
      rating: modalRating,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      title: modalTitle.trim(),
      comment: modalComment.trim(),
      verifiedBuyer: true,
      helpfulCount: 0,
    };

    setReviews((prev) => {
      const updated = [newRev, ...prev];
      try {
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setPendingItems((prev) => prev.filter((p) => p.id !== selectedPending.id));
    setSelectedPending(null);
    setSubmitting(false);
    setActiveTab("published");
    toast.success("Your review was published! Earned 150 Silk Points.");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6D001A]">
            <Star size={15} />
            <span>Community Voice</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2A26] mt-1">
            My Reviews &amp; Ratings
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Share your experience with fellow silk patrons and help honor our master pit-loom weavers.
          </p>
        </div>

        <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-bold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("published")}
            className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-lg transition ${
              activeTab === "published"
                ? "bg-[#6D001A] text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Published ({reviews.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-lg transition ${
              activeTab === "pending"
                ? "bg-[#6D001A] text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Awaiting Review ({pendingItems.length})
          </button>
        </div>
      </div>

      {/* TAB 1: PUBLISHED REVIEWS */}
      {activeTab === "published" ? (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-200 p-10 text-center text-xs text-stone-500">
              <Star size={28} className="mx-auto text-stone-300 mb-2" />
              <p className="font-bold text-stone-700">No reviews published yet</p>
              <p className="text-stone-400 mt-0.5">
                Share your feedback on delivered sarees to earn Silk Points.
              </p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
                      <Image
                        src={rev.productImage}
                        alt={rev.productName}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-[#2D2A26] line-clamp-1">
                        {rev.productName}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center text-[#D4AF37]">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={13}
                              className={
                                i < rev.rating
                                  ? "fill-[#D4AF37] text-[#D4AF37]"
                                  : "text-stone-200"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-stone-400 font-mono">
                          {rev.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {rev.verifiedBuyer && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                      <ShieldCheck size={13} className="text-emerald-600" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-stone-700 leading-relaxed">
                  <h5 className="font-bold text-sm text-[#6D001A]">
                    &ldquo;{rev.title}&rdquo;
                  </h5>
                  <p className="text-stone-600">{rev.comment}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <span className="text-[11px] text-stone-400">
                    Was this review helpful to you?
                  </span>
                  <button
                    type="button"
                    onClick={() => handleHelpful(rev.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1 text-[11px] font-semibold text-stone-600 hover:border-[#6D001A] hover:text-[#6D001A] transition cursor-pointer"
                  >
                    <ThumbsUp size={12} />
                    <span>Helpful ({rev.helpfulCount})</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* TAB 2: AWAITING REVIEW */
        <div className="space-y-4">
          {pendingItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-200 p-10 text-center text-xs text-stone-500">
              <CheckCircle2 size={28} className="mx-auto text-emerald-500 mb-2" />
              <p className="font-bold text-stone-700">All delivered sarees have been reviewed!</p>
              <p className="text-stone-400 mt-0.5">Thank you for helping our weaving community.</p>
            </div>
          ) : (
            pendingItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm sm:text-base font-bold text-[#2D2A26]">
                      {item.productName}
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5 font-mono">
                      Order #{item.orderId} • {item.deliveredDate}
                    </p>
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 mt-1">
                      <Sparkles size={12} />
                      <span>Review &amp; Earn 150 Silk Points</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenWriteModal(item)}
                  className="rounded-xl bg-[#6D001A] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#520013] transition shadow-xs cursor-pointer self-start sm:self-auto"
                >
                  Write Review
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* WRITE REVIEW MODAL */}
      {selectedPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-5 border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2D2A26]">
                  Write a Review
                </h3>
                <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                  {selectedPending.productName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPending(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating Picker */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-stone-700">Overall Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setModalRating(star)}
                      className="p-1 cursor-pointer transition hover:scale-110"
                    >
                      <Star
                        size={24}
                        className={
                          star <= modalRating
                            ? "fill-[#D4AF37] text-[#D4AF37]"
                            : "text-stone-200"
                        }
                      />
                    </button>
                  ))}
                  <span className="font-bold text-xs text-stone-600 ml-2">
                    {modalRating === 5
                      ? "Masterpiece (5/5)"
                      : modalRating === 4
                      ? "Very Good (4/5)"
                      : `${modalRating}/5`}
                  </span>
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-1 text-xs">
                <label className="font-bold text-stone-700">Review Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stunning weave and opulent border"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 p-2.5 text-xs focus:border-[#6D001A] focus:outline-none"
                />
              </div>

              {/* Detailed Review */}
              <div className="space-y-1 text-xs">
                <label className="font-bold text-stone-700">Detailed Feedback</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details about the silk texture, zari luster, drape comfort, and packaging..."
                  value={modalComment}
                  onChange={(e) => setModalComment(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 p-2.5 text-xs focus:border-[#6D001A] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#6D001A] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#520013] transition shadow-xs cursor-pointer"
              >
                Submit Review &amp; Claim 150 Points
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
