"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export default function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
}: QuickActionCardProps) {
  return (
    <Link href={href}>
      <div className="rounded-xl border bg-white p-6 shadow-md transition hover:shadow-xl hover:-translate-y-1">
        <div className="mb-4">
          <Icon
            size={34}
            className="text-[#7A1F2B]"
          />
        </div>

        <h3 className="text-xl font-semibold">
          {title}
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          {description}
        </p>
      </div>
    </Link>
  );
}