"use client";

import { useEffect } from "react";

type Props = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ProductError({
  error,
  reset,
}: Props) {
  useEffect(() => {
    console.error(
      "Product page error:",
      error
    );
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-lg text-center">

        <div className="mb-6 text-7xl">
          ⚠️
        </div>

        <h1 className="text-4xl font-bold text-[#7A1F2B]">
          Something Went Wrong
        </h1>

        <p className="mt-4 text-gray-600">
          We couldn't load this product right now.
          Please try again.
        </p>

        <div className="mt-8 flex justify-center gap-4">

          <button
            type="button"
            onClick={() => reset()}
            className="rounded-xl bg-[#7A1F2B] px-6 py-3 font-semibold text-white transition hover:bg-[#641923]"
          >
            Try Again
          </button>

          <a
            href="/collections"
            className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Continue Shopping
          </a>

        </div>

      </div>
    </main>
  );
}