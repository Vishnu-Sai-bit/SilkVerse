import Link from "next/link";
import { Sparkles, ArrowLeft, Compass, Crown } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center px-4 py-12 sm:px-6">
      <div className="relative w-full overflow-hidden rounded-3xl border-2 border-[#D4AF37]/50 bg-white p-6 sm:p-12 text-center shadow-lg">
        {/* Subtle Gold Filigree Frame */}
        <div className="pointer-events-none absolute inset-2.5 rounded-2xl border border-[#D4AF37]/30" />

        <div className="relative z-10 flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-[#FFF8F0] px-3.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#6D001A]">
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
            404 &bull; Page Not Found
          </span>

          <h1 className="mt-4 font-serif text-3xl sm:text-5xl font-bold text-[#6D001A]">
            This Thread Has Drifted From the Loom
          </h1>

          <p className="mt-3 max-w-lg text-xs sm:text-sm text-stone-600 leading-relaxed">
            The page or silk weave you are looking for may have been moved or is no longer available. Explore our master weaver collections below.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 rounded-xl bg-[#6D001A] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#520013]"
            >
              <Compass className="h-4 w-4 text-[#D4AF37]" />
              <span>Explore All Silks</span>
            </Link>

            <Link
              href="/collections?category=Bridal"
              className="inline-flex items-center gap-2 rounded-xl border border-[#D4AF37] bg-[#FFFBF5] px-5 py-3 text-xs sm:text-sm font-bold text-[#6D001A] transition hover:bg-[#D4AF37]/15"
            >
              <Crown className="h-4 w-4 text-[#C9A227]" />
              <span>Bridal Muhurtham Silks</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
