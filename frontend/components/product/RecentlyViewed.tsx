"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/services/api";

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  averageRating?: number;
  numReviews?: number;
  stock?: number;
  isBestSeller?: boolean;
  salesCount?: number;
};

type Props = {
  currentProduct?: Product;
};

const STORAGE_KEY = "recentlyViewedProducts";
const TARGET_DISPLAY_COUNT = 5;

export default function RecentlyViewed({
  currentProduct,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function updateAndLoadRecent() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        let existing: Product[] = [];

        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            existing = parsed;
          }
        }

        // Filter out current product from previous history if provided
        const filtered = currentProduct?._id
          ? existing.filter(
              (item) => item?._id && item._id !== currentProduct._id
            )
          : existing.filter((item) => item?._id);

        // Save current product to front of recent history if provided
        if (currentProduct?._id) {
          const updatedHistory = [currentProduct, ...filtered].slice(0, 10);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
        }

        let displayList: Product[] = filtered.slice(0, TARGET_DISPLAY_COUNT);

        // If user has viewed fewer than 5 previous products, supplement with top store products
        if (displayList.length < TARGET_DISPLAY_COUNT) {
          const excludedIds = new Set([
            ...(currentProduct?._id ? [currentProduct._id] : []),
            ...displayList.map((p) => p._id),
          ]);

          try {
            const res = await getProducts({ limit: 12, sort: "bestseller" });
            if (res?.products && Array.isArray(res.products)) {
              const supplemental = res.products.filter(
                (p: any) => p?._id && !excludedIds.has(p._id)
              );
              displayList = [...displayList, ...supplemental].slice(
                0,
                TARGET_DISPLAY_COUNT
              );
            }
          } catch {
            // Silently ignore supplemental fetch failure
          }
        }

        if (!cancelled) {
          setProducts(displayList);
          setMounted(true);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to update recently viewed products:",
            error
          );
          setMounted(true);
        }
      }
    }

    updateAndLoadRecent();

    return () => {
      cancelled = true;
    };
  }, [currentProduct]);

  if (!mounted || products.length === 0) {
    return null;
  }

  return (
    <section
      className="mt-20"
      aria-labelledby="recently-viewed-heading"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
        <h2
          id="recently-viewed-heading"
          className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-[#2D2A26] uppercase"
        >
          RECENTLY VIEWED
        </h2>

        <Link
          href="/products"
          className="text-xs sm:text-sm font-semibold text-[#6D001A] transition hover:text-[#520013] hover:underline"
        >
          View All Collections →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            id={product._id}
            name={product.name}
            category={product.category}
            price={product.price}
            image={product.image || "/images/products/default.jpg"}
            averageRating={product.averageRating ?? 0}
            numReviews={product.numReviews ?? 0}
            stock={product.stock}
            badge={product.isBestSeller ? "BEST SELLER" : undefined}
            salesCount={product.salesCount}
          />
        ))}
      </div>
    </section>
  );
}