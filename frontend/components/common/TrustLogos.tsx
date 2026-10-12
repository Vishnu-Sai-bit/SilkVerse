"use client";

import React from "react";

// =================================================================
// Pure Silk Mark & Handloom Mark SVG Emblems (Standalone without outer boxes)
// =================================================================
export function SilkMarkEmblem({
  size = 48,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <circle cx="50" cy="50" r="46" fill="#7A1F2B" stroke="#C9A227" strokeWidth="4" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="#C9A227" strokeWidth="1" strokeDasharray="2 2" />
      {/* Butterfly / Silk Cocoon Motif */}
      <path
        d="M50 24 C44 32, 28 35, 26 48 C24 60, 36 68, 48 56 C49 55, 51 55, 52 56 C64 68, 76 60, 74 48 C72 35, 56 32, 50 24 Z"
        fill="#C9A227"
      />
      <path
        d="M50 54 C46 62, 34 68, 32 76 C31 81, 38 84, 46 76 C48 74, 52 74, 54 76 C62 84, 69 81, 68 76 C66 68, 54 62, 50 54 Z"
        fill="#E7D7C1"
      />
      {/* Central cocoon thread */}
      <ellipse cx="50" cy="52" rx="3.5" ry="14" fill="#FFFFFF" />
    </svg>
  );
}

export function HandloomMarkEmblem({
  size = 48,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <circle cx="50" cy="50" r="46" fill="#044D29" stroke="#E7D7C1" strokeWidth="3" />
      {/* Loom Shuttle / Weaver Shuttle Motif */}
      <path
        d="M20 50 Q50 22 80 50 Q50 78 20 50 Z"
        fill="#FFFFFF"
      />
      <circle cx="50" cy="50" r="8" fill="#C9A227" />
      <line x1="30" y1="50" x2="70" y2="50" stroke="#044D29" strokeWidth="3" />
    </svg>
  );
}

// =================================================================
// 1. Silk Mark India Official Certification Logo Badge
// =================================================================
export function SilkMarkLogo({
  size = "md",
  showText = true,
}: {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}) {
  const dimensions =
    size === "sm" ? { h: 32, w: 32 } : size === "lg" ? { h: 56, w: 56 } : { h: 42, w: 42 };

  return (
    <div className="inline-flex items-center gap-2.5 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/40 p-2 shadow-xs">
      <svg
        width={dimensions.w}
        height={dimensions.h}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <circle cx="50" cy="50" r="46" fill="#7A1F2B" stroke="#C9A227" strokeWidth="4" />
        <circle cx="50" cy="50" r="41" fill="none" stroke="#C9A227" strokeWidth="1" strokeDasharray="2 2" />
        {/* Butterfly / Silk Cocoon Motif */}
        <path
          d="M50 24 C44 32, 28 35, 26 48 C24 60, 36 68, 48 56 C49 55, 51 55, 52 56 C64 68, 76 60, 74 48 C72 35, 56 32, 50 24 Z"
          fill="#C9A227"
        />
        <path
          d="M50 54 C46 62, 34 68, 32 76 C31 81, 38 84, 46 76 C48 74, 52 74, 54 76 C62 84, 69 81, 68 76 C66 68, 54 62, 50 54 Z"
          fill="#E7D7C1"
        />
        {/* Central cocoon thread */}
        <ellipse cx="50" cy="52" rx="3.5" ry="14" fill="#FFFFFF" />
      </svg>
      {showText && (
        <div className="leading-tight text-left">
          <span className="block text-[11px] font-black uppercase tracking-wider text-[#7A1F2B]">
            Silk Mark
          </span>
          <span className="block text-[9px] font-medium text-amber-800">
            100% Pure Natural Silk
          </span>
        </div>
      )}
    </div>
  );
}

// =================================================================
// 2. Handloom Mark Authenticity Badge
// =================================================================
export function HandloomMarkLogo({
  size = "md",
}: {
  size?: "sm" | "md";
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-2 text-left">
      <svg
        width={size === "sm" ? "28" : "36"}
        height={size === "sm" ? "28" : "36"}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <circle cx="50" cy="50" r="46" fill="#044D29" stroke="#E7D7C1" strokeWidth="3" />
        {/* Loom Shuttle / Weaver Shuttle Motif */}
        <path
          d="M20 50 Q50 22 80 50 Q50 78 20 50 Z"
          fill="#FFFFFF"
        />
        <circle cx="50" cy="50" r="8" fill="#C9A227" />
        <line x1="30" y1="50" x2="70" y2="50" stroke="#044D29" strokeWidth="3" />
      </svg>
      <div className="leading-tight">
        <span className="block text-[11px] font-black uppercase tracking-wider text-emerald-900">
          Handloom Mark
        </span>
        <span className="block text-[9px] font-medium text-emerald-700">
          Certified Artisan Woven
        </span>
      </div>
    </div>
  );
}

// =================================================================
// 3. Official Indian Payment Provider SVG Logos (Razor Sharp)
// =================================================================

// 3.1 UPI (Unified Payments Interface - NPCI)
export function UpiLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 85 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="85" height="30" rx="4" fill="#FFFFFF" />
      <g transform="translate(8, 4)">
        {/* NPCI Dual Arrow Chevrons */}
        <path d="M14 3 L22 11 L14 19 Z" fill="#097939" />
        <path d="M6 3 L14 11 L6 19 Z" fill="#ED7524" />
        <text
          x="27"
          y="16"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontStyle="italic"
          fontWeight="900"
          fontSize="14"
          fill="#1A237E"
          letterSpacing="0.8"
        >
          UPI
        </text>
      </g>
    </svg>
  );
}

// 3.2 Google Pay (GPay)
export function GooglePayLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 92 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="92" height="30" rx="4" fill="#FFFFFF" />
      <g transform="translate(10, 5)">
        {/* Official Google 4-Color 'G' */}
        <g transform="translate(0, 0)">
          <path
            d="M19 10.2c0-.7-.06-1.37-.18-2.02H10v3.82h5.05c-.22 1.18-.88 2.18-1.89 2.85v2.37h3.06c1.79-1.65 2.82-4.08 2.82-7.02z"
            fill="#4285F4"
          />
          <path
            d="M10 19.4c2.54 0 4.67-.84 6.23-2.28l-3.06-2.37c-.84.57-1.92.9-3.17.9-2.44 0-4.51-1.65-5.25-3.87H1.58v2.45C3.13 17.3 6.32 19.4 10 19.4z"
            fill="#34A853"
          />
          <path
            d="M4.75 11.78c-.19-.57-.3-1.18-.3-1.78s.11-1.21.3-1.78V5.77H1.58C.93 7.05.57 8.49.57 10s.36 2.95 1.01 4.23l3.17-2.45z"
            fill="#FBBC05"
          />
          <path
            d="M10 4.43c1.38 0 2.62.48 3.6 1.4l2.7-2.7C14.66 1.6 12.53.6 10 .6 6.32.6 3.13 2.7 1.58 5.77l3.17 2.45c.74-2.22 2.81-3.87 5.25-3.87z"
            fill="#EA4335"
          />
        </g>
        {/* "Pay" wordmark */}
        <text
          x="23"
          y="15"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="700"
          fontSize="13"
          fill="#3C4043"
          letterSpacing="-0.2"
        >
          Pay
        </text>
      </g>
    </svg>
  );
}

// 3.3 PhonePe
export function PhonePeLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 98 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="98" height="30" rx="4" fill="#FFFFFF" />
      <g transform="translate(6, 4)">
        {/* PhonePe Purple Circle Emblem */}
        <circle cx="11" cy="11" r="10" fill="#5F259F" />
        {/* Stylized 'Pe' Motif */}
        <path
          d="M8.5 7h4.8c1.5 0 2.7.9 2.7 2.3 0 1.2-.8 2.1-2 2.3 1.2.3 2 1.2 2 2.4 0 1.6-1.3 2.6-3 2.6H8.5V7zm2 3.6h2.4c.5 0 .9-.3.9-.8s-.4-.8-.9-.8h-2.4v1.6zm0 3.8h2.6c.6 0 1-.3 1-.9s-.4-.9-1-.9h-2.6v1.8z"
          fill="#FFFFFF"
        />
        <text
          x="25"
          y="16"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="12.5"
          fill="#5F259F"
          letterSpacing="-0.3"
        >
          PhonePe
        </text>
      </g>
    </svg>
  );
}

// 3.4 Paytm
export function PaytmLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 85 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="85" height="30" rx="4" fill="#FFFFFF" />
      <g transform="translate(8, 5)">
        <text
          x="4"
          y="16"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="15"
          fill="#002970"
          letterSpacing="-0.4"
        >
          pay<tspan fill="#00BAF2">tm</tspan>
        </text>
      </g>
    </svg>
  );
}

// 3.5 RuPay
export function RupayLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 95 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="95" height="30" rx="4" fill="#FFFFFF" />
      <g transform="translate(8, 4)">
        <text
          x="4"
          y="17"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="14.5"
          fill="#0D47A1"
          letterSpacing="-0.2"
        >
          Ru<tspan fill="#00A651">Pay</tspan>
        </text>
        {/* Dual Chevrons */}
        <path
          d="M62 6 L68 11 L62 16"
          stroke="#ED7524"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M68 6 L74 11 L68 16"
          stroke="#00A651"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

// 3.6 Visa
export function VisaLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 85 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="85" height="30" rx="4" fill="#FFFFFF" />
      <g transform="translate(10, 3)">
        <text
          x="6"
          y="19"
          fontFamily="Arial, 'Helvetica Neue', sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="17"
          fill="#1A1F71"
          letterSpacing="-0.5"
        >
          VISA
        </text>
        {/* Visa gold wing accent on V */}
        <path d="M6 8 L13 8 L10 12 Z" fill="#F7B600" />
      </g>
    </svg>
  );
}

// 3.7 Mastercard
export function MastercardLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 85 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="85" height="30" rx="4" fill="#FFFFFF" />
      <g transform="translate(20, 5)">
        <circle cx="14" cy="10" r="10" fill="#EB001B" />
        <circle cx="30" cy="10" r="10" fill="#F79E1B" fillOpacity="0.9" />
        <path
          d="M22 3.6 C24.5 5.2 26 8 26 10 C26 12 24.5 14.8 22 16.4 C19.5 14.8 18 12 18 10 C18 8 19.5 5.2 22 3.6 Z"
          fill="#FF5F00"
        />
      </g>
    </svg>
  );
}

// 3.8 Razorpay Secure
export function RazorpayLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 115 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="115" height="30" rx="4" fill="#0C2340" />
      <g transform="translate(8, 3)">
        {/* Electric Blue Razorpay Bolt */}
        <path d="M12 4 L7 14 L12 14 L8 21 L17 11 L12 11 Z" fill="#3395FF" />
        <text
          x="21"
          y="15"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="11"
          fill="#FFFFFF"
        >
          Razorpay
        </text>
        <text
          x="21"
          y="22"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="6.5"
          fill="#3395FF"
          letterSpacing="0.8"
        >
          SECURE PAY
        </text>
      </g>
    </svg>
  );
}

// 3.9 Net Banking (50+ Banks)
export function NetBankingLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 105 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="105" height="30" rx="4" fill="#FFFFFF" />
      <g transform="translate(8, 4)">
        {/* Classical Bank Pillars Icon */}
        <path
          d="M8 7 L15 3 L22 7 Z M9 8 H21 V9.5 H9 Z M10 10.5 H12 V16.5 H10 Z M14 10.5 H16 V16.5 H14 Z M18 10.5 H20 V16.5 H18 Z M8 17.5 H22 V19.5 H8 Z"
          fill="#1E3A8A"
        />
        <text
          x="26"
          y="12"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="9"
          fill="#1E3A8A"
          letterSpacing="0.2"
        >
          NET BANKING
        </text>
        <text
          x="26"
          y="19"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="700"
          fontSize="6.5"
          fill="#059669"
          letterSpacing="0.4"
        >
          50+ BANKS (SBI/HDFC)
        </text>
      </g>
    </svg>
  );
}

// 3.10 Cash on Delivery (COD)
export function CodBadge({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="100" height="30" rx="4" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="1" />
      <g transform="translate(6, 4)">
        {/* Rupee Circle Badge */}
        <circle cx="10" cy="11" r="8" fill="#16A34A" />
        <text
          x="10"
          y="15"
          textAnchor="middle"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="10"
          fill="#FFFFFF"
        >
          ₹
        </text>
        <text
          x="23"
          y="11"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="8.5"
          fill="#166534"
          letterSpacing="0.3"
        >
          CASH ON
        </text>
        <text
          x="23"
          y="18.5"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="7.5"
          fill="#15803D"
          letterSpacing="0.4"
        >
          DELIVERY
        </text>
      </g>
    </svg>
  );
}

// 3.11 PCI-DSS Level 1 Security Badge
export function PciDssBadge({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 105 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="105" height="30" rx="4" fill="#0F172A" />
      <g transform="translate(6, 4)">
        {/* Shield with Check */}
        <path
          d="M10 2 L4 5 V11 C4 15 10 19 10 19 C10 19 16 15 16 11 V5 L10 2 Z"
          fill="#10B981"
        />
        <path
          d="M7.5 10.5 L9.5 12.5 L13 8.5"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="20"
          y="11"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="8.5"
          fill="#FFFFFF"
          letterSpacing="0.5"
        >
          PCI-DSS
        </text>
        <text
          x="20"
          y="18"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="700"
          fontSize="6.5"
          fill="#34D399"
          letterSpacing="0.3"
        >
          LEVEL 1 COMPLIANT
        </text>
      </g>
    </svg>
  );
}

// 3.12 256-Bit SSL Encryption Badge
export function SslSecurityBadge({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 105 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="105" height="30" rx="4" fill="#1E293B" />
      <g transform="translate(6, 4)">
        {/* Padlock Icon */}
        <path
          d="M8 8 V6 A4 4 0 0 1 16 6 V8 M6 8 H18 V18 H6 Z"
          stroke="#F59E0B"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="12" cy="12" r="1.5" fill="#F59E0B" />
        <text
          x="22"
          y="11"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="8"
          fill="#FFFFFF"
          letterSpacing="0.4"
        >
          256-BIT SSL
        </text>
        <text
          x="22"
          y="18"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="700"
          fontSize="6.5"
          fill="#FBBF24"
          letterSpacing="0.2"
        >
          BANK GRADE SECURITY
        </text>
      </g>
    </svg>
  );
}

// =================================================================
// 4. Compact Payment Badges Grid (For Footer Column 1 & Mini Cart)
// =================================================================
export function PaymentGatewayBadgesGrid({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {/* UPI */}
      <div className="group relative flex h-7 items-center rounded-md border border-white/20 bg-white p-1 shadow-2xs hover:border-[#D4AF37] hover:scale-105 transition-all">
        <UpiLogo className="h-full w-auto" />
      </div>
      {/* Google Pay */}
      <div className="group relative flex h-7 items-center rounded-md border border-white/20 bg-white p-1 shadow-2xs hover:border-[#D4AF37] hover:scale-105 transition-all">
        <GooglePayLogo className="h-full w-auto" />
      </div>
      {/* PhonePe */}
      <div className="group relative flex h-7 items-center rounded-md border border-white/20 bg-white p-1 shadow-2xs hover:border-[#D4AF37] hover:scale-105 transition-all">
        <PhonePeLogo className="h-full w-auto" />
      </div>
      {/* Paytm */}
      <div className="group relative flex h-7 items-center rounded-md border border-white/20 bg-white p-1 shadow-2xs hover:border-[#D4AF37] hover:scale-105 transition-all">
        <PaytmLogo className="h-full w-auto" />
      </div>
      {/* RuPay */}
      <div className="group relative flex h-7 items-center rounded-md border border-white/20 bg-white p-1 shadow-2xs hover:border-[#D4AF37] hover:scale-105 transition-all">
        <RupayLogo className="h-full w-auto" />
      </div>
      {/* Visa */}
      <div className="group relative flex h-7 items-center rounded-md border border-white/20 bg-white p-1 shadow-2xs hover:border-[#D4AF37] hover:scale-105 transition-all">
        <VisaLogo className="h-full w-auto" />
      </div>
      {/* Mastercard */}
      <div className="group relative flex h-7 items-center rounded-md border border-white/20 bg-white p-1 shadow-2xs hover:border-[#D4AF37] hover:scale-105 transition-all">
        <MastercardLogo className="h-full w-auto" />
      </div>
      {/* NetBanking */}
      <div className="group relative flex h-7 items-center rounded-md border border-white/20 bg-white p-1 shadow-2xs hover:border-[#D4AF37] hover:scale-105 transition-all">
        <NetBankingLogo className="h-full w-auto" />
      </div>
      {/* Cash on Delivery */}
      <div className="group relative flex h-7 items-center rounded-md shadow-2xs hover:scale-105 transition-all">
        <CodBadge className="h-full w-auto" />
      </div>
    </div>
  );
}

// =================================================================
// 5. Full Luxury "Verified Payment Gateways & Secure Checkout Strip"
// (Placed prominently in Footer / Cart Checkout for maximum trust)
// =================================================================
export function VerifiedPaymentGatewaysStrip({
  theme = "dark",
  className = "",
}: {
  theme?: "dark" | "light";
  className?: string;
}) {
  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all ${
        isDark
          ? "border-[#D4AF37]/30 bg-gradient-to-b from-[#380A0A]/90 via-[#2A060C]/95 to-[#1A0307] text-[#F9F5EB] shadow-xl"
          : "border-amber-200/80 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/20 text-[#2D060D] shadow-sm"
      } ${className}`}
    >
      {/* Header with Title and Trust Assurances */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-xs">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
              Verified Payment Gateways &amp; 100% Secure Checkout
            </h4>
            <p className="text-[10px] sm:text-[11px] text-white/70">
              Zero transaction surcharge • Instant refund guarantee • RBI authorized Indian gateways
            </p>
          </div>
        </div>

        {/* Security Seals */}
        <div className="flex items-center gap-2 pt-1 sm:pt-0">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
            <span>PCI-DSS Level 1</span>
          </div>
        </div>
      </div>

      {/* Row of Official Payment Brand Badges */}
      <div className="pt-3.5 flex flex-wrap items-center justify-start sm:justify-between gap-2 sm:gap-2.5">
        <div className="flex h-8 items-center rounded-lg border border-white/20 bg-white px-1 shadow-xs hover:border-[#D4AF37] hover:scale-105 transition">
          <UpiLogo className="h-6 w-auto" />
        </div>
        <div className="flex h-8 items-center rounded-lg border border-white/20 bg-white px-1 shadow-xs hover:border-[#D4AF37] hover:scale-105 transition">
          <GooglePayLogo className="h-6 w-auto" />
        </div>
        <div className="flex h-8 items-center rounded-lg border border-white/20 bg-white px-1 shadow-xs hover:border-[#D4AF37] hover:scale-105 transition">
          <PhonePeLogo className="h-6 w-auto" />
        </div>
        <div className="flex h-8 items-center rounded-lg border border-white/20 bg-white px-1 shadow-xs hover:border-[#D4AF37] hover:scale-105 transition">
          <PaytmLogo className="h-6 w-auto" />
        </div>
        <div className="flex h-8 items-center rounded-lg border border-white/20 bg-white px-1 shadow-xs hover:border-[#D4AF37] hover:scale-105 transition">
          <RupayLogo className="h-6 w-auto" />
        </div>
        <div className="flex h-8 items-center rounded-lg border border-white/20 bg-white px-1 shadow-xs hover:border-[#D4AF37] hover:scale-105 transition">
          <VisaLogo className="h-6 w-auto" />
        </div>
        <div className="flex h-8 items-center rounded-lg border border-white/20 bg-white px-1 shadow-xs hover:border-[#D4AF37] hover:scale-105 transition">
          <MastercardLogo className="h-6 w-auto" />
        </div>
        <div className="flex h-8 items-center rounded-lg border border-white/20 bg-white px-1 shadow-xs hover:border-[#D4AF37] hover:scale-105 transition">
          <RazorpayLogo className="h-6 w-auto" />
        </div>
        <div className="flex h-8 items-center rounded-lg border border-white/20 bg-white px-1 shadow-xs hover:border-[#D4AF37] hover:scale-105 transition">
          <NetBankingLogo className="h-6 w-auto" />
        </div>
        <div className="flex h-8 items-center rounded-lg shadow-xs hover:scale-105 transition">
          <CodBadge className="h-6 w-auto" />
        </div>
      </div>
    </div>
  );
}

// =================================================================
// 6. Generic PaymentLogos (Backward Compatibility for Cart & Modals)
// =================================================================
export function PaymentLogos({
  theme = "light",
  className = "",
}: {
  theme?: "light" | "dark";
  className?: string;
}) {
  return <PaymentGatewayBadgesGrid className={className} />;
}
