"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import {
  ShoppingBag,
  Trash2,
  Heart,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

// ======================================
// API
// ======================================

const RAW_API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

const API = RAW_API.replace(/\/+$/, "").replace(/\/api$/, "");

// ======================================
// Types
// ======================================

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  image?: string;
  images?: string[];
  stock?: number;
  averageRating?: number;
  numReviews?: number;
}

interface WishlistItem {
  _id: string;
  user: string;
  product: Product | null;
}

// ======================================
// Image URL
// ======================================

function getImageUrl(
  image?: string
) {
  if (!image) {
    return "/images/products/saree_1_kanchipuram_clean.png";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

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
}

// ======================================
// Format Price
// ======================================

function formatPrice(
  price: number
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(price);
}

// ======================================
// Wishlist Page
// ======================================

export default function WishlistPage() {
  const router = useRouter();
  const { addToCart } = useCart();

  const [wishlist, setWishlist] =
    useState<WishlistItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [removingId, setRemovingId] =
    useState<string | null>(null);

  // ====================================
  // Load Wishlist
  // ====================================

  async function loadWishlist() {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "silkverse-token"
        );

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${API}/api/wishlist`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const contentType =
        response.headers.get(
          "content-type"
        );

      if (
        !contentType?.includes(
          "application/json"
        )
      ) {
        throw new Error(
          "Invalid server response."
        );
      }

      const data =
        await response.json();

      if (response.status === 401) {
        localStorage.removeItem(
          "silkverse-token"
        );

        window.location.href =
          "/login";

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load wishlist."
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to load wishlist."
        );
      }

      setWishlist(
        Array.isArray(data.wishlist)
          ? data.wishlist
          : []
      );
    } catch (error: unknown) {
      console.error(
        "Wishlist error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load wishlist."
      );
    } finally {
      setLoading(false);
    }
  }

  // ====================================
  // Initial Load
  // ====================================

  useEffect(() => {
    loadWishlist();
  }, []);

  // ====================================
  // Remove Wishlist Item
  // ====================================

  async function removeFromWishlist(
    wishlistId: string
  ) {
    if (removingId) {
      return;
    }

    try {
      setRemovingId(wishlistId);
      setError("");

      const token =
        localStorage.getItem(
          "silkverse-token"
        );

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${API}/api/wishlist/${wishlistId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType =
        response.headers.get(
          "content-type"
        );

      if (
        !contentType?.includes(
          "application/json"
        )
      ) {
        throw new Error(
          "Invalid server response."
        );
      }

      const data =
        await response.json();

      if (response.status === 401) {
        localStorage.removeItem(
          "silkverse-token"
        );

        router.push("/login");

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to remove wishlist item."
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to remove wishlist item."
        );
      }

      setWishlist(
        (previousWishlist) =>
          previousWishlist.filter(
            (item) =>
              item._id !== wishlistId
          )
      );
    } catch (error: unknown) {
      console.error(
        "Remove wishlist error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to remove item."
      );
    } finally {
      setRemovingId(null);
    }
  }

  // ====================================
  // Loading
  // ====================================

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FDF4E8]">
            <Heart
              size={26}
              className="animate-pulse text-[#7A1F2B]"
            />
          </div>

          <p className="mt-4 text-lg font-semibold text-gray-600">
            Loading Wishlist...
          </p>

        </div>
      </div>
    );
  }

  // ====================================
  // Page
  // ====================================

  return (
    <div className="space-y-6">

      {/* ==================================
          Header
      ================================== */}

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C9A227]">
            My Collection
          </p>

          <div className="mt-1.5 flex items-center gap-3.5">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#FDF4E8] border border-[#D4AF37]/40">
              <FaHeart
                size={20}
                className="text-[#7A1F2B]"
              />
            </div>

            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#7A1F2B]">
                My Wishlist
              </h1>

              <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
                Save your favorite silk sarees and shop them whenever you like.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/collections"
          className="inline-flex items-center gap-2 rounded-xl bg-[#6D001A] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#520013] transition shadow-xs"
        >
          <ShoppingBag size={14} />
          <span>Explore More Silks</span>
        </Link>
      </div>

      {/* ==================================
          Error
      ================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">

          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>

            <p className="font-semibold">
              Something went wrong
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>

            <button
              type="button"
              onClick={loadWishlist}
              className="mt-3 font-semibold underline"
            >
              Try Again
            </button>

          </div>

        </div>
      )}

      {/* ==================================
          Empty Wishlist
      ================================== */}

      {wishlist.length === 0 ? (

        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center shadow-xs">

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FDF4E8]">

            <FaHeart
              className="text-4xl text-[#7A1F2B]"
            />

          </div>

          <h2 className="mt-5 font-serif text-xl sm:text-2xl font-bold text-gray-800">
            Wishlist is Empty
          </h2>

          <p className="mt-2 max-w-md text-xs sm:text-sm text-gray-500">
            Save your favorite silk sarees here
            and come back whenever you&apos;re ready
            to shop.
          </p>

          <Link
            href="/collections"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#7A1F2B] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#651923]"
          >
            <ShoppingBag size={16} />
            Explore Collections
          </Link>

        </div>

      ) : (

        /* ==================================
           Wishlist Products (2-Col Mobile, 3-Col Desktop)
        ================================== */

        <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {wishlist.map((item) => {

            const product =
              item.product;

            if (!product) {
              return (
                <div
                  key={item._id}
                  className="rounded-2xl border bg-white p-4 sm:p-6 shadow-xs"
                >

                  <p className="text-xs sm:text-sm text-gray-500">
                    This product is no longer
                    available.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      removeFromWishlist(
                        item._id
                      )
                    }
                    disabled={
                      removingId ===
                      item._id
                    }
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
                  >
                    {removingId ===
                    item._id
                      ? "Removing..."
                      : "Remove"}
                  </button>

                </div>
              );
            }

            const image =
              product.image ||
              (product.images?.length
                ? product.images[0]
                : undefined);

            return (
              <div
                key={item._id}
                className="overflow-hidden rounded-2xl border border-[#E8E4DF] bg-white shadow-xs transition hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
              >

                {/* Product Image */}

                <Link
                  href={`/products/${product._id}`}
                  className="block"
                >

                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">

                    <Image
                      src={getImageUrl(
                        image
                      )}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-300 hover:scale-105"
                    />

                    {/* Wishlist Badge */}

                    <div className="absolute right-2.5 top-2.5 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/95 shadow-xs">

                      <FaHeart
                        size={15}
                        className="text-[#7A1F2B]"
                      />

                    </div>

                  </div>

                </Link>

                {/* Product Details */}

                <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">

                  <div>
                    <Link
                      href={`/products/${product._id}`}
                    >
                      <h2 className="line-clamp-2 font-serif text-sm sm:text-base font-bold text-gray-900 transition hover:text-[#7A1F2B]">
                        {product.name}
                      </h2>
                    </Link>

                    {product.category && (
                      <p className="mt-0.5 text-[11px] sm:text-xs text-gray-500">
                        {product.category}
                      </p>
                    )}

                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                      <span className="truncate">Silk Mark Certified</span>
                    </div>

                    {/* Price */}

                    <p className="mt-2 font-serif text-base sm:text-xl font-bold text-[#7A1F2B]">
                      {formatPrice(
                        product.price
                      )}
                    </p>
                  </div>

                  {/* Actions */}

                  <div className="mt-3 pt-2.5 border-t border-stone-100 space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        addToCart({
                          _id: product._id,
                          name: product.name,
                          price: product.price,
                          image: getImageUrl(image),
                          quantity: 1,
                        });
                        toast.success(`Added "${product.name}" to your Shopping Bag!`);
                      }}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#6D001A] py-2 text-center text-xs font-bold text-white transition hover:bg-[#520013] cursor-pointer"
                    >
                      <ShoppingBag size={13} />
                      <span>Move to Bag</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        removeFromWishlist(
                          item._id
                        )
                      }
                      disabled={
                        removingId ===
                        item._id
                      }
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-[11px] sm:text-xs font-medium text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >

                      <Trash2 size={14} />

                      {removingId ===
                      item._id
                        ? "Removing..."
                        : "Remove"}

                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
}