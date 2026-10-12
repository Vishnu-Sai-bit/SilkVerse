"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/services/api";
import BrandLogo from "@/components/common/BrandLogo";
import {
  Mail,
  Smartphone,
  ArrowRight,
  Lock,
} from "lucide-react";

type ResetMethod = "email" | "mobile";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [method, setMethod] = useState<ResetMethod>("email");
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleMethodChange(newMethod: ResetMethod) {
    setMethod(newMethod);
    setIdentifier("");
    setError("");
  }

  function validateInput() {
    const value = identifier.trim();

    if (!value) {
      setError(
        method === "email"
          ? "Please enter your email address."
          : "Please enter your mobile number."
      );
      return false;
    }

    if (method === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError("Please enter a valid email address.");
        return false;
      }
    }

    if (method === "mobile") {
      const mobile = value.replace(/\D/g, "");
      if (mobile.length !== 10) {
        setError("Please enter a valid 10-digit mobile number.");
        return false;
      }
      setIdentifier(mobile);
    }

    return true;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!validateInput()) {
      return;
    }

    try {
      setLoading(true);

      const value =
        method === "mobile"
          ? identifier.replace(/\D/g, "")
          : identifier.trim();

      await forgotPassword({
        method,
        identifier: value,
      });

      router.push(
        `/verify-otp?method=${method}&identifier=${encodeURIComponent(value)}`
      );
    } catch (err: any) {
      setError(
        err?.message || "Unable to send verification OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#FAF7F2] py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
        
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

        {/* FORGOT PASSWORD FORM */}
        <div className="space-y-5">
          <div className="text-center space-y-1">
            <h1 className="font-serif text-2xl font-bold text-[#580F1A]">
              Forgot Password
            </h1>
            <p className="text-xs text-stone-500 leading-relaxed">
              Enter your {method === "email" ? "registered email" : "registered mobile number"} and we&apos;ll send you a 6-digit OTP to reset your password.
            </p>
          </div>

          {/* Method Tabs: Email vs Mobile */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#FAF7F2] border border-stone-200">
            <button
              type="button"
              onClick={() => handleMethodChange("email")}
              className={`py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                method === "email"
                  ? "bg-[#580F1A] text-white shadow-xs font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Mail size={13} />
              Email OTP
            </button>
            <button
              type="button"
              onClick={() => handleMethodChange("mobile")}
              className={`py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                method === "mobile"
                  ? "bg-[#580F1A] text-white shadow-xs font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Smartphone size={13} />
              Mobile OTP
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2"
              role="alert"
            >
              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">
                {method === "email" ? "Email Address" : "10-Digit Mobile Number"}
              </label>
              <input
                type={method === "email" ? "email" : "tel"}
                placeholder={
                  method === "email"
                    ? "Enter your email address"
                    : "e.g. 9876543210"
                }
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full h-10 rounded-xl bg-white border border-stone-300 px-3.5 text-base sm:text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#580F1A] focus:ring-1 focus:ring-[#580F1A] transition-all shadow-2xs"
                autoComplete={method === "email" ? "email" : "tel"}
                inputMode={method === "mobile" ? "numeric" : "email"}
                maxLength={method === "mobile" ? 10 : undefined}
                required
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#580F1A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#7A1628] active:scale-[0.99] transition-all shadow-md disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Sending OTP...</span>
              ) : (
                <>
                  <span>SEND VERIFICATION OTP</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Envelope Illustration Card */}
          <div className="p-4 rounded-2xl bg-[#FFF8F3] border border-[#C8985A]/30 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[#C8985A] mb-1.5 shadow-2xs">
              <Mail size={18} />
            </div>
            <span className="text-[11px] text-stone-700 font-medium">
              Verification OTP is valid for 10 minutes
            </span>
            <span className="text-[9px] text-stone-400 mt-0.5">
              We protect your account with end-to-end encryption.
            </span>
          </div>

          {/* Back to Login Link */}
          <div className="text-center pt-1">
            <span className="text-xs text-stone-500">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-bold text-[#580F1A] hover:underline"
              >
                Login
              </Link>
            </span>
          </div>
        </div>

        {/* Security Footer */}
        <div className="pt-4 border-t border-stone-200/80 flex items-center justify-center text-[10px] text-stone-500">
          <span className="flex items-center gap-1">
            <Lock size={11} className="text-stone-400" />
            Safe &amp; Encrypted Account Recovery
          </span>
        </div>

      </div>
    </div>
  );
}