export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16 animate-pulse">

      {/* Breadcrumb Skeleton */}
      <div className="mb-8 h-5 w-64 rounded bg-gray-200" />

      {/* Product Main Section */}
      <div className="grid items-start gap-16 lg:grid-cols-2">

        {/* Gallery */}
        <div className="flex gap-6">

          {/* Thumbnails */}
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-24 w-20 rounded-xl bg-gray-200"
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="aspect-[4/5] flex-1 rounded-3xl bg-gray-200" />
        </div>

        {/* Product Details */}
        <div>

          {/* Category */}
          <div className="h-4 w-32 rounded bg-gray-200" />

          {/* Name */}
          <div className="mt-4 h-12 w-4/5 rounded bg-gray-200" />

          <div className="mt-3 h-12 w-3/5 rounded bg-gray-200" />

          {/* Rating */}
          <div className="mt-6 h-6 w-48 rounded bg-gray-200" />

          {/* Price */}
          <div className="mt-7 h-10 w-40 rounded bg-gray-200" />

          {/* Description */}
          <div className="mt-8 space-y-3">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-4/5 rounded bg-gray-200" />
            <div className="h-4 w-3/5 rounded bg-gray-200" />
          </div>

          {/* Stock */}
          <div className="mt-10 rounded-2xl border p-6">
            <div className="space-y-4">
              <div className="h-5 w-40 rounded bg-gray-200" />
              <div className="h-5 w-48 rounded bg-gray-200" />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <div className="h-12 w-40 rounded-xl bg-gray-200" />
            <div className="h-12 w-40 rounded-xl bg-gray-200" />
          </div>

        </div>
      </div>

      {/* Delivery Information */}
      <div className="mt-12 rounded-2xl border p-6">
        <div className="mb-5 h-7 w-56 rounded bg-gray-200" />

        <div className="space-y-3">
          <div className="h-5 w-64 rounded bg-gray-200" />
          <div className="h-5 w-56 rounded bg-gray-200" />
          <div className="h-5 w-48 rounded bg-gray-200" />
          <div className="h-5 w-60 rounded bg-gray-200" />
        </div>
      </div>

      {/* Specifications */}
      <div className="mt-8 rounded-2xl border p-6">
        <div className="mb-6 h-7 w-64 rounded bg-gray-200" />

        <div className="grid gap-5 sm:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-5 w-48 rounded bg-gray-200"
            />
          ))}
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-20">
        <div className="h-8 w-56 rounded bg-gray-200" />

        <div className="mt-8 space-y-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-xl border p-5"
            >
              <div className="h-5 w-40 rounded bg-gray-200" />
              <div className="mt-3 h-4 w-24 rounded bg-gray-200" />
              <div className="mt-5 space-y-2">
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-4/5 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}