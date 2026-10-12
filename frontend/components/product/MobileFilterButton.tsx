"use client";

import { useEffect, useState } from "react";
import FilterSidebar from "./FilterSidebar";

type Props = {
  keyword: string;
  setKeyword: (value: string) => void;

  category: string;
  setCategory: (value: string) => void;

  minPrice: string;
  setMinPrice: (value: string) => void;

  maxPrice: string;
  setMaxPrice: (value: string) => void;

  rating: string;
  setRating: (value: string) => void;

  sort: string;
  setSort: (value: string) => void;

  clearFilters: () => void;
};

export default function MobileFilterButton({
  keyword,
  setKeyword,
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  rating,
  setRating,
  sort,
  setSort,
  clearFilters,
}: Props) {
  const [open, setOpen] = useState(false);

  function handleClearFilters() {
    clearFilters();
    setOpen(false);
  }

  function closeDrawer() {
    setOpen(false);
  }

  // Prevent background page scrolling while the drawer is open.
  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  // Allow Escape key to close the drawer.
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDrawer();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      {/* Filter Button */}

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open filters"
        aria-expanded={open}
        aria-controls="mobile-filter-drawer"
        className="flex items-center gap-2 rounded-lg border bg-white px-5 py-3 font-semibold shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7A1F2B] focus:ring-offset-2"
      >
        <span aria-hidden="true">⚙️</span>
        Filters
      </button>

      {/* Mobile Filter Drawer */}

      {open && (
        <div
          className="fixed inset-0 z-50"
          role="presentation"
        >
          {/* Overlay */}

          <button
            type="button"
            aria-label="Close filters"
            onClick={closeDrawer}
            className="absolute inset-0 h-full w-full cursor-default bg-black/40"
          />

          {/* Drawer */}

          <div
            id="mobile-filter-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-filter-title"
            className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white p-6 shadow-xl"
          >
            {/* Drawer Header */}

            <div className="mb-6 flex items-center justify-between">
              <h2
                id="mobile-filter-title"
                className="text-2xl font-bold text-[#7A1F2B]"
              >
                Filters
              </h2>

              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close filters"
                className="flex h-10 w-10 items-center justify-center rounded-full text-2xl font-bold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7A1F2B] focus:ring-offset-2"
              >
                <span aria-hidden="true">
                  ✕
                </span>
              </button>
            </div>

            {/* Filters */}

            <FilterSidebar
              keyword={keyword}
              setKeyword={setKeyword}

              category={category}
              setCategory={setCategory}

              minPrice={minPrice}
              setMinPrice={setMinPrice}

              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}

              rating={rating}
              setRating={setRating}

              sort={sort}
              setSort={setSort}

              clearFilters={handleClearFilters}
            />

            {/* Apply / Close */}

            <button
              type="button"
              onClick={closeDrawer}
              className="mt-6 w-full rounded-lg bg-[#7A1F2B] py-3 font-semibold text-white transition hover:bg-[#5B1620] focus:outline-none focus:ring-2 focus:ring-[#7A1F2B] focus:ring-offset-2"
            >
              View Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}