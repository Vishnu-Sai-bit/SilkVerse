"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/services/api";

type SearchProduct = {
  _id: string;
  name: string;
  category?: string;
  price: number;
  image: string;
  averageRating?: number;
  numReviews?: number;
  stock?: number;
};

function SearchContent() {
  const searchParams = useSearchParams();

  const keyword =
    searchParams.get("keyword")?.trim() || "";

  const [products, setProducts] = useState<
    SearchProduct[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [sort, setSort] =
    useState("newest");

  const [totalProducts, setTotalProducts] =
    useState(0);

  useEffect(() => {
    async function loadProducts() {
      if (!keyword) {
        setProducts([]);
        setTotalProducts(0);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await getProducts({
          keyword,
          sort,
          page: 1,
          limit: 200,
        });

        const list = (data.products ?? []) as SearchProduct[];

        setProducts(list);

        setTotalProducts(
          data.totalProducts ?? list.length
        );
      } catch (error) {
        console.error(
          "Failed to search products:",
          error
        );

        setProducts([]);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [keyword, sort]);

  const handleSortChange = (
    value: string
  ) => {
    setSort(value);
  };

  if (!keyword) {
    return (
      <main className="min-h-[60vh] bg-[#FDFBF7] px-6 py-20">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-[#3A2A20]">
            Search Silk Sarees
          </h1>

          <p className="mt-4 text-[#7A685B]">
            Enter a saree name, category, or keyword
            in the search bar.
          </p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-[60vh] bg-[#FDFBF7] px-4 py-8 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="h-10 w-full max-w-72 animate-pulse rounded bg-[#F3EEE8]" />

              <div className="mt-3 h-5 w-48 animate-pulse rounded bg-[#F3EEE8]" />
            </div>

            <div className="h-10 w-48 animate-pulse rounded bg-[#F3EEE8]" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="h-[420px] animate-pulse rounded-2xl bg-[#F3EEE8]"
                />
              )
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[60vh] bg-[#FDFBF7] px-4 py-8 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-[#3A2A20]">
              Search Results
            </h1>

            <p className="mt-3 text-lg text-[#7A685B]">
              Results for{" "}
              <span className="font-semibold text-[#7A1F2B]">
                "{keyword}"
              </span>
            </p>

            <p className="mt-1 text-sm text-[#8A786A]">
              {totalProducts}{" "}
              {totalProducts === 1
                ? "product"
                : "products"}{" "}
              found
            </p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="search-sort"
              className="text-sm font-medium text-[#5A4638]"
            >
              Sort by
            </label>

            <select
              id="search-sort"
              name="sort"
              value={sort}
              onChange={(event) =>
                handleSortChange(
                  event.target.value
                )
              }
              aria-label="Sort search results"
              className="rounded-lg border border-[#DCCFC2] bg-white px-4 py-2.5 text-sm text-[#3A2A20] outline-none transition focus:border-[#7A1F2B] focus:ring-2 focus:ring-[#7A1F2B]/20"
            >
              <option value="newest">
                Newest
              </option>

              <option value="priceAsc">
                Price: Low to High
              </option>

              <option value="priceDesc">
                Price: High to Low
              </option>

              <option value="rating">
                Top Rated
              </option>
            </select>
          </div>
        </div>

        {/* No Results */}
        {products.length === 0 ? (
          <div className="rounded-2xl border border-[#E8DED2] bg-white px-4 py-8 sm:px-6 sm:py-16 text-center">
            <h2 className="text-2xl font-semibold text-[#3A2A20]">
              No Products Found
            </h2>

            <p className="mt-3 text-[#7A685B]">
              We couldn't find any sarees matching
              "{keyword}".
            </p>

            <p className="mt-2 text-sm text-[#9A887A]">
              Try searching with another name,
              category, or keyword.
            </p>
          </div>
        ) : (
          <>
            {/* Products */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {products.map(
                (product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    category={product.category}
                    price={product.price}
                    image={product.image}
                    averageRating={
                      product.averageRating
                    }
                    numReviews={
                      product.numReviews
                    }
                    stock={product.stock}
                  />
                )
              )}
            </div>

            {/* Continuous Single-Page Catalog Summary Footer */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#E8DED2] bg-white px-5 py-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF8F0] border border-[#D4AF37]/50 text-[#6D001A] text-xs font-serif">
                  ✦
                </span>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-[#5A4638]">
                    Showing all{" "}
                    <span className="font-bold text-[#6D001A]">{products.length}</span>{" "}
                    matching {products.length === 1 ? "saree" : "sarees"}
                  </p>
                  <div className="mt-1.5 h-1.5 w-44 sm:w-56 overflow-hidden rounded-full bg-stone-100 mx-auto sm:mx-0">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-[#6D001A] to-[#D4AF37]" />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#D4AF37]/60 bg-[#FFF8F0] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#6D001A] hover:bg-[#6D001A] hover:text-white transition cursor-pointer"
              >
                <span>Back to Top ↑</span>
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}