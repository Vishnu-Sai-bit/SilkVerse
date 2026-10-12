"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReviewsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/account/reviews");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-xs text-stone-500">
      Loading your reviews...
    </div>
  );
}
