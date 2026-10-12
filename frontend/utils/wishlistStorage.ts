// ============================================
// Wishlist Local Storage & Sync Utility
// ============================================

import { getWishlist } from "@/services/api";

export type WishlistProductItem = {
  _id: string;
  name: string;
  category?: string;
  price: number;
  image?: string;
  averageRating?: number;
  numReviews?: number;
  stock?: number;
  isBestSeller?: boolean;
  salesCount?: number;
};

const STORAGE_KEY = "silkverse_wishlist_items";

export function getLocalWishlist(): WishlistProductItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalWishlist(items: WishlistProductItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("wishlist-updated"));
  } catch (e) {
    console.error("Failed to save wishlist items to storage", e);
  }
}

export function addToLocalWishlist(product: WishlistProductItem): void {
  const current = getLocalWishlist();
  if (!current.some((p) => p._id === product._id)) {
    const updated = [product, ...current];
    saveLocalWishlist(updated);
  }
}

export function removeFromLocalWishlist(productId: string): void {
  const current = getLocalWishlist();
  const updated = current.filter((p) => p._id !== productId);
  saveLocalWishlist(updated);
}

export function isLocalWishlisted(productId: string): boolean {
  const current = getLocalWishlist();
  return current.some((p) => p._id === productId);
}

// Fetch all wishlisted items, merging server wishlist (if logged in) and local wishlist
export async function getAllWishlistedProducts(): Promise<WishlistProductItem[]> {
  const localItems = getLocalWishlist();
  if (typeof window === "undefined") return localItems;

  const token =
    localStorage.getItem("silkverse-token") ||
    localStorage.getItem("token");

  if (!token) {
    return localItems;
  }

  try {
    const serverRes = await getWishlist(token);
    const serverList = Array.isArray(serverRes) ? serverRes : serverRes?.wishlist || [];

    const serverProducts: WishlistProductItem[] = [];
    serverList.forEach((item: any) => {
      const prod = item?.product;
      if (prod && prod._id) {
        serverProducts.push({
          _id: prod._id,
          name: prod.name,
          category: prod.category,
          price: prod.price,
          image: prod.images?.[0] || prod.image || "/images/products/default.jpg",
          averageRating: prod.averageRating ?? 5,
          numReviews: prod.numReviews ?? 0,
          stock: prod.stock ?? 10,
          isBestSeller: prod.isBestSeller,
          salesCount: prod.salesCount,
        });
      }
    });

    // Merge server products and local items, deduplicating by _id
    const combinedMap = new Map<string, WishlistProductItem>();
    serverProducts.forEach((p) => combinedMap.set(p._id, p));
    localItems.forEach((p) => {
      if (!combinedMap.has(p._id)) {
        combinedMap.set(p._id, p);
      }
    });

    const merged = Array.from(combinedMap.values());
    if (merged.length !== localItems.length) {
      saveLocalWishlist(merged);
    }
    return merged;
  } catch {
    return localItems;
  }
}
