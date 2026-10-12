"use client";

import { useState, useEffect } from "react";
import { Gift, Sparkles, Check, HeartHandshake } from "lucide-react";
import { toast } from "sonner";

const PRESET_BLESSINGS = [
  {
    label: "Wedding Blessing (English)",
    text: "Wishing the bride and groom a lifetime of love, prosperity, and timeless grace with this pure handloom silk saree.",
  },
  {
    label: "పెళ్లి ఆశీస్సులు (Telugu)",
    text: "నూతన వధూవరులకు అష్టైశ్వర్యాలు, ఆయురారోగ్యాలు మరియు సుఖసంతోషాలు కలగాలని మనస్ఫూర్తిగా ఆశీర్వదిస్తున్నాము.",
  },
  {
    label: "Gruhapravesam / Festive",
    text: "May this auspicious handwoven silk bring warmth, celebration, and golden memories to your family.",
  },
];

export default function GiftPackagingCard() {
  const [isGift, setIsGift] = useState(false);
  const [boxStyle, setBoxStyle] = useState<"potli" | "velvet">("potli");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState(PRESET_BLESSINGS[0].text);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("silkverse_gift_note");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.isGift) {
          setIsGift(true);
          setBoxStyle(parsed.boxStyle || "potli");
          setRecipient(parsed.recipient || "");
          setSender(parsed.sender || "");
          setMessage(parsed.message || PRESET_BLESSINGS[0].text);
          setSaved(true);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggleGift = (checked: boolean) => {
    setIsGift(checked);
    if (!checked) {
      localStorage.removeItem("silkverse_gift_note");
      setSaved(false);
    }
  };

  const handleSaveGiftNote = () => {
    const payload = {
      isGift: true,
      boxStyle,
      recipient: recipient.trim(),
      sender: sender.trim(),
      message: message.trim(),
    };
    localStorage.setItem("silkverse_gift_note", JSON.stringify(payload));
    setSaved(true);
    toast.success("Traditional Gift Packaging & Blessing Card saved to your order!");
  };

  return (
    <div className="rounded-2xl border border-[#D4AF37]/45 bg-gradient-to-r from-[#FFF8F0] via-white to-[#FFF8F0] p-4 sm:p-5 shadow-2xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6D001A] text-[#D4AF37] shadow-2xs">
            <Gift size={18} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#2D2A26]">
                Auspicious Wedding &amp; Festive Gift Packaging
              </h3>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Complimentary
              </span>
            </div>
            <p className="mt-0.5 text-xs text-stone-600">
              Add traditional <strong>Kalyana Thamboolam</strong> silk potli wrap and a gold-foiled blessing card in English or Telugu.
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
          <input
            type="checkbox"
            checked={isGift}
            onChange={(e) => handleToggleGift(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6D001A]" />
        </label>
      </div>

      {isGift && (
        <div className="mt-4 pt-4 border-t border-[#D4AF37]/30 grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Left: Form Controls */}
          <div className="md:col-span-7 space-y-3.5">
            {/* Packaging Style */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Select Heritage Packaging Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setBoxStyle("potli");
                    setSaved(false);
                  }}
                  className={`rounded-xl border p-2.5 text-left transition cursor-pointer ${
                    boxStyle === "potli"
                      ? "border-[#6D001A] bg-[#FFF8F0] ring-1 ring-[#6D001A]"
                      : "border-stone-200 bg-white hover:border-[#D4AF37]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2D2A26]">Zari Silk Potli Wrap</span>
                    <span className="text-[10px] font-bold text-emerald-700">FREE</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Handwoven brocade drawstring pouch
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBoxStyle("velvet");
                    setSaved(false);
                  }}
                  className={`rounded-xl border p-2.5 text-left transition cursor-pointer ${
                    boxStyle === "velvet"
                      ? "border-[#6D001A] bg-[#FFF8F0] ring-1 ring-[#6D001A]"
                      : "border-stone-200 bg-white hover:border-[#D4AF37]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2D2A26]">Royal Bridal Box</span>
                    <span className="text-[10px] font-bold text-emerald-700">FREE</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Hardbound maroon box with butter paper
                  </p>
                </button>
              </div>
            </div>

            {/* Recipient & Sender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  To (Recipient Name)
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => {
                    setRecipient(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="e.g. Chi. Sow. Sravani"
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-base sm:text-xs text-stone-800 focus:border-[#6D001A] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  From (Your Name / Family)
                </label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => {
                    setSender(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="e.g. Rao Family"
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-base sm:text-xs text-stone-800 focus:border-[#6D001A] focus:outline-none"
                />
              </div>
            </div>

            {/* Preset Blessing Chips */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                  Blessing Card Message (English / తెలుగు)
                </label>
                <div className="flex flex-wrap gap-1">
                  {PRESET_BLESSINGS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setMessage(preset.text);
                        setSaved(false);
                      }}
                      className="rounded-md border border-[#D4AF37]/50 bg-[#FFF8F0] hover:bg-[#F5E6C8] px-2 py-0.5 text-[10px] font-semibold text-[#6D001A] transition cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setSaved(false);
                }}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-base sm:text-xs text-stone-800 focus:border-[#6D001A] focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveGiftNote}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#6D001A] hover:bg-[#520013] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition cursor-pointer"
            >
              {saved ? <Check size={14} /> : <Sparkles size={14} />}
              <span>{saved ? "Gift Card Saved" : "Save Gift Card to Bag"}</span>
            </button>
          </div>

          {/* Right: Live Gold-Bordered Blessing Card Preview */}
          <div className="md:col-span-5">
            <div className="rounded-xl border-2 border-[#D4AF37] bg-[#FFFDF9] p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2 mb-2.5">
                <span className="font-serif text-xs font-bold tracking-widest uppercase text-[#6D001A]">
                  ✦ SilkVerse Shubha Lekha ✦
                </span>
                <HeartHandshake size={14} className="text-[#C98A2C]" />
              </div>

              <p className="text-xs font-bold text-[#2D2A26]">
                Dear {recipient || "Special One"},
              </p>

              <p className="mt-2 font-serif italic text-xs leading-relaxed text-stone-700 min-h-[48px]">
                “{message || "With warm blessings on your auspicious occasion."}”
              </p>

              <div className="mt-3 pt-2 border-t border-[#D4AF37]/25 flex items-center justify-between text-[11px]">
                <span className="text-stone-500">
                  {boxStyle === "velvet" ? "Royal Bridal Keepsake Box" : "Zari Silk Potli Wrap"}
                </span>
                <span className="font-bold text-[#6D001A]">
                  — {sender || "With Warm Blessings"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
