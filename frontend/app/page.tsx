import { getProducts } from "@/services/api";
import HeroBannerCarousel from "@/components/home/HeroBannerCarousel";
import TrustFeaturesStrip from "@/components/home/TrustFeaturesStrip";
import ExploreCollectionsSection from "@/components/home/ExploreCollectionsSection";
import HomeProductShowcase from "@/components/home/HomeProductShowcase";
import HeritageSection from "@/components/home/HeritageSection";
import InstagramGalleryStrip from "@/components/home/InstagramGalleryStrip";
import HomeRecentlyViewed from "@/components/home/HomeRecentlyViewed";
import FestiveOfferStrip from "@/components/home/FestiveOfferStrip";

export default async function HomePage() {
  const data = await getProducts({ limit: 200 });
  const allProducts = data.products || [];

  return (
    <main className="bg-[#FFF8F0]">
      {/* 1. HERO BANNER SLIDER */}
      <HeroBannerCarousel />

      {/* 2. SHOP BY COLLECTION (8 Round Bubbles) */}
      <ExploreCollectionsSection />

      {/* 3. INTERACTIVE FEATURED SAREES TABS & SHOP BY BUDGET */}
      {allProducts.length > 0 && (
        <HomeProductShowcase products={allProducts} />
      )}

      {/* 4. FESTIVE OFFERS RIBBON */}
      <FestiveOfferStrip />

      {/* 4.5 RECENTLY VIEWED SAREES (Personalized Continue Shopping Strip) */}
      <HomeRecentlyViewed />

      {/* 5. THE SILKVERSE STORY */}
      <HeritageSection />

      {/* 6. LOWER DUAL SECTION: FOLLOW US ON INSTAGRAM + STAY IN THE LOOP */}
      <InstagramGalleryStrip />

      {/* 7. 5-PILLAR TRUST STRIP (Bottom of Page above Footer) */}
      <TrustFeaturesStrip />
    </main>
  );
}