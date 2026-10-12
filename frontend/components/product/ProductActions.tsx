"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Heart, ShoppingCart, Zap, ShieldCheck, Truck, RefreshCw, Award, Check, Minus, Plus, ArrowRight, Share2, Copy } from "lucide-react";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getProductById,
} from "@/services/api";

import { useCart } from "@/context/CartContext";

// ======================================
// Helper: Get Color Hex
// ======================================

function getColorHex(colorName: string): string {
  const lower = (colorName || "").toLowerCase();
  if (lower.includes("olive")) return "#7A842E";
  if (lower.includes("mehendi") || lower.includes("moss")) return "#5E7128";
  if (lower.includes("sea green") || lower.includes("seafoam")) return "#2E8B78";
  if (lower.includes("mint") || lower.includes("sage") || lower.includes("pistachio")) return "#68A38B";
  if (lower.includes("bottle green") || lower.includes("emerald") || lower.includes("green")) return "#0F5132";
  if (lower.includes("sky blue") || lower.includes("powder") || lower.includes("sea blue")) return "#5B9BD5";
  if (lower.includes("peacock") || lower.includes("turquoise") || lower.includes("teal")) return "#0D5C75";
  if (lower.includes("navy") || lower.includes("midnight blue")) return "#1B263B";
  if (lower.includes("indigo")) return "#2E2B5F";
  if (lower.includes("royal blue") || lower.includes("sapphire") || lower.includes("blue")) return "#1D3557";
  if (lower.includes("peach") || lower.includes("blush") || lower.includes("apricot")) return "#E89980";
  if (lower.includes("dusty rose")) return "#B56576";
  if (lower.includes("coral")) return "#D95F43";
  if (lower.includes("rani") || lower.includes("magenta") || lower.includes("fuchsia") || lower.includes("pink")) return "#C2185B";
  if (lower.includes("lavender") || lower.includes("mauve") || lower.includes("lilac")) return "#967BB6";
  if (lower.includes("wine") || lower.includes("burgundy") || lower.includes("bordeaux") || lower.includes("sangria")) return "#581828";
  if (lower.includes("plum") || lower.includes("violet") || lower.includes("amethyst") || lower.includes("jamun") || lower.includes("purple")) return "#5B2C6F";
  if (lower.includes("crimson") || lower.includes("sindoor") || lower.includes("vermilion") || lower.includes("kumkum") || lower.includes("ruby") || lower.includes("red")) return "#9B111E";
  if (lower.includes("maroon")) return "#6D001A";
  if (lower.includes("marigold") || lower.includes("mustard") || lower.includes("yellow") || lower.includes("haldi") || lower.includes("turmeric")) return "#D49B27";
  if (lower.includes("ivory") || lower.includes("cream") || lower.includes("pearl") || lower.includes("white")) return "#EFE6D5";
  if (lower.includes("gold") || lower.includes("tissue") || lower.includes("champagne")) return "#C5A049";
  if (lower.includes("orange") || lower.includes("terracotta") || lower.includes("rust") || lower.includes("copper")) return "#C85A28";
  if (lower.includes("black") || lower.includes("charcoal") || lower.includes("obsidian")) return "#222222";
  return "#7A1F2B";
}

// ======================================
// Types
// ======================================

export type ProductColorOption = {
  name: string;
  hex?: string;
};

type ProductActionsProps = {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    stock?: number;
    colors?: Array<ProductColorOption | string>;
    color?: string;
    occasion?: string;
    fabric?: string;
  };
};

type WishlistItem = {
  _id: string;
  product?: {
    _id: string;
  };
};

// ======================================
// Component
// ======================================

