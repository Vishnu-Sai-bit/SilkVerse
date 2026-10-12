export default function ProductNotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">

        <div className="mb-6 text-7xl">
          🧵
        </div>

        <h1 className="text-4xl font-bold text-[#7A1F2B]">
          Product Not Found
        </h1>

        <p className="mt-4 max-w-md text-gray-600">
          Sorry, we couldn't find the saree you're
          looking for. It may have been removed or
          the product link may be invalid.
        </p>

        <a
          href="/collections"
          className="mt-8 inline-block rounded-xl bg-[#7A1F2B] px-6 py-3 font-semibold text-white transition hover:bg-[#641923]"
        >
          Continue Shopping
        </a>

      </div>
    </main>
  );
}