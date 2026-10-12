"use client";

import ReviewCard from "./ReviewCard";

type Review = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
  };
};

type Props = {
  reviews: Review[];
};

export default function ReviewList({
  reviews,
}: Props) {
  return (
    <section
      className="mt-10"
      aria-labelledby="customer-reviews-heading"
    >
      <h2
        id="customer-reviews-heading"
        className="mb-6 text-2xl font-bold"
      >
        Customer Reviews
      </h2>

      {reviews.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center">
          <p className="text-gray-500">
            No reviews yet.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
            />
          ))}
        </div>
      )}
    </section>
  );
}