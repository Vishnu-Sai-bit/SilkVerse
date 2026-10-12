"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Sparkles, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client errors in development/monitoring
    console.error("SilkVerse App Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-[#FFF8F0]">
      <div className="max-w-md w-full text-center bg-white border border-[#D4AF37]/40 rounded-3xl p-8 sm:p-10 shadow-xl">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5B0D16]/10 text-[#5B0D16] mb-6">
          <AlertCircle size={32} />
        </div>

        <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#D4AF37] mb-2">
          <Sparkles size={12} />
          <span>SilkVerse Heritage</span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2A26] mb-3">
          Moments on the Loom
        </h1>

        <p className="text-sm text-stone-600 leading-relaxed mb-8">
          We encountered an unexpected thread while preparing this page. Our master weavers have been notified.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5B0D16] hover:bg-[#43090F] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Try Again</span>
          </button>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 hover:border-[#D4AF37] hover:bg-[#FFF8F0] text-stone-700 px-5 py-3 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          >
            <Home size={14} />
            <span>Browse Sarees</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
