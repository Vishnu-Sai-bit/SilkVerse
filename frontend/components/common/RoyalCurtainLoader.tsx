"use client";

import { useEffect, useState } from "react";

const GOLD_PARTICLES = [
  { top: "14%", left: "18%", size: 5, delay: "0s", duration: "2.2s" },
  { top: "24%", left: "34%", size: 4, delay: "0.3s", duration: "2.6s" },
  { top: "18%", left: "68%", size: 6, delay: "0.1s", duration: "2.0s" },
  { top: "28%", left: "82%", size: 4, delay: "0.5s", duration: "2.4s" },
  { top: "46%", left: "12%", size: 5, delay: "0.2s", duration: "2.3s" },
  { top: "52%", left: "27%", size: 3, delay: "0.7s", duration: "2.1s" },
  { top: "48%", left: "73%", size: 5, delay: "0.4s", duration: "2.5s" },
  { top: "56%", left: "88%", size: 4, delay: "0.6s", duration: "2.2s" },
  { top: "74%", left: "22%", size: 6, delay: "0.15s", duration: "2.4s" },
  { top: "80%", left: "38%", size: 4, delay: "0.45s", duration: "2.0s" },
  { top: "76%", left: "64%", size: 5, delay: "0.25s", duration: "2.3s" },
  { top: "82%", left: "79%", size: 4, delay: "0.55s", duration: "2.6s" },
];

