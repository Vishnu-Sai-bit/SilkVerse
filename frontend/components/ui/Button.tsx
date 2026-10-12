"use client";

import React, { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "text";
export type ButtonVisualState = "default" | "hover" | "pressed" | "disabled";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  visualState?: ButtonVisualState;
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  visualState = "default",
  children,
  icon,
  iconPosition = "right",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || visualState === "disabled";

  // Base styling: rounded, font-bold, uppercase tracking-wider
  let baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none";

  if (fullWidth) {
    baseStyles += " w-full";
  }

  // Padding based on variant
  if (variant === "text") {
    baseStyles += " py-2 px-1";
  } else {
    baseStyles += " py-3 px-6 shadow-2xs";
  }

  // Variant & State combinations
  let variantStyles = "";

  if (variant === "primary") {
    if (visualState === "hover") {
      variantStyles = "bg-[#43080F] text-white shadow-md";
    } else if (visualState === "pressed") {
      variantStyles = "bg-[#2A050A] text-white scale-[0.98]";
    } else if (visualState === "disabled") {
      variantStyles = "bg-[#CF8A86] text-white/80 cursor-not-allowed opacity-75";
    } else {
      variantStyles =
        "bg-[#5B0D16] text-white hover:bg-[#43080F] active:bg-[#2A050A] active:scale-[0.98] disabled:bg-[#CF8A86] disabled:cursor-not-allowed";
    }
  } else if (variant === "secondary") {
    if (visualState === "hover") {
      variantStyles = "bg-[#B89327] text-white shadow-md";
    } else if (visualState === "pressed") {
      variantStyles = "bg-[#9A781B] text-white scale-[0.98]";
    } else if (visualState === "disabled") {
      variantStyles = "bg-[#F5EDE1] text-amber-800/40 cursor-not-allowed";
    } else {
      variantStyles =
        "bg-[#D4AF37] text-white hover:bg-[#B89327] active:bg-[#9A781B] active:scale-[0.98] disabled:bg-[#F5EDE1] disabled:text-amber-800/40 disabled:cursor-not-allowed";
    }
  } else if (variant === "outline") {
    if (visualState === "hover") {
      variantStyles = "border border-[#5B0D16] bg-[#FFF7EE] text-[#5B0D16] shadow-xs";
    } else if (visualState === "pressed") {
      variantStyles = "border border-[#231F20] bg-gray-100 text-[#231F20] scale-[0.98]";
    } else if (visualState === "disabled") {
      variantStyles = "border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed";
    } else {
      variantStyles =
        "border border-[#231F20] bg-white text-[#231F20] hover:border-[#5B0D16] hover:bg-[#FFF7EE] hover:text-[#5B0D16] active:scale-[0.98] disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed";
    }
  } else if (variant === "text") {
    if (visualState === "hover") {
      variantStyles = "text-[#5B0D16] underline";
    } else if (visualState === "pressed") {
      variantStyles = "text-[#2A050A] underline scale-[0.98]";
    } else if (visualState === "disabled") {
      variantStyles = "text-gray-400 cursor-not-allowed";
    } else {
      variantStyles =
        "text-[#231F20] hover:text-[#5B0D16] hover:underline active:scale-[0.98] disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed";
    }
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
    </button>
  );
}
