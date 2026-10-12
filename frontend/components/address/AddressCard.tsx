"use client";

import { Address } from "@/types/address";

import {
  Home,
  Briefcase,
  MapPin,
  Pencil,
  Trash2,
  CheckCircle,
  Phone,
} from "lucide-react";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  // =====================================
  // Address Type Icon
  // =====================================

  function getAddressIcon() {
    switch (address.addressType) {
      case "Home":
        return (
          <Home
            size={20}
            aria-hidden="true"
          />
        );

      case "Work":
        return (
          <Briefcase
            size={20}
            aria-hidden="true"
          />
        );

      case "Other":
      default:
        return (
          <MapPin
            size={20}
            aria-hidden="true"
          />
        );
    }
  }

  // =====================================
  // Render
  // =====================================

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* =====================================
          Header
      ===================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="w-full">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-[#7A1F2B]">
              {getAddressIcon()}

              <h3 className="text-lg font-bold text-gray-800">
                {address.addressType}
              </h3>
            </div>

            {address.isDefault && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                <CheckCircle
                  size={13}
                  aria-hidden="true"
                />
                Default Address
              </span>
            )}
          </div>

          <p className="mt-3 text-xl font-semibold text-[#7A1F2B]">
            {address.fullName}
          </p>
        </div>
      </div>

      {/* =====================================
          Address Details
      ===================================== */}

      <div className="mt-6 rounded-xl bg-[#FDFBF7] p-3.5 sm:p-5">
        <div className="space-y-1.5 text-gray-700">
          <p className="font-medium">
            {address.houseNumber}
          </p>

          <p>{address.area}</p>

          {address.landmark && (
            <p>
              <span className="font-medium">
                Landmark:
              </span>{" "}
              {address.landmark}
            </p>
          )}

          <p>
            {address.city}
            {address.district ? `, ${address.district}` : ""}, {address.state}
          </p>

          <p>{address.country}</p>

          <p>
            <span className="font-medium">
              Pincode:
            </span>{" "}
            {address.pincode}
          </p>
        </div>

        {/* =====================================
            Mobile
        ===================================== */}

        <div className="mt-4 flex items-center gap-2 border-t border-gray-200 pt-4 text-gray-700">
          <Phone
            size={17}
            className="text-[#7A1F2B]"
            aria-hidden="true"
          />

          <span className="font-medium">
            {address.mobile}
          </span>
        </div>
      </div>

      {/* =====================================
          Actions
      ===================================== */}

      <div className="mt-6 flex flex-wrap gap-3">
        {/* Edit */}

        <button
          type="button"
          onClick={() => onEdit(address)}
          aria-label={`Edit ${address.addressType} address`}
          className="flex items-center gap-2 rounded-lg border border-[#7A1F2B] px-4 py-2.5 font-medium text-[#7A1F2B] transition hover:bg-[#7A1F2B] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2"
        >
          <Pencil
            size={16}
            aria-hidden="true"
          />

          Edit
        </button>

        {/* Delete */}

        <button
          type="button"
          onClick={() => onDelete(address._id)}
          aria-label={`Delete ${address.addressType} address`}
          className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 font-medium text-red-600 transition hover:bg-red-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
        >
          <Trash2
            size={16}
            aria-hidden="true"
          />

          Delete
        </button>

        {/* Set Default */}

        {!address.isDefault && (
          <button
            type="button"
            onClick={() =>
              onSetDefault(address._id)
            }
            aria-label={`Set ${address.addressType} address as default`}
            className="flex items-center gap-2 rounded-lg bg-[#7A1F2B] px-4 py-2.5 font-medium text-white transition hover:bg-[#651923] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2"
          >
            <CheckCircle
              size={16}
              aria-hidden="true"
            />

            Set Default
          </button>
        )}
      </div>
    </div>
  );
}