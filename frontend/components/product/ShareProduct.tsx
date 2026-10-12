"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Check, Copy, MessageCircle } from "lucide-react";
import { toast } from "sonner";

type Props = {
  productName: string;
};

export default function ShareProduct({ productName }: Props) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getUrl = () =>
    typeof window !== "undefined" ? window.location.href : "";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleShareClick = async () => {
    const url = getUrl();
    if (!url) return;

    // Use native Web Share API if supported (works on all mobile devices and modern desktop browsers)
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: productName,
          text: `Check out ${productName} on SilkVerse:`,
          url,
        });
        return;
      } catch (err: any) {
        // If aborted or rejected by user, don't show dropdown if aborted
        if (err?.name === "AbortError") return;
      }
    }

    // Otherwise toggle the compact dropdown
    setIsOpen((prev) => !prev);
  };

  const copyLink = async () => {
    const url = getUrl();
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Product link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
      setIsOpen(false);
    } catch {
      toast.error("Unable to copy link.");
    }
  };

  const shareWhatsApp = () => {
    const url = getUrl();
    if (!url) return;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${productName}\n${url}`)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setIsOpen(false);
  };

  const shareFacebook = () => {
    const url = getUrl();
    if (!url) return;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setIsOpen(false);
  };

  const shareTwitter = () => {
    const url = getUrl();
    if (!url) return;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(productName)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleShareClick}
        aria-label="Share this saree"
        className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-600 hover:text-[#6D001A] hover:border-[#6D001A]/30 hover:bg-stone-50 transition-all shadow-2xs cursor-pointer"
      >
        <Share2 size={13} className="text-[#6D001A]" />
        <span>Share</span>
      </button>

      {/* Simplified, Compact Floating Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-40 w-44 rounded-xl border border-stone-200 bg-white p-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-150">
          <button
            type="button"
            onClick={copyLink}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 hover:bg-[#FFF8F0] hover:text-[#6D001A] transition cursor-pointer text-left font-medium"
          >
            {copied ? (
              <Check size={14} className="text-emerald-600" />
            ) : (
              <Copy size={14} className="text-stone-400" />
            )}
            <span>{copied ? "Link Copied!" : "Copy Link"}</span>
          </button>

          <button
            type="button"
            onClick={shareWhatsApp}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 transition cursor-pointer text-left font-medium"
          >
            <MessageCircle size={14} className="text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={shareFacebook}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 hover:bg-blue-50 hover:text-blue-800 transition cursor-pointer text-left font-medium"
          >
            <svg className="w-3.5 h-3.5 fill-blue-600" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook</span>
          </button>

          <button
            type="button"
            onClick={shareTwitter}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition cursor-pointer text-left font-medium"
          >
            <svg className="w-3.5 h-3.5 fill-stone-900" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>X (Twitter)</span>
          </button>
        </div>
      )}
    </div>
  );
}