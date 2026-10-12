"use client";

import React from "react";
import { Check } from "lucide-react";

export interface StepperProgressProps {
  currentStep?: number;
}

export function StepperProgress({ currentStep = 2 }: StepperProgressProps) {
  const steps = [
    { number: 1, label: "Cart" },
    { number: 2, label: "Address" },
    { number: 3, label: "Payment" },
    { number: 4, label: "Confirmation" },
  ];

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        {/* Connector Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-200 z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#231F20] z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isDone = step.number < currentStep;
          const isActive = step.number === currentStep;

          return (
            <div
              key={step.number}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all shadow-xs ${
                  isDone
                    ? "bg-[#231F20] text-white"
                    : isActive
                    ? "bg-[#231F20] text-white ring-4 ring-gray-100"
                    : "bg-white border-2 border-gray-300 text-gray-400"
                }`}
              >
                {isDone ? <Check size={14} strokeWidth={3} /> : step.number}
              </div>
              <span
                className={`mt-2 text-[11px] sm:text-xs font-bold tracking-wider uppercase ${
                  isActive || isDone ? "text-[#231F20]" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface CircularProgressProps {
  percentage?: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({
  percentage = 75,
  label = "Processing your order...",
  size = 110,
  strokeWidth = 9,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F3EAD8"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#D4AF37"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute font-serif text-xl sm:text-2xl font-extrabold text-[#231F20]">
          {percentage}%
        </span>
      </div>
      {label && (
        <span className="mt-3 text-xs sm:text-sm font-medium text-gray-600">
          {label}
        </span>
      )}
    </div>
  );
}
