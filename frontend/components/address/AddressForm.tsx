"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  X,
  Save,
} from "lucide-react";

import { Address } from "@/types/address";
import {
  COUNTRIES,
  INDIAN_STATES,
  getDistrictsForState,
  inferLocationFromPincode,
} from "@/lib/locationsData";

// =====================================
// Props
// =====================================

interface AddressFormProps {
  initialData: Address | null;

  onSubmit: (
    data: Omit<Address, "_id">
  ) => Promise<void>;

  onCancel: () => void;
}

// =====================================
// Form Type
// =====================================

type FormData = Omit<
  Address,
  "_id" | "landmark" | "district"
> & {
  landmark: string;
  district: string;
};

// =====================================
// Empty Form
// =====================================

const emptyForm: FormData = {
  fullName: "",
  mobile: "",
  pincode: "",
  houseNumber: "",
  area: "",
  landmark: "",
  city: "",
  district: "",
  state: "",
  country: "India",
  addressType: "Home",
  isDefault: false,
};

// =====================================
// Component
// =====================================

export default function AddressForm({
  initialData,
  onSubmit,
  onCancel,
}: AddressFormProps) {
  const [formData, setFormData] =
    useState<FormData>({
      ...emptyForm,
    });

  const [errors, setErrors] =
    useState<
      Partial<
        Record<
          keyof FormData,
          string
        >
      >
    >({});

  const [submitting, setSubmitting] =
    useState(false);

  // =====================================
  // Load Existing Address
  // =====================================

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName:
          initialData.fullName ?? "",

        mobile:
          initialData.mobile ?? "",

        pincode:
          initialData.pincode ?? "",

        houseNumber:
          initialData.houseNumber ?? "",

        area:
          initialData.area ?? "",

        landmark:
          initialData.landmark ?? "",

        city:
          initialData.city ?? "",

        district:
          initialData.district ?? "",

        state:
          initialData.state ?? "",

        country:
          initialData.country ??
          "India",

        addressType:
          initialData.addressType ===
          "Work"
            ? "Work"
            : initialData.addressType ===
                "Other"
              ? "Other"
              : "Home",

        isDefault:
          initialData.isDefault ??
          false,
      });
    } else {
      setFormData({
        ...emptyForm,
      });
    }

    setErrors({});
    setSubmitting(false);
  }, [initialData]);

  // =====================================
  // Handle Input Change
  // =====================================

  function handleChange(
    field: keyof FormData,
    value: string | boolean
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((previous) => ({
        ...previous,
        [field]: "",
      }));
    }
  }

  // =====================================
  // Validate Form
  // =====================================

  function validateForm(): boolean {
    const newErrors: Partial<
      Record<
        keyof FormData,
        string
      >
    > = {};

    const fullName =
      formData.fullName.trim();

    const mobile =
      formData.mobile.trim();

    const pincode =
      formData.pincode.trim();

    const houseNumber =
      formData.houseNumber.trim();

    const area =
      formData.area.trim();

    const city =
      formData.city.trim();

    const state =
      formData.state.trim();

    const country =
      formData.country.trim();

    // ===================================
    // Full Name
    // ===================================

    if (!fullName) {
      newErrors.fullName =
        "Full name is required.";
    } else if (
      fullName.length < 2
    ) {
      newErrors.fullName =
        "Full name must contain at least 2 characters.";
    }

    // ===================================
    // Mobile
    // ===================================

    if (!mobile) {
      newErrors.mobile =
        "Mobile number is required.";
    } else if (
      !/^[6-9]\d{9}$/.test(
        mobile
      )
    ) {
      newErrors.mobile =
        "Enter a valid 10-digit Indian mobile number.";
    }

    // ===================================
    // House Number
    // ===================================

    if (!houseNumber) {
      newErrors.houseNumber =
        "House / Flat number is required.";
    }

    // ===================================
    // Area
    // ===================================

    if (!area) {
      newErrors.area =
        "Area / Street is required.";
    }

    // ===================================
    // City
    // ===================================

    if (!city) {
      newErrors.city =
        "City is required.";
    }

    // ===================================
    // State
    // ===================================

    if (!state) {
      newErrors.state =
        "State is required.";
    }

    // ===================================
    // Country
    // ===================================

    if (!country) {
      newErrors.country =
        "Country is required.";
    } else if (
      country.toLowerCase() !==
      "india"
    ) {
      newErrors.country =
        "Currently, delivery is available only within India.";
    }

    // ===================================
    // Pincode
    // ===================================

    if (!pincode) {
      newErrors.pincode =
        "Pincode is required.";
    } else if (
      !/^\d{6}$/.test(
        pincode
      )
    ) {
      newErrors.pincode =
        "Pincode must contain exactly 6 digits.";
    }

    // ===================================
    // Address Type
    // ===================================

    if (
      ![
        "Home",
        "Work",
        "Other",
      ].includes(
        formData.addressType
      )
    ) {
      newErrors.addressType =
        "Please select an address type.";
    }

    setErrors(newErrors);

    return (
      Object.keys(
        newErrors
      ).length === 0
    );
  }

  // =====================================
  // Submit Form
  // =====================================

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      await onSubmit({
        fullName:
          formData.fullName.trim(),

        mobile:
          formData.mobile.trim(),

        pincode:
          formData.pincode.trim(),

        houseNumber:
          formData.houseNumber.trim(),

        area:
          formData.area.trim(),

        landmark:
          formData.landmark.trim(),

        city:
          formData.city.trim(),

        district:
          formData.district.trim(),

        state:
          formData.state.trim(),

        country:
          formData.country.trim(),

        addressType:
          formData.addressType,

        isDefault:
          formData.isDefault,
      });
    } finally {
      setSubmitting(false);
    }
  }

  // =====================================
  // Input Class
  // =====================================

  function inputClass(
    field: keyof FormData
  ) {
    return `mt-2 w-full rounded-lg border px-4 py-3 outline-none transition ${
      errors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-200"
        : "border-gray-300 focus:border-[#7A1F2B] focus:ring-1 focus:ring-[#7A1F2B]"
    } disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70`;
  }

  // =====================================
  // UI
  // =====================================

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-md sm:p-6 md:p-8">
      {/* =====================================
          Header
      ===================================== */}

      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#7A1F2B]">
            {initialData
              ? "Edit Address"
              : "Add New Address"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {initialData
              ? "Update your delivery address details."
              : "Add an address for faster checkout."}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          aria-label="Close address form"
          className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2"
        >
          <X
            size={22}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* =====================================
          Form
      ===================================== */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        noValidate
      >
        {/* Full Name + Mobile */}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Full Name */}

          <div>
            <label
              htmlFor="fullName"
              className="text-sm font-semibold text-gray-700"
            >
              Full Name *
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              value={
                formData.fullName
              }
              onChange={(event) =>
                handleChange(
                  "fullName",
                  event.target.value
                )
              }
              placeholder="Enter your full name"
              className={inputClass(
                "fullName"
              )}
              disabled={submitting}
              autoComplete="name"
              aria-invalid={Boolean(
                errors.fullName
              )}
              aria-describedby={
                errors.fullName
                  ? "fullName-error"
                  : undefined
              }
              required
            />

            {errors.fullName && (
              <p
                id="fullName-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Mobile */}

          <div>
            <label
              htmlFor="mobile"
              className="text-sm font-semibold text-gray-700"
            >
              Mobile Number *
            </label>

            <input
              id="mobile"
              name="mobile"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={
                formData.mobile
              }
              onChange={(event) =>
                handleChange(
                  "mobile",
                  event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10)
                )
              }
              placeholder="10-digit mobile number"
              className={inputClass(
                "mobile"
              )}
              disabled={submitting}
              autoComplete="tel"
              aria-invalid={Boolean(
                errors.mobile
              )}
              aria-describedby={
                errors.mobile
                  ? "mobile-error"
                  : undefined
              }
              required
            />

            {errors.mobile && (
              <p
                id="mobile-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.mobile}
              </p>
            )}
          </div>
        </div>

        {/* House Number + Area */}

        <div className="grid gap-6 md:grid-cols-2">
          {/* House Number */}

          <div>
            <label
              htmlFor="houseNumber"
              className="text-sm font-semibold text-gray-700"
            >
              House / Flat Number *
            </label>

            <input
              id="houseNumber"
              name="houseNumber"
              type="text"
              value={
                formData.houseNumber
              }
              onChange={(event) =>
                handleChange(
                  "houseNumber",
                  event.target.value
                )
              }
              placeholder="House no, Flat no, Building"
              className={inputClass(
                "houseNumber"
              )}
              disabled={submitting}
              autoComplete="address-line1"
              aria-invalid={Boolean(
                errors.houseNumber
              )}
              aria-describedby={
                errors.houseNumber
                  ? "houseNumber-error"
                  : undefined
              }
              required
            />

            {errors.houseNumber && (
              <p
                id="houseNumber-error"
                className="mt-1 text-sm text-red-600"
              >
                {
                  errors.houseNumber
                }
              </p>
            )}
          </div>

          {/* Area */}

          <div>
            <label
              htmlFor="area"
              className="text-sm font-semibold text-gray-700"
            >
              Area / Street *
            </label>

            <input
              id="area"
              name="area"
              type="text"
              value={formData.area}
              onChange={(event) =>
                handleChange(
                  "area",
                  event.target.value
                )
              }
              placeholder="Street, locality or area"
              className={inputClass(
                "area"
              )}
              disabled={submitting}
              autoComplete="address-line2"
              aria-invalid={Boolean(
                errors.area
              )}
              aria-describedby={
                errors.area
                  ? "area-error"
                  : undefined
              }
              required
            />

            {errors.area && (
              <p
                id="area-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.area}
              </p>
            )}
          </div>
        </div>

        {/* Landmark */}

        <div>
          <label
            htmlFor="landmark"
            className="text-sm font-semibold text-gray-700"
          >
            Landmark
            <span className="ml-1 font-normal text-gray-400">
              (Optional)
            </span>
          </label>

          <input
            id="landmark"
            name="landmark"
            type="text"
            value={
              formData.landmark
            }
            onChange={(event) =>
              handleChange(
                "landmark",
                event.target.value
              )
            }
            placeholder="Nearby landmark"
            className={inputClass(
              "landmark"
            )}
            disabled={submitting}
            autoComplete="off"
          />
        </div>

        {/* Country + State */}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Country */}

          <div>
            <label
              htmlFor="country"
              className="text-sm font-semibold text-gray-700"
            >
              Country *
            </label>

            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={(event) => {
                const nextCountry = event.target.value;
                handleChange("country", nextCountry);
                if (nextCountry !== "India") {
                  handleChange("state", "");
                  handleChange("district", "");
                }
              }}
              className={inputClass("country")}
              disabled={submitting}
              required
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {errors.country && (
              <p
                id="country-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.country}
              </p>
            )}
          </div>

          {/* State */}

          <div>
            <label
              htmlFor="state"
              className="text-sm font-semibold text-gray-700"
            >
              State *
            </label>

            {formData.country === "India" ? (
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={(event) => {
                  handleChange("state", event.target.value);
                  handleChange("district", "");
                }}
                className={inputClass("state")}
                disabled={submitting}
                required
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
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={(event) =>
                  handleChange(
                    "state",
                    event.target.value
                  )
                }
                placeholder="Enter state"
                className={inputClass(
                  "state"
                )}
                disabled={submitting}
                autoComplete="address-level1"
                required
              />
            )}

            {errors.state && (
              <p
                id="state-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.state}
              </p>
            )}
          </div>
        </div>

        {/* District + City */}

        <div className="grid gap-6 md:grid-cols-2">
          {/* District */}

          <div>
            <label
              htmlFor="district"
              className="text-sm font-semibold text-gray-700"
            >
              District
            </label>

            {formData.country === "India" &&
            getDistrictsForState(formData.state).length > 0 ? (
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={(event) =>
                  handleChange("district", event.target.value)
                }
                className={inputClass("district")}
                disabled={submitting}
              >
                <option value="">
                  Select District ({formData.state})
                </option>
                {getDistrictsForState(formData.state).map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="district"
                name="district"
                type="text"
                value={formData.district}
                onChange={(event) =>
                  handleChange("district", event.target.value)
                }
                placeholder="e.g., Sri Sathya Sai (Dharmavaram), Anantapur, Hyderabad"
                className={inputClass("district")}
                disabled={submitting}
              />
            )}
          </div>

          {/* City */}

          <div>
            <label
              htmlFor="city"
              className="text-sm font-semibold text-gray-700"
            >
              City / Town *
            </label>

            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={(event) =>
                handleChange(
                  "city",
                  event.target.value
                )
              }
              placeholder="e.g., Dharmavaram, Bengaluru, Hyderabad"
              className={inputClass(
                "city"
              )}
              disabled={submitting}
              autoComplete="address-level2"
              aria-invalid={Boolean(
                errors.city
              )}
              aria-describedby={
                errors.city
                  ? "city-error"
                  : undefined
              }
              required
            />

            {errors.city && (
              <p
                id="city-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.city}
              </p>
            )}
          </div>
        </div>

        {/* Pincode */}

        <div>
          <label
            htmlFor="pincode"
            className="text-sm font-semibold text-gray-700"
          >
            Pincode *
          </label>

          <input
            id="pincode"
            name="pincode"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={
              formData.pincode
            }
            onChange={(event) => {
              const nextPin = event.target.value
                .replace(/\D/g, "")
                .slice(0, 6);
              handleChange("pincode", nextPin);

              if (nextPin.length === 6) {
                const inferred = inferLocationFromPincode(nextPin);
                if (inferred) {
                  if (inferred.state && !formData.state) {
                    handleChange("state", inferred.state);
                  }
                  if (inferred.district && !formData.district) {
                    handleChange("district", inferred.district);
                  }
                  if (inferred.city && !formData.city) {
                    handleChange("city", inferred.city);
                  }
                }
              }
            }}
            placeholder="6-digit pincode (e.g., 515671)"
            className={inputClass(
              "pincode"
            )}
            disabled={submitting}
            autoComplete="postal-code"
            aria-invalid={Boolean(
              errors.pincode
            )}
            aria-describedby={
              errors.pincode
                ? "pincode-error"
                : undefined
            }
            required
          />

          {errors.pincode && (
            <p
              id="pincode-error"
              className="mt-1 text-sm text-red-600"
            >
              {errors.pincode}
            </p>
          )}
        </div>

        {/* Address Type */}

        <div>
          <p
            id="address-type-label"
            className="text-sm font-semibold text-gray-700"
          >
            Address Type
          </p>

          <div
            className="mt-3 grid gap-3 sm:grid-cols-3"
            role="radiogroup"
            aria-labelledby="address-type-label"
            aria-describedby={
              errors.addressType
                ? "address-type-error"
                : undefined
            }
          >
            {(
              [
                "Home",
                "Work",
                "Other",
              ] as const
            ).map((type) => (
              <label
                key={type}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                  formData.addressType ===
                  type
                    ? "border-[#7A1F2B] bg-[#FFF9F5]"
                    : "border-gray-300 hover:border-[#C9A227]"
                }`}
              >
                <input
                  type="radio"
                  name="addressType"
                  value={type}
                  checked={
                    formData.addressType ===
                    type
                  }
                  onChange={() =>
                    handleChange(
                      "addressType",
                      type
                    )
                  }
                  disabled={submitting}
                  className="accent-[#7A1F2B]"
                />

                <span className="font-medium">
                  {type}
                </span>
              </label>
            ))}
          </div>

          {errors.addressType && (
            <p
              id="address-type-error"
              className="mt-1 text-sm text-red-600"
            >
              {errors.addressType}
            </p>
          )}
        </div>

        {/* Default Address */}

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <input
            type="checkbox"
            checked={
              formData.isDefault
            }
            onChange={(event) =>
              handleChange(
                "isDefault",
                event.target.checked
              )
            }
            disabled={submitting}
            className="mt-1 h-4 w-4 accent-[#7A1F2B]"
          />

          <div>
            <p className="font-semibold text-gray-800">
              Set as default address
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Use this address automatically
              during checkout.
            </p>
          </div>
        </label>

        {/* Buttons */}

        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
          {/* Cancel */}

          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2"
          >
            Cancel
          </button>

          {/* Save / Update */}

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#7A1F2B] px-6 py-3 font-semibold text-white transition hover:bg-[#651923] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2"
          >
            <Save
              size={18}
              aria-hidden="true"
            />

            {submitting
              ? "Saving..."
              : initialData
                ? "Update Address"
                : "Save Address"}
          </button>
        </div>
      </form>
    </div>
  );
}