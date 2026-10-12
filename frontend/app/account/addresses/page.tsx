"use client";

import AddressList from "@/components/address/AddressList";
import { MapPin } from "lucide-react";

export default function AddressesPage() {
  return (
    <div className="space-y-8">
      {/* =====================================
          Page Header
      ===================================== */}

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
          Address Book
        </p>

        <div className="mt-2 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F2E8D6] border border-[#D4AF37]/40">
            <MapPin
              className="text-[#7A1020]"
              size={26}
            />
          </div>

          <div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#7A1020]">
              My Addresses
            </h1>

            <p className="mt-1 text-sm text-[#3B2F2F]/80">
              Manage your delivery addresses for faster checkout.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================
          Address List
      ===================================== */}

      <AddressList />
    </div>
  );
}