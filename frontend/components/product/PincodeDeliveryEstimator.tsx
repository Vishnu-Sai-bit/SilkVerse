"use client";

import { useState } from "react";
import {
  MapPin,
  CheckCircle2,
  Truck,
  RotateCcw,
  ShieldCheck,
  Banknote,
  Loader2,
} from "lucide-react";
import { inferLocationFromPincode } from "@/lib/locationsData";

export default function PincodeDeliveryEstimator() {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    valid: boolean;
    location?: string;
    deliveryDate?: string;
    codAvailable?: boolean;
    freeDelivery?: boolean;
  } | null>(null);
  const [error, setError] = useState("");

  const checkPinValue = (rawPin: string) => {
    const cleanPin = rawPin.trim();

    if (!/^\d{6}$/.test(cleanPin)) {
      setError("Please enter a valid 6-digit Indian PIN code");
      setResult(null);
      return;
    }

    setError("");
    setLoading(true);

    // Smart logistics calculation based on Indian PIN zones + exact District/State lookup
    setTimeout(() => {
      setLoading(false);
      const firstDigit = cleanPin[0];
      const today = new Date();

      const daysToAdd = ["5", "6"].includes(firstDigit) ? 2 : ["1", "4"].includes(firstDigit) ? 3 : 4;
      const deliveryDateObj = new Date(today);
      deliveryDateObj.setDate(today.getDate() + daysToAdd);

      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        month: "short",
        day: "numeric",
      };
      const formattedDate = deliveryDateObj.toLocaleDateString("en-IN", options);

      const inferred = inferLocationFromPincode(cleanPin);
      const zoneMap: Record<string, string> = {
        "1": "Delhi / North Region",
        "2": "UP / Uttarakhand Region",
        "3": "Rajasthan / Gujarat Region",
        "4": "Maharashtra / Goa / MP",
        "5": "Telangana / AP / Karnataka",
        "6": "Tamil Nadu / Kerala",
        "7": "Eastern / Kolkata Region",
        "8": "Bihar / Jharkhand Region",
        "9": "North-East Region",
      };

      const resolvedLocation = inferred
        ? [inferred.district, inferred.state].filter(Boolean).join(", ")
        : zoneMap[firstDigit] || "All India Delivery";

      setResult({
        valid: true,
        location: resolvedLocation,
        deliveryDate: formattedDate,
        codAvailable: true,
        freeDelivery: true,
      });
    }, 350);
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    checkPinValue(pincode);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-[#FAF7F2]/60 p-4 sm:p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
        <Truck className="text-[#7A1F2B]" size={18} />
        <span>Delivery &amp; Services</span>
      </div>

      <form onSubmit={handleCheck} className="mt-3 flex gap-2">
        <div className="relative min-w-0 flex-1">
          <MapPin
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => {
              setPincode(e.target.value.replace(/\D/g, ""));
              setError("");
            }}
            placeholder="Enter Delivery Pincode (e.g. 515671)"
            className="min-w-0 w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-base sm:text-sm font-medium outline-none transition focus:border-[#7A1F2B] focus:ring-1 focus:ring-[#7A1F2B]"
          />
        </div>

        <button
          type="submit"
          disabled={loading || pincode.length < 6}
          className="shrink-0 rounded-lg bg-[#7A1F2B] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#601721] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            "Check"
          )}
        </button>
      </form>

      {error && (
        <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
      )}

      {result && result.valid && (
        <div className="mt-3 space-y-2 border-t border-gray-200/80 pt-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
            <CheckCircle2 size={16} className="text-green-600 shrink-0" />
            <span>
              Express Delivery by{" "}
              <strong className="text-green-700">{result.deliveryDate}</strong>{" "}
              ({result.location})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-gray-600">
            <div className="flex items-center gap-1.5 font-medium">
              <Banknote size={14} className="text-[#B58A32] shrink-0" />
              <span>Cash on Delivery Available</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-green-700">
              <Truck size={14} className="text-green-600 shrink-0" />
              <span>Free Express Shipping</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <RotateCcw size={14} className="text-blue-600 shrink-0" />
              <span>7 Days Easy Return/Exchange</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
              <span>100% Silk Mark Authenticated</span>
            </div>
          </div>
        </div>
      )}

      {!result && (
        <p className="mt-2 text-[11px] text-gray-500">
          Enter your 6-digit PIN code to verify delivery speed, Cash on Delivery (COD), and return policies.
        </p>
      )}
    </div>
  );
}
