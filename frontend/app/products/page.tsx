"use client";

import {
  useCallback,
  useEffect,
  useState,
  Suspense,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { getProducts, getCategories } from "@/services/api";
import ProductCard from "@/components/product/ProductCard";
import FilterSidebar from "@/components/product/FilterSidebar";
import ProductListingHero from "@/components/product/ProductListingHero";
import PLPBestPractices from "@/components/product/PLPBestPractices";

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  color?: string;
  image?: string;
  images?: string[];
  averageRating?: number;
  numReviews?: number;
  stock?: number;
  badge?: string;
}

const COLOR_PALETTE_FILTERS = [
  { id: "", label: "All Shades", hex: "conic-gradient(#8B001D, #0F5132, #1D3557, #C5A049, #B51763, #8B001D)", keywords: [] },
  { id: "red", label: "Crimson & Red", hex: "#8B001D", keywords: ["crimson", "red", "sindoor", "kumkum", "maroon", "ruby"] },
  { id: "green", label: "Emerald & Green", hex: "#0F5132", keywords: ["emerald", "green", "panna", "jade", "mint", "olive", "pistachio", "forest", "leaf"] },
  { id: "blue", label: "Royal Blue & Teal", hex: "#1D3557", keywords: ["blue", "sapphire", "navy", "indigo", "peacock", "teal", "cerulean", "aqua", "turquoise"] },
  { id: "pink", label: "Rani Pink & Peach", hex: "#B51763", keywords: ["pink", "rani", "magenta", "fuchsia", "peach", "coral", "rose", "apricot", "blush"] },
  { id: "purple", label: "Purple & Wine", hex: "#4A154B", keywords: ["purple", "violet", "amethyst", "plum", "jamun", "wine", "burgundy", "lilac", "lavender", "mauve", "orchid", "bordeaux", "sangria"] },
  { id: "gold", label: "Gold & Mustard", hex: "#C5A049", keywords: ["gold", "mustard", "yellow", "haldi", "tissue", "swarna", "mango", "orange", "copper", "rust"] },
  { id: "ivory", label: "Ivory & Pastel", hex: "#F3EFE6", keywords: ["ivory", "cream", "pearl", "white", "pastel", "powder", "champagne"] },
];

interface ProductResponse {
  products?: Product[];
  totalPages?: number;
  currentPage?: number;
  totalProducts?: number;
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Query State
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [occasion, setOccasion] = useState("");
  const [fabric, setFabric] = useState("");
  const [colorFamily, setColorFamily] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("popularity");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Dynamic filter counts
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [occasionCounts, setOccasionCounts] = useState<Record<string, number>>({});
  const [fabricCounts, setFabricCounts] = useState<Record<string, number>>({});

  // Total Products Count
  const [totalProducts, setTotalProducts] = useState(0);

  const API =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5001";

  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch dynamic categories and counts
  useEffect(() => {
    getCategories()
      .then((data) => {
        if (data.counts) setCategoryCounts(data.counts);
        if (data.occasionCounts) setOccasionCounts(data.occasionCounts);
        if (data.fabricCounts) setFabricCounts(data.fabricCounts);
      })
      .catch((err) => console.error("Failed to load category counts:", err));
  }, []);

  // Sync state with URL search params
  useEffect(() => {
    setKeyword(searchParams.get("keyword") || "");
    setCategory(searchParams.get("category") || "");
    setOccasion(searchParams.get("occasion") || "");
    setFabric(searchParams.get("fabric") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setRating(searchParams.get("rating") || "");
    setSort(searchParams.get("sort") || "popularity");
  }, [searchParams]);

  // Prevent background scrolling when mobile filter drawer is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFilterOpen]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileFilterOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activeFilterCount = [
    Boolean(category),
    Boolean(occasion),
    Boolean(fabric),
    Boolean(minPrice),
    Boolean(maxPrice && maxPrice !== "50000"),
    Boolean(rating),
  ].filter(Boolean).length;

  // Load All Matching Products on a Single Page
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const apiSort =
        sort === "popularity" || sort === "rating"
          ? "rating"
          : sort === "priceAsc"
          ? "priceAsc"
          : sort === "priceDesc"
          ? "priceDesc"
          : "newest";

      const data = (await getProducts({
        keyword: keyword.trim() || undefined,
        category: category.trim() || undefined,
        occasion: occasion.trim() || undefined,
        fabric: fabric.trim() || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        rating: rating ? Number(rating) : undefined,
        sort: apiSort,
        page: 1,
        limit: 200,
      })) as ProductResponse;

      const list = data.products ?? [];

      // Add Page 06 sample badges (BEST SELLER, NEW, TRENDING)
      const badges = ["BEST SELLER", "NEW", "NEW", "TRENDING"];
      const enriched = list.map((p, idx) => ({
        ...p,
        badge: badges[idx % badges.length],
      }));

      setProducts(enriched);
      setTotalProducts(data.totalProducts ?? list.length);
    } catch (err: any) {
      setError(err?.message || "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [keyword, category, occasion, fabric, minPrice, maxPrice, rating, sort]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const clearFilters = () => {
    setKeyword("");
    setCategory("");
    setOccasion("");
    setFabric("");
    setColorFamily("");
    setMinPrice("");
    setMaxPrice("");
    setRating("");
    setSort("popularity");
    router.push("/products");
  };

  const displayedProducts = products.filter((p) => {
    if (!colorFamily) return true;
    const found = COLOR_PALETTE_FILTERS.find((c) => c.id === colorFamily);
    if (!found || found.keywords.length === 0) return true;
    const text = `${p.color || ""} ${p.name || ""} ${p.description || ""}`.toLowerCase();
    return found.keywords.some((kw) => text.includes(kw));
  });

  return (
    <main className="bg-[#FAF8F5]">
      {/* 1. Category Hero with Promo Banner Box matching Page 06 */}
      <ProductListingHero
        category={category}
        occasion={occasion}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* 1b. Visual Color Palette Swatches & Budget Quick-Pills Bar */}
        <div className="mb-4 rounded-2xl border border-[#E8E4DF] bg-white p-3.5 sm:p-4 shadow-2xs space-y-3">
          {/* Row 1: Color Swatch Circles */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 shrink-0 mr-1">
              Shade:
            </span>
            {COLOR_PALETTE_FILTERS.map((swatch) => {
              const isSelected = colorFamily === swatch.id;
              return (
                <button
                  key={swatch.id || "all"}
                  type="button"
                  onClick={() => setColorFamily(isSelected && swatch.id !== "" ? "" : swatch.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shrink-0 transition cursor-pointer ${
                    isSelected
                      ? "border-[#6D001A] bg-[#FFF8F0] text-[#6D001A] ring-1 ring-[#6D001A] shadow-2xs"
                      : "border-stone-200 bg-[#FAF8F5] text-stone-700 hover:border-[#D4AF37] hover:bg-white"
                  }`}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-stone-300 shadow-2xs shrink-0"
                    style={{ background: swatch.hex }}
                  />
                  <span>{swatch.label}</span>
                </button>
              );
            })}
          </div>

          {/* Row 2: Quick Budget & Occasion Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-stone-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 shrink-0 mr-1">
              Quick Pick:
            </span>
            {[
              { label: "All Price Ranges", min: "", max: "" },
              { label: "Under ₹14,000", min: "", max: "14000" },
              { label: "₹14,000 – ₹20,000", min: "14000", max: "20000" },
              { label: "Bridal Luxury ₹20,000+", min: "20000", max: "" },
            ].map((tier) => {
              const activeTier = minPrice === tier.min && maxPrice === tier.max;
              return (
                <button
                  key={tier.label}
                  type="button"
                  onClick={() => {
                    setMinPrice(tier.min);
                    setMaxPrice(tier.max);
                  }}
                  className={`rounded-lg border px-3 py-1 text-[11px] font-bold shrink-0 transition cursor-pointer ${
                    activeTier
                      ? "border-[#6D001A] bg-[#6D001A] text-white"
                      : "border-stone-200 bg-white text-stone-600 hover:border-[#D4AF37] hover:text-[#6D001A]"
                  }`}
                >
                  {tier.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Toolbar Strip matching Page 06 */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E8E4DF] bg-white p-3.5 sm:p-4 shadow-xs">
          {/* Left: FILTERS */}
          <div className="flex items-center gap-3">
            {/* Mobile Interactive Filter Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              aria-label="Open Filters"
              className="lg:hidden inline-flex items-center gap-2 font-bold uppercase tracking-wider text-[#6D001A] px-3.5 py-2 bg-[#FFF8F0] hover:bg-[#FBEEDC] active:scale-95 rounded-xl border border-[#D4AF37]/50 text-xs shadow-2xs transition cursor-pointer"
            >
              <SlidersHorizontal size={14} className="text-[#6D001A]" />
              <span>FILTERS</span>
              {activeFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#6D001A] text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Desktop Static Badge */}
            <div className="hidden lg:inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#6D001A] px-3 py-1.5 bg-[#FFF8F0] rounded-xl border border-[#D4AF37]/40 text-xs">
              <SlidersHorizontal size={14} />
              <span>FILTERS</span>
            </div>

            {/* Product Count (Desktop only) */}
            <span className="hidden lg:inline text-xs sm:text-sm font-semibold text-[#2D2A26]">
              {loading ? "Loading..." : `${displayedProducts.length} Products Found`}
            </span>
          </div>

          {/* Right: SORT BY & View Switcher */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="hidden sm:inline text-gray-500 font-medium">SORT BY</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                }}
                className="rounded-lg border border-[#E8E4DF] bg-white px-3 py-1.5 font-semibold text-[#2D2A26] focus:border-[#6D001A] focus:outline-none"
              >
                <option value="popularity">Popularity ▾</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* View Switcher */}
            <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-[#6D001A] text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "list"
                    ? "bg-[#6D001A] text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Main Grid Layout: Left Sidebar + 4-Column Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Filter Sidebar (3 cols on desktop, hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-3">
            <FilterSidebar
              category={category}
              setCategory={(c) => setCategory(c)}
              occasion={occasion}
              setOccasion={(o) => setOccasion(o)}
              fabric={fabric}
              setFabric={(f) => setFabric(f)}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              rating={rating}
              setRating={setRating}
              sort={sort}
              setSort={setSort}
              clearFilters={clearFilters}
              categoryCounts={categoryCounts}
              occasionCounts={occasionCounts}
              fabricCounts={fabricCounts}
              totalCount={categoryCounts.All ?? totalProducts}
            />
          </div>

          {/* Right Product Grid (12 cols on mobile, 9 cols on desktop) */}
          <div className="col-span-1 lg:col-span-9 space-y-8">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div
                    key={n}
                    className="h-96 animate-pulse rounded-2xl bg-white border border-[#E8E4DF]"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
                <h3 className="font-serif text-xl font-bold text-red-700">
                  Unable to Load Products
                </h3>
                <p className="mt-2 text-xs text-gray-600">{error}</p>
                <button
                  onClick={loadProducts}
                  className="mt-4 rounded-xl bg-[#6D001A] px-6 py-2.5 text-xs font-bold uppercase text-white"
                >
                  Retry
                </button>
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="rounded-2xl border border-[#E8E4DF] bg-white p-12 text-center shadow-xs">
                <h3 className="font-serif text-xl font-bold text-[#6D001A]">
                  No Sarees Found
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-600">
                  Try adjusting your filters or category selection.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 rounded-xl bg-[#6D001A] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Product Grid or List View based on viewMode */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-5">
                    {displayedProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        id={product._id}
                        name={product.name}
                        category={product.category}
                        price={product.price}
                        image={
                          product.image || "/images/products/saree_1_maroon.png"
                        }
                        averageRating={product.averageRating ?? 5}
                        numReviews={product.numReviews ?? 128}
                        stock={product.stock ?? 10}
                        badge={product.badge}
                        layout="grid"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {displayedProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        id={product._id}
                        name={product.name}
                        category={product.category}
                        price={product.price}
                        image={
                          product.image || "/images/products/saree_1_maroon.png"
                        }
                        averageRating={product.averageRating ?? 5}
                        numReviews={product.numReviews ?? 128}
                        stock={product.stock ?? 10}
                        badge={product.badge}
                        layout="list"
                      />
                    ))}
                  </div>
                )}

                {/* 4. Continuous Single-Page Catalog Summary Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#E8E4DF] bg-white px-5 py-4 shadow-2xs">
                  <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF8F0] border border-[#D4AF37]/50 text-[#6D001A] text-xs font-serif">
                      ✦
                    </span>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-stone-700">
                        Showing all{" "}
                        <span className="font-bold text-[#6D001A]">{displayedProducts.length}</span>{" "}
                        of{" "}
                        <span className="font-bold text-stone-900">{totalProducts || products.length}</span>{" "}
                        handcrafted sarees
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
        </div>
      </section>



      {/* Mobile Filter Slide-over Drawer */}
      {isMobileFilterOpen && (
        <div
          className="fixed inset-0 z-[80] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-filter-heading"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-[88vw] sm:max-w-md w-full bg-white shadow-2xl flex flex-col z-[85] animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E4DF] bg-[#FAF8F5]">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal size={18} className="text-[#6D001A]" />
                <h2 id="mobile-filter-heading" className="font-serif text-lg font-bold text-[#6D001A]">
                  Filters
                </h2>
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-[#6D001A] text-white px-2 py-0.5 text-[11px] font-bold">
                    {activeFilterCount} Active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-semibold text-[#6D001A] hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  aria-label="Close filters"
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-200 transition text-[#2D2A26] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5">
              <FilterSidebar
                category={category}
                setCategory={(c) => setCategory(c)}
                occasion={occasion}
                setOccasion={(o) => setOccasion(o)}
                fabric={fabric}
                setFabric={(f) => setFabric(f)}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                rating={rating}
                setRating={setRating}
                sort={sort}
                setSort={setSort}
                clearFilters={clearFilters}
                isMobileDrawer={true}
                categoryCounts={categoryCounts}
                occasionCounts={occasionCounts}
                fabricCounts={fabricCounts}
                totalCount={categoryCounts.All ?? totalProducts}
              />
            </div>

            {/* Drawer Sticky Footer */}
            <div className="p-4 border-t border-[#E8E4DF] bg-[#FAF8F5] flex items-center gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="w-1/3 rounded-xl border border-[#6D001A] py-3 text-xs font-bold uppercase tracking-wider text-[#6D001A] hover:bg-[#6D001A]/10 transition active:scale-95 cursor-pointer text-center"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-2/3 rounded-xl bg-[#6D001A] hover:bg-[#5B0D16] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition active:scale-95 cursor-pointer text-center"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Bottom Features Strip & Best Practices matching Page 06 */}
      <PLPBestPractices />
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse bg-[#FAF8F5]" />}>
      <ProductsContent />
    </Suspense>
  );
}