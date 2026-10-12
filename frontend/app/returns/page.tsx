"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReturnsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/account/returns");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-xs text-stone-500">
      Redirecting to Returns &amp; Refunds...
    </div>
  );
}
