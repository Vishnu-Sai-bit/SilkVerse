"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border bg-white px-6 py-20 text-center shadow-sm">

      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-pink-100">
        <ShoppingBag
          size={50}
          className="text-pink-600"
        />
      </div>

      <h2 className="mb-3 text-3xl font-bold">
        Your cart is empty
      </h2>

      <p className="mb-8 max-w-md text-gray-600">
        Looks like you haven't added any beautiful silk
        sarees yet. Explore our exclusive collection and
        find your perfect match.
      </p>

      <Link
        href="/products"
        className="rounded-xl bg-pink-600 px-8 py-3 font-semibold text-white transition hover:bg-pink-700"
      >
        Continue Shopping
      </Link>
    </div>
  );
}