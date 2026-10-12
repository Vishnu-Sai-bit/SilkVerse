"use client";

import { useEffect, useState } from "react";
import { Clock, Trash2 } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

type RecentProduct = {
  _id: string;
  name: string;
  category?: string;
  price: number;
  image?: string;
  averageRating?: number;
  numReviews?: number;
  stock?: number;
  badge?: string;
};

const STORAGE_KEY = "recentlyViewedProducts";

export default function HomeRecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentProducts(parsed.filter((item) => item && item._id).slice(0, 5));
        }
      }
    } catch {
      // Ignore localStorage parse errors
    } finally {
      setMounted(true);
    }
  }, []);

  if (!mounted || recentProducts.length === 0) {
    return null;
  }

  const handleClearRecent = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setRecentProducts([]);
    } catch {
      // Ignore
    }
  };

  return (
    <section className="bg-[#FAF6EE] px-4 py-10 sm:py-14 sm:px-6 lg:px-8 border-b border-[#E8E4DF]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              <Clock size={13} />
              <span>Pick Up Where You Left Off</span>
            </div>
            <h2 className="mt-1 font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#7A1020]">
              Recently Viewed Sarees
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClearRecent}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-white px-3.5 py-1.5 text-[11px] font-semibold text-[#3B2F2F]/75 hover:border-[#7A1020] hover:text-[#7A1020] transition cursor-pointer"
          >
            <Trash2 size={12} />
            <span>Clear History</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
          {recentProducts.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              category={product.category}
              price={product.price}
              image={product.image || "/images/products/saree_1_maroon.png"}
              averageRating={product.averageRating ?? 5}
              numReviews={product.numReviews ?? 64}
              stock={product.stock}
              badge={product.badge}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
