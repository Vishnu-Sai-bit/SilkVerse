"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";

import { getRelatedProducts } from "@/services/api";
import ProductCard from "@/components/product/ProductCard";
import { getAllWishlistedProducts } from "@/utils/wishlistStorage";

export type RelatedProduct = {
  _id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  averageRating?: number;
  numReviews?: number;
  stock?: number;
  isBestSeller?: boolean;
  salesCount?: number;
};

type Props = {
  productId: string;
  initialProducts?: RelatedProduct[];
};

export default function RelatedProducts({
  productId,
  initialProducts = [],
}: Props) {
  const [products, setProducts] = useState<RelatedProduct[]>(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const baseRelatedRef = useRef<RelatedProduct[]>(initialProducts);

  const [hasWishlistMatch, setHasWishlistMatch] = useState(false);

  const assembleDisplayList = useCallback(
    async (baseList: RelatedProduct[]) => {
      try {
        const wishlisted = await getAllWishlistedProducts();
        const validWishlisted = wishlisted.filter(
          (p) => p._id && p._id !== productId
        );

        // Read recently viewed categories to boost AI preference matching
        let preferredCategories = new Set<string>();
        try {
          const rvRaw = localStorage.getItem("recentlyViewed");
          if (rvRaw) {
            const rvList = JSON.parse(rvRaw);
            if (Array.isArray(rvList)) {
              rvList.forEach((item: any) => {
                if (item?.category) preferredCategories.add(String(item.category).toLowerCase());
              });
            }
          }
        } catch {
          // ignore
        }

        const scoreProduct = (p: RelatedProduct) => {
          let score = 0;
          if (p.category && preferredCategories.has(p.category.toLowerCase())) score += 3;
          if (p.isBestSeller) score += 2;
          if ((p.averageRating ?? 0) >= 4.5) score += 1;
          return score;
        };

        if (validWishlisted.length > 0) {
          setHasWishlistMatch(true);
          const wishlistedIds = new Set(validWishlisted.map((p) => p._id));
          const nonWishlistedBase = baseList
            .filter((p) => p._id && p._id !== productId && !wishlistedIds.has(p._id))
            .sort((a, b) => scoreProduct(b) - scoreProduct(a));

          // Wishlisted products take top priority in "You May Also Like", followed by AI-scored matches
          const combined = [
            ...validWishlisted,
            ...nonWishlistedBase,
          ].slice(0, 5);
          return combined as RelatedProduct[];
        }

        setHasWishlistMatch(false);
        return [...baseList]
          .sort((a, b) => scoreProduct(b) - scoreProduct(a))
          .slice(0, 5);
      } catch {
        return baseList.slice(0, 5);
      }
    },
    [productId]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        let base = baseRelatedRef.current;

        // Fetch fresh base related products if needed
        if (base.length === 0 || base[0]?._id === productId) {
          if (products.length === 0) setLoading(true);
          const data = await getRelatedProducts(productId);
          if (Array.isArray(data) && data.length > 0) {
            base = data as RelatedProduct[];
            baseRelatedRef.current = base;
          }
        }

        const assembled = await assembleDisplayList(base);
        if (!cancelled && assembled.length > 0) {
          setProducts(assembled);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load related products:", error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    // Listen for wishlist updates anywhere in the app
    const handleWishlistUpdated = async () => {
      const assembled = await assembleDisplayList(baseRelatedRef.current);
      if (!cancelled && assembled.length > 0) {
        setProducts(assembled);
      }
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener("wishlist-updated", handleWishlistUpdated);
    };
  }, [productId, assembleDisplayList]);

  if (loading && products.length === 0) {
    return (
      <section
        className="mt-20"
        aria-labelledby="related-products-heading"
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
          <h2
            id="related-products-heading"
            className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-[#2D2A26] uppercase"
          >
            YOU MAY ALSO LIKE
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-stone-200 bg-white p-3"
            >
              <div className="aspect-[3/4] w-full rounded-xl bg-stone-100" />
              <div className="mt-3 h-4 w-3/4 rounded bg-stone-100" />
              <div className="mt-2 h-3 w-1/2 rounded bg-stone-100" />
              <div className="mt-3 h-4 w-1/3 rounded bg-stone-100" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="mt-20"
      aria-labelledby="related-products-heading"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2
            id="related-products-heading"
            className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-[#2D2A26] uppercase"
          >
            YOU MAY ALSO LIKE
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/60 bg-[#F9F5EC] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#7A1020]">
            <span className="text-[#D4AF37]">✦</span>
            <span>{hasWishlistMatch ? "Wishlist & AI Curated" : "AI Stylist Curated"}</span>
          </span>
        </div>

        <Link
          href="/products"
          className="text-xs sm:text-sm font-semibold text-[#6D001A] transition hover:text-[#520013] hover:underline"
        >
          View All Collections →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
        {products.slice(0, 5).map((prod) => (
          <ProductCard
            key={prod._id}
            id={prod._id}
            name={prod.name}
            category={prod.category}
            price={prod.price}
            image={prod.image || "/images/products/default.jpg"}
            averageRating={prod.averageRating ?? 0}
            numReviews={prod.numReviews ?? 0}
            stock={prod.stock}
            badge={prod.isBestSeller ? "BEST SELLER" : undefined}
            salesCount={prod.salesCount}
          />
        ))}
      </div>
    </section>
  );
}