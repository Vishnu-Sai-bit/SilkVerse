import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
}: StatsCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md border hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-[#7A1F2B]">
            {value}
          </h2>
        </div>

        <div className="rounded-full bg-[#FDF4E8] p-4">
          <Icon
            size={30}
            className="text-[#7A1F2B]"
          />
        </div>
      </div>
    </div>
  );
}