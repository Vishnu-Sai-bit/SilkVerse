export default function AdminTableSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-white p-6 shadow">
      <div className="mb-6 h-8 w-48 rounded bg-gray-200" />

      {[1, 2, 3, 4, 5].map((row) => (
        <div
          key={row}
          className="mb-4 grid grid-cols-6 gap-4"
        >
          {[1, 2, 3, 4, 5, 6].map((col) => (
            <div
              key={col}
              className="h-10 rounded bg-gray-200"
            />
          ))}
        </div>
      ))}
    </div>
  );
}