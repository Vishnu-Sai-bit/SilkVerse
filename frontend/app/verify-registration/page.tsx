"use client";

import { Suspense, useEffect, useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import Link from "next/link";
import {
  verifyRegistrationOTP,
  resendRegistrationOTP,
} from "@/services/api";

function VerifyRegistrationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [resendTimer, setResendTimer] = useState(60);
  const [isVerified, setIsVerified] = useState(false);

  // =====================================
  // Resend Countdown
  // =====================================

  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((previous) =>
        previous > 0 ? previous - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // =====================================
  // Verify OTP
  // =====================================

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email) {
      setError(
        "Email address is missing. Please register again."
      );
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      await verifyRegistrationOTP({
        email,
        otp,
      });

      setIsVerified(true);
      setSuccess(
        "Email verified successfully! Redirecting to login..."
      );

      setTimeout(() => {
        router.push("/login?verified=success");
      }, 1200);
    } catch (err: any) {
      setError(
        err?.message ||
          "Invalid or expired OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================
  // Resend OTP
  // =====================================

  async function handleResendOTP() {
    if (!email) {
      setError(
        "Email address is missing. Please register again."
      );
      return;
    }

    if (resendTimer > 0 || resending) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      setResending(true);

      await resendRegistrationOTP(email);

      setOtp("");

      setSuccess(
        "A new verification OTP has been sent to your email."
      );

      setResendTimer(60);
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to resend OTP. Please try again later."
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="mb-3 text-center text-3xl font-bold">
        Verify Your Email
      </h1>

      <p className="mb-8 text-center text-sm text-gray-600">
        We sent a 6-digit verification code to
        <br />
        <span className="font-medium text-gray-900">
          {email || "your email address"}
        </span>
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          className="w-full rounded border p-3 text-center text-lg tracking-[0.4em]"
          value={otp}
          onChange={(e) => {
            const value = e.target.value
              .replace(/\D/g, "")
              .slice(0, 6);

            setOtp(value);
          }}
          autoComplete="one-time-code"
          required
        />

        {error && (
          <p
            className="rounded bg-red-50 p-3 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            className="rounded bg-green-50 p-3 text-sm text-green-600"
            role="status"
          >
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || resending || isVerified}
          className="w-full rounded bg-[#7A1F2B] py-3 text-white transition hover:bg-[#641924] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Verifying..."
            : "Verify Email"}
        </button>
      </form>

      {/* Resend OTP */}

      <div className="mt-5 text-center">
        {resendTimer > 0 ? (
          <p className="text-sm text-gray-500">
            Resend OTP in{" "}
            <span className="font-medium text-gray-900">
              {resendTimer}s
            </span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resending || isVerified}
            className="text-sm font-medium text-[#7A1F2B] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resending
              ? "Sending OTP..."
              : "Resend OTP"}
          </button>
        )}
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        <Link
          href="/register"
          className="font-medium text-[#7A1F2B] hover:underline"
        >
          Back to Registration
        </Link>
      </div>
    </div>
  );
}

export default function VerifyRegistrationPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-6 py-16 text-center">Loading...</div>}>
      <VerifyRegistrationContent />
    </Suspense>
  );
}