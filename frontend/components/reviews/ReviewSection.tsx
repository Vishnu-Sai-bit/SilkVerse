"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ReviewForm from "./ReviewForm";
import { createReview } from "@/services/api";

type Props = {
  productId: string;
};

export default function ReviewSection({
  productId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    rating: number,
    comment: string
  ) {
    if (loading) {
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
          "Please login to submit a review."
        );

        router.push(
          `/login?redirect=/products/${productId}`
        );

        return;
      }

      await createReview(token, {
        productId,
        rating,
        comment,
      });

      toast.success(
        "Review submitted successfully."
      );

      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit review."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      aria-label="Submit a product review"
    >
      <ReviewForm
        onSubmit={handleSubmit}
        buttonText={
          loading
            ? "Submitting..."
            : "Submit Review"
        }
      />
    </section>
  );
}