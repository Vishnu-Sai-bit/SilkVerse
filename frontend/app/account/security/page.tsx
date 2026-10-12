"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { changePassword } from "@/services/api";

function getPasswordStrength(pw: string) {
  if (!pw) return { score: 0, label: "", color: "bg-gray-200" };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
  if (score === 2) return { score: 2, label: "Fair", color: "bg-amber-500" };
  if (score === 3) return { score: 3, label: "Good", color: "bg-emerald-500" };
  return { score: 4, label: "Strong Royal Security", color: "bg-[#7A1020]" };
}

export default function SecurityPage() {
  const { token } = useAuth();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const strength = getPasswordStrength(newPassword);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const activeToken =
      token ||
      (typeof window !== "undefined"
        ? localStorage.getItem("silkverse-token")
        : null);

    if (!activeToken) {
      setErrorMessage("Please login to change your password.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(
        "New password and confirm password do not match."
      );
      return;
    }

    try {
      setLoading(true);

      await changePassword(activeToken, {
        currentPassword,
        newPassword,
      });

      setSuccessMessage(
        "Password changed successfully."
      );
      toast.success("Your password has been updated securely.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      const msg =
        error?.message ||
        "Failed to change password. Please try again.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
          Account Protection
        </p>
        <h1 className="mt-1.5 font-serif text-2xl sm:text-4xl font-bold text-[#7A1020]">
          Password &amp; Security
        </h1>

        <p className="mt-1.5 text-sm text-[#3B2F2F]/80">
          Manage your password and keep your account secure.
        </p>
      </div>

      {/* Security Overview */}
      <div className="flex items-start gap-4 rounded-2xl border border-[#D4AF37]/40 bg-[#F9F5EC] p-5">
        <ShieldCheck
          className="mt-0.5 text-[#7A1020] shrink-0"
          size={26}
        />

        <div>
          <h2 className="font-serif text-lg font-bold text-[#7A1020]">
            Your account security
          </h2>

          <p className="mt-1 text-xs sm:text-sm text-[#3B2F2F]/80">
            Use a strong password that you do not use on
            other websites.
          </p>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl border border-[#D4AF37]/35 bg-white p-5 sm:p-6 shadow-xs">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-[#F2E8D6] p-2.5 border border-[#D4AF37]/40">
            <Lock
              className="text-[#7A1020]"
              size={22}
            />
          </div>

          <div>
            <h2 className="font-serif text-xl font-bold text-[#3B2F2F]">
              Change Password
            </h2>

            <p className="text-xs sm:text-sm text-gray-500">
              Update your password regularly for better
              security.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl space-y-5"
        >
          {/* Current Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Current Password
            </label>

            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                placeholder="Enter current password"
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none transition focus:border-[#7A1F2B] focus:ring-1 focus:ring-[#7A1F2B] disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrent(!showCurrent)
                }
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#7A1F2B]"
              >
                {showCurrent ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              New Password
            </label>

            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                placeholder="Enter new password"
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none transition focus:border-[#7A1F2B] focus:ring-1 focus:ring-[#7A1F2B] disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#7A1F2B]"
              >
                {showNew ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {newPassword ? (
              <div className="mt-2.5 space-y-1.5">
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        level <= strength.score
                          ? strength.color
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[11px] font-semibold text-gray-600">
                  Strength:{" "}
                  <span className="text-[#7A1020]">{strength.label}</span>
                </p>
              </div>
            ) : (
              <p className="mt-1 text-xs text-gray-500">
                Password must contain at least 6 characters.
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm new password"
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none transition focus:border-[#7A1F2B] focus:ring-1 focus:ring-[#7A1F2B] disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm(!showConfirm)
                }
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#7A1F2B]"
              >
                {showConfirm ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[#7A1F2B] px-6 py-3 font-semibold text-white transition hover:bg-[#641923] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Changing Password..."
              : "Change Password"}
          </button>
        </form>
      </div>

      {/* Security Tips */}
      <div className="rounded-xl border bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">
          Security Tips
        </h2>

        <ul className="space-y-3 text-sm text-gray-600">
          <li>
            • Use a unique password for your SilkVerse
            account.
          </li>

          <li>
            • Avoid sharing your password with anyone.
          </li>

          <li>
            • Avoid using easily guessed information.
          </li>

          <li>
            • Change your password if you believe your
            account is compromised.
          </li>
        </ul>
      </div>
    </div>
  );
}