"use client";

import { useState } from "react";
import { toast } from "sonner";

type Props = {
  onSubmit: (
    rating: number,
    comment: string
  ) => Promise<void>;

  buttonText?: string;
};

export default function ReviewForm({
  onSubmit,
  buttonText = "Submit Review",
}: Props) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const isSubmitting =
    buttonText !== "Submit Review";

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (rating === 0) {
      toast.error(
        "Please select a rating."
      );
      return;
    }

    const trimmedComment =
      comment.trim();

    if (!trimmedComment) {
      toast.error(
        "Please enter a review."
      );
      return;
    }

    if (trimmedComment.length > 1000) {
      toast.error(
        "Review cannot exceed 1000 characters."
      );
      return;
    }

    try {
      await onSubmit(
        rating,
        trimmedComment
      );

      setRating(0);
      setHoverRating(0);
      setComment("");
    } catch {
      // ReviewSection handles the error.
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-6 text-2xl font-bold text-[#7A1F2B]">
        Write a Review
      </h2>

      {/* Rating */}
      <div className="mb-6">
        <p
          id="review-rating-label"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Rating
        </p>

        <div
          className="flex items-center gap-1"
          role="group"
          aria-labelledby="review-rating-label"
          onMouseLeave={() =>
            setHoverRating(0)
          }
        >
          {[1, 2, 3, 4, 5].map(
            (star) => {
              const activeRating =
                hoverRating || rating;

              const isActive =
                star <= activeRating;

              return (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setRating(star)
                  }
                  onMouseEnter={() =>
                    setHoverRating(star)
                  }
                  disabled={isSubmitting}
                  aria-label={`Rate ${star} out of 5`}
                  aria-pressed={
                    rating === star
                  }
                  className="rounded text-4xl leading-none transition-transform duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#7A1F2B]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span
                    className={
                      isActive
                        ? "text-[#C9A227]"
                        : "text-gray-300"
                    }
                    aria-hidden="true"
                  >
                    ★
                  </span>
                </button>
              );
            }
          )}
        </div>

        {rating > 0 && (
          <p
            className="mt-2 text-sm font-medium text-gray-600"
            aria-live="polite"
          >
            {rating} out of 5
          </p>
        )}
      </div>

      {/* Review */}
      <div className="mb-5">
        <label
          htmlFor="review-comment"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Your Review
        </label>

        <textarea
          id="review-comment"
          name="review"
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          placeholder="Share your experience with this product..."
          maxLength={1000}
          rows={5}
          disabled={isSubmitting}
          aria-describedby="review-character-count"
          className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-base sm:text-sm text-gray-800 outline-none transition focus:border-[#7A1F2B] focus:ring-2 focus:ring-[#7A1F2B]/20 disabled:cursor-not-allowed disabled:bg-gray-50"
        />

        <div
          id="review-character-count"
          className="mt-1 text-right text-sm text-gray-500"
          aria-live="polite"
        >
          {comment.length}/1000
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-[#7A1F2B] px-6 py-3 font-semibold text-white transition hover:bg-[#641923] focus:outline-none focus:ring-2 focus:ring-[#7A1F2B] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {buttonText}
      </button>
    </form>
  );
}