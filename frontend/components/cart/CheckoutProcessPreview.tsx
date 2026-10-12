"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Truck,
  MapPin,
  FileText,
  Lock,
  Building2,
  Wallet,
  Banknote,
  QrCode,
} from "lucide-react";

export default function CheckoutProcessPreview() {
  const [activeStep, setActiveStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const STEPS = [
    { num: 1, label: "CART" },
    { num: 2, label: "ADDRESS" },
    { num: 3, label: "SHIPPING" },
    { num: 4, label: "PAYMENT" },
    { num: 5, label: "CONFIRMATION" },
  ];

  return (
    <section className="mt-14 rounded-2xl border border-stone-200/90 bg-[#FAF8F5] p-6 sm:p-8 shadow-xs">
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-[#2D2A26] uppercase">
          CHECKOUT PROCESS
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-stone-500">
          A simple, secure 5-step journey from selection to doorstep delivery
        </p>
      </div>

      {/* 5-Step Stepper Bar (Page 08) */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-between">
          {STEPS.map((step, idx) => {
            const isCompleted = activeStep > step.num;
            const isActive = activeStep === step.num;

            return (
              <div key={step.num} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  onClick={() => setActiveStep(step.num)}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div
                    className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#6D001A] text-white ring-4 ring-[#6D001A]/15 shadow-sm"
                        : isCompleted
                        ? "bg-[#D4AF37] text-white"
                        : "bg-white border border-stone-300 text-stone-500 group-hover:border-stone-400"
                    }`}
                  >
                    {isCompleted ? "✓" : step.num}
                  </div>
                  <span
                    className={`mt-1.5 text-[10px] sm:text-xs font-bold tracking-wider uppercase ${
                      isActive
                        ? "text-[#6D001A]"
                        : isCompleted
                        ? "text-stone-800"
                        : "text-stone-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </button>

                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 sm:mx-3 transition-colors ${
                      activeStep > step.num ? "bg-[#D4AF37]" : "bg-stone-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5 Multi-Step Cards Grid / Carousel (Page 08) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-stretch">
        {/* Card 1: 1. ADDRESS */}
        <div
          className={`flex flex-col justify-between rounded-xl border p-4 bg-white shadow-2xs transition ${
            activeStep === 2
              ? "border-[#6D001A] ring-2 ring-[#6D001A]/20"
              : "border-stone-200"
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5 border-b border-stone-100 pb-2 mb-3">
              <MapPin size={15} className="text-[#C98A2C]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2A26]">
                1. ADDRESS
              </h3>
            </div>
            <div className="space-y-2 text-left">
              <div>
                <span className="block text-[10px] text-stone-400 uppercase font-semibold">Full Name</span>
                <input
                  type="text"
                  readOnly
                  value="Ananya Sharma"
                  className="w-full text-xs font-medium text-stone-800 bg-stone-50 border border-stone-200 rounded px-2 py-1"
                />
              </div>
              <div>
                <span className="block text-[10px] text-stone-400 uppercase font-semibold">Mobile Number</span>
                <input
                  type="text"
                  readOnly
                  value="+91 98765 43210"
                  className="w-full text-xs font-medium text-stone-800 bg-stone-50 border border-stone-200 rounded px-2 py-1"
                />
              </div>
              <div>
                <span className="block text-[10px] text-stone-400 uppercase font-semibold">Address</span>
                <textarea
                  rows={2}
                  readOnly
                  value="123, Heritage Lane, T. Nagar, Chennai"
                  className="w-full text-xs font-medium text-stone-800 bg-stone-50 border border-stone-200 rounded px-2 py-1 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <span className="block text-[10px] text-stone-400 uppercase font-semibold">City</span>
                  <input
                    type="text"
                    readOnly
                    value="Chennai"
                    className="w-full text-xs font-medium text-stone-800 bg-stone-50 border border-stone-200 rounded px-2 py-1"
                  />
                </div>
                <div>
                  <span className="block text-[10px] text-stone-400 uppercase font-semibold">Pincode</span>
                  <input
                    type="text"
                    readOnly
                    value="600017"
                    className="w-full text-xs font-medium text-stone-800 bg-stone-50 border border-stone-200 rounded px-2 py-1"
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className="mt-4 w-full rounded-md bg-[#6D001A] py-2 text-[11px] font-bold text-white uppercase tracking-wider hover:bg-[#520013] transition"
          >
            SAVE & CONTINUE
          </button>
        </div>

        {/* Card 2: 2. SHIPPING */}
        <div
          className={`flex flex-col justify-between rounded-xl border p-4 bg-white shadow-2xs transition ${
            activeStep === 3
              ? "border-[#6D001A] ring-2 ring-[#6D001A]/20"
              : "border-stone-200"
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5 border-b border-stone-100 pb-2 mb-3">
              <Truck size={15} className="text-[#C98A2C]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2A26]">
                2. SHIPPING
              </h3>
            </div>
            <div className="text-left space-y-2.5">
              <div>
                <span className="block text-[10px] text-stone-400 uppercase font-semibold">Deliver To</span>
                <p className="text-[11px] text-stone-700 leading-snug bg-stone-50 p-2 rounded border border-stone-200">
                  123, Heritage Lane, T. Nagar, Chennai, Tamil Nadu - 600017
                </p>
              </div>

              <div>
                <span className="block text-[10px] text-stone-400 uppercase font-semibold mb-1.5">
                  Shipping Method
                </span>
                <div className="space-y-1.5">
                  <label
                    onClick={() => setShippingMethod("standard")}
                    className={`flex items-center justify-between p-2 rounded border cursor-pointer text-xs ${
                      shippingMethod === "standard"
                        ? "border-[#6D001A] bg-stone-50 text-[#6D001A]"
                        : "border-stone-200 text-stone-700"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                        className="accent-[#6D001A]"
                      />
                      <span className="text-[11px] font-semibold">Standard Delivery (3-5 Days)</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700">FREE</span>
                  </label>

                  <label
                    onClick={() => setShippingMethod("express")}
                    className={`flex items-center justify-between p-2 rounded border cursor-pointer text-xs ${
                      shippingMethod === "express"
                        ? "border-[#6D001A] bg-stone-50 text-[#6D001A]"
                        : "border-stone-200 text-stone-700"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        checked={shippingMethod === "express"}
                        onChange={() => setShippingMethod("express")}
                        className="accent-[#6D001A]"
                      />
                      <span className="text-[11px] font-semibold">Express Delivery (1-2 Days)</span>
                    </div>
                    <span className="text-[11px] font-bold text-stone-800">₹199</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveStep(4)}
            className="mt-4 w-full rounded-md bg-[#6D001A] py-2 text-[11px] font-bold text-white uppercase tracking-wider hover:bg-[#520013] transition"
          >
            CONTINUE TO PAYMENT
          </button>
        </div>

        {/* Card 3: 3. PAYMENT */}
        <div
          className={`flex flex-col justify-between rounded-xl border p-4 bg-white shadow-2xs transition ${
            activeStep === 4
              ? "border-[#6D001A] ring-2 ring-[#6D001A]/20"
              : "border-stone-200"
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5 border-b border-stone-100 pb-2 mb-3">
              <CreditCard size={15} className="text-[#C98A2C]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2A26]">
                3. PAYMENT
              </h3>
            </div>
            <div className="text-left space-y-1.5">
              <span className="block text-[10px] text-stone-400 uppercase font-semibold mb-1">
                Choose a Payment Method
              </span>

              <label
                onClick={() => setPaymentMethod("upi")}
                className={`flex items-center justify-between p-1.5 rounded border cursor-pointer text-xs ${
                  paymentMethod === "upi" ? "border-[#6D001A] bg-stone-50" : "border-stone-200"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <input type="radio" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} className="accent-[#6D001A]" />
                  <span className="text-[11px] font-medium">UPI / QR Code</span>
                </div>
                <QrCode size={14} className="text-[#C98A2C]" />
              </label>

              <label
                onClick={() => setPaymentMethod("card")}
                className={`flex items-center justify-between p-1.5 rounded border cursor-pointer text-xs ${
                  paymentMethod === "card" ? "border-[#6D001A] bg-stone-50" : "border-stone-200"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <input type="radio" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="accent-[#6D001A]" />
                  <span className="text-[11px] font-medium">Credit / Debit Card</span>
                </div>
                <CreditCard size={14} className="text-[#C98A2C]" />
              </label>

              <label
                onClick={() => setPaymentMethod("netbanking")}
                className={`flex items-center justify-between p-1.5 rounded border cursor-pointer text-xs ${
                  paymentMethod === "netbanking" ? "border-[#6D001A] bg-stone-50" : "border-stone-200"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <input type="radio" checked={paymentMethod === "netbanking"} onChange={() => setPaymentMethod("netbanking")} className="accent-[#6D001A]" />
                  <span className="text-[11px] font-medium">Net Banking</span>
                </div>
                <Building2 size={14} className="text-[#C98A2C]" />
              </label>

              <label
                onClick={() => setPaymentMethod("wallet")}
                className={`flex items-center justify-between p-1.5 rounded border cursor-pointer text-xs ${
                  paymentMethod === "wallet" ? "border-[#6D001A] bg-stone-50" : "border-stone-200"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <input type="radio" checked={paymentMethod === "wallet"} onChange={() => setPaymentMethod("wallet")} className="accent-[#6D001A]" />
                  <span className="text-[11px] font-medium">Wallets</span>
                </div>
                <Wallet size={14} className="text-[#C98A2C]" />
              </label>

              <label
                onClick={() => setPaymentMethod("cod")}
                className={`flex items-center justify-between p-1.5 rounded border cursor-pointer text-xs ${
                  paymentMethod === "cod" ? "border-[#6D001A] bg-stone-50" : "border-stone-200"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <input type="radio" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-[#6D001A]" />
                  <span className="text-[11px] font-medium">Cash on Delivery</span>
                </div>
                <Banknote size={14} className="text-[#C98A2C]" />
              </label>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveStep(5)}
            className="mt-4 flex items-center justify-center gap-1 w-full rounded-md bg-[#6D001A] py-2 text-[11px] font-bold text-white uppercase tracking-wider hover:bg-[#520013] transition"
          >
            <Lock size={12} />
            <span>PAY ₹27,998</span>
          </button>
        </div>

        {/* Card 4: 4. REVIEW ORDER */}
        <div
          className={`flex flex-col justify-between rounded-xl border p-4 bg-white shadow-2xs transition ${
            activeStep === 4
              ? "border-[#6D001A] ring-2 ring-[#6D001A]/20"
              : "border-stone-200"
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5 border-b border-stone-100 pb-2 mb-3">
              <FileText size={15} className="text-[#C98A2C]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2A26]">
                4. REVIEW ORDER
              </h3>
            </div>
            <div className="text-left space-y-2">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                <div className="relative h-10 w-8 rounded overflow-hidden bg-stone-100 shrink-0">
                  <Image src="/images/products/saree_1_maroon.png" alt="Kanchipuram Silk" fill unoptimized className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-stone-800 truncate">Kanchipuram Silk</p>
                  <p className="text-[10px] text-stone-500">Qty: 1 • ₹18,999</p>
                </div>
              </div>

              <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                <div className="relative h-10 w-8 rounded overflow-hidden bg-stone-100 shrink-0">
                  <Image src="/images/products/saree_3_blue.png" alt="Banarasi Silk Saree" fill unoptimized className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-stone-800 truncate">Banarasi Silk Saree</p>
                  <p className="text-[10px] text-stone-500">Qty: 1 • ₹16,499</p>
                </div>
              </div>

              <div className="text-[11px] space-y-1 pt-1">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span>₹35,498</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount</span>
                  <span>-₹7,500</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Shipping</span>
                  <span className="font-bold text-emerald-700">FREE</span>
                </div>
                <div className="flex justify-between font-bold text-[#2D2A26] border-t border-stone-100 pt-1">
                  <span>Grand Total</span>
                  <span>₹27,998</span>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveStep(5)}
            className="mt-4 w-full rounded-md bg-[#6D001A] py-2 text-[11px] font-bold text-white uppercase tracking-wider hover:bg-[#520013] transition"
          >
            PLACE ORDER
          </button>
        </div>

        {/* Card 5: 5. CONFIRMATION */}
        <div
          className={`flex flex-col justify-between rounded-xl border p-4 bg-white shadow-2xs transition text-center ${
            activeStep === 5
              ? "border-emerald-500 ring-2 ring-emerald-500/20"
              : "border-stone-200"
          }`}
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-1.5 border-b border-stone-100 pb-2 mb-3 w-full">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2A26]">
                5. CONFIRMATION
              </h3>
            </div>

            <div className="my-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 size={28} />
            </div>

            <h4 className="font-serif text-base font-bold text-[#2D2A26]">Thank You!</h4>
            <p className="text-[11px] text-stone-600 mt-1">Your order has been placed successfully.</p>

            <div className="mt-3 p-2 rounded bg-stone-50 border border-stone-200 w-full text-[11px]">
              <span className="text-stone-400 block text-[10px] uppercase font-semibold">Order ID</span>
              <span className="font-mono font-bold text-[#6D001A]">SV25050876</span>
            </div>

            <p className="mt-2 text-[10px] text-stone-400 leading-snug">
              We have sent a confirmation email with all the details.
            </p>
          </div>

          <Link
            href="/orders"
            className="mt-4 block w-full rounded-md bg-[#6D001A] py-2 text-[11px] font-bold text-white uppercase tracking-wider hover:bg-[#520013] transition"
          >
            TRACK ORDER
          </Link>
        </div>
      </div>
    </section>
  );
}
