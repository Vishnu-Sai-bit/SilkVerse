"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import {
  useCart,
  CartItem as CartItemType,
} from "@/context/CartContext";

interface Props {
  item: CartItemType;
}

function getImageUrl(image?: string) {
  const backendUrl = (
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5001"
  ).replace(/\/+$/, "");

  if (!image) {
    return "/images/products/default.jpg";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  if (image.startsWith("/uploads/")) {
    const filename = image.replace(/^\/uploads\/(?:products\/)?/, "");
    return `/images/products/${filename}`;
  }

  if (image.startsWith("uploads/")) {
    const filename = image.replace(/^uploads\/(?:products\/)?/, "");
    return `/images/products/${filename}`;
  }

  if (image.startsWith("/")) {
    return image;
  }

  return `/images/products/${image}`;
}

export default function CartItem({ item }: Props) {
  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const stock =
    item.stock !== undefined
      ? Math.max(0, Number(item.stock) || 0)
      : undefined;

  const hasReachedStock =
    stock !== undefined &&
    (stock === 0 || item.quantity >= stock);

  const imageUrl = getImageUrl(item.image);

  const itemTotal =
    Number(item.price || 0) * item.quantity;

  const handleDecrease = () => {
    if (item.quantity <= 1) {
      removeFromCart(item._id);
      return;
    }

    decreaseQuantity(item._id);
  };

  return (
    <article className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-2xl border border-stone-200/90 bg-white p-4 sm:p-5 shadow-2xs hover:border-stone-300 transition">
      {/* Left: Product Image */}
      <div className="flex items-start gap-4 w-full sm:w-auto">
        <Link
          href={`/products/${item._id}`}
          className="shrink-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6D001A] focus:ring-offset-2"
          aria-label={`View ${item.name}`}
        >
          <div className="relative h-28 w-24 sm:h-32 sm:w-28 overflow-hidden rounded-xl bg-stone-100 border border-stone-200">
            <Image
              src={imageUrl}
              alt={item.name || "Product"}
              fill
              sizes="112px"
              loading="eager"
              unoptimized
              className="object-cover transition duration-300 hover:scale-105"
              onError={(event) => {
                event.currentTarget.src =
                  "/images/products/default.jpg";
              }}
            />
          </div>
        </Link>

        {/* Center: Title, Color, Attributes, Price */}
        <div className="flex-1 min-w-0 space-y-1">
          <Link
            href={`/products/${item._id}`}
            className="inline-block focus:outline-none focus:ring-2 focus:ring-[#6D001A] focus:ring-offset-2"
          >
            <h2 className="font-serif text-base sm:text-lg font-bold text-[#2D2A26] transition hover:text-[#6D001A] leading-snug">
              {item.name}
            </h2>
          </Link>

          {/* Color / Subtitle if present */}
          {item.color && (
            <p className="text-xs font-semibold text-[#6D001A]">
              {item.color}
            </p>
          )}

          {/* Attributes List */}
          <div className="text-[11px] text-stone-500 space-y-0.5 pt-0.5">
            <p>Fabric: <span className="font-medium text-stone-700">{item.name.includes("Kanchipuram") ? "Kanchipuram Silk" : "Pure Handloom Silk"}</span></p>
            <p>Length: <span className="font-medium text-stone-700">5.5 Meters (With Blouse Piece)</span></p>
            <p>Occasion: <span className="font-medium text-stone-700">{item.name.includes("Wedding") ? "Wedding" : "Festive"}</span></p>
          </div>

          {/* Price + Strikethrough + Discount Pill */}
          <div className="flex items-center gap-2 pt-1.5">
            <span className="font-serif text-base sm:text-lg font-bold text-[#2D2A26]">
              ₹{Number(item.price || 0).toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-stone-400 line-through">
              ₹{Math.round(Number(item.price || 0) * 1.315).toLocaleString("en-IN")}
            </span>
            <span className="rounded-md bg-[#2D2A26] px-2 py-0.5 text-[10px] font-bold text-white">
              24% OFF
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Unit Price, Actions, Stepper, Total */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
        {/* Unit Price & Quick Actions (Wishlist + Delete) */}
        <div className="flex items-center gap-3">
          <div className="text-left sm:text-right">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400">Unit Price</span>
            <span className="text-xs font-semibold text-stone-700">₹{Number(item.price || 0).toLocaleString("en-IN")}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                removeFromCart(item._id);
              }}
              title="Remove from cart"
              aria-label={`Remove ${item.name} from cart`}
              className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Stepper + Item Total */}
        <div className="flex items-center gap-4">
          <div
            className="flex h-9 items-center rounded-md border border-stone-300 bg-white"
            aria-label={`Quantity controls for ${item.name}`}
          >
            <button
              type="button"
              onClick={handleDecrease}
              className="flex h-full w-8 sm:w-7 items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={13} />
            </button>

            <span
              className="w-7 text-center text-xs font-bold text-[#2D2A26]"
              aria-live="polite"
            >
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() => increaseQuantity(item._id)}
              disabled={stock === 0 || hasReachedStock}
              className="flex h-full w-8 sm:w-7 items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={13} />
            </button>
          </div>

          <div className="min-w-[70px] text-right">
            <span className="font-serif text-base sm:text-lg font-bold text-[#2D2A26]">
              ₹{itemTotal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}