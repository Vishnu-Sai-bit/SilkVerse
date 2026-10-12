"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface MegaMenuProps {
  onClose?: () => void;
}

export default function MegaMenu({ onClose }: MegaMenuProps) {
  const sareeCategories = [
    { name: "Kanchipuram Silk", href: "/collections?category=Kanchipuram" },
    { name: "Banarasi Silk", href: "/collections?category=Banarasi" },
    { name: "Paithani Silk", href: "/collections?category=Paithani" },
    { name: "Dharmavaram Silk", href: "/collections?category=Dharmavaram" },
    { name: "Soft Silk", href: "/collections?category=Soft%20Silk" },
    { name: "Organza Silk", href: "/collections?category=Organza" },
    { name: "Handloom Silk", href: "/collections?category=Handloom" },
    { name: "Luxury Silk", href: "/collections?category=Luxury%20Silk" },
    { name: "Pure Mulberry Silk", href: "/collections?category=Mulberry" },
  ];

  const occasions = [
    { name: "Wedding Collection", href: "/collections?occasion=Wedding" },
    { name: "Bridal Collection", href: "/collections?occasion=Bridal" },
    { name: "Festive Collection", href: "/collections?occasion=Festive" },
    { name: "Party Wear", href: "/collections?occasion=Party%20Wear" },
    { name: "Traditional Wear", href: "/collections?occasion=Traditional" },
    { name: "Casual Wear", href: "/collections?occasion=Casual%20Wear" },
    { name: "Office Wear", href: "/collections?occasion=Office%20Wear" },
  ];

  const shopBy = [
    { name: "Best Sellers", href: "/collections?sort=popularity" },
    { name: "Coupons & Offers", href: "/offers" },
    { name: "New Arrivals", href: "/collections?sort=newest" },
    { name: "Price: Low to High", href: "/collections?sort=priceAsc" },
    { name: "Price: High to Low", href: "/collections?sort=priceDesc" },
    { name: "Exclusive Collection", href: "/collections?category=Luxury%20Silk" },
  ];

  return (
    <div
      role="region"
      aria-label="Sarees Mega Menu"
      className="w-full max-w-7xl rounded-2xl border border-[#D4AF37]/30 bg-white p-5 xl:p-8 shadow-2xl transition-all"
    >
      <div className="grid grid-cols-12 gap-4 xl:gap-8 items-start">
        {/* Left Promo Card matching Page 04 */}
        <div className="col-span-3">
          <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#D4AF37]/30 shadow-md">
            <Image
              src="/images/megamenu/megamenu_heritage.jpg"
              alt="Timeless Elegance, Woven with Heritage"
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1200px) 25vw, 300px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 via-45% to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <h4 className="font-serif text-lg font-bold leading-tight drop-shadow-sm">
                <span>Timeless Elegance,</span>
                <br />
                <span className="italic font-normal text-[#D4AF37] font-serif">
                  Woven with Heritage
                </span>
              </h4>
              <Link
                href="/collections"
                onClick={onClose}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:text-white transition-colors group-hover:translate-x-1"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Column 1: SAREE CATEGORIES */}
        <div className="col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#6D001A] border-b border-[#D4AF37]/30 pb-2 mb-3">
            SAREE CATEGORIES
          </h4>
          <ul className="space-y-2">
            {sareeCategories.map((cat) => (
              <li key={cat.name}>
                <Link
                  href={cat.href}
                  onClick={onClose}
                  className="text-xs text-[#2D2A26]/85 hover:text-[#6D001A] hover:font-semibold transition-all block py-0.5"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: OCCASIONS */}
        <div className="col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#6D001A] border-b border-[#D4AF37]/30 pb-2 mb-3">
            OCCASIONS
          </h4>
          <ul className="space-y-2">
            {occasions.map((occ) => (
              <li key={occ.name}>
                <Link
                  href={occ.href}
                  onClick={onClose}
                  className="text-xs text-[#2D2A26]/85 hover:text-[#6D001A] hover:font-semibold transition-all block py-0.5"
                >
                  {occ.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: SHOP BY */}
        <div className="col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#6D001A] border-b border-[#D4AF37]/30 pb-2 mb-3">
            SHOP BY
          </h4>
          <ul className="space-y-2">
            {shopBy.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="text-xs text-[#2D2A26]/85 hover:text-[#6D001A] hover:font-semibold transition-all block py-0.5"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: FEATURED matching Page 04 */}
        <div className="col-span-3 flex flex-col justify-between h-full">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#6D001A] border-b border-[#D4AF37]/30 pb-2 mb-3">
              FEATURED
            </h4>
            <div className="space-y-3">
              {/* Card 1: WEDDING COLLECTION */}
              <Link
                href="/collections?category=Wedding"
                onClick={onClose}
                className="group relative block aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#D4AF37]/20 shadow-xs"
              >
                <Image
                  src="/images/megamenu/megamenu_wedding.jpg"
                  alt="Wedding Collection"
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1200px) 25vw, 300px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 via-45% to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                  <span className="block text-xs font-bold uppercase tracking-wider text-white">
                    WEDDING
                  </span>
                  <span className="text-[10px] text-amber-200">COLLECTION</span>
                </div>
              </Link>

              {/* Card 2: FESTIVE COLLECTION */}
              <Link
                href="/collections?category=Festive"
                onClick={onClose}
                className="group relative block aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#D4AF37]/20 shadow-xs"
              >
                <Image
                  src="/images/megamenu/megamenu_festive.jpg"
                  alt="Festive Collection"
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1200px) 25vw, 300px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 via-45% to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                  <span className="block text-xs font-bold uppercase tracking-wider text-white">
                    FESTIVE
                  </span>
                  <span className="text-[10px] text-amber-200">COLLECTION</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-3">
            <Link
              href="/collections"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6D001A] hover:text-[#D4AF37] transition-colors"
            >
              <span>VIEW ALL COLLECTIONS</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
