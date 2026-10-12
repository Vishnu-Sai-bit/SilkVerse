"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyResetOTP, forgotPassword } from "@/services/api";
import BrandLogo from "@/components/common/BrandLogo";
import {
  Mail,
  Smartphone,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Lock,
  ShieldCheck,
} from "lucide-react";

type ResetMethod = "email" | "mobile";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const method = (searchParams.get("method") as ResetMethod) || "email";
  const identifier = searchParams.get("identifier") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  function handleOTPChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setError("");
  }

  async function handleResend() {
    if (resendCooldown > 0 || resending) return;
    if (!identifier) {
      setError("Missing email or mobile. Please go back to forgot password.");
      return;
    }

    try {
      setResending(true);
      setError("");
      setSuccessMsg("");

      await forgotPassword({
        method,
        identifier,
      });

      setSuccessMsg("A new 6-digit OTP has been sent. Please check your inbox/messages.");
      setResendCooldown(60);
      setOtp("");
      inputRef.current?.focus();
    } catch (err: any) {
      setError(err?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!identifier) {
      setError("Invalid password reset request. Please start again from Forgot Password.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const data = await verifyResetOTP({
        method,
        identifier,
        otp,
      });

      if (!data?.resetToken) {
        throw new Error("Unable to verify OTP. Please try again.");
      }

      router.push(`/reset-password?token=${encodeURIComponent(data.resetToken)}`);
    } catch (err: any) {
      setError(err?.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#FAF7F2] py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden p-4 sm:p-8 space-y-6">
        
        {/* Brand Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <BrandLogo
              variant="horizontal"
              theme="light"
              height={44}
              href="/"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-1.5">
          <h1 className="font-serif text-2xl font-bold text-[#580F1A]">
            Verify OTP
          </h1>
          <p className="text-xs text-stone-500 leading-relaxed">
            Enter the 6-digit verification code sent to your registered {method === "mobile" ? "mobile number" : "email address"}:
          </p>
          {identifier && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-800 mt-1 max-w-full truncate">
              {method === "mobile" ? (
                <Smartphone size={13} className="text-[#580F1A] shrink-0" />
              ) : (
                <Mail size={13} className="text-[#580F1A] shrink-0" />
              )}
              <span className="truncate">{identifier}</span>
            </div>
          )}
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div
            className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2"
            role="status"
          >
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div
            className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2"
            role="alert"
          >
            <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* OTP Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700 block text-center">
              Enter 6-Digit OTP
            </label>

            {/* Segmented OTP Visual Display */}
            <div
              className="relative flex justify-center cursor-text"
              onClick={() => inputRef.current?.focus()}
            >
              <div className="flex gap-1.5 sm:gap-2.5 justify-center">
                {[0, 1, 2, 3, 4, 5].map((index) => {
                  const char = otp[index] || "";
                  const isCurrent = otp.length === index || (index === 5 && otp.length === 6);
                  return (
                    <div
                      key={index}
                      className={`w-9 h-11 sm:w-12 sm:h-14 rounded-2xl border flex items-center justify-center text-xl sm:text-2xl font-bold font-mono transition-all ${
                        char
                          ? "border-[#580F1A] bg-[#FFF8F3] text-[#580F1A] shadow-2xs"
                          : isCurrent
                          ? "border-[#580F1A] bg-white ring-2 ring-[#580F1A]/20"
                          : "border-stone-300 bg-stone-50/60 text-stone-800"
                      }`}
                    >
                      {char}
                    </div>
                  );
                })}
              </div>

              {/* Underlying Transparent Input */}
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={handleOTPChange}
                className="absolute inset-0 opacity-0 cursor-text w-full h-full"
                aria-label="6-digit verification code"
                required
              />
            </div>

            <p className="text-[11px] text-stone-400 text-center pt-1">
              OTP expires in 10 minutes.
            </p>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full h-11 rounded-xl bg-[#580F1A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#7A1628] active:scale-[0.99] transition-all shadow-md disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Verifying OTP...</span>
            ) : (
              <>
                <span>VERIFY &amp; PROCEED</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Resend OTP Section */}
        <div className="p-3.5 rounded-2xl bg-[#FFF8F3] border border-[#C8985A]/30 flex items-center justify-between text-xs">
          <span className="text-stone-600">Didn&apos;t receive the code?</span>
          {resendCooldown > 0 ? (
            <span className="text-stone-400 font-medium text-[11px]">
              Resend in {resendCooldown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-1 font-bold text-[#580F1A] hover:underline disabled:opacity-50"
            >
              <RotateCcw size={12} className={resending ? "animate-spin" : ""} />
              <span>{resending ? "Sending..." : "Resend OTP"}</span>
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex items-center justify-between text-xs pt-1">
          <Link
            href="/forgot-password"
            className="font-medium text-stone-600 hover:text-[#580F1A] transition-colors"
          >
            ← Change {method === "mobile" ? "Number" : "Email"}
          </Link>
          <Link
            href="/login"
            className="font-bold text-[#580F1A] hover:underline"
          >
            Back to Login
          </Link>
        </div>

        {/* Footer Blueprint Link */}
        <div className="pt-4 border-t border-stone-200/80 flex items-center justify-between text-[10px] text-stone-500">
          <span className="flex items-center gap-1">
            <Lock size={11} className="text-stone-400" />
            Safe &amp; Encrypted
          </span>
          <span className="flex items-center gap-1 text-stone-400">
            <ShieldCheck size={11} />
            SilkVerse Security
          </span>
        </div>

      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-140px)] bg-[#FAF7F2] py-12 px-4 flex items-center justify-center">
          <div className="text-xs text-stone-500 font-medium">Loading verification...</div>
        </div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  );
}