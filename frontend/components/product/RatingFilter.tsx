"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const ratings = [
  {
    label: "All Ratings",
    value: "",
  },
  {
    label: "★★★★★ & Up",
    value: "5",
  },
  {
    label: "★★★★☆ & Up",
    value: "4",
  },
  {
    label: "★★★☆☆ & Up",
    value: "3",
  },
  {
    label: "★★☆☆☆ & Up",
    value: "2",
  },
  {
    label: "★☆☆☆☆ & Up",
    value: "1",
  },
];

export default function RatingFilter({
  value,
  onChange,
}: Props) {
  return (
    <div className="mb-8">
      <label
        htmlFor="rating-filter"
        className="mb-3 block text-lg font-semibold text-[#7A1F2B]"
      >
        Minimum Rating
      </label>

      <select
        id="rating-filter"
        name="rating"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        aria-label="Filter products by minimum rating"
        className="w-full rounded-xl border border-gray-300 px-4 py-3 transition focus:border-[#7A1F2B] focus:outline-none focus:ring-2 focus:ring-[#7A1F2B]/20"
      >
        {ratings.map((rating) => (
          <option
            key={rating.value}
            value={rating.value}
          >
            {rating.label}
          </option>
        ))}
      </select>
    </div>
  );
}