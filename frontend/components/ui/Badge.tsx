"use client";

import React, { ReactNode } from "react";
import BrandLogo from "@/components/common/BrandLogo";

export type BadgeVariant =
  | "bestseller"
  | "newarrival"
  | "discount"
  | "limitedstock"
  | "puresilk"
  | "handwoven"
  | "silkmark";

export interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
  icon?: ReactNode;
}

export default function Badge({
  variant,
  label,
  className = "",
  icon,
}: BadgeProps) {
  let defaultLabel = "";
  let badgeStyles = "inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-extrabold uppercase tracking-wider select-none";

  switch (variant) {
    case "bestseller":
      defaultLabel = "BEST SELLER";
      badgeStyles += " bg-[#5B0D16] text-white";
      break;
    case "newarrival":
      defaultLabel = "NEW ARRIVAL";
      badgeStyles += " bg-[#D4AF37] text-white";
      break;
    case "discount":
      defaultLabel = "24% OFF";
      badgeStyles += " bg-[#231F20] text-white";
      break;
    case "limitedstock":
      defaultLabel = "LIMITED STOCK";
      badgeStyles += " bg-[#1E3D2F] text-white";
      break;
    case "puresilk":
      defaultLabel = "PURE SILK";
      badgeStyles += " bg-[#FFF7EE] border border-gray-300 text-[#231F20]";
      break;
    case "handwoven":
      defaultLabel = "HANDWOVEN";
      badgeStyles += " bg-[#FFF7EE] border border-gray-300 text-[#231F20]";
      break;
    case "silkmark":
      defaultLabel = "SILK MARK CERTIFIED";
      badgeStyles += " bg-[#FFF7EE] border border-gray-300 text-[#231F20]";
      break;
  }

  return (
    <span className={`${badgeStyles} ${className}`}>
      {variant === "silkmark" && (
        <span className="shrink-0 text-[#D4AF37]">
          <BrandLogo variant="icon" height={13} />
        </span>
      )}
      {icon && variant !== "silkmark" && <span className="shrink-0">{icon}</span>}
      <span>{label || defaultLabel}</span>
    </span>
  );
}