export default function RoyalCurtainLoader() {
  const [phase, setPhase] = useState<"closed" | "opening" | "done">("closed");
  const [weaveProgress, setWeaveProgress] = useState(12);

  useEffect(() => {
    // Animate the golden zari thread progress bar
    const progressTimer = setTimeout(() => {
      setWeaveProgress(100);
    }, 80);

    // Part the royal curtains after the golden thread finishes weaving
    const openTimer = setTimeout(() => {
      setPhase("opening");
    }, 1150);

    // Completely unmount after the theatrical curtain sweep completes
    const doneTimer = setTimeout(() => {
      setPhase("done");
    }, 3050);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(openTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") return null;

  const isOpening = phase === "opening";

  return (
    <div
      onClick={() => setPhase("opening")}
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] flex overflow-hidden select-none ${
        isOpening ? "pointer-events-none" : "cursor-pointer"
      }`}
    >
      {/* ================= CENTER GOLDEN SUNBURST FLARE (As Curtains Part) ================= */}
      <div
        className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-1000 ease-out ${
          isOpening ? "opacity-0 delay-300" : "opacity-100"
        }`}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 243, 176, 0.42) 0%, rgba(212, 175, 55, 0.22) 25%, rgba(26, 4, 8, 0.35) 65%, transparent 100%)",
        }}
      />

      {/* Vertical Center Seam Golden Light Beam when Unlocking */}
      <div
        className={`absolute inset-y-0 left-1/2 -translate-x-1/2 z-20 w-1.5 sm:w-2.5 bg-gradient-to-b from-[#FFF3B0] via-[#D4AF37] to-[#FFF3B0] shadow-[0_0_45px_12px_rgba(255,243,176,0.85)] transition-all duration-700 ${
          isOpening ? "opacity-0 scale-x-[18] duration-1000" : "opacity-95 scale-x-100"
        }`}
      />

      {/* ================= TOP ROYAL SCALLOPED VELVET PELMET (TORAN) ================= */}
      <div
        className={`absolute top-0 inset-x-0 z-40 transition-transform duration-[1400ms] ease-[cubic-bezier(0.7,0,0.2,1)] ${
          isOpening ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {/* Top Heavy Gold Cornice Molding */}
        <div className="h-3 sm:h-4 w-full bg-gradient-to-r from-[#7A5416] via-[#FFF3B0] to-[#7A5416] border-b border-[#4A0911] shadow-[0_4px_20px_rgba(0,0,0,0.75)]">
          <div className="h-full w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(91,13,22,0.4)_8px,rgba(91,13,22,0.4)_12px)]" />
        </div>

        {/* Scalloped Royal Maroon Velvet Valance with Hanging 24K Gold Tassels */}
        <div className="relative flex w-full overflow-hidden drop-shadow-[0_14px_24px_rgba(0,0,0,0.8)]">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div
              key={idx}
              className="relative flex-1 min-w-[72px] sm:min-w-[110px] flex flex-col items-center"
            >
              {/* Scallop Arch */}
              <div
                className="w-full h-8 sm:h-11 rounded-b-full border-b-[3px] sm:border-b-4 border-x border-[#D4AF37]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 50% 0%, #8B1526 0%, #5B0D16 55%, #2D0409 100%)",
                  boxShadow: "inset 0 -4px 10px rgba(212, 175, 55, 0.35)",
                }}
              />
              {/* Hanging Gold Silk Jhumka Tassel */}
              <div className="animate-tassel-swing -mt-1 flex flex-col items-center">
                <span className="h-2 w-2 rounded-full bg-gradient-to-b from-[#FFF3B0] to-[#B58A32] shadow-sm" />
                <span className="h-3 sm:h-4 w-1.5 sm:w-2 bg-gradient-to-b from-[#D4AF37] via-[#FFF3B0] to-[#8A6421] rounded-b-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= LEFT ROYAL KANCHIPURAM SILK CURTAIN ================= */}
      <div
        className={`relative z-20 h-full w-1/2 origin-top-left transition-all duration-[1850ms] ease-[cubic-bezier(0.7,0,0.2,1)] will-change-transform ${
          isOpening
            ? "-translate-x-[104%] -rotate-[4deg] -skew-x-3 scale-x-90"
            : "translate-x-0 rotate-0 skew-x-0 scale-x-100"
        }`}
        style={{
          backgroundImage: `
            radial-gradient(circle at 90% 50%, rgba(212, 175, 55, 0.18), transparent 60%),
            repeating-linear-gradient(
              90deg,
              #240307 0%,
              #4A0911 3.5%,
              #7D1220 7%,
              #9B1B2C 9%,
              #6D0D1A 12%,
              #38050B 16%,
              #1F0205 19%,
              #5B0D16 22.5%
            )
          `,
          boxShadow: "22px 0 65px rgba(0, 0, 0, 0.85)",
        }}
      >
        {/* Sweeping Golden Silk Lustre Sheen */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-silk-sheen h-full w-1/3 bg-gradient-to-r from-transparent via-[#FFF3B0]/12 to-transparent" />
        </div>

        {/* Woven 24K Gold Zari Floral Butta Pattern across the Silk */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `
              radial-gradient(#D4AF37 1.1px, transparent 1.1px),
              radial-gradient(#FFF3B0 0.8px, transparent 0.8px)
            `,
            backgroundSize: "36px 36px",
            backgroundPosition: "0 0, 18px 18px",
          }}
        />

        {/* Grand Bottom Kanchipuram Gold Brocade Pallu Hem */}
        <div className="absolute bottom-0 inset-x-0 h-14 sm:h-20 bg-gradient-to-t from-[#3A2406] via-[#8A6421]/65 to-transparent border-t-2 border-[#D4AF37] flex flex-col justify-end">
          <div
            className="h-5 sm:h-7 w-full opacity-80"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, #D4AF37 0px, #FFF3B0 4px, #5B0D16 4px, #5B0D16 10px)",
            }}
          />
        </div>

        {/* Inner Right Edge: Authentic 24K Gold Kanchipuram Temple Gopuram (Rekku) Border */}
        <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-14 flex">
          {/* Temple Gopuram Sawtooth / Rekku Triangles pointing into the maroon silk */}
          <div
            className="h-full w-2.5 sm:w-4 opacity-90"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #D4AF37 50%, transparent 50%), linear-gradient(45deg, #D4AF37 50%, transparent 50%)",
              backgroundSize: "16px 16px",
              backgroundRepeat: "repeat-y",
            }}
          />
          {/* Solid Woven 24K Gold Zari Selvedge Band */}
          <div className="flex-1 h-full bg-gradient-to-r from-[#9E7324] via-[#F5E29C] to-[#D4AF37] border-l-2 border-[#FFF3B0]/80 shadow-[-10px_0_30px_rgba(212,175,55,0.4)] flex flex-col justify-between py-2 overflow-hidden">
            <div
              className="h-full w-full opacity-60"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(180deg, #5B0D16 0px, #5B0D16 4px, transparent 4px, transparent 12px)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ================= RIGHT ROYAL KANCHIPURAM SILK CURTAIN ================= */}
      <div
        className={`relative z-20 h-full w-1/2 origin-top-right transition-all duration-[1850ms] ease-[cubic-bezier(0.7,0,0.2,1)] will-change-transform ${
          isOpening
            ? "translate-x-[104%] rotate-[4deg] skew-x-3 scale-x-90"
            : "translate-x-0 rotate-0 skew-x-0 scale-x-100"
        }`}
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 50%, rgba(212, 175, 55, 0.18), transparent 60%),
            repeating-linear-gradient(
              -90deg,
              #240307 0%,
              #4A0911 3.5%,
              #7D1220 7%,
              #9B1B2C 9%,
              #6D0D1A 12%,
              #38050B 16%,
              #1F0205 19%,
              #5B0D16 22.5%
            )
          `,
          boxShadow: "-22px 0 65px rgba(0, 0, 0, 0.85)",
        }}
      >
        {/* Sweeping Golden Silk Lustre Sheen */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-silk-sheen h-full w-1/3 bg-gradient-to-r from-transparent via-[#FFF3B0]/12 to-transparent" />
        </div>

        {/* Woven 24K Gold Zari Floral Butta Pattern across the Silk */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `
              radial-gradient(#D4AF37 1.1px, transparent 1.1px),
              radial-gradient(#FFF3B0 0.8px, transparent 0.8px)
            `,
            backgroundSize: "36px 36px",
            backgroundPosition: "0 0, 18px 18px",
          }}
        />

        {/* Grand Bottom Kanchipuram Gold Brocade Pallu Hem */}
        <div className="absolute bottom-0 inset-x-0 h-14 sm:h-20 bg-gradient-to-t from-[#3A2406] via-[#8A6421]/65 to-transparent border-t-2 border-[#D4AF37] flex flex-col justify-end">
          <div
            className="h-5 sm:h-7 w-full opacity-80"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, #D4AF37 0px, #FFF3B0 4px, #5B0D16 4px, #5B0D16 10px)",
            }}
          />
        </div>

        {/* Inner Left Edge: Authentic 24K Gold Kanchipuram Temple Gopuram (Rekku) Border */}
        <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-14 flex">
          {/* Solid Woven 24K Gold Zari Selvedge Band */}
          <div className="flex-1 h-full bg-gradient-to-l from-[#9E7324] via-[#F5E29C] to-[#D4AF37] border-r-2 border-[#FFF3B0]/80 shadow-[10px_0_30px_rgba(212,175,55,0.4)] flex flex-col justify-between py-2 overflow-hidden">
            <div
              className="h-full w-full opacity-60"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(180deg, #5B0D16 0px, #5B0D16 4px, transparent 4px, transparent 12px)",
              }}
            />
          </div>
          {/* Temple Gopuram Sawtooth / Rekku Triangles pointing into the maroon silk */}
          <div
            className="h-full w-2.5 sm:w-4 opacity-90"
            style={{
              backgroundImage:
                "linear-gradient(-135deg, #D4AF37 50%, transparent 50%), linear-gradient(-45deg, #D4AF37 50%, transparent 50%)",
              backgroundSize: "16px 16px",
              backgroundRepeat: "repeat-y",
            }}
          />
        </div>
      </div>

      {/* ================= FLOATING 24K GOLD ZARI SPARKLE PARTICLES ================= */}
      <div
        className={`pointer-events-none absolute inset-0 z-30 transition-opacity duration-700 ${
          isOpening ? "opacity-0" : "opacity-100"
        }`}
      >
        {GOLD_PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#FFF3B0] shadow-[0_0_12px_3px_rgba(212,175,55,0.9)]"
            style={{
              top: p.top,
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animation: `goldSparkleFloat ${p.duration} ease-in-out ${p.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* ================= CENTER ROYAL MANDALA & PALACE CREST SEAL ================= */}
      <div
        className={`absolute inset-0 z-30 flex items-center justify-center px-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpening
            ? "scale-125 opacity-0"
            : "scale-100 opacity-100"
        }`}
      >
        {/* Outer Rotating Sacred Gold Lotus Mandala SVG */}
        <div className="pointer-events-none absolute flex items-center justify-center">
          <svg
            viewBox="0 0 260 260"
            className="h-[310px] w-[310px] sm:h-[440px] sm:w-[440px] text-[#D4AF37]/35 animate-mandala-slow"
          >
            <circle
              cx="130"
              cy="130"
              r="122"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="4 6"
            />
            <circle
              cx="130"
              cy="130"
              r="108"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {Array.from({ length: 16 }).map((_, i) => (
              <g key={i} transform={`rotate(${i * 22.5} 130 130)`}>
                <path
                  d="M130 10 L136 26 L130 22 L124 26 Z"
                  fill="currentColor"
                />
              </g>
            ))}
          </svg>

          <svg
            viewBox="0 0 220 220"
            className="absolute h-[260px] w-[260px] sm:h-[360px] sm:w-[360px] text-[#FFF3B0]/30 animate-mandala-reverse"
          >
            <circle
              cx="110"
              cy="110"
              r="96"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="8 4"
            />
          </svg>
        </div>

        {/* Center Royal Seal Plaque */}
        <div className="relative flex flex-col items-center rounded-3xl border-2 border-[#D4AF37] bg-gradient-to-b from-[#540A14] via-[#36050B] to-[#1F0205] px-7 py-6 sm:px-12 sm:py-9 text-center shadow-[0_25px_90px_rgba(0,0,0,0.95),0_0_60px_rgba(212,175,55,0.45)]">
          {/* Double Inner Gold Zari Filigree Border */}
          <div className="pointer-events-none absolute inset-1.5 rounded-[20px] border border-[#FFF3B0]/45" />
          <div className="pointer-events-none absolute inset-3 rounded-[16px] border border-[#D4AF37]/25" />

          {/* Corner Gold Temple Studs */}
          <span className="absolute top-3.5 left-3.5 h-2 w-2 rotate-45 bg-[#D4AF37]" />
          <span className="absolute top-3.5 right-3.5 h-2 w-2 rotate-45 bg-[#D4AF37]" />
          <span className="absolute bottom-3.5 left-3.5 h-2 w-2 rotate-45 bg-[#D4AF37]" />
          <span className="absolute bottom-3.5 right-3.5 h-2 w-2 rotate-45 bg-[#D4AF37]" />

          {/* Ornate 24K Gold Lotus & Crown Crest Emblem */}
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-[#D4AF37] bg-gradient-to-b from-[#7A1422] to-[#38050B] shadow-[0_0_25px_rgba(212,175,55,0.4)]">
            <svg
              viewBox="0 0 32 32"
              className="h-7 w-7 sm:h-8 sm:w-8 text-[#FFF3B0] drop-shadow-[0_2px_6px_rgba(212,175,55,0.6)]"
              fill="currentColor"
            >
              <path d="M16 4C14 9 10 12 10 16C10 19.3 12.7 22 16 22C19.3 22 22 19.3 22 16C22 12 18 9 16 4ZM8 13C5 15 4 18 5 21C6 23 8.5 24 11 23C9 21 8 17.5 8 13ZM24 13C24 17.5 23 21 21 23C23.5 24 26 23 27 21C28 18 27 15 24 13ZM7 26H25V28H7V26Z" />
            </svg>
          </div>

          <p className="mt-3 text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.38em] text-[#D4AF37]">
            Welcome to the Royal Atelier
          </p>

          {/* Metallic 24K Gold Foil Title */}
          <h1 className="mt-1 font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-[0.18em] bg-gradient-to-r from-[#FFF3B0] via-[#D4AF37] to-[#FFF3B0] bg-clip-text text-transparent drop-shadow-[0_4px_14px_rgba(0,0,0,0.75)]">
            SILKVERSE
          </h1>

          {/* Ornate Gold Diamond Filigree Divider */}
          <div className="my-2.5 flex items-center gap-2.5">
            <span className="h-[1px] w-10 sm:w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#FFF3B0]" />
            <span className="h-1.5 w-1.5 rotate-45 bg-[#FFF3B0] shadow-[0_0_8px_#FFF3B0]" />
            <span className="h-2.5 w-2.5 rotate-45 border border-[#FFF3B0] bg-[#D4AF37]" />
            <span className="h-1.5 w-1.5 rotate-45 bg-[#FFF3B0] shadow-[0_0_8px_#FFF3B0]" />
            <span className="h-[1px] w-10 sm:w-16 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#FFF3B0]" />
          </div>

          <p className="text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.26em] text-[#FFF8F0]/90">
            Kanchipuram &bull; Banarasi &bull; Dharmavaram
          </p>

          {/* Animated 24K Gold Zari Thread Weaving Bar */}
          <div className="mt-4 w-44 sm:w-56 overflow-hidden rounded-full bg-[#1A0205] p-[1.5px] border border-[#D4AF37]/40">
            <div
              className="h-1 rounded-full bg-gradient-to-r from-[#8A6421] via-[#FFF3B0] to-[#D4AF37] shadow-[0_0_12px_rgba(255,243,176,0.9)] transition-all duration-1000 ease-out"
              style={{ width: `${weaveProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
