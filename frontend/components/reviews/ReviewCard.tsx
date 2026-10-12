"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import StarRating from "./StarRating";

import {
  deleteReview,
  updateReview,
} from "@/services/api";

import { useAuth } from "@/context/AuthContext";

type Review = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user:
    | {
        _id?: string;
        id?: string;
        name?: string;
      }
    | null;
};

type Props = {
  review: Review;
};

export default function ReviewCard({
  review,
}: Props) {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [rating, setRating] =
    useState(review.rating);

  const [hoverRating, setHoverRating] =
    useState(0);

  const [comment, setComment] =
    useState(review.comment);

  const reviewUserId =
    review.user?._id ??
    review.user?.id ??
    "";

  const currentUserId =
    user?.id ??
    "";

  const isOwner =
    Boolean(
      currentUserId &&
        reviewUserId &&
        String(currentUserId) ===
          String(reviewUserId)
    );

  async function handleDelete() {
    if (loading) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this review?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem(
          "silkverse-token"
        );

      if (!token) {
        toast.error(
          "Please login to delete your review."
        );
        return;
      }

      await deleteReview(
        token,
        review._id
      );

      toast.success(
        "Review deleted successfully."
      );

      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete review."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (loading) {
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
      setLoading(true);

      const token =
        localStorage.getItem(
          "silkverse-token"
        );

      if (!token) {
        toast.error(
          "Please login to update your review."
        );
        return;
      }

      await updateReview(
        token,
        review._id,
        {
          rating,
          comment: trimmedComment,
        }
      );

      toast.success(
        "Review updated successfully."
      );

      setEditing(false);
      setHoverRating(0);

      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update review."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleEdit() {
    if (loading) {
      return;
    }

    setRating(review.rating);
    setComment(review.comment);
    setHoverRating(0);
    setEditing(true);
  }

  function handleCancel() {
    if (loading) {
      return;
    }

    setEditing(false);
    setRating(review.rating);
    setComment(review.comment);
    setHoverRating(0);
  }

  const formattedDate =
    review.createdAt
      ? new Date(
          review.createdAt
        ).toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        )
      : "";

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {review.user?.name ||
              "Customer"}
          </h3>

          {formattedDate && (
            <p className="text-sm text-gray-500">
              {formattedDate}
            </p>
          )}
        </div>

        {!editing && (
          <StarRating
            rating={review.rating}
          />
        )}
      </div>

      {/* Review Content */}
      {editing ? (
        <div className="mt-5 space-y-5">
          {/* Rating */}
          <div>
            <p
              id={`rating-label-${review._id}`}
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Rating
            </p>

            <div
              className="flex items-center gap-1"
              role="group"
              aria-labelledby={`rating-label-${review._id}`}
              onMouseLeave={() =>
                setHoverRating(0)
              }
            >
              {[1, 2, 3, 4, 5].map(
                (star) => {
                  const activeRating =
                    hoverRating ||
                    rating;

                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setRating(star)
                      }
                      onMouseEnter={() =>
                        setHoverRating(
                          star
                        )
                      }
                      disabled={loading}
                      aria-label={`Rate ${star} out of 5`}
                      aria-pressed={
                        rating === star
                      }
                      className="rounded text-4xl leading-none transition-transform duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#7A1F2B]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span
                        className={
                          star <=
                          activeRating
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

          {/* Comment */}
          <div>
            <label
              htmlFor={`review-${review._id}`}
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Your Review
            </label>

            <textarea
              id={`review-${review._id}`}
              name={`review-${review._id}`}
              rows={4}
              maxLength={1000}
              value={comment}
              disabled={loading}
              onChange={(e) =>
                setComment(
                  e.target.value
                )
              }
              aria-describedby={`review-count-${review._id}`}
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-base sm:text-sm text-gray-800 outline-none transition focus:border-[#7A1F2B] focus:ring-2 focus:ring-[#7A1F2B]/20 disabled:cursor-not-allowed disabled:bg-gray-50"
            />

            <div
              id={`review-count-${review._id}`}
              className="mt-1 text-right text-sm text-gray-500"
              aria-live="polite"
            >
              {comment.length}/1000
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleUpdate}
              disabled={loading}
              className="rounded-lg bg-green-600 px-5 py-2 font-medium text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-5 py-2 font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7A1F2B] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Comment */}
          <p className="mt-4 whitespace-pre-wrap leading-7 text-gray-700">
            {review.comment}
          </p>

          {/* Edit/Delete */}
          {isOwner && (
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleEdit}
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          )}
        </>
      )}
    </article>
  );
}