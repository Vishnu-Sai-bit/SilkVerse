"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/services/api";
import BrandLogo from "@/components/common/BrandLogo";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Lock,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const resetToken = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!resetToken) {
      setError("Invalid or expired password reset session. Please request a new OTP.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        resetToken,
        newPassword,
        confirmPassword,
      });

      router.push("/login?reset=success");
    } catch (err: any) {
      setError(
        err?.message || "Unable to reset your password. Please try again."
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

        {/* Heading */}
        <div className="text-center space-y-1">
          <h1 className="font-serif text-2xl font-bold text-[#580F1A]">
            Reset Password
          </h1>
          <p className="text-xs text-stone-500 leading-relaxed">
            Create a strong new password for your SilkVerse account.
          </p>
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
          
          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                autoComplete="new-password"
                minLength={6}
                className="w-full h-10 rounded-xl bg-white border border-stone-300 pl-3.5 pr-10 text-base sm:text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#580F1A] focus:ring-1 focus:ring-[#580F1A] transition-all shadow-2xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-type your new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                autoComplete="new-password"
                minLength={6}
                className="w-full h-10 rounded-xl bg-white border border-stone-300 pl-3.5 pr-10 text-base sm:text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#580F1A] focus:ring-1 focus:ring-[#580F1A] transition-all shadow-2xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-[#580F1A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#7A1628] active:scale-[0.99] transition-all shadow-md disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2 pt-1"
          >
            {loading ? (
              <span>Resetting Password...</span>
            ) : (
              <>
                <span>RESET PASSWORD</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="text-center pt-1">
          <Link
            href="/login"
            className="text-xs font-medium text-stone-600 hover:text-[#580F1A] transition-colors"
          >
            ← Back to Login
          </Link>
        </div>

        {/* Footer */}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-140px)] bg-[#FAF7F2] py-12 px-4 flex items-center justify-center">
          <div className="text-xs text-stone-500 font-medium">Loading...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}