const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

export const API_URL = RAW_API_URL
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

/**
 * Normalizes any product image URL to safely resolve across:
 * 1. External URLs (Cloudinary, Unsplash, HTTPS)
 * 2. Next.js local static assets in public/images/
 * 3. Uploaded media in public/uploads/ or backend/uploads/
 */
export function getProductImageUrl(image?: string): string {
  if (!image || typeof image !== "string" || !image.trim()) {
    return "/images/products/default.jpg";
  }

  const clean = image.trim();

  // Strip localhost / 127.0.0.1 domain prefixes if present
  if (clean.includes("localhost:") || clean.includes("127.0.0.1:")) {
    const relative = clean.replace(/^https?:\/\/[^/]+/, "");
    return getProductImageUrl(relative);
  }

  // Full external URL (Cloudinary, Unsplash, HTTPS CDN)
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  // Next.js local static images (/images/...)
  if (clean.startsWith("/images/")) {
    return clean;
  }

  // Map legacy /uploads/ and uploads/ to Next.js static /images/products/
  if (clean.startsWith("/uploads/")) {
    const filename = clean.replace(/^\/uploads\/(?:products\/)?/, "");
    return `/images/products/${filename}`;
  }

  if (clean.startsWith("uploads/")) {
    const filename = clean.replace(/^uploads\/(?:products\/)?/, "");
    return `/images/products/${filename}`;
  }

  // Root-relative path
  if (clean.startsWith("/")) {
    return clean;
  }

  // Plain filename fallback
  return `/images/products/${clean}`;
}
