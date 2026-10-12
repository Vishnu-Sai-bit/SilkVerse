export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border bg-white shadow">
      <div className="h-80 bg-gray-200" />

      <div className="space-y-4 p-6">
        <div className="h-4 w-20 rounded bg-gray-200" />

        <div className="h-7 w-3/4 rounded bg-gray-200" />

        <div className="h-4 w-40 rounded bg-gray-200" />

        <div className="h-6 w-28 rounded bg-gray-200" />

        <div className="h-5 w-24 rounded bg-gray-200" />

        <div className="h-12 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}