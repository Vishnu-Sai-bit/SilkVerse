export default function ProductDetailsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid gap-16 lg:grid-cols-2">
        <div className="h-[650px] rounded-3xl bg-gray-200" />

        <div className="space-y-6">
          <div className="h-5 w-28 rounded bg-gray-200" />

          <div className="h-12 w-3/4 rounded bg-gray-200" />

          <div className="h-6 w-40 rounded bg-gray-200" />

          <div className="h-10 w-32 rounded bg-gray-200" />

          <div className="space-y-2">
            <div className="h-4 rounded bg-gray-200" />
            <div className="h-4 rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
          </div>

          <div className="h-52 rounded-2xl bg-gray-200" />

          <div className="h-14 rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}