"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Palette, Check } from "lucide-react";
import { getProducts } from "@/services/api";

interface VariantProduct {
  _id: string;
  name: string;
  price: number;
  color?: string;
  category?: string;
  image?: string;
  images?: string[];
}

function resolveColorHex(text: string): string {
  const lower = (text || "").toLowerCase();
  if (lower.includes("emerald") || lower.includes("panna") || lower.includes("jade") || lower.includes("forest")) return "#0F5132";
  if (lower.includes("mint") || lower.includes("sage") || lower.includes("pistachio") || lower.includes("seafoam")) return "#68A38B";
  if (lower.includes("olive") || lower.includes("moss") || lower.includes("green")) return "#3A5A40";
  if (lower.includes("peacock") || lower.includes("teal") || lower.includes("turquoise") || lower.includes("aqua")) return "#0D5C75";
  if (lower.includes("royal blue") || lower.includes("sapphire") || lower.includes("cobalt")) return "#1D3557";
  if (lower.includes("midnight") || lower.includes("navy") || lower.includes("indigo")) return "#1B263B";
  if (lower.includes("sky") || lower.includes("powder") || lower.includes("cerulean") || lower.includes("blue")) return "#457B9D";
  if (lower.includes("rani") || lower.includes("magenta") || lower.includes("fuchsia")) return "#B51763";
  if (lower.includes("peach") || lower.includes("coral") || lower.includes("apricot") || lower.includes("blush")) return "#E07A5F";
  if (lower.includes("pink") || lower.includes("rose")) return "#C94A77";
  if (lower.includes("crimson") || lower.includes("sindoor") || lower.includes("kumkum") || lower.includes("ruby") || lower.includes("red")) return "#8B001D";
  if (lower.includes("maroon") || lower.includes("wine") || lower.includes("burgundy") || lower.includes("bordeaux") || lower.includes("sangria")) return "#5C0918";
  if (lower.includes("purple") || lower.includes("violet") || lower.includes("amethyst") || lower.includes("jamun") || lower.includes("plum")) return "#4A154B";
  if (lower.includes("lavender") || lower.includes("lilac") || lower.includes("mauve") || lower.includes("orchid")) return "#8E6C88";
  if (lower.includes("mustard") || lower.includes("haldi") || lower.includes("yellow") || lower.includes("mango")) return "#D49B27";
  if (lower.includes("gold") || lower.includes("tissue") || lower.includes("swarna") || lower.includes("champagne")) return "#C5A049";
  if (lower.includes("orange") || lower.includes("copper") || lower.includes("rust")) return "#BF4E1F";
  if (lower.includes("ivory") || lower.includes("cream") || lower.includes("pearl") || lower.includes("white")) return "#F3EFE6";
  if (lower.includes("black") || lower.includes("charcoal") || lower.includes("obsidian")) return "#222222";
  return "#7A1F2B";
}

function getSwatchImageUrl(img?: string): string {
  if (!img) return "/images/products/saree_1_maroon.png";
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("/images/")) return img;
  const filename = img.replace(/^.*[\\\/]/, "");
  if (filename.startsWith("saree_")) return `/images/products/${filename}`;
  return img;
}

export default function WeaveColorSwatches({
  currentProductId,
  category,
  currentColor,
  currentName,
  currentImage,
}: {
  currentProductId: string;
  category?: string;
  currentColor?: string;
  currentName: string;
  currentImage: string;
}) {
  const [variants, setVariants] = useState<VariantProduct[]>([]);
  const [hoveredVariant, setHoveredVariant] = useState<VariantProduct | null>(null);

  useEffect(() => {
    let active = true;
    getProducts({ category: category || undefined, limit: 24 })
      .then((res: any) => {
        if (!active) return;
        const list: VariantProduct[] = Array.isArray(res?.products) ? res.products : [];
        const seenHex = new Set<string>();
        const currentHex = resolveColorHex(currentColor || currentName);
        seenHex.add(currentHex);

        const picked: VariantProduct[] = [
          {
            _id: currentProductId,
            name: currentName,
            price: 0,
            color: currentColor || "Current Shade",
            image: currentImage,
          },
        ];

        for (const item of list) {
          if (item._id === currentProductId) continue;
          const hex = resolveColorHex(item.color || item.name);
          if (!seenHex.has(hex) && picked.length < 8) {
            seenHex.add(hex);
            picked.push(item);
          }
        }

        if (picked.length > 1) {
          setVariants(picked);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [currentProductId, category, currentColor, currentName, currentImage]);

  if (variants.length <= 1) return null;

  const activeLabel =
    hoveredVariant?.color ||
    hoveredVariant?.name.split(" ").slice(0, 3).join(" ") ||
    currentColor ||
    "Original Weave Shade";

  return (
    <div className="mt-4 rounded-xl border border-stone-200/90 bg-[#FAF8F5] p-3.5">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2D2A26]">
          <Palette size={14} className="text-[#6D001A]" />
          <span>Explore Other Colors in {category || "Pure Silk"}:</span>
        </div>
        <span className="text-xs font-semibold text-[#6D001A] truncate max-w-[180px]">
          {activeLabel}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {variants.map((v) => {
          const isCurrent = v._id === currentProductId;
          const hex = resolveColorHex(v.color || v.name);
          const thumb = getSwatchImageUrl(v.image || v.images?.[0]);

          return (
            <Link
              key={v._id}
              href={`/products/${v._id}`}
              onMouseEnter={() => setHoveredVariant(v)}
              onMouseLeave={() => setHoveredVariant(null)}
              title={`${v.color || v.name}${v.price ? ` — ₹${v.price.toLocaleString("en-IN")}` : ""}`}
              className={`group relative flex items-center gap-1.5 rounded-lg border p-1 pr-2.5 transition-all ${
                isCurrent
                  ? "border-[#6D001A] bg-[#FFF8F0] ring-1 ring-[#6D001A] shadow-2xs"
                  : "border-stone-200 bg-white hover:border-[#D4AF37] hover:shadow-2xs"
              }`}
            >
              <div className="relative h-9 w-7 overflow-hidden rounded border border-stone-200 shrink-0">
                <img
                  src={thumb}
                  alt={v.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
                <span
                  className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border border-white shadow-2xs flex items-center justify-center"
                  style={{ backgroundColor: hex }}
                >
                  {isCurrent && <Check size={8} className="text-white" />}
                </span>
              </div>
              <div className="text-left min-w-0">
                <p className="text-[11px] font-bold text-[#2D2A26] truncate max-w-[85px]">
                  {(v.color || v.name).split("&")[0].trim()}
                </p>
                {v.price > 0 && (
                  <p className="text-[10px] font-semibold text-stone-500">
                    ₹{v.price.toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
