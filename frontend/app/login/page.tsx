"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import SocialAuthSection from "@/components/auth/SocialAuthSection";
import BrandLogo from "@/components/common/BrandLogo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const verified = searchParams.get("verified");
  const reset = searchParams.get("reset");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("Please enter your email/mobile number and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser({
        identifier: identifier.trim(),
        password,
      });

      await login(data.token);
      router.push("/");
    } catch (err: any) {
      setError(
        err?.message || "Invalid email/mobile number or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#FAF7F2] py-8 sm:py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-stone-200/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* ============================================================== */}
        {/* LEFT PANEL: LUXURY DRAPED SILK VISUAL (Laptop & Desktop)       */}
        {/* ============================================================== */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-[#3D0A12] via-[#580F1A] to-[#181313] p-8 text-white flex-col justify-between overflow-hidden">
          {/* Saree Photography Background Texture */}
          <div className="absolute inset-0 opacity-30 mix-blend-overlay">
            <Image
              src="/images/products/saree_1_maroon.png"
              alt="SilkVerse Heritage Silk"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#181313]/90 via-[#580F1A]/60 to-[#2A060C]/90" />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <BrandLogo
              variant="horizontal"
              theme="dark"
              height={46}
              href="/"
            />
          </div>

          {/* Middle Editorial Quote */}
          <div className="relative z-10 space-y-3 my-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#C8985A]/20 text-amber-200 border border-[#C8985A]/40">
              <Sparkles size={11} />
              Heritage Craftsmanship
            </div>
            <h2 className="font-serif text-2xl xl:text-3xl font-bold text-[#FFFDF7] leading-tight">
              Timeless Silks.<br />
              <span className="text-amber-200">Modern Elegance.</span>
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed font-light">
              Experience the finest handwoven Dharmavaram pure silk sarees, crafted with heritage and delivered with trust.
            </p>
          </div>

          {/* Bottom Trust Stamp */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-stone-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#C8985A]" />
              100% Pure Silk Certified
            </span>
            <span className="text-amber-200/80 font-serif">Est. 1925</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT PANEL: REFINED AUTHENTICATION CARD                       */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 bg-[#FFF8F3]/50 p-6 sm:p-10 flex flex-col justify-between">
          <div className="max-w-md mx-auto w-full space-y-6">
            
            {/* Header / Brand Logo */}
            <div className="text-center space-y-2.5">
              <div className="flex justify-center">
                <BrandLogo
                  variant="horizontal"
                  theme="light"
                  height={44}
                  href="/"
                />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#580F1A]">
                Welcome back
              </h1>
              <p className="text-xs text-stone-500">
                Please login to your account
              </p>
            </div>

            {/* Email Verified Toast Banner */}
            {verified === "success" && (
              <div
                className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2"
                role="status"
              >
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Email verified successfully. You can now log in.</span>
              </div>
            )}

            {/* Password Reset Success Banner */}
            {reset === "success" && (
              <div
                className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2"
                role="status"
              >
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Password reset successfully. You can now log in with your new password.</span>
              </div>
            )}

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

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email or Mobile Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  Email Address or Mobile
                </label>
                <input
                  type="text"
                  placeholder="Enter your email"
                  className="w-full h-10 rounded-xl bg-white border border-stone-300 px-3.5 text-base sm:text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#580F1A] focus:ring-1 focus:ring-[#580F1A] transition-all shadow-2xs"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-700">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-[#580F1A] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full h-10 rounded-xl bg-white border border-stone-300 px-3.5 pr-10 text-base sm:text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#580F1A] focus:ring-1 focus:ring-[#580F1A] transition-all shadow-2xs"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 text-[#580F1A] accent-[#580F1A] focus:ring-[#580F1A]"
                />
                <label htmlFor="remember" className="text-xs text-stone-600 select-none cursor-pointer">
                  Remember me
                </label>
              </div>

              {/* SIGN IN Primary Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-[#580F1A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#7A1628] active:scale-[0.99] transition-all shadow-md disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>SIGN IN</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Social Divider */}
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <div className="flex-1 h-px bg-stone-200" />
              <span>or continue with</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            {/* Social Sign-In Buttons */}
            <SocialAuthSection />

            {/* Register Link */}
            <div className="text-center pt-2">
              <p className="text-xs text-stone-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-bold text-[#580F1A] hover:underline"
                >
                  Register
                </Link>
              </p>
            </div>

          </div>

          {/* Bottom Trust Strip */}
          <div className="mt-8 pt-4 border-t border-stone-200/80 flex items-center justify-center gap-1.5 text-[10px] text-stone-500">
            <Lock size={12} className="text-stone-400" />
            <span>Safe &amp; Encrypted with 256-bit SSL Protection</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[500px] flex items-center justify-center text-xs text-stone-500">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}