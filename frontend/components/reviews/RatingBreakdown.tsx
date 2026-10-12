"use client";

import StarRating from "./StarRating";

type Props = {
  averageRating: number;
  totalReviews: number;
  ratings: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
};

export default function RatingBreakdown({
  averageRating,
  totalReviews,
  ratings,
}: Props) {
  const safeAverageRating = Math.min(
    Math.max(Number(averageRating) || 0, 0),
    5
  );

  const safeTotalReviews = Math.max(
    Number(totalReviews) || 0,
    0
  );

  function getPercentage(star: number, count: number) {
    if (safeTotalReviews === 0) {
      if (safeAverageRating <= 0) return 0;
      const fiveStarPct = Math.min(
        Math.max(Math.round((safeAverageRating - 4) * 100), 0),
        100
      );
      if (star === 5) return fiveStarPct;
      if (star === 4) return 100 - fiveStarPct;
      return 0;
    }

    const safeCount = Math.max(
      Number(count) || 0,
      0
    );

    return Math.min(
      Math.round(
        (safeCount / safeTotalReviews) * 100
      ),
      100
    );
  }

  return (
    <section
      className="rounded-2xl border bg-white p-6 shadow-sm"
      aria-labelledby="customer-rating-heading"
    >
      <h2
        id="customer-rating-heading"
        className="mb-6 text-2xl font-bold text-gray-900"
      >
        Customer Rating
      </h2>

      {/* Overall Rating */}
      <div className="mb-8 flex items-center gap-4">
        <span
          className="text-5xl font-bold text-[#7A1F2B]"
          aria-label={`Average rating ${safeAverageRating.toFixed(
            1
          )} out of 5`}
        >
          {safeAverageRating.toFixed(1)}
        </span>

        <div>
          <StarRating
            rating={safeAverageRating}
          />

          <p className="mt-1 text-sm text-gray-500">
            {safeTotalReviews > 0
              ? `${safeTotalReviews} ${
                  safeTotalReviews === 1
                    ? "Review"
                    : "Reviews"
                }`
              : "Star Rating (4★ – 5★)"}
          </p>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="space-y-4">
        {[5, 4, 3, 2, 1].map((star) => {
          const count =
            ratings[
              star as keyof typeof ratings
            ] ?? 0;

          const safeCount = Math.max(
            Number(count) || 0,
            0
          );

          const percentage =
            getPercentage(star, safeCount);

          return (
            <div
              key={star}
              className="flex items-center gap-4"
            >
              <span className="w-10 shrink-0 text-sm font-medium text-gray-700">
                {star} ★
              </span>

              <div
                className="h-3 flex-1 overflow-hidden rounded-full bg-gray-200"
                role="progressbar"
                aria-label={`${star} star ratings`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percentage}
                aria-valuetext={`${percentage}% of reviews are ${star} star ratings`}
              >
                <div
                  className="h-full rounded-full bg-[#C9A227] transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>

              <span className="w-12 shrink-0 text-right text-sm text-gray-600">
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}