export default function ProductActions({
  product,
}: ProductActionsProps) {
  const router = useRouter();

  // Always show the exact single color of this product
  const exactProductColor = useMemo(() => {
    if (typeof product.color === "string" && product.color.trim().length > 0) {
      return product.color.trim();
    }
    if (Array.isArray(product.colors) && product.colors.length > 0) {
      const first = product.colors[0];
      if (typeof first === "string" && first.trim()) return first.trim();
      if (first && typeof first === "object" && typeof first.name === "string") return first.name.trim();
    }
    return "";
  }, [product.color, product.colors]);

  const [selectedColor, setSelectedColor] = useState<string>(exactProductColor);

  useEffect(() => {
    setSelectedColor(exactProductColor);
  }, [product._id, exactProductColor]);

  const fabricName =
    product.fabric ||
    (product.name.includes("Kanchipuram")
      ? "100% Pure Kanchipuram Silk"
      : "Pure Handloom Silk");

  const productOccasion = product.occasion || "Wedding & Festive";

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistChecking, setWishlistChecking] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [restockContact, setRestockContact] = useState("");
  const [restockSubscribed, setRestockSubscribed] = useState(false);
  const [liveStock, setLiveStock] = useState<number>(
    Math.max(0, product.stock ?? 0)
  );

  useEffect(() => {
    setLiveStock(Math.max(0, product.stock ?? 0));
  }, [product._id, product.stock]);

  useEffect(() => {
    let active = true;
    const syncStock = async () => {
      try {
        const fresh = await getProductById(product._id);
        if (active && fresh && typeof fresh.stock === "number") {
          setLiveStock(Math.max(0, fresh.stock));
        }
      } catch {
        // Keep current stock
      }
    };
    syncStock();
    window.addEventListener("focus", syncStock);
    return () => {
      active = false;
      window.removeEventListener("focus", syncStock);
    };
  }, [product._id]);

  const { cart, addToCart } = useCart();
  const stock = liveStock;
  const maxSelectableQty = Math.max(1, Math.min(stock, 10));
  const cartItem = cart.find((item) => item._id === product._id);

  // ====================================
  // Check Wishlist Status
  // ====================================

  useEffect(() => {
    let cancelled = false;

    async function checkWishlist() {
      setWishlistChecking(true);

      const token =
        localStorage.getItem("silkverse-token");

      if (!token) {
        if (!cancelled) {
          setIsWishlisted(false);
          setWishlistId(null);
          setWishlistChecking(false);
        }

        return;
      }

      try {
        const wishlist =
          (await getWishlist(token)) as WishlistItem[];

        if (cancelled) {
          return;
        }

        const existingItem = wishlist.find(
          (item) =>
            item?.product?._id === product._id
        );

        if (existingItem) {
          setIsWishlisted(true);
          setWishlistId(existingItem._id);
        } else {
          setIsWishlisted(false);
          setWishlistId(null);
        }
      } catch {
        if (!cancelled) {
          setIsWishlisted(false);
          setWishlistId(null);
        }
      } finally {
        if (!cancelled) {
          setWishlistChecking(false);
        }
      }
    }

    checkWishlist();

    return () => {
      cancelled = true;
    };
  }, [product._id]);


  // ====================================
  // Add To Cart
  // ====================================

  const handleAddToCart = () => {
    if (stock <= 0) {
      toast.error(
        "This product is currently out of stock."
      );
      return;
    }

    const safeQty = Math.max(1, Math.min(quantity, stock));

    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: safeQty,
      stock,
      ...(selectedColor ? { color: selectedColor } : {}),
    });

    toast.success(
      `${product.name} (${safeQty}) added to cart!`
    );
  };

  // ====================================
  // Buy Now
  // ====================================

  const handleBuyNow = () => {
    if (stock <= 0) {
      toast.error(
        "This product is currently out of stock."
      );
      return;
    }

    const safeQty = Math.max(1, Math.min(quantity, stock));

    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: safeQty,
      stock,
      ...(selectedColor ? { color: selectedColor } : {}),
    });

    toast.success("Redirecting to checkout...");

    router.push("/checkout");
  };

  // ====================================
  // Toggle Wishlist
  // ====================================

  const handleWishlist = async () => {
    const token =
      localStorage.getItem("silkverse-token");

    if (!token) {
      toast.error(
        "Please login to use your wishlist."
      );

      router.push(
        `/login?redirect=/products/${product._id}`
      );

      return;
    }

    if (wishlistLoading || wishlistChecking) {
      return;
    }

    try {
      setWishlistLoading(true);

      // ==================================
      // Remove From Wishlist
      // ==================================

      if (isWishlisted && wishlistId) {
        await removeFromWishlist(
          token,
          wishlistId
        );

        setIsWishlisted(false);
        setWishlistId(null);

        toast.success(
          "Removed from wishlist."
        );

        return;
      }

      // ==================================
      // Add To Wishlist
      // ==================================

      const data = await addToWishlist(
        token,
        product._id
      );

      setIsWishlisted(true);

      setWishlistId(
        data?.wishlist?._id ??
          data?.item?._id ??
          data?._id ??
          null
      );

      toast.success("Added to wishlist.");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Wishlist operation failed.";

      const normalizedMessage =
        message.toLowerCase();

      if (
        normalizedMessage.includes("unauthorized") ||
        normalizedMessage.includes("token") ||
        normalizedMessage.includes("session")
      ) {
        localStorage.removeItem(
          "silkverse-token"
        );

        setIsWishlisted(false);
        setWishlistId(null);

        toast.error(
          "Your session has expired. Please login again."
        );

        router.push(
          `/login?redirect=/products/${product._id}`
        );

        return;
      }

      toast.error(message);
    } finally {
      setWishlistLoading(false);
    }
  };

  const [showCareGuide, setShowCareGuide] = useState(false);
  const [showSilkMarkModal, setShowSilkMarkModal] = useState(false);
  const [showDesktopSticky, setShowDesktopSticky] = useState(false);

  const handleWhatsAppShare = () => {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : `https://silkverse.in/products/${product._id}`;
    const text = `Check out this handwoven silk saree on SilkVerse: *${product.name}* (₹${product.price.toLocaleString("en-IN")}) — ${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCopyLink = async () => {
    try {
      const url =
        typeof window !== "undefined"
          ? window.location.href
          : `https://silkverse.in/products/${product._id}`;
      await navigator.clipboard.writeText(url);
      toast.success("Product link copied to clipboard!");
    } catch {
      toast.error("Unable to copy link.");
    }
  };

  useEffect(() => {
    const onScroll = () => {
      setShowDesktopSticky(window.scrollY > 560);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="mt-6 space-y-4">
      {/* 1. Exact Product Color Display + 1-Tap Family Share Buttons */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        {selectedColor && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#2D2A26]">
              COLOR: <span className="font-semibold text-[#6D001A]">{selectedColor}</span>
            </p>
            <div className="inline-flex items-center gap-2 rounded-md border border-[#D4AF37]/60 bg-[#FFF8F0]/60 px-3.5 py-1.5 text-xs font-semibold text-[#6D001A]">
              <span
                className="h-3.5 w-3.5 rounded-full border border-stone-300 shadow-2xs shrink-0"
                style={{ backgroundColor: getColorHex(selectedColor) }}
              />
              <span>{selectedColor}</span>
            </div>
          </div>
        )}

        {/* 1-Tap Share on WhatsApp & Copy Link */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="inline-flex items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-50/80 px-2.5 py-1.5 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
            title="Share this saree with family on WhatsApp"
          >
            <Share2 size={13} />
            <span>Share on WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-stone-600 hover:border-[#6D001A] hover:text-[#6D001A] transition cursor-pointer"
            title="Copy product link"
          >
            <Copy size={13} />
            <span>Copy Link</span>
          </button>
        </div>
      </div>

      {/* 2. FABRIC & DIMENSIONS ROW */}
      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[#2D2A26]">
            FABRIC: <span className="font-semibold text-[#6D001A]">{fabricName}</span>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowSilkMarkModal(true)}
              className="text-[11px] font-bold text-emerald-800 underline hover:text-[#6D001A] transition cursor-pointer"
            >
              📜 View Silk Mark Certificate
            </button>
            <button
              type="button"
              onClick={() => setShowCareGuide(true)}
              className="text-[11px] font-bold text-[#6D001A] underline hover:text-[#C98A2C] transition cursor-pointer"
            >
              📐 Saree Dimensions (6.3m) &amp; Care
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-md border border-[#D4AF37]/60 bg-[#FFF8F0]/60 px-3.5 py-1.5 text-xs font-semibold text-[#6D001A]">
            {fabricName}
          </div>
          <span className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-[11px] font-medium text-stone-600">
            5.5m Saree + 0.8m Unstitched Blouse Piece
          </span>
        </div>
      </div>

      {/* Official Silk Mark & Loom Authenticity Certificate Modal */}
      {showSilkMarkModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setShowSilkMarkModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border-2 border-[#D4AF37] bg-[#FFFDF9] p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#D4AF37]/30 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                  ✓ Verified Handloom Purity
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#6D001A]">
                  Silk Mark Authenticity Certificate
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSilkMarkModal(false)}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl border border-[#D4AF37]/50 bg-white p-4 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span className="text-stone-500">Weave Title</span>
                <span className="font-bold text-stone-900 text-right max-w-[210px] truncate">
                  {product.name}
                </span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span className="text-stone-500">Silk Grade</span>
                <span className="font-bold text-[#6D001A]">
                  100% Pure 3-Ply Mulberry Silk
                </span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span className="text-stone-500">Zari Testing</span>
                <span className="font-bold text-stone-800">
                  Electroplated Gold/Silver Tested Zari
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Certification Authority</span>
                <span className="font-bold text-emerald-700">
                  Silk Mark Org. of India (Central Silk Board)
                </span>
              </div>
            </div>

            <p className="text-[11px] text-stone-600 leading-relaxed">
              Every SilkVerse saree is dispatched with a physical <strong>numbered Silk Mark Hologram Tag</strong> and Master Weaver cluster provenance card inside the box.
            </p>

            <button
              type="button"
              onClick={() => setShowSilkMarkModal(false)}
              className="w-full rounded-xl bg-[#6D001A] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#520013] transition cursor-pointer"
            >
              Close Certificate
            </button>
          </div>
        </div>
      )}

      {/* Saree Dimensions & Zari Care Guide Modal */}
      {showCareGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setShowCareGuide(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-[#D4AF37]/50 bg-white p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C98A2C]">
                  SilkVerse Handloom Standards
                </span>
                <h3 className="font-serif text-lg font-bold text-[#6D001A]">
                  Saree Dimensions &amp; Zari Care Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCareGuide(false)}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="rounded-xl bg-[#FFF8F0] border border-[#D4AF37]/40 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Saree Drape Length
                </p>
                <p className="font-serif text-base font-bold text-[#6D001A] mt-0.5">
                  5.50 Metres
                </p>
                <p className="text-[11px] text-stone-600">Full 6-Yard Traditional Drape</p>
              </div>
              <div className="rounded-xl bg-[#FFF8F0] border border-[#D4AF37]/40 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Blouse Piece
                </p>
                <p className="font-serif text-base font-bold text-[#6D001A] mt-0.5">
                  0.80 Metres
                </p>
                <p className="text-[11px] text-stone-600">Unstitched with Zari Border</p>
              </div>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3.5 space-y-2 text-xs text-stone-700">
              <p className="font-bold text-[#2D2A26] uppercase tracking-wider text-[11px]">
                ✨ Heirloom Silk &amp; 24K Zari Preservation
              </p>
              <ul className="space-y-1.5 text-[11px] leading-relaxed list-disc pl-4">
                <li>
                  <strong>Dry Clean Only:</strong> Never machine-wash or wring pure mulberry silk weaves.
                </li>
                <li>
                  <strong>Muslin Storage:</strong> Wrap your saree in pure unbleached cotton or muslin cloth so the Zari threads can breathe.
                </li>
                <li>
                  <strong>Refold Every 3 Months:</strong> Change the fold lines periodically to prevent permanent creases along the heavy Zari brocade pallu.
                </li>
                <li>
                  <strong>Protect from Sprays:</strong> Avoid spraying perfume directly onto the gold/silver Zari border.
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setShowCareGuide(false)}
              className="w-full rounded-xl bg-[#6D001A] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#520013] transition cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* 5. Desktop Action Buttons (Orange Add to Cart + Maroon Buy Now) */}
      <div className="hidden lg:flex items-center gap-3 pt-1">
        {/* ADD TO CART Button (Orange #f08024) */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={stock <= 0}
          className="flex-1 min-w-[140px] h-11 flex items-center justify-center gap-2 rounded-md bg-[#f08024] hover:bg-[#d9701a] px-5 text-xs sm:text-sm font-bold tracking-wider text-white transition shadow-xs disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          <ShoppingCart size={16} />
          <span>{stock > 0 ? "Add to Cart" : "Out of Stock"}</span>
        </button>

        {/* BUY NOW Button (Dark Maroon #6D001A) */}
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={stock <= 0}
          className="flex-1 min-w-[140px] h-11 flex items-center justify-center gap-2 rounded-md bg-[#6D001A] hover:bg-[#520013] px-5 text-xs sm:text-sm font-bold tracking-wider text-white transition shadow-xs disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          <Zap size={16} />
          <span>Buy Now</span>
        </button>

        {/* Wishlist Button (Desktop) */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={wishlistLoading || wishlistChecking}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`h-11 w-11 shrink-0 flex items-center justify-center rounded-md border transition cursor-pointer ${
            isWishlisted
              ? "border-[#6D001A] bg-[#FFF8F0] text-[#6D001A]"
              : "border-stone-300 text-stone-600 bg-white hover:bg-stone-50 hover:text-[#6D001A]"
          }`}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Out-of-Stock Weaver Restock Notification Box */}
      {stock <= 0 && (
        <div className="rounded-xl border border-amber-300/80 bg-[#FFF8F0] p-3.5 space-y-2">
          <p className="text-xs font-bold text-[#6D001A]">
            🔔 This handloom saree is currently being woven on the loom
          </p>
          {restockSubscribed ? (
            <p className="text-xs font-semibold text-emerald-700">
              ✓ You are on the priority waitlist! We will notify you as soon as this weave is restocked.
            </p>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={restockContact}
                onChange={(e) => setRestockContact(e.target.value)}
                placeholder="Enter WhatsApp number or Email for restock alert"
                className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-base sm:text-xs text-stone-800 focus:border-[#6D001A] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (!restockContact.trim()) {
                    toast.error("Please enter your WhatsApp number or email.");
                    return;
                  }
                  setRestockSubscribed(true);
                  toast.success("Restock alert activated! We will notify you first.");
                }}
                className="rounded-lg bg-[#6D001A] hover:bg-[#520013] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition cursor-pointer"
              >
                Notify Me
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          5b. DESKTOP STICKY QUICK-ACTION BAR ON SCROLL (hidden lg:flex)
      ======================================================== */}
      {showDesktopSticky && (
        <div className="hidden lg:flex fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#D4AF37]/40 shadow-[0_-6px_24px_rgba(0,0,0,0.08)] py-2.5 px-6 animate-in slide-in-from-bottom-4 duration-200">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6">
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src={product.image}
                alt={product.name}
                className="h-11 w-9 rounded-md object-cover border border-stone-200 shrink-0"
              />
              <div className="min-w-0">
                <p className="font-serif text-sm font-bold text-[#2D2A26] truncate">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  {selectedColor && (
                    <span className="inline-flex items-center gap-1 font-medium text-[#6D001A]">
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-stone-300"
                        style={{ backgroundColor: getColorHex(selectedColor) }}
                      />
                      {selectedColor}
                    </span>
                  )}
                  <span>•</span>
                  <span>{fabricName}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <span className="font-serif text-xl font-bold text-[#6D001A]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={stock <= 0}
                className="h-10 flex items-center justify-center gap-2 rounded-lg bg-[#f08024] hover:bg-[#d9701a] px-5 text-xs font-bold tracking-wider text-white transition shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <ShoppingCart size={15} />
                <span>{stock > 0 ? "Add to Cart" : "Out of Stock"}</span>
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={stock <= 0}
                className="h-10 flex items-center justify-center gap-2 rounded-lg bg-[#6D001A] hover:bg-[#520013] px-5 text-xs font-bold tracking-wider text-white transition shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Zap size={15} />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5c. MOBILE STICKY BOTTOM ACTION BAR (lg:hidden)
          Matches Flipkart & user specification:
          [Heart Wishlist] [Orange Add to Cart] [Maroon Buy Now]
      ======================================================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-t border-stone-200/90 px-3 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_20px_rgba(0,0,0,0.12)] flex items-center gap-2.5">
        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={wishlistLoading || wishlistChecking}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`h-11 w-11 shrink-0 flex items-center justify-center rounded-lg border transition cursor-pointer active:scale-95 ${
            isWishlisted
              ? "border-[#6D001A] bg-[#FFF8F0] text-[#6D001A]"
              : "border-stone-300 text-stone-600 bg-white hover:bg-stone-50"
          }`}
        >
          <Heart
            size={18}
            className={isWishlisted ? "fill-[#6D001A] text-[#6D001A]" : "text-stone-600"}
          />
        </button>

        {/* Add to Cart Button (Orange #f08024) */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={stock <= 0}
          className="flex-1 h-11 flex items-center justify-center gap-2 rounded-lg bg-[#f08024] hover:bg-[#d9701a] active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-xs transition disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          <ShoppingCart size={16} />
          <span>{stock > 0 ? "Add to Cart" : "Out of Stock"}</span>
        </button>

        {/* Buy Now Button (Maroon #6D001A) */}
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={stock <= 0}
          className="flex-1 h-11 flex items-center justify-center gap-2 rounded-lg bg-[#6D001A] hover:bg-[#520013] active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-xs transition disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          <Zap size={16} />
          <span>Buy Now</span>
        </button>
      </div>

      {/* 6. 4 Micro-Trust Badges Strip (Below action buttons as in Page 07) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-stone-200/80">
        <div className="flex items-center gap-2 text-[11px] font-medium text-stone-600">
          <ShieldCheck size={16} className="text-[#C98A2C] shrink-0" />
          <span>Secure Payments</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-stone-600">
          <Truck size={16} className="text-[#C98A2C] shrink-0" />
          <span>Free Shipping above ₹1,000</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-stone-600">
          <RefreshCw size={16} className="text-[#C98A2C] shrink-0" />
          <span>Easy Returns within 7 days</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-stone-600">
          <Award size={16} className="text-[#C98A2C] shrink-0" />
          <span>Happy Customers</span>
        </div>
      </div>
    </div>
  );
}