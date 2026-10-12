import {
  getProductById,
  getReviews,
  getRelatedProducts,
} from "@/services/api";
import { getProductImageUrl } from "@/utils/image";

import { notFound } from "next/navigation";

import ProductActions from "@/components/product/ProductActions";
import StarRating from "@/components/reviews/StarRating";
import RatingBreakdown from "@/components/reviews/RatingBreakdown";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewSection from "@/components/reviews/ReviewSection";
import ProductGallery from "@/components/product/ProductGallery";
import RelatedProducts from "@/components/product/RelatedProducts";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import ShareProduct from "@/components/product/ShareProduct";
import Breadcrumb from "@/components/layout/Breadcrumb";
import PincodeDeliveryEstimator from "@/components/product/PincodeDeliveryEstimator";
import ProductDetailsAccordion from "@/components/product/ProductDetailsAccordion";
import VideoShoppingModal from "@/components/product/VideoShoppingModal";
import { Sparkles } from "lucide-react";

// ======================================
// Types
// ======================================

type Review = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
  };
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

// ======================================
// Product Details Page
// ======================================
import catalogData from "@/data/catalog.json";

export async function generateStaticParams() {
  return ((catalogData as any).products || []).map((p: any) => ({
    id: String(p._id),
  }));
}

export default async function ProductDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  // ====================================
  // Product
  // ====================================

  let product;

  try {
    product = await getProductById(id);

    if (!product) {
      notFound();
    }
  } catch (error: any) {
    if (
      error?.message === "Invalid product ID" ||
      error?.message === "Product not found"
    ) {
      notFound();
    }

    throw error;
  }

  // ====================================
  // Reviews
  // ====================================

  let reviews: Review[] = [];

  try {
    const reviewData = await getReviews(id);

    reviews = reviewData ?? [];
  } catch {
    // Reviews are optional for page rendering.
    // The product page can still load if reviews fail.
    reviews = [];
  }

  // ====================================
  // Related Products
  // ====================================

  let relatedProducts = [];

  try {
    relatedProducts = await getRelatedProducts(id);
  } catch {
    relatedProducts = [];
  }

  // ====================================
  // API URL
  // ====================================

  const RAW_API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5001";

  const API_URL = RAW_API_URL
    .replace(/\/+$/, "")
    .replace(/\/api$/, "");

  // ====================================
  // Product Image Helper
  // ====================================

  const getImageUrl = (image?: string) => getProductImageUrl(image);

  // ====================================
  // Product Images & Supplementary Views
  // ====================================

  const primaryImage =
    product.images?.length > 0
      ? getImageUrl(product.images[0])
      : getImageUrl(product.image);

  const galleryImages =
    product.images?.length > 0
      ? product.images.map((img: string) => getImageUrl(img))
      : [primaryImage];

  const productViews = product.views
    ? {
        front: product.views.front ? getImageUrl(product.views.front) : primaryImage,
        side: product.views.side ? getImageUrl(product.views.side) : undefined,
        back: product.views.back ? getImageUrl(product.views.back) : undefined,
        border: product.views.border ? getImageUrl(product.views.border) : undefined,
        blouse: product.views.blouse ? getImageUrl(product.views.blouse) : undefined,
        kongu: product.views.kongu ? getImageUrl(product.views.kongu) : undefined,
      }
    : undefined;

  // ====================================
  // Rating Breakdown
  // ====================================

  const ratingCounts = {
    5: reviews.filter(
      (review) => review.rating === 5
    ).length,

    4: reviews.filter(
      (review) => review.rating === 4
    ).length,

    3: reviews.filter(
      (review) => review.rating === 3
    ).length,

    2: reviews.filter(
      (review) => review.rating === 2
    ).length,

    1: reviews.filter(
      (review) => review.rating === 1
    ).length,
  };

  // ====================================
  // Render
  // ====================================

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 sm:pt-16 pb-24 lg:pb-16">
      {/* ==================================
          Breadcrumb
      ================================== */}

      {/* ==================================
          Breadcrumb (Page 07)
      ================================== */}

      <Breadcrumb
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Collections",
            href: "/collections",
          },
          {
            label: `${product.category || "Wedding"} Collection`,
            href: "/collections",
          },
          {
            label: product.name,
          },
        ]}
      />

      {/* ==================================
          Product Main Section (Gallery + Info)
      ================================== */}

      <div className="grid items-start gap-8 lg:gap-12 lg:grid-cols-2">
        {/* =================================
            Product Gallery (Page 07: Vertical Carousel + Zoom + 4-Pill Trust Bar)
        ================================= */}

        <ProductGallery
          productId={product._id}
          productName={product.name}
          images={galleryImages}
          views={productViews}
        />

        {/* =================================
            Product Details & Actions
        ================================= */}

        <div className="flex flex-col">
          {/* Top Bar: Dynamic Collection/Best Seller Pill + Share */}
          <div className="flex items-center justify-between gap-4">
            <span className="inline-block rounded-md bg-[#FFF8F0] px-3 py-1 text-[11px] font-bold tracking-wider text-[#6D001A] border border-[#D4AF37]/50 shadow-2xs uppercase">
              {product.category === "Bridal"
                ? "👑 Bridal Muhurtham Exclusive"
                : product.category === "Luxury Silk"
                ? "✨ Heirloom Collector Edition"
                : product.isBestSeller || (product.salesCount ?? 0) >= 30
                ? "★ Best Seller"
                : `🪷 Pure ${product.category || "Handloom"} Silk`}
            </span>

            <div className="flex items-center gap-2">
              <ShareProduct
                productName={product.name}
              />
            </div>
          </div>

          {/* Product Name (Serif Cormorant Garamond) */}
          <h1 className="mt-3 font-serif text-2xl sm:text-4xl lg:text-[42px] font-bold leading-tight text-[#2D2A26]">
            {product.name}
          </h1>

          {/* Ratings (4★ - 5★ Star Rating without review count) */}
          <div className="mt-3 flex flex-wrap items-center gap-2.5 text-xs text-stone-600">
            <div className="flex items-center text-amber-500">
              <StarRating
                rating={
                  (product.averageRating ?? 0) > 0
                    ? product.averageRating ?? 4.8
                    : 4.8
                }
              />
            </div>

            <span className="font-semibold text-stone-800">
              {Number(product.averageRating || 4.8).toFixed(1)} / 5.0
            </span>

            {(product.salesCount ?? 0) > 0 && (
              <span className="rounded-md bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                {product.salesCount}+ Sold
              </span>
            )}
          </div>

          {/* Clean Direct Weaver Price Block */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#6D001A] tracking-tight">
              ₹{(product.price ?? 18999).toLocaleString("en-IN")}
            </span>
            <span className="rounded-md bg-[#FFF8F0] border border-[#D4AF37]/50 px-2.5 py-1 text-[11px] font-bold text-[#6D001A] shadow-2xs">
              Direct Master Weaver Price
            </span>
          </div>
          <p className="mt-1 text-xs text-stone-500 font-medium">
            Inclusive of all taxes • Free Insured Express Delivery
          </p>

          {/* Short Description */}
          <p className="mt-4 text-xs sm:text-sm leading-relaxed text-stone-600">
            {product.description ||
              "A timeless Kanchipuram silk saree in majestic royal maroon with traditional zari weave and rich gold border. Perfect for weddings and grand celebrations."}
          </p>

          {/* Stock Status */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Availability:</span>
            {(product.stock ?? 0) <= 0 ? (
              <span className="rounded bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                Out of Stock
              </span>
            ) : (product.stock ?? 0) <= 5 ? (
              <span className="rounded bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700">
                🔥 Only a few left
              </span>
            ) : (
              <span className="rounded bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                ✓ In Stock (Ready to Dispatch)
              </span>
            )}
          </div>

          {/* Product Customizations & Action Buttons (Color, Fabric, Occasion, Length, QTY, Maroon ADD TO CART, Gold BUY NOW, Micro-Trust) */}
          <div className="mt-2">
            <ProductActions
              product={{
                _id: product._id,
                name: product.name,
                price:
                  product.price ?? 0,
                image: primaryImage,
                stock: product.stock ?? 0,
                colors: product.colors,
                color: product.color,
                occasion: product.occasion,
                fabric: product.fabric,
              }}
            />
          </div>

          {/* Live Video Saree Viewing Appointment Modal */}
          <VideoShoppingModal
            product={{
              _id: product._id,
              name: product.name,
              price: product.price ?? 0,
              image: primaryImage,
              category: product.category,
              color: product.color,
            }}
          />

          {/* Pincode Estimator */}
          <div className="mt-5">
            <PincodeDeliveryEstimator />
          </div>
        </div>
      </div>

      {/* ==================================
          Full-Width 3-Column Specifications & Certifications Block (Page 07)
      ================================== */}

      <ProductDetailsAccordion product={product} />

      {/* ==================================
          Heritage Quote Divider Banner
      ================================== */}

      <div className="mt-12 rounded-2xl border border-[#D4AF37]/35 bg-gradient-to-r from-[#FFF8F0] via-[#FAF6EE] to-[#FFF8F0] p-6 text-center shadow-2xs">
        <p className="font-serif italic text-base sm:text-lg font-medium text-[#2D2A26] leading-relaxed max-w-2xl mx-auto">
          <span className="text-xl text-[#D4AF37] mr-1.5 font-normal">❝</span>
          Every thread tells a story of heritage, elegance and timeless beauty.
          <span className="text-xl text-[#D4AF37] ml-1.5 font-normal">❞</span>
        </p>
      </div>

      {/* ====================================
          Ratings & Reviews Section
      ==================================== */}

      <section
        id="reviews"
        className="mt-20 scroll-mt-24 space-y-8"
      >
        <RatingBreakdown
          averageRating={
            (product.averageRating ?? 0) > 0
              ? product.averageRating ?? 4.8
              : 4.8
          }
          totalReviews={
            reviews.length
          }
          ratings={ratingCounts}
        />

        {reviews.length > 0 && (
          <ReviewList
            reviews={reviews}
          />
        )}

        <ReviewSection
          productId={product._id}
        />
      </section>

      {/* ====================================
          Related Products
      ==================================== */}

      <RelatedProducts
        productId={product._id}
        initialProducts={relatedProducts}
      />

      {/* ====================================
          Recently Viewed
      ==================================== */}

      <RecentlyViewed
        currentProduct={{
          _id: product._id,
          name: product.name,
          category:
            product.category,
          price:
            product.price ?? 0,
          image: primaryImage,
          averageRating:
            product.averageRating ?? 0,
          numReviews:
            product.numReviews ?? 0,
          stock:
            product.stock ?? 0,
        }}
      />

      {/* Google Rich Results Product Schema (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            image: primaryImage.startsWith("http")
              ? primaryImage
              : `https://silkverse.com${primaryImage}`,
            description:
              product.description ||
              `Authentic handwoven ${product.category} pure silk saree from master weavers.`,
            brand: {
              "@type": "Brand",
              name: "SilkVerse",
            },
            offers: {
              "@type": "Offer",
              url: `https://silkverse.com/products/${product._id}`,
              priceCurrency: "INR",
              price: product.price ?? 18999,
              availability:
                (product.stock ?? 1) > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              itemCondition: "https://schema.org/NewCondition",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: Number(product.averageRating || 4.8).toFixed(1),
              reviewCount: Math.max(1, product.numReviews || 12),
            },
          }),
        }}
      />
    </main>
  );
}