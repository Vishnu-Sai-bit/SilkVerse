"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
} from "lucide-react";

export type AlertType = "success" | "warning" | "error" | "info";

export interface AlertProps {
  type: AlertType;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export default function Alert({
  type,
  message,
  onDismiss,
  className = "",
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  let containerStyles = "flex items-center justify-between gap-3 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm font-medium border shadow-2xs transition-all";
  let icon = null;

  switch (type) {
    case "success":
      containerStyles += " bg-[#EBF7EE] border-[#B7E5C3] text-[#1E3D2F]";
      icon = <CheckCircle2 size={18} className="text-[#1E3D2F] shrink-0" />;
      break;
    case "warning":
      containerStyles += " bg-[#FFF9E6] border-[#FBE599] text-[#78350F]";
      icon = <AlertTriangle size={18} className="text-[#B45309] shrink-0" />;
      break;
    case "error":
      containerStyles += " bg-[#FDF2F2] border-[#F8B4B4] text-[#771D1D]";
      icon = <AlertCircle size={18} className="text-[#991B1B] shrink-0" />;
      break;
    case "info":
      containerStyles += " bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]";
      icon = <Info size={18} className="text-[#2563EB] shrink-0" />;
      break;
  }

  return (
    <div className={`${containerStyles} ${className}`}>
      <div className="flex items-center gap-3 min-w-0">
        {icon}
        <span className="leading-snug">{message}</span>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 p-1 text-gray-500 hover:text-gray-900 rounded transition cursor-pointer"
        aria-label="Dismiss alert"
      >
        <X size={15} />
      </button>
    </div>
  );
}
