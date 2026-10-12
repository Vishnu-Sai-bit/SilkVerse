"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/api";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";
import SocialAuthSection from "@/components/auth/SocialAuthSection";
import BrandLogo from "@/components/common/BrandLogo";

function RegisterPageContent() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Password strength calculation
  const hasMinLength = form.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(form.password);
  const hasNumber = /[0-9]/.test(form.password);
  const hasSpecial = /[^A-Za-z0-9]/.test(form.password);

  const passedCriteriaCount = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthLevel =
    form.password.length === 0
      ? ""
      : passedCriteriaCount <= 1
      ? "Weak"
      : passedCriteriaCount <= 3
      ? "Medium"
      : "Strong";

  const strengthColor =
    passedCriteriaCount <= 1
      ? "bg-red-500"
      : passedCriteriaCount <= 3
      ? "bg-amber-500"
      : "bg-emerald-600";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const mobile = form.mobile.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!name || !email || !mobile || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (name.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      setError("Mobile number must contain exactly 10 digits.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);

      const data = await registerUser({
        name,
        email,
        mobile,
        password,
      });

      if (data?.requiresEmailVerification) {
        router.push(
          `/verify-registration?email=${encodeURIComponent(email)}`
        );
        return;
      }

      setError(
        "Registration completed, but email verification is required."
      );
    } catch (err: any) {
      setError(
        err?.message || "Failed to create account. Please try again."
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

          {/* Middle Editorial Highlight */}
          <div className="relative z-10 space-y-3 my-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#C8985A]/20 text-amber-200 border border-[#C8985A]/40">
              <Sparkles size={11} />
              Member Privileges
            </div>
            <h2 className="font-serif text-2xl xl:text-3xl font-bold text-[#FFFDF7] leading-tight">
              Join the<br />
              <span className="text-amber-200">SilkVerse Legacy.</span>
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed font-light">
              Create your account to unlock private collection previews, certified weavers’ direct pricing, and VIP concierge assistance.
            </p>
          </div>

          {/* Bottom Trust Stamp */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-stone-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#C8985A]" />
              Silk Mark Assured
            </span>
            <span className="text-amber-200/80 font-serif">500+ Weavers</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT PANEL: REFINED REGISTRATION CARD                         */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 bg-[#FFF8F3]/50 p-6 sm:p-10 flex flex-col justify-between">
          <div className="max-w-md mx-auto w-full space-y-5">
            
            {/* Header / Brand Logo */}
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <BrandLogo
                  variant="horizontal"
                  theme="light"
                  height={44}
                  href="/"
                />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#580F1A]">
                Create your account
              </h1>
              <p className="text-xs text-stone-500">
                Join SilkVerse and explore timeless elegance
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

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full h-10 sm:h-9 rounded-xl bg-white border border-stone-300 px-3.5 text-base sm:text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#580F1A] focus:ring-1 focus:ring-[#580F1A] transition-all shadow-2xs"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full h-10 sm:h-9 rounded-xl bg-white border border-stone-300 px-3.5 text-base sm:text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#580F1A] focus:ring-1 focus:ring-[#580F1A] transition-all shadow-2xs"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Mobile Number (10 digits)</label>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="e.g. 9876543210"
                  className="w-full h-10 sm:h-9 rounded-xl bg-white border border-stone-300 px-3.5 text-base sm:text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#580F1A] focus:ring-1 focus:ring-[#580F1A] transition-all shadow-2xs"
                  value={form.mobile}
                  onChange={handleChange}
                  inputMode="numeric"
                  maxLength={10}
                  autoComplete="tel"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    className="w-full h-10 sm:h-9 rounded-xl bg-white border border-stone-300 px-3.5 pr-10 text-base sm:text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#580F1A] focus:ring-1 focus:ring-[#580F1A] transition-all shadow-2xs"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-stone-400 hover:text-stone-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {form.password.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-stone-500">Strength: <strong className="text-stone-800">{strengthLevel}</strong></span>
                      <div className="flex items-center gap-1 w-20">
                        <div className={`h-1 flex-1 rounded-full ${passedCriteriaCount >= 1 ? strengthColor : "bg-stone-200"}`} />
                        <div className={`h-1 flex-1 rounded-full ${passedCriteriaCount >= 2 ? strengthColor : "bg-stone-200"}`} />
                        <div className={`h-1 flex-1 rounded-full ${passedCriteriaCount >= 3 ? strengthColor : "bg-stone-200"}`} />
                        <div className={`h-1 flex-1 rounded-full ${passedCriteriaCount >= 4 ? strengthColor : "bg-stone-200"}`} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className="w-full h-10 sm:h-9 rounded-xl bg-white border border-stone-300 px-3.5 pr-10 text-base sm:text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#580F1A] focus:ring-1 focus:ring-[#580F1A] transition-all shadow-2xs"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2 text-stone-400 hover:text-stone-600"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Terms & Privacy Checkbox */}
              <div className="flex items-start gap-2 pt-1 text-xs text-stone-600">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-stone-300 text-[#580F1A] accent-[#580F1A] focus:ring-[#580F1A]"
                />
                <label htmlFor="terms" className="leading-tight select-none cursor-pointer">
                  I agree to the <span className="text-[#580F1A] font-semibold hover:underline">Terms &amp; Conditions</span> and <span className="text-[#580F1A] font-semibold hover:underline">Privacy Policy</span>
                </label>
              </div>

              {/* CREATE ACCOUNT Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-[#580F1A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#7A1628] active:scale-[0.99] transition-all shadow-md disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>CREATE ACCOUNT</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Social Divider */}
            <div className="flex items-center gap-3 text-xs text-stone-400 pt-1">
              <div className="flex-1 h-px bg-stone-200" />
              <span>or continue with</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            {/* Social Buttons */}
            <SocialAuthSection />

            {/* Login Link */}
            <div className="text-center pt-2">
              <p className="text-xs text-stone-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[#580F1A] hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>

          </div>

          {/* Bottom Trust Stamp */}
          <div className="mt-6 pt-4 border-t border-stone-200/80 flex items-center justify-center gap-1.5 text-[10px] text-stone-500">
            <Lock size={12} className="text-stone-400" />
            <span>We respect your privacy. Your information is never shared.</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-140px)] bg-[#FAF7F2] py-8 flex items-center justify-center">
          <div className="text-xs text-stone-500 font-medium">Loading registration...</div>
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}