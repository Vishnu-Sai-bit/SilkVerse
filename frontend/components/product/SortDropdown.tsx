"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const sortOptions = [
  {
    label: "Newest",
    value: "newest",
  },
  {
    label: "Price: Low to High",
    value: "priceAsc",
  },
  {
    label: "Price: High to Low",
    value: "priceDesc",
  },
  {
    label: "Highest Rated",
    value: "rating",
  },
];

export default function SortDropdown({
  value,
  onChange,
}: Props) {
  return (
    <div className="mb-8">
      <label
        htmlFor="sort-filter"
        className="mb-3 block text-lg font-semibold text-[#7A1F2B]"
      >
        Sort By
      </label>

      <select
        id="sort-filter"
        name="sort"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        aria-label="Sort products"
        className="w-full rounded-xl border border-gray-300 px-4 py-3 transition focus:border-[#7A1F2B] focus:outline-none focus:ring-2 focus:ring-[#7A1F2B]/20"
      >
        {sortOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}