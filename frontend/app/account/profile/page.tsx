"use client";

import {
  useEffect,
  useState,
  type ElementType,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  ExternalLink,
  Globe,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  Shield,
  User,
  X,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "@/services/api";
import {
  COUNTRIES,
  INDIAN_STATES,
  getDistrictsForState,
} from "@/lib/locationsData";

function toDateInputValue(value?: string | null) {
  if (!value) return "";

  // Handle YYYY-MM-DD directly without timezone conversion.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  // Handle date-only values without timezone shifting.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] =
      value.split("-").map(Number);

    const date = new Date(
      year,
      month - 1,
      day
    );

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function ProfilePage() {
  const router = useRouter();

  const {
    user,
    token,
    loading: authLoading,
    updateUser,
    logout,
  } = useAuth();

  const [isEditing, setIsEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [name, setName] =
    useState("");

  const [mobile, setMobile] =
    useState("");

  const [dateOfBirth, setDateOfBirth] =
    useState("");

  const [district, setDistrict] =
    useState("");

  const [state, setState] =
    useState("");

  const [country, setCountry] =
    useState("India");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const resetForm = () => {
    setName(user?.name || "");
    setMobile(user?.mobile || "");

    setDateOfBirth(
      toDateInputValue(
        user?.dateOfBirth
      )
    );
    setDistrict(user?.district || "");
    setState(user?.state || "");
    setCountry(user?.country || "India");
  };

  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setMobile(user.mobile || "");

    setDateOfBirth(
      toDateInputValue(
        user.dateOfBirth
      )
    );
    setDistrict(user.district || "");
    setState(user.state || "");
    setCountry(user.country || "India");
  }, [user]);

  useEffect(() => {
    if (
      !authLoading &&
      !user &&
      !token
    ) {
      router.replace(
        "/login?redirect=/account/profile"
      );
    }
  }, [
    authLoading,
    user,
    token,
    router,
  ]);

  const handleEdit = () => {
    if (saving) return;

    setError("");
    setSuccess("");

    resetForm();
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (saving) return;

    setError("");
    setSuccess("");

    resetForm();
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (saving) return;

    setError("");
    setSuccess("");

    if (!token) {
      router.replace(
        "/login?redirect=/account/profile"
      );
      return;
    }

    if (!user) {
      setError(
        "Your account information is unavailable. Please log in again."
      );
      return;
    }

    const trimmedName =
      name.trim();

    const trimmedMobile =
      mobile.trim();

    if (trimmedName.length < 2) {
      setError(
        "Name must contain at least 2 characters."
      );
      return;
    }

    if (
      !/^[6-9]\d{9}$/.test(
        trimmedMobile
      )
    ) {
      setError(
        "Enter a valid 10-digit Indian mobile number."
      );
      return;
    }

    try {
      setSaving(true);

      const data =
        await updateProfile(
          token,
          {
            name: trimmedName,
            mobile: trimmedMobile,
            dateOfBirth:
              dateOfBirth || null,
            district: district.trim(),
            state: state.trim(),
            country: country.trim() || "India",
          }
        );

      if (!data?.user) {
        throw new Error(
          "Profile update response is invalid."
        );
      }

      updateUser(data.user);

      setSuccess(
        "Profile updated successfully."
      );

      setIsEditing(false);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div
          role="status"
          aria-label="Loading profile"
          className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#7A1F2B]"
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const availableDistricts = getDistrictsForState(state);

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
            Account Details
          </p>

          <h1 className="mt-1.5 font-serif text-2xl sm:text-4xl font-bold text-[#7A1020]">
            My Profile
          </h1>

          <p className="mt-1.5 text-sm text-[#3B2F2F]/80">
            View and manage your personal
            information.
          </p>
        </div>

        {!isEditing && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleEdit}
              disabled={saving}
              aria-label="Edit profile"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#7A1020] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#5B0D16] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 cursor-pointer"
            >
              <Pencil
                size={16}
                aria-hidden="true"
              />

              Edit Profile
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              aria-label="Sign out of account"
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/70 px-4 py-2.5 text-xs sm:text-sm font-semibold text-red-700 transition hover:bg-red-600 hover:text-white cursor-pointer"
            >
              <LogOut size={16} aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>

      {/* Messages */}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700"
        >
          {success}
        </div>
      )}

      {/* Profile Card */}

      <div className="overflow-hidden rounded-2xl border border-[#D4AF37]/35 bg-white shadow-xs">
        <div className="border-b border-[#D4AF37]/25 bg-[#F9F5EC] px-6 py-6 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F2E8D6] border border-[#D4AF37]/40">
              <User
                size={32}
                className="text-[#7A1020]"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <h2 className="truncate font-serif text-2xl font-bold text-[#7A1020]">
                {user.name || "User"}
              </h2>

              <p className="mt-1 text-xs sm:text-sm text-[#3B2F2F]/75">
                Your SilkVerse account
                information
              </p>
            </div>
          </div>
        </div>

        {isEditing ? (
          <form
            className="p-4 sm:p-6 lg:p-8"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSave();
            }}
          >
            <div className="grid gap-6 md:grid-cols-2">
              {/* Full Name */}

              <FormInput
                id="profile-name"
                icon={User}
                label="Full Name"
                type="text"
                value={name}
                onChange={setName}
                placeholder="Enter your full name"
                autoComplete="name"
                disabled={saving}
                required
                autoFocus
              />

              {/* Email */}

              <div>
                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>

                <div className="flex items-center gap-3 rounded-xl border bg-gray-100 px-4 py-3">
                  <Mail
                    size={20}
                    className="shrink-0 text-gray-500"
                    aria-hidden="true"
                  />

                  <input
                    id="profile-email"
                    type="email"
                    value={user.email || ""}
                    disabled
                    autoComplete="email"
                    aria-describedby="profile-email-help"
                    className="w-full bg-transparent text-gray-500 outline-none"
                  />
                </div>

                <p
                  id="profile-email-help"
                  className="mt-2 text-xs text-gray-500"
                >
                  Email address cannot be
                  changed here.
                </p>
              </div>

              {/* Mobile */}

              <FormInput
                id="profile-mobile"
                icon={Phone}
                label="Mobile Number"
                type="tel"
                value={mobile}
                onChange={(value) =>
                  setMobile(
                    value
                      .replace(/\D/g, "")
                      .slice(0, 10)
                  )
                }
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
                autoComplete="tel"
                inputMode="numeric"
                pattern="[6-9][0-9]{9}"
                disabled={saving}
                required
              />

              {/* Date of Birth */}

              <FormInput
                id="profile-date-of-birth"
                icon={Calendar}
                label="Date of Birth"
                type="date"
                value={dateOfBirth}
                onChange={setDateOfBirth}
                autoComplete="bday"
                max={toDateInputValue(
                  new Date().toISOString()
                )}
                disabled={saving}
              />

              {/* Country */}
              <div>
                <label
                  htmlFor="profile-country"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Country
                </label>
                <div className="flex items-center gap-3 rounded-xl border px-4 py-3 transition focus-within:border-[#C9A227] focus-within:ring-1 focus-within:ring-[#C9A227] bg-white">
                  <Globe size={20} className="shrink-0 text-[#7A1F2B]" />
                  <select
                    id="profile-country"
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      if (e.target.value !== "India") {
                        setState("");
                        setDistrict("");
                      }
                    }}
                    disabled={saving}
                    className="w-full bg-transparent outline-none text-sm font-medium text-gray-800"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* State */}
              <div>
                <label
                  htmlFor="profile-state"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  State
                </label>
                <div className="flex items-center gap-3 rounded-xl border px-4 py-3 transition focus-within:border-[#C9A227] focus-within:ring-1 focus-within:ring-[#C9A227] bg-white">
                  <MapPin size={20} className="shrink-0 text-[#7A1F2B]" />
                  {country === "India" ? (
                    <select
                      id="profile-state"
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        setDistrict("");
                      }}
                      disabled={saving}
                      className="w-full bg-transparent outline-none text-sm font-medium text-gray-800"
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="profile-state"
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Enter state / province"
                      disabled={saving}
                      className="w-full bg-transparent outline-none text-sm"
                    />
                  )}
                </div>
              </div>

              {/* District */}
              <div className="md:col-span-2">
                <label
                  htmlFor="profile-district"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  District
                </label>
                <div className="flex items-center gap-3 rounded-xl border px-4 py-3 transition focus-within:border-[#C9A227] focus-within:ring-1 focus-within:ring-[#C9A227] bg-white">
                  <MapPin size={20} className="shrink-0 text-[#7A1F2B]" />
                  {country === "India" && availableDistricts.length > 0 ? (
                    <select
                      id="profile-district"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      disabled={saving}
                      className="w-full bg-transparent outline-none text-sm font-medium text-gray-800"
                    >
                      <option value="">Select District ({state})</option>
                      {availableDistricts.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="profile-district"
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="Select a State above or enter District (e.g., Sri Sathya Sai / Anantapur / Hyderabad)"
                      disabled={saving}
                      className="w-full bg-transparent outline-none text-sm"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[#7A1020] px-6 py-3 font-medium text-white transition hover:bg-[#651923] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2"
              >
                <Save
                  size={18}
                  aria-hidden="true"
                />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2"
              >
                <X
                  size={18}
                  aria-hidden="true"
                />

                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <ProfileItem
                icon={User}
                label="Full Name"
                value={user.name || "-"}
              />

              <ProfileItem
                icon={Mail}
                label="Email Address"
                value={user.email || "-"}
              />

              <ProfileItem
                icon={Phone}
                label="Mobile Number"
                value={user.mobile || "-"}
              />

              <ProfileItem
                icon={Calendar}
                label="Date of Birth"
                value={formatDate(
                  user.dateOfBirth
                )}
              />

              <ProfileItem
                icon={MapPin}
                label="District"
                value={user.district || "Sri Sathya Sai (Dharmavaram)"}
              />

              <ProfileItem
                icon={MapPin}
                label="State"
                value={user.state || "Andhra Pradesh"}
              />

              <ProfileItem
                icon={Globe}
                label="Country"
                value={user.country || "India"}
              />

              {user?.role === "admin" && (
                <ProfileItem
                  icon={Shield}
                  label="Account Role"
                  value="Admin"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Admin Panel Access - Show ONLY for Admin */}
      {user?.role === "admin" && (
        <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#F9F5EC] p-6 shadow-sm sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#7A1020] text-[#D4AF37] shadow-xs">
                <Shield size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-xl font-bold text-[#7A1020]">Administrator Account</h2>
                  <span className="rounded-full bg-[#7A1020] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                    Admin
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-stone-600">
                  You have full administrative privileges to manage products, orders, and store operations.
                </p>
              </div>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7A1020] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#5B0D16] transition shadow-xs shrink-0 self-start sm:self-auto"
            >
              <span>Admin Portal</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* SilkVerse Promises */}

      <div className="rounded-2xl bg-[#7A1020] p-6 text-white shadow-md sm:p-8 border border-[#D4AF37]/40">
        <div className="grid gap-6 md:grid-cols-3">
          <PromiseItem
            title="100% Pure Silk"
            description="Assured quality"
          />

          <PromiseItem
            title="Secure Payments"
            description="100% safe transactions"
          />

          <PromiseItem
            title="Easy Returns"
            description="7-day return support"
          />
        </div>
      </div>
    </div>
  );
}

/* ======================================
   Form Input
====================================== */

type FormInputProps = {
  id: string;
  icon: ElementType;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  autoComplete?: string;
  inputMode?: "numeric";
  pattern?: string;
  max?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
};

function FormInput({
  icon: Icon,
  label,
  id,
  type,
  value,
  onChange,
  placeholder,
  maxLength,
  autoComplete,
  inputMode,
  pattern,
  max,
  disabled = false,
  required = false,
  autoFocus = false,
}: FormInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>

      <div className="flex items-center gap-3 rounded-xl border px-4 py-3 transition focus-within:border-[#C9A227] focus-within:ring-1 focus-within:ring-[#C9A227]">
        <Icon
          size={20}
          className="shrink-0 text-[#7A1F2B]"
          aria-hidden="true"
        />

        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          inputMode={inputMode}
          pattern={pattern}
          max={max}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          className="w-full bg-transparent outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
    </div>
  );
}

/* ======================================
   Profile Item
====================================== */

function ProfileItem({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border p-3.5 sm:p-5 transition hover:border-[#C9A227] hover:shadow-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FDF4E8]">
        <Icon
          size={22}
          className="text-[#7A1F2B]"
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0">
        <p className="text-sm text-gray-500">
          {label}
        </p>

        <p className="mt-1 truncate text-lg font-semibold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}



/* ======================================
   Promise Item
====================================== */

function PromiseItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="font-semibold">
        {title}
      </h3>

      <p className="mt-1 text-sm text-white/70">
        {description}
      </p>
    </div>
  );
}