"use client";

type StarRatingProps = {
  rating: number;
  size?: number;
};

export default function StarRating({
  rating,
  size = 20,
}: StarRatingProps) {
  const safeRating = Math.min(
    Math.max(Number(rating) || 0, 0),
    5
  );

  const roundedRating = Math.round(
    safeRating
  );

  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`${safeRating.toFixed(
        1
      )} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: `${size}px`,
          }}
          className={
            star <= roundedRating
              ? "text-[#C9A227]"
              : "text-gray-300"
          }
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}