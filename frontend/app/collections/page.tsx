import { Suspense } from "react";
import CollectionsHero from "@/components/collections/CollectionsHero";
import FilterSidebar from "@/components/collections/FilterSidebar";
import ProductGrid from "@/components/collections/ProductGrid";
import CollectionsBestPractices from "@/components/collections/CollectionsBestPractices";

export default function CollectionsPage() {
  return (
    <main className="bg-[#FAF8F5]">
      {/* 1. Curated Collections Hero + 5 Occasion Cards matching Page 05 */}
      <CollectionsHero />

      {/* 2. Collection Layout Preview: Sidebar + Product Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-12 items-start">
          {/* Left Filter Sidebar (3 cols on desktop, hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-3">
            <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-white border border-[#E8E4DF]" />}>
              <FilterSidebar />
            </Suspense>
          </div>

          {/* Right Product Grid & Filter Bar (12 cols on mobile, 9 cols on desktop) */}
          <div className="col-span-1 lg:col-span-9">
            <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-white border border-[#E8E4DF]" />}>
              <ProductGrid />
            </Suspense>
          </div>
        </div>
      </section>

      {/* 3. Collections Best Practices Banner matching Page 05 */}
      <CollectionsBestPractices />
    </main>
  );
}