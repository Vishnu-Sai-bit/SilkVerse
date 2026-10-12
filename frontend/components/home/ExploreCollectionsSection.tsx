"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCategories, getProducts } from "@/services/api";

interface CollectionItem {
  id: string;
  title: string;
  image: string;
  href: string;
}

const BASE_COLLECTIONS: CollectionItem[] = [
  {
    id: "wedding",
    title: "WEDDING",
    image: "/images/collections/wedding.png",
    href: "/collections?category=Wedding",
  },
  {
    id: "bridal",
    title: "BRIDAL",
    image: "/images/collections/bridal.png",
    href: "/collections?category=Bridal",
  },
  {
    id: "festive",
    title: "FESTIVE",
    image: "/images/collections/festive.png",
    href: "/collections?category=Festive",
  },
  {
    id: "heritage",
    title: "HERITAGE",
    image: "/images/collections/heritage.png",
    href: "/collections?category=Handloom",
  },
  {
    id: "casual",
    title: "CASUAL",
    image: "/images/collections/soft_silk.png",
    href: "/collections?category=Soft%20Silk",
  },
  {
    id: "designer",
    title: "DESIGNER",
    image: "/images/collections/luxury.png",
    href: "/collections?category=Luxury%20Silk",
  },
  {
    id: "party-wear",
    title: "PARTY WEAR",
    image: "/images/collections/party_wear.png",
    href: "/collections?occasion=Party%20Wear",
  },
  {
    id: "new-arrivals",
    title: "NEW ARRIVALS",
    image: "/images/collections/new_arrivals.png",
    href: "/collections?sort=newest",
  },
];

// Known categories covered by the base 8 bubbles
const COVERED_CATEGORIES = new Set([
  "all",
  "wedding",
  "bridal",
  "festive",
  "handloom",
  "soft silk",
  "luxury silk",
  "casual",
  "designer",
  "party wear",
  "new arrivals",
]);

export default function ExploreCollectionsSection() {
  const [collections, setCollections] = useState<CollectionItem[]>(BASE_COLLECTIONS);

  // Dynamically append any new categories added in the future via Admin/Database
  useEffect(() => {
    let active = true;
    Promise.all([getCategories(), getProducts({ limit: 100 })])
      .then(([catData, prodData]: [any, any]) => {
        if (!active) return;
        const dbCategories: string[] = Array.isArray(catData?.categories)
          ? catData.categories
          : [];
        const productList: any[] = Array.isArray(prodData?.products)
          ? prodData.products
          : [];

        const extraItems: CollectionItem[] = [];
        for (const catName of dbCategories) {
          const clean = (catName || "").trim();
          if (!clean || COVERED_CATEGORIES.has(clean.toLowerCase())) continue;

          const matchingProduct = productList.find(
            (p) => (p.category || "").trim().toLowerCase() === clean.toLowerCase()
          );
          const imgSrc =
            matchingProduct?.image || "/images/collections/heritage.png";

          extraItems.push({
            id: `dyn-${clean.toLowerCase().replace(/\s+/g, "-")}`,
            title: clean.toUpperCase(),
            image: imgSrc,
            href: `/collections?category=${encodeURIComponent(clean)}`,
          });
        }

        if (extraItems.length > 0) {
          setCollections([...BASE_COLLECTIONS, ...extraItems]);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="bg-[#FFF8F0] py-12 sm:py-14 border-b border-amber-900/10 overflow-hidden">
      <style>{`
        @keyframes silkverseCollectionTreadmill {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .silkverse-treadmill-track {
          display: flex;
          width: max-content;
          animation: silkverseCollectionTreadmill 24s linear infinite;
          will-change: transform;
        }
      `}</style>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading with Gold Arrow Dividers */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center gap-3 text-[#D4AF37]">
            <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[10px] sm:text-xs font-serif italic">✦</span>
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-[0.2em] text-[#6D001A]">
              Shop By Collection
            </h2>
            <span className="text-[10px] sm:text-xs font-serif italic">✦</span>
            <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
        </div>
      </div>

      {/* Continuous Non-Stop Treadmill Moving Track */}
      <div className="relative w-full overflow-hidden py-2">
        <div className="silkverse-treadmill-track">
          {[0, 1].map((copyIdx) => (
            <div
              key={copyIdx}
              className="flex items-start gap-6 sm:gap-8 pr-6 sm:pr-8 shrink-0"
            >
              {collections.map((col) => (
                <Link
                  key={`${col.id}-${copyIdx}`}
                  href={col.href}
                  className="group flex flex-col items-center gap-2.5 text-center shrink-0 w-[110px] sm:w-[130px]"
                >
                  <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-[#D4AF37] p-1 bg-white shadow-md transition-all duration-300 group-hover:scale-108 group-hover:border-[#6D001A] group-hover:shadow-xl">
                    <div className="relative h-full w-full overflow-hidden rounded-full">
                      <Image
                        src={col.image}
                        alt={col.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 96px, 112px"
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-112"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#2D2A26] transition-colors group-hover:text-[#6D001A] text-center whitespace-nowrap">
                    {col.title}
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
