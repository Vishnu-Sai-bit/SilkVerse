"use client";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const safeCurrentPage = Math.min(
    Math.max(currentPage, 1),
    totalPages
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    if (page === safeCurrentPage) {
      return;
    }

    onPageChange(page);
  };

  return (
    <nav
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
      aria-label="Product pagination"
    >
      {/* Previous */}

      <button
        type="button"
        onClick={() =>
          handlePageChange(safeCurrentPage - 1)
        }
        disabled={safeCurrentPage === 1}
        aria-label="Go to previous page"
        className="rounded-lg border px-4 py-2 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7A1F2B] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
      >
        Previous
      </button>

      {/* Page Numbers */}

      <div
        className="flex flex-wrap items-center justify-center gap-2"
        aria-label="Page numbers"
      >
        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((page) => {
          const isCurrent =
            safeCurrentPage === page;

          return (
            <button
              key={page}
              type="button"
              onClick={() =>
                handlePageChange(page)
              }
              aria-label={`Go to page ${page}`}
              aria-current={
                isCurrent ? "page" : undefined
              }
              className={`min-w-10 rounded-lg px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-[#7A1F2B] focus:ring-offset-2 ${
                isCurrent
                  ? "bg-[#7A1F2B] text-white"
                  : "border hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next */}

      <button
        type="button"
        onClick={() =>
          handlePageChange(safeCurrentPage + 1)
        }
        disabled={
          safeCurrentPage === totalPages
        }
        aria-label="Go to next page"
        className="rounded-lg border px-4 py-2 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7A1F2B] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
      >
        Next
      </button>
    </nav>
  );
}