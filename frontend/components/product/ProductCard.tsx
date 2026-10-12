"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { Loader2, Eye, X, Check, ShieldCheck, Truck, Zap } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import StarRating from "@/components/reviews/StarRating";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "@/services/api";
import {
  addToLocalWishlist,
  removeFromLocalWishlist,
  isLocalWishlisted,
} from "@/utils/wishlistStorage";

// ============================================
// API Configuration
// ============================================

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

const API_URL = RAW_API_URL
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

// ============================================
// Helpers
// ============================================

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);

const getImageUrl = (image?: string) => {
  if (!image) {
    return "/images/products/default.jpg";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  // Next.js local static assets (e.g. /images/products/...)
  if (image.startsWith("/images/")) {
    return image;
  }

  // Map legacy /uploads/ to Next.js static /images/products/
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
};

// ============================================
// Types
// ============================================

type ProductCardProps = {
  id: string;
  name: string;
  category?: string;
  price: number;
  image: string;
  averageRating?: number;
  numReviews?: number;
  stock?: number;
  badge?: "BEST SELLER" | "NEW" | "TRENDING" | string;
  salesCount?: number;
  layout?: "grid" | "list";
};

type WishlistProduct = {
  _id: string;
};

type WishlistItem = {
  _id: string;
  product: WishlistProduct | null;
};

// ============================================
// Component
// ============================================

export default function ProductCard({
  id,
  name,
  category,
  price,
  image,
  averageRating = 0,
  numReviews = 0,
  stock = 0,
  badge,
  salesCount,
  layout = "grid",
}: ProductCardProps) {
  const router = useRouter();
  const { cart, addToCart } = useCart();
  const { t } = useLanguage();

  const [isWishlisted, setIsWishlisted] =
    useState(false);

  const [wishlistId, setWishlistId] =
    useState<string | null>(null);

  const [wishlistLoading, setWishlistLoading] =
    useState(false);

  const [quickViewOpen, setQuickViewOpen] =
    useState(false);

  const isInCart = cart.some((item) => item._id === id);

  const imageUrl = getImageUrl(image);
  const [imgSrc, setImgSrc] = useState(imageUrl);

  useEffect(() => {
    setImgSrc(imageUrl);
  }, [imageUrl]);

  // ============================================
  // Check Existing Wishlist
  // ============================================

  useEffect(() => {
    let cancelled = false;

    async function checkWishlist() {
      // Check local wishlist first
      if (isLocalWishlisted(id)) {
        setIsWishlisted(true);
      }

      const token =
        localStorage.getItem("silkverse-token") ||
        localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const wishlist = await getWishlist(token);

        if (cancelled) {
          return;
        }

        const existingItem = (wishlist as WishlistItem[]).find(
          (item) => item?.product?._id === id
        );

        if (existingItem) {
          setIsWishlisted(true);
          setWishlistId(existingItem._id);
        }
      } catch {
        // silent
      }
    }

    checkWishlist();

    const onWishlistUpdate = () => {
      setIsWishlisted(isLocalWishlisted(id));
    };

    window.addEventListener("wishlist-updated", onWishlistUpdate);

    return () => {
      cancelled = true;
      window.removeEventListener("wishlist-updated", onWishlistUpdate);
    };
  }, [id]);

  // ============================================
  // Wishlist Toggle
  // ============================================

  const handleWishlist = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (wishlistLoading) {
      return;
    }

    const token =
      localStorage.getItem("silkverse-token") ||
      localStorage.getItem("token");

    try {
      setWishlistLoading(true);

      if (isWishlisted) {
        removeFromLocalWishlist(id);
        setIsWishlisted(false);

        if (token && wishlistId) {
          try {
            await removeFromWishlist(token, wishlistId);
          } catch {
            // ignore server error
          }
          setWishlistId(null);
        }

        toast.success("Removed from wishlist.");
      } else {
        addToLocalWishlist({
          _id: id,
          name,
          category,
          price,
          image: imageUrl,
          averageRating,
          numReviews,
          stock,
          isBestSeller: badge === "BEST SELLER",
          salesCount,
        });
        setIsWishlisted(true);

        if (token) {
          try {
            const data = await addToWishlist(token, id);
            setWishlistId(
              data?.wishlist?._id ??
                data?.item?._id ??
                data?._id ??
                null
            );
          } catch {
            // ignore server error
          }
        }

        toast.success("Added to wishlist!");
      }
    } catch {
      toast.error("Wishlist operation failed.");
    } finally {
      setWishlistLoading(false);
    }
  };

  // ============================================
  // Add To Cart
  // ============================================

  const handleAddToCart = () => {
    if (stock <= 0) {
      toast.error(
        "This product is currently out of stock."
      );

      return;
    }

    addToCart({
      _id: id,
      name,
      price,
      image: imageUrl,
      quantity: 1,
    });

    toast.success(
      `${name} added to cart!`
    );
  };

  // ============================================
  // Stock Status (Never shows exact inventory count)
  // ============================================

  const stockStatus =
    stock <= 0
      ? {
          text: t("product.outOfStock", "Out of Stock"),
          className:
            "text-red-700 bg-red-50 border-red-200",
        }
      : stock <= 5
        ? {
            text: t("product.fewLeft", "Only a few left"),
            className:
              "text-orange-700 bg-orange-50 border-orange-200",
          }
        : {
            text: t("product.inStock", "In Stock"),
            className:
              "text-emerald-700 bg-emerald-50 border-emerald-200",
          };

  // ============================================
  // Render
  // ============================================

  if (layout === "list") {
    return (
      <article className="group min-w-0 overflow-hidden rounded-2xl border border-amber-200/70 bg-white shadow-xs transition-all duration-300 hover:shadow-md hover:border-amber-400 flex flex-row items-stretch">
        {/* Product Image */}
        <div className="relative aspect-[3/4] w-32 sm:w-44 md:w-52 shrink-0 overflow-hidden bg-stone-100">
          <Link href={`/products/${id}`} scroll={true} className="relative block h-full w-full">
            <Image
              src={imgSrc}
              alt={name}
              fill
              loading="eager"
              unoptimized
              onError={() => setImgSrc("/images/products/saree_1_maroon.png")}
              sizes="(max-width: 639px) 128px, 208px"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {/* Badge */}
          {badge && (
            <span className="absolute left-2 top-2 inline-flex items-center rounded-full bg-black/40 backdrop-blur-md px-2 py-0.5 text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.16em] text-[#FAF8F5] border border-white/20 shadow-sm z-10">
              {badge}
            </span>
          )}

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlist}
            disabled={wishlistLoading}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isWishlisted}
            className={`absolute right-2 top-2 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full transition-all duration-300 z-10 ${
              isWishlisted
                ? "bg-white/95 text-red-600 shadow-md backdrop-blur-md opacity-100 scale-100"
                : "bg-black/25 backdrop-blur-md border border-white/25 text-white/90 hover:bg-white hover:text-red-600 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 active:scale-95 shadow-sm"
            } ${wishlistLoading ? "cursor-not-allowed opacity-60" : ""}`}
          >
            {wishlistLoading ? (
              <Loader2 size={13} className="animate-spin text-white" aria-hidden="true" />
            ) : (
              <FaHeart
                size={12}
                aria-hidden="true"
                className={isWishlisted ? "text-red-600 fill-red-600" : "transition-transform group-hover:scale-110"}
              />
            )}
          </button>
        </div>

        {/* Product Information */}
        <div className="p-3 sm:p-4.5 flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              {category && (
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  {category}
                </span>
              )}
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${stockStatus.className}`}>
                {stockStatus.text}
              </span>
            </div>
            <Link href={`/products/${id}`} scroll={true}>
              <h3 className="mt-0.5 font-serif line-clamp-1 sm:line-clamp-2 text-sm sm:text-base md:text-lg font-bold text-gray-900 transition-colors group-hover:text-[#6D001A]">
                {name}
              </h3>
            </Link>

            {/* Rating Indicator */}
            {averageRating > 0 ? (
              <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                <StarRating rating={averageRating} />
                <span className="text-xs font-semibold text-[#6D001A]">
                  {Number(averageRating).toFixed(1)}
                </span>
                {numReviews > 0 && (
                  <span className="text-[11px] text-gray-500">
                    ({numReviews})
                  </span>
                )}
              </div>
            ) : (
              <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-emerald-800">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600" />
                <span>{t("product.pureHandloom", "100% Pure Handloom Silk")}</span>
              </div>
            )}

            {/* Price */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-base sm:text-lg font-extrabold text-[#6D001A]">
                {formatPrice(price)}
              </span>
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(Math.round(Number(price) * 1.25))}
              </span>
              <span className="rounded-md bg-[#F5E9D6] px-1.5 py-0.5 text-[10px] font-bold text-[#6D001A] border border-[#D4AF37]/40">
                24% OFF
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={stock <= 0}
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#6D001A] hover:bg-[#8B0024] text-white text-xs font-bold tracking-wider uppercase transition-all shadow-sm active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <FaShoppingCart size={12} className="text-[#D4AF37]" />
              <span>{stock <= 0 ? stockStatus.text : t("product.addToCart", "Add to Cart")}</span>
            </button>
            <button
              type="button"
              onClick={handleWishlist}
              disabled={wishlistLoading}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`flex items-center justify-center h-8.5 w-8.5 rounded-xl border transition-all cursor-pointer ${
                isWishlisted
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "border-gray-200 text-gray-400 hover:text-[#6D001A] hover:border-[#6D001A] bg-white"
              }`}
            >
              <FaHeart size={12} className={isWishlisted ? "text-red-600 fill-red-600" : ""} />
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group min-w-0 overflow-hidden rounded-2xl border border-amber-200/70 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_-8px_rgba(122,31,43,0.15)] hover:border-amber-400">
      {/* Product Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <Link
          href={`/products/${id}`}
          scroll={true}
          className="relative block h-full w-full"
        >
          <Image
            src={imgSrc}
            alt={name}
            fill
            loading="eager"
            unoptimized
            onError={() => setImgSrc("/images/products/saree_1_maroon.png")}
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover object-top"
          />
          {/* Subtle bottom gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Badge - Transparent Frosted Glass (Only rendered when explicitly set) */}
        {badge && (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center rounded-full bg-black/40 backdrop-blur-md px-2.5 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.16em] text-[#FAF8F5] border border-white/20 shadow-sm z-10">
            {badge}
          </span>
        )}

        {/* Wishlist Button - Transparent Frosted Glass (Reveals on Hover, Always visible when wishlisted) */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={wishlistLoading}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          aria-pressed={isWishlisted}
          className={`absolute right-2.5 top-2.5 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-all duration-300 z-10 ${
            isWishlisted
              ? "bg-white/95 text-red-600 shadow-md backdrop-blur-md opacity-100 scale-100"
              : "bg-black/25 backdrop-blur-md border border-white/25 text-white/90 hover:bg-white hover:text-red-600 hover:border-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 active:scale-95 shadow-sm"
          } ${
            wishlistLoading
              ? "cursor-not-allowed opacity-60"
              : ""
          }`}
        >
          {wishlistLoading ? (
            <Loader2
              size={15}
              className="animate-spin text-white"
              aria-hidden="true"
            />
          ) : (
            <FaHeart
              size={14}
              aria-hidden="true"
              className={
                isWishlisted
                  ? "text-red-600 fill-red-600"
                  : "transition-transform group-hover:scale-110"
              }
            />
          )}
        </button>
        {/* Quick View Button on Image */}
        <button
          type="button"
          onClick={() => setQuickViewOpen(true)}
          aria-label={`Quick view ${name}`}
          className="absolute right-2.5 top-12 sm:top-12.5 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-black/25 backdrop-blur-md border border-white/25 text-white/90 hover:bg-white hover:text-[#7A1020] hover:border-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 active:scale-95 shadow-sm z-10 cursor-pointer"
          title="Quick View"
        >
          <Eye size={14} />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-2.5 sm:p-4">
        {/* Product Name */}
        <Link href={`/products/${id}`} scroll={true}>
          <h3 className="mt-1 font-serif line-clamp-2 min-h-[44px] text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#7A1F2B] sm:min-h-[48px] sm:text-base">
            {name}
          </h3>
        </Link>

        {/* Rating and Stock Status Indicator */}
        {averageRating > 0 ? (
          <div className="mt-2 flex min-w-0 items-center justify-between gap-1 flex-wrap">
            <div className="flex items-center gap-1">
              <StarRating rating={averageRating} />
              <span className="shrink-0 text-xs font-semibold text-[#7A1F2B]">
                {Number(averageRating).toFixed(1)}
              </span>
              {numReviews > 0 && (
                <span className="shrink-0 text-[10px] text-gray-500 sm:text-xs">
                  ({numReviews})
                </span>
              )}
            </div>
            <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${stockStatus.className}`}>
              {stockStatus.text}
            </span>
          </div>
        ) : (
          <div className="mt-2 flex items-center justify-between gap-1.5 text-[11px] font-medium text-emerald-800 flex-wrap">
            <span className="flex items-center gap-1.5 truncate">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
              <span className="truncate">{t("product.pureHandloom", "100% Pure Handloom Silk")}</span>
            </span>
            <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${stockStatus.className}`}>
              {stockStatus.text}
            </span>
          </div>
        )}

        {/* Price matching Page 06 */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span className="text-base font-extrabold text-[#6D001A] sm:text-lg tracking-tight">
            {formatPrice(price)}
          </span>

          <span className="text-xs text-gray-400 line-through">
            {formatPrice(Math.round(Number(price) * 1.25))}
          </span>

          <span className="rounded-md bg-[#F5E9D6] px-1.5 py-0.5 text-[10px] font-bold text-[#6D001A] border border-[#D4AF37]/40">
            24% OFF
          </span>
        </div>

        {/* Action Row: Add to Cart + Wishlist matching Page 02 Reference */}
        <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 text-[11px] sm:text-xs whitespace-nowrap rounded-xl font-bold tracking-wider uppercase transition-all shadow-sm hover:shadow active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
              isInCart
                ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                : "bg-[#6D001A] hover:bg-[#8B0024] text-white"
            }`}
          >
            {isInCart ? (
              <>
                <Check size={13} className="text-amber-300 shrink-0" />
                <span>In Bag • Add +1</span>
              </>
            ) : (
              <>
                <FaShoppingCart size={12} className="text-[#D4AF37] shrink-0" />
                <span>{stock <= 0 ? stockStatus.text : t("product.addToCart", "Add to Cart")}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleWishlist}
            disabled={wishlistLoading}
            aria-label={
              isWishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            className={`flex items-center justify-center h-8.5 w-8.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
              isWishlisted
                ? "bg-red-50 border-red-200 text-red-600 shadow-xs"
                : "border-gray-200 hover:border-[#6D001A] text-gray-400 hover:text-[#6D001A] bg-white hover:bg-gray-50"
            }`}
          >
            <FaHeart
              size={13}
              className={
                isWishlisted
                  ? "text-red-600 fill-red-600"
                  : ""
              }
            />
          </button>
        </div>
      </div>

      {/* Quick View Modal (E-Commerce Instant Preview) */}
      {quickViewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4"
          onClick={() => setQuickViewOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#D4AF37]/50 bg-[#F9F5EC] shadow-2xl grid grid-cols-1 sm:grid-cols-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQuickViewOpen(false)}
              aria-label="Close quick view"
              className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#3B2F2F] shadow hover:bg-[#7A1020] hover:text-white transition cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Left: Saree Image */}
            <div className="relative aspect-[3/4] sm:col-span-5 bg-stone-100">
              <Image
                src={imgSrc}
                alt={name}
                fill
                unoptimized
                className="object-cover object-top"
              />
              {badge && (
                <span className="absolute left-3 top-3 rounded-full bg-black/50 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  {badge}
                </span>
              )}
            </div>

            {/* Right: Saree Details & Quick Actions */}
            <div className="p-5 sm:p-6 sm:col-span-7 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center justify-between gap-2 pr-6">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                    {category || "Dharmavaram Silk"}
                  </span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${stockStatus.className}`}>
                    {stockStatus.text}
                  </span>
                </div>

                <h2 className="mt-1.5 font-serif text-xl sm:text-2xl font-bold text-[#3B2F2F] leading-snug">
                  {name}
                </h2>

                <div className="mt-2 flex items-center gap-2">
                  <StarRating rating={averageRating > 0 ? averageRating : 4.8} />
                  <span className="text-xs font-semibold text-[#7A1020]">
                    {averageRating > 0 ? Number(averageRating).toFixed(1) : "4.8"} / 5.0
                  </span>
                  {numReviews > 0 && (
                    <span className="text-xs text-stone-500">
                      ({numReviews} Verified Reviews)
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-baseline gap-2.5">
                  <span className="font-serif text-2xl font-bold text-[#7A1020]">
                    {formatPrice(price)}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(Math.round(Number(price) * 1.25))}
                  </span>
                  <span className="rounded bg-[#F2E8D6] px-2 py-0.5 text-[10px] font-bold text-[#7A1020] border border-[#D4AF37]/40">
                    24% OFF
                  </span>
                </div>

                <div className="mt-4 space-y-2 rounded-xl bg-[#F9F5EC] p-3 border border-[#D4AF37]/30 text-xs text-[#3B2F2F]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={15} className="text-[#7A1020] shrink-0" />
                    <span>100% Pure Handloom Dharmavaram Silk • Silk Mark Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck size={15} className="text-[#7A1020] shrink-0" />
                    <span>Free Insured Shipping on orders ₹1,000+ • 7-Day Easy Returns</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart();
                      setQuickViewOpen(false);
                    }}
                    disabled={stock <= 0}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#f08024] hover:bg-[#d9701a] py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-white transition disabled:opacity-40 cursor-pointer"
                  >
                    <FaShoppingCart size={13} />
                    <span>{stock <= 0 ? "Out of Stock" : "Add to Cart"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart();
                      setQuickViewOpen(false);
                      router.push("/checkout");
                    }}
                    disabled={stock <= 0}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#7A1020] hover:bg-[#5B0D16] py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-white transition disabled:opacity-40 cursor-pointer"
                  >
                    <Zap size={14} />
                    <span>Buy Now</span>
                  </button>
                </div>

                <Link
                  href={`/products/${id}`}
                  onClick={() => setQuickViewOpen(false)}
                  className="block w-full rounded-xl border border-[#D4AF37]/60 bg-white py-2 text-center text-xs font-bold text-[#7A1020] hover:bg-[#F9F5EC] transition"
                >
                  View Full Saree Details &amp; Specifications →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}