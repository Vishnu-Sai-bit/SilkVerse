"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const categories = [
  "All",
  "Kanchipuram",
  "Banarasi",
  "Mysore",
  "Soft Silk",
  "Bridal",
  "Dharmavaram",
  "Traditional",
  "Organza",
  "Tussar",
];

export default function CategoryFilter({
  value,
  onChange,
}: Props) {
  return (
    <div className="mb-8">
      <label
        htmlFor="category-filter"
        className="mb-3 block text-lg font-semibold text-[#7A1F2B]"
      >
        Category
      </label>

      <select
        id="category-filter"
        name="category"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        aria-label="Filter products by category"
        className="w-full rounded-xl border border-gray-300 px-4 py-3 transition focus:border-[#7A1F2B] focus:outline-none focus:ring-2 focus:ring-[#7A1F2B]/20"
      >
        {categories.map((category) => (
          <option
            key={category}
            value={
              category === "All"
                ? ""
                : category
            }
          >
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}