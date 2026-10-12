"use client";

type Props = {
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
};

export default function PriceFilter({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: Props) {
  return (
    <div className="mb-8">
      <h3 className="mb-3 text-lg font-semibold text-[#7A1F2B]">
        Price Range
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="min-price"
            className="sr-only"
          >
            Minimum price
          </label>

          <input
            id="min-price"
            name="minPrice"
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) =>
              onMinPriceChange(
                e.target.value
              )
            }
            aria-label="Minimum price"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 transition focus:border-[#7A1F2B] focus:outline-none focus:ring-2 focus:ring-[#7A1F2B]/20"
          />
        </div>

        <div>
          <label
            htmlFor="max-price"
            className="sr-only"
          >
            Maximum price
          </label>

          <input
            id="max-price"
            name="maxPrice"
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) =>
              onMaxPriceChange(
                e.target.value
              )
            }
            aria-label="Maximum price"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 transition focus:border-[#7A1F2B] focus:outline-none focus:ring-2 focus:ring-[#7A1F2B]/20"
          />
        </div>
      </div>
    </div>
  );
}