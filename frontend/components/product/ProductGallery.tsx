"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { addToWishlist, getWishlist, removeFromWishlist } from "@/services/api";
import {
  addToLocalWishlist,
  removeFromLocalWishlist,
  isLocalWishlisted,
} from "@/utils/wishlistStorage";

export type SareeViews = {
  front?: string;
  side?: string;
  back?: string;
  border?: string;
  blouse?: string;
  kongu?: string;
};

type Props = {
  images: string[];
  productName: string;
  productId?: string;
  views?: SareeViews;
};

export default function ProductGallery({
  images,
  productName,
  productId,
  views,
}: Props) {
  // Single primary product image
  const singleImage =
    views?.front ||
    (images.length > 0 ? images[0] : "/images/products/saree_1_maroon.png");

  // Wishlist state (Flipkart / Amazon style floating heart)
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    if (isLocalWishlisted(productId)) {
      setIsWishlisted(true);
    }

    async function checkWishlistStatus() {
      if (!productId) return;
      try {
        const token =
          localStorage.getItem("silkverse-token") ||
          localStorage.getItem("token");
        if (!token) return;
        const res = await getWishlist(token);
        const list = Array.isArray(res) ? res : res?.wishlist || [];
        const found = list.find(
          (item: any) =>
            item?.product?._id === productId || item?.product === productId
        );
        if (found) {
          setIsWishlisted(true);
          setWishlistId(found._id);
        }
      } catch {
        // silent
      }
    }

    checkWishlistStatus();

    const onWishlistUpdate = () => {
      if (productId) {
        setIsWishlisted(isLocalWishlisted(productId));
      }
    };

    window.addEventListener("wishlist-updated", onWishlistUpdate);

    return () => {
      window.removeEventListener("wishlist-updated", onWishlistUpdate);
    };
  }, [productId]);

  const toggleWishlist = async () => {
    if (!productId) return;
    if (wishlistLoading) return;
    setWishlistLoading(true);

    const token =
      localStorage.getItem("silkverse-token") ||
      localStorage.getItem("token");

    try {
      if (isWishlisted) {
        removeFromLocalWishlist(productId);
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
          _id: productId,
          name: productName,
          image: singleImage,
          price: 0,
        });
        setIsWishlisted(true);

        if (token) {
          try {
            const data = await addToWishlist(token, productId);
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
      toast.error("Wishlist update failed.");
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* ========================================================
          SINGLE PRODUCT IMAGE DISPLAY
          - Shows only one single authentic product image
          - No thumbnails, no extra view buttons
          - NO cursor hover zoom
          - Top-right floating Wishlist Heart button
      ======================================================== */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-stone-200/90 bg-[#FAF8F5] shadow-xs select-none">
        <Image
          src={singleImage}
          alt={productName}
          fill
          priority
          unoptimized
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-top select-none pointer-events-none"
        />

        {/* Top-Right Floating Wishlist Heart */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <button
            type="button"
            onClick={toggleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-md hover:bg-white transition cursor-pointer border border-stone-200 group"
          >
            <Heart
              size={18}
              className={`transition-transform duration-200 group-hover:scale-110 ${
                isWishlisted
                  ? "fill-red-600 text-red-600"
                  : "text-stone-500 hover:text-red-500"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}