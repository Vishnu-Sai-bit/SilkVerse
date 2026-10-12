"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface BrandLogoProps {
  variant?: "horizontal" | "icon" | "stacked";
  theme?: "light" | "dark";
  height?: number;
  showTagline?: boolean;
  href?: string;
  className?: string;
}

export default function BrandLogo({
  variant = "horizontal",
  theme = "light",
  height = 42,
  showTagline = false,
  href,
  className = "",
}: BrandLogoProps) {
  const [imgError, setImgError] = useState(false);

  // Logo source resolution using previous original logo files
  let logoSrc = "/logo/logo-horizontal.png";
  let altText = "SilkVerse - Authentic Handloom Silks";
  let width = Math.round(height * 2.55);

  if (variant === "icon") {
    logoSrc = "/logo/logo-icon.png";
    width = height;
  } else if (variant === "stacked") {
    logoSrc = "/logo/logo-primary.png";
    width = Math.round(height * 1.1);
  }

  const logoContent = (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {!imgError ? (
        <div
          className="relative flex items-center shrink-0"
          style={{ height: `${height}px`, width: `${width}px`, maxHeight: `${height}px` }}
        >
          <Image
            src={logoSrc}
            alt={altText}
            width={width}
            height={height}
            priority
            unoptimized
            onError={() => setImgError(true)}
            style={{
              height: `${height}px`,
              width: "auto",
              maxHeight: `${height}px`,
              maxWidth: "100%",
              objectFit: "contain",
            }}
            className={`transition duration-200 ${
              theme === "dark"
                ? "brightness-110 drop-shadow-[0_2px_8px_rgba(201,162,39,0.3)]"
                : ""
            }`}
          />
        </div>
      ) : (
        // High-fidelity fallback if image cannot load
        <div className="flex flex-col">
          <span
            className={`font-serif font-extrabold tracking-tight ${
              theme === "dark" ? "text-white" : "text-[#7A1F2B]"
            }`}
            style={{ fontSize: `${Math.max(18, height * 0.55)}px` }}
          >
            Silk<span className="text-[#C9A227]">Verse</span>
          </span>
          {showTagline && (
            <span
              className={`text-[9px] font-semibold tracking-[0.2em] uppercase ${
                theme === "dark" ? "text-amber-200" : "text-[#7A1F2B]"
              }`}
            >
              Pure Handloom Silks
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition-opacity hover:opacity-95">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
