"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <div className="mb-8">
      <label
        htmlFor="product-search"
        className="sr-only"
      >
        Search silk sarees
      </label>

      <input
        id="product-search"
        name="search"
        type="search"
        placeholder="Search silk sarees..."
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        autoComplete="off"
        aria-label="Search silk sarees"
        className="w-full rounded-xl border border-gray-300 px-5 py-3 text-lg outline-none transition focus:border-[#7A1F2B] focus:ring-2 focus:ring-[#7A1F2B]/20"
      />
    </div>
  );
}