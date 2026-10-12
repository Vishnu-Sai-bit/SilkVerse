"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import {
  Heart,
  Loader2,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  getWishlist,
  removeFromWishlist,
} from "@/services/api";

import { useCart } from "@/context/CartContext";

// ======================================
// Types
// ======================================

type WishlistProduct = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  stock?: number;
};

type WishlistItem = {
  _id: string;
  product: WishlistProduct | null;
};

// ======================================
// Helpers
// ======================================

function getImageUrl(image?: string) {
  const backendUrl = (
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5001"
  )
    .replace(/\/+$/, "")
    .replace(/\/api$/, "");

  if (!image) {
    return "/images/products/saree_1_kanchipuram_clean.png";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  // Backend-uploaded product images
  if (image.startsWith("/uploads/")) {
    const filename = image.replace(/^\/uploads\/(?:products\/)?/, "");
    return `/images/products/${filename}`;
  }

  // Frontend public images
  if (image.startsWith("/")) {
    return image;
  }

  // Backend-uploaded relative path
  if (image.startsWith("uploads/")) {
    const filename = image.replace(/^uploads\/(?:products\/)?/, "");
    return `/images/products/${filename}`;
  }

  return `/images/products/${image}`;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);
}

function isSessionError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("unauthorized") ||
    message.includes("authentication") ||
    message.includes("token") ||
    message.includes("session") ||
    message.includes("jwt")
  );
}

// ======================================
// Component
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

  const [cartLoadingId, setCartLoadingId] =
    useState<string | null>(null);

  // ====================================
  // Load Wishlist
  // ====================================

  const loadWishlist = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "silkverse-token"
        );

      if (!token) {
        router.replace(
          "/login?redirect=/wishlist"
        );
        return;
      }

      const data =
        await getWishlist(token);

      setWishlist(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error: unknown) {
      if (isSessionError(error)) {
        localStorage.removeItem(
          "silkverse-token"
        );

        toast.error(
          "Your session has expired. Please login again."
        );

        router.replace(
          "/login?redirect=/wishlist"
        );

        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : "Failed to load wishlist.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // ====================================
  // Initial Load
  // ====================================

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // ====================================
  // Remove Wishlist Item
  // ====================================

  const handleRemove = async (
    wishlistId: string
  ) => {
    if (
      removingId ||
      cartLoadingId
    ) {
      return;
    }

    try {
      const token =
        localStorage.getItem(
          "silkverse-token"
        );

      if (!token) {
        router.replace(
          "/login?redirect=/wishlist"
        );
        return;
      }

      setRemovingId(wishlistId);

      await removeFromWishlist(
        token,
        wishlistId
      );

      setWishlist(
        (previous) =>
          previous.filter(
            (item) =>
              item._id !== wishlistId
          )
      );

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("wishlist-updated"));
      }

      toast.success(
        "Removed from wishlist."
      );
    } catch (error: unknown) {
      if (isSessionError(error)) {
        localStorage.removeItem(
          "silkverse-token"
        );

        toast.error(
          "Your session has expired. Please login again."
        );

        router.replace(
          "/login?redirect=/wishlist"
        );

        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : "Failed to remove item.";

      toast.error(message);
    } finally {
      setRemovingId(null);
    }
  };

  // ====================================
  // Add To Cart
  // ====================================

  const handleAddToCart = (
    item: WishlistItem
  ) => {
    if (
      removingId ||
      cartLoadingId
    ) {
      return;
    }

    if (!item.product) {
      toast.error(
        "This product is no longer available."
      );

      return;
    }

    const product = item.product;

    const stock =
      Number(product.stock) || 0;

    const price =
      Number(product.price) || 0;

    if (stock <= 0) {
      toast.error(
        "This product is currently out of stock."
      );

      return;
    }

    if (price < 0) {
      toast.error(
        "This product has an invalid price."
      );

      return;
    }

    try {
      setCartLoadingId(item._id);

      addToCart({
        _id: product._id,
        name: product.name,
        price,
        image: product.image || "",
        quantity: 1,
      });

      toast.success(
        `${product.name} added to cart.`
      );
    } finally {
      setCartLoadingId(null);
    }
  };

  // ====================================
  // Image Error
  // ====================================

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src =
      "/images/products/default.jpg";
  };

  // ====================================
  // Loading
  // ====================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F9F5EC]">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div className="text-center">
            <Loader2
              className="mx-auto animate-spin text-[#7A1020]"
              size={40}
            />

            <p className="mt-4 text-sm font-medium text-[#3B2F2F]/80">
              Loading your wishlist...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ====================================
  // Error
  // ====================================

  if (error) {
    return (
      <main className="min-h-screen bg-[#F9F5EC]">
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <Heart
                size={30}
                className="text-red-500"
              />
            </div>

            <h1 className="mt-5 font-serif text-2xl font-bold text-[#7A1020]">
              Unable to load wishlist
            </h1>

            <p className="mt-2 text-sm text-[#3B2F2F]/80">
              {error}
            </p>

            <button
              type="button"
              onClick={loadWishlist}
              className="mt-6 rounded-xl bg-[#7A1020] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#5B0D16]"
            >
              Try Again
            </button>
          </div>
        </section>
      </main>
    );
  }

  // ====================================
  // Render
  // ====================================

  const handleMoveAllToBag = () => {
    const validItems = wishlist.filter((item) => item.product && (Number(item.product.stock) || 0) > 0);
    if (validItems.length === 0) {
      toast.error("No in-stock items available to move to bag.");
      return;
    }
    validItems.forEach((item) => {
      const product = item.product!;
      addToCart({
        _id: product._id,
        name: product.name,
        price: Number(product.price) || 0,
        image: product.image || "",
        quantity: 1,
      });
    });
    toast.success(`Added ${validItems.length} saree${validItems.length > 1 ? "s" : ""} to your shopping bag!`);
    router.push("/cart");
  };

  return (
    <main className="min-h-screen bg-[#F9F5EC]">

      {/* Header */}

      <section className="border-b border-[#D4AF37]/30 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 sm:gap-4">

              <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#F2E8D6] border border-[#D4AF37]/40">
                <Heart
                  size={22}
                  className="text-[#7A1020]"
                  fill="currentColor"
                />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4AF37]">
                  Curated Favourites
                </p>
                <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#7A1020]">
                  My Wishlist
                </h1>

                <p className="mt-1 text-xs sm:text-sm text-[#3B2F2F]/80">
                  {wishlist.length === 0
                    ? "Save your favourite Dharmavaram silk sarees here."
                    : `${wishlist.length} ${
                        wishlist.length === 1
                          ? "handcrafted saree"
                          : "handcrafted sarees"
                      } saved`}
                </p>
              </div>

            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/account"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#D4AF37]/60 bg-[#FFF8F0] px-3.5 py-2.5 text-xs font-bold text-[#6D001A] hover:bg-[#6D001A] hover:text-white transition shadow-2xs"
              >
                <span>← Back to My Account</span>
              </Link>

              {wishlist.length > 0 && (
                <button
                  type="button"
                  onClick={handleMoveAllToBag}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#6D001A] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#520013] transition shadow-xs cursor-pointer"
                >
                  <ShoppingCart size={15} />
                  <span>Move All to Bag</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}

      <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">

        {wishlist.length === 0 ? (
          <div className="rounded-2xl border border-[#D4AF37]/40 bg-white px-6 py-16 text-center shadow-xs">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F2E8D6] border border-[#D4AF37]/40">
              <Heart
                size={36}
                className="text-[#7A1020]"
              />
            </div>

            <h2 className="mt-6 font-serif text-2xl sm:text-3xl font-bold text-[#3B2F2F]">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-[#3B2F2F]/75">
              Browse our authentic Dharmavaram silk
              sarees and save the ones
              you love for later.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex rounded-xl bg-[#7A1020] px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#5B0D16]"
            >
              Continue Shopping
            </Link>

          </div>
        ) : (
          <div className="grid grid-cols-2 justify-items-center gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">

            {wishlist.map((item) => {
              const product =
                item.product;

              // ==================================
              // Deleted / unavailable product
              // ==================================

              if (!product) {
                return (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-[#D4AF37]/30 bg-white p-6 shadow-xs"
                  >
                    <p className="text-sm text-[#3B2F2F]/75">
                      This product is no
                      longer available.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemove(
                          item._id
                        )
                      }
                      disabled={
                        removingId ===
                          item._id ||
                        Boolean(removingId)
                      }
                      className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {removingId ===
                      item._id
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  </div>
                );
              }

              const stock =
                Number(product.stock) || 0;

              const isRemoving =
                removingId ===
                item._id;

              const isAddingToCart =
                cartLoadingId ===
                item._id;

              const productPrice =
                Number(product.price) || 0;

              return (
                <article
                  key={item._id}
                  className="group w-full overflow-hidden rounded-2xl border border-[#D4AF37]/35 bg-white shadow-xs transition hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
                >

                  {/* Image */}

                  <div className="relative aspect-[4/5] overflow-hidden bg-[#F2E8D6]/50">

                    <Link
                      href={`/products/${product._id}`}
                      className="block h-full w-full"
                    >
                      <img
                        src={getImageUrl(
                          product.image
                        )}
                        alt={
                          product.name ||
                          "Product"
                        }
                        onError={
                          handleImageError
                        }
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </Link>

                    {/* Wishlist button */}

                    <button
                      type="button"
                      onClick={() =>
                        handleRemove(
                          item._id
                        )
                      }
                      disabled={
                        isRemoving ||
                        Boolean(removingId)
                      }
                      aria-label="Remove from wishlist"
                      className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#7A1020] shadow-md transition hover:bg-[#7A1020] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isRemoving ? (
                        <Loader2
                          size={20}
                          className="animate-spin"
                        />
                      ) : (
                        <Heart
                          size={20}
                          fill="currentColor"
                        />
                      )}
                    </button>

                    {/* Stock badge */}

                    <div className="absolute bottom-3 left-3">
                      {stock > 0 ? (
                        <span className={`rounded-full bg-white/95 px-3 py-1 text-xs font-semibold shadow ${
                          stock <= 5
                            ? "text-amber-700"
                            : "text-emerald-700"
                        }`}>
                          {stock <= 5
                            ? "Only a few left"
                            : "In Stock"}
                        </span>
                      ) : (
                        <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-red-600 shadow">
                          Out of Stock
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Details */}

                  <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <Link
                        href={`/products/${product._id}`}
                      >
                        <h2 className="line-clamp-2 min-h-[38px] sm:min-h-[48px] font-serif text-sm sm:text-lg font-bold text-[#3B2F2F] transition hover:text-[#7A1020]">
                          {product.name ||
                            "Product"}
                        </h2>
                      </Link>

                      <p className="mt-1.5 sm:mt-2 font-serif text-base sm:text-xl font-bold text-[#7A1020]">
                        {formatPrice(
                          productPrice
                        )}
                      </p>
                    </div>

                    {/* Actions */}

                    <div className="mt-3 sm:mt-5 flex flex-col sm:flex-row gap-2">

                      <Link
                        href={`/products/${product._id}`}
                        className="flex-1 rounded-lg border border-[#D4AF37]/60 px-2.5 py-2 sm:px-3 sm:py-2.5 text-center text-xs font-semibold text-[#3B2F2F] transition hover:border-[#7A1020] hover:text-[#7A1020]"
                      >
                        View
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleAddToCart(
                            item
                          )
                        }
                        disabled={
                          stock <= 0 ||
                          isAddingToCart ||
                          Boolean(removingId)
                        }
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#7A1020] px-2.5 py-2 sm:px-3 sm:py-2.5 text-xs font-semibold text-white transition hover:bg-[#5B0D16] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                      >
                        {isAddingToCart ? (
                          <Loader2
                            size={15}
                            className="animate-spin"
                          />
                        ) : (
                          <ShoppingCart
                            size={15}
                          />
                        )}

                        <span>
                          {stock > 0
                            ? "Add to Bag"
                            : "Out of Stock"}
                        </span>
                      </button>

                    </div>

                    {/* Remove */}

                    <button
                      type="button"
                      onClick={() =>
                        handleRemove(
                          item._id
                        )
                      }
                      disabled={
                        isRemoving ||
                        Boolean(removingId)
                      }
                      className="mt-2 sm:mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] sm:text-xs font-medium text-[#3B2F2F]/70 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                      <Trash2
                        size={14}
                      />

                      {isRemoving
                        ? "Removing..."
                        : "Remove"}
                    </button>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </section>
    </main>
  );
}