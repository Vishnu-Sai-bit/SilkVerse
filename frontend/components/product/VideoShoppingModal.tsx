"use client";

import { useState, useEffect } from "react";
import {
  Video,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  X,
  Phone,
  User,
  Globe,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export interface VideoShoppingProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  color?: string;
}

interface VideoShoppingModalProps {
  product?: VideoShoppingProduct;
}

const TIME_SLOTS = [
  "10:30 AM IST",
  "12:00 PM IST",
  "02:30 PM IST",
  "04:30 PM IST",
  "06:30 PM IST",
  "08:00 PM IST",
];

const OCCASIONS = [
  "Bridal Muhurtham (పెళ్లి పట్టు)",
  "Reception & Sangeet",
  "Gruhapravesam / Pooja",
  "Festive & Family Gifting",
];

export default function VideoShoppingModal({ product }: VideoShoppingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[1]);
  const [preferredLang, setPreferredLang] = useState<"Telugu" | "English">("Telugu");
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [notes, setNotes] = useState("");
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  // Generate next 5 days for quick date selection
  const upcomingDates = Array.from({ length: 5 }, (_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() + idx);
    const iso = d.toISOString().split("T")[0];
    const label =
      idx === 0
        ? "Today"
        : idx === 1
        ? "Tomorrow"
        : d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    return { iso, label };
  });

  useEffect(() => {
    if (!selectedDate && upcomingDates.length > 0) {
      setSelectedDate(upcomingDates[0].iso);
    }
  }, []);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid 10-digit WhatsApp mobile number.");
      return;
    }

    const refId = `SV-LIVE-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      refId,
      name: name.trim(),
      phone: cleanPhone,
      date: selectedDate,
      time: selectedTime,
      language: preferredLang,
      occasion,
      notes: notes.trim(),
      product: product
        ? {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
          }
        : null,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem("silkverse_video_bookings") || "[]");
      localStorage.setItem(
        "silkverse_video_bookings",
        JSON.stringify([newBooking, ...existing.slice(0, 19)])
      );
    } catch {
      // ignore storage errors
    }

    setBookingRef(refId);
    toast.success("Live Saree Video Viewing booked successfully!");
  };

  const resetAndClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setBookingRef(null);
    }, 300);
  };

  return (
    <>
      {/* Trigger Card inside Product Detail Page */}
      <div className="mt-4 rounded-xl border border-[#D4AF37]/45 bg-gradient-to-r from-[#FFF8F0] via-[#FAF5EC] to-[#FFF8F0] p-3.5 sm:p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6D001A] text-[#D4AF37] shadow-2xs">
              <Video size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6D001A]">
                  Live Video Saree Viewing
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  FREE
                </span>
              </div>
              <p className="mt-0.5 text-[11px] sm:text-xs text-stone-600 leading-snug">
                Inspect the real 24K zari sheen &amp; drape live on WhatsApp Video with our Dharmavaram weaver stylist in <strong>Telugu</strong> or <strong>English</strong>.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#6D001A] hover:bg-[#520013] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-2xs transition cursor-pointer"
          >
            <Video size={14} className="text-[#D4AF37]" />
            <span>Book Video Call</span>
          </button>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#D4AF37]/50 bg-white shadow-2xl overflow-hidden my-8">
            {/* Royal Header */}
            <div className="bg-gradient-to-r from-[#4A0E17] via-[#6D001A] to-[#4A0E17] px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37]">
                  <Video size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold tracking-wide text-white">
                    Live Virtual Showroom Appointment
                  </h3>
                  <p className="text-[11px] text-[#F5E6C8]">
                    1-on-1 Live Drape &amp; Zari Inspection • Telugu &amp; English
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetAndClose}
                aria-label="Close modal"
                className="rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {bookingRef ? (
              /* Confirmation Screen */
              <div className="p-6 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600">
                  <CheckCircle2 size={30} />
                </div>

                <div>
                  <span className="inline-block rounded-full bg-[#FFF8F0] border border-[#D4AF37]/50 px-3 py-0.5 text-[11px] font-bold text-[#6D001A]">
                    Booking ID: {bookingRef}
                  </span>
                  <h4 className="mt-2 font-serif text-xl font-bold text-[#2D2A26]">
                    Your Live Saree Viewing is Confirmed!
                  </h4>
                  <p className="mt-1 text-xs text-stone-600 max-w-md mx-auto">
                    Our senior silk stylist will connect with <strong>{name}</strong> on WhatsApp Video (<strong>+91 {phone}</strong>) in <strong>{preferredLang}</strong>.
                  </p>
                </div>

                <div className="rounded-xl border border-stone-200 bg-[#FAF8F5] p-3.5 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Scheduled Slot:</span>
                    <span className="font-bold text-[#2D2A26]">
                      {selectedDate} • {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Preferred Language:</span>
                    <span className="font-bold text-[#6D001A]">
                      {preferredLang === "Telugu" ? "Telugu (తెలుగు)" : "English"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Occasion:</span>
                    <span className="font-semibold text-stone-800">{occasion}</span>
                  </div>
                  {product && (
                    <div className="pt-2 mt-2 border-t border-stone-200 flex items-center gap-2.5">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-8 rounded object-cover border border-stone-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#2D2A26] truncate">{product.name}</p>
                        <p className="text-[11px] font-bold text-[#6D001A]">
                          ₹{product.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <a
                    href={`https://wa.me/919876543210?text=${encodeURIComponent(
                      `Namaste SilkVerse! My Live Saree Video Viewing booking ID is ${bookingRef} for ${
                        product ? product.name : "Bridal Pattu Sarees"
                      } on ${selectedDate} at ${selectedTime} (${preferredLang}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition"
                  >
                    <MessageCircle size={15} />
                    <span>Send on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="flex-1 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-700 transition cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Form */
              <form onSubmit={handleBookAppointment} className="p-5 space-y-4">
                {/* Pre-selected Saree Preview */}
                {product && (
                  <div className="flex items-center gap-3 rounded-xl border border-[#D4AF37]/40 bg-[#FFF8F0]/70 p-2.5">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-13 w-10 rounded-lg object-cover border border-[#D4AF37]/30 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C98A2C]">
                        Selected for Live Drape Inspection
                      </span>
                      <p className="text-xs font-bold text-[#2D2A26] truncate">{product.name}</p>
                      <p className="text-xs font-semibold text-[#6D001A]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Language Selection (Telugu / English) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    <Globe size={12} className="inline mr-1 text-[#6D001A]" />
                    Preferred Stylist Language
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(["Telugu", "English"] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setPreferredLang(lang)}
                        className={`rounded-xl border py-2 px-3 text-xs font-bold transition cursor-pointer ${
                          preferredLang === lang
                            ? "border-[#6D001A] bg-[#6D001A] text-white shadow-2xs"
                            : "border-stone-200 bg-stone-50 text-stone-700 hover:border-[#D4AF37]"
                        }`}
                      >
                        {lang === "Telugu" ? "తెలుగు (Telugu)" : "English"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    <Calendar size={12} className="inline mr-1 text-[#6D001A]" />
                    Select Date
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {upcomingDates.map((d) => (
                      <button
                        key={d.iso}
                        type="button"
                        onClick={() => setSelectedDate(d.iso)}
                        className={`rounded-lg border py-2 px-1 text-center text-[11px] font-semibold transition cursor-pointer ${
                          selectedDate === d.iso
                            ? "border-[#6D001A] bg-[#FFF8F0] text-[#6D001A] font-bold ring-1 ring-[#6D001A]"
                            : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slot Selection */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    <Clock size={12} className="inline mr-1 text-[#6D001A]" />
                    Select Time Slot
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`rounded-lg border py-1.5 px-2 text-[11px] font-semibold transition cursor-pointer ${
                          selectedTime === slot
                            ? "border-[#6D001A] bg-[#FFF8F0] text-[#6D001A] font-bold ring-1 ring-[#6D001A]"
                            : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Occasion & Contact Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                      <User size={12} className="inline mr-1 text-[#6D001A]" />
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Lakshmi Devi"
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-base sm:text-xs text-stone-800 focus:border-[#6D001A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                      <Phone size={12} className="inline mr-1 text-[#6D001A]" />
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="10-digit WhatsApp no."
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-base sm:text-xs text-stone-800 focus:border-[#6D001A] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    <Sparkles size={12} className="inline mr-1 text-[#6D001A]" />
                    Occasion
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-base sm:text-xs font-medium text-stone-800 focus:border-[#6D001A] focus:outline-none"
                  >
                    {OCCASIONS.map((occ) => (
                      <option key={occ} value={occ}>
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                    <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                    <span>No obligation to buy • 100% Free Consultation</span>
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#6D001A] hover:bg-[#520013] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition cursor-pointer"
                  >
                    Confirm Slot
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
