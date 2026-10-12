"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 850);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll back to top"
      title="Back to Top"
      className="print:hidden fixed bottom-[74px] md:bottom-7 right-3 sm:right-6 z-40 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#D4AF37] bg-[#7A1020] text-[#D4AF37] shadow-md transition-all duration-300 hover:bg-[#5B0D16] hover:scale-105 active:scale-95 cursor-pointer"
    >
      <ArrowUp size={16} strokeWidth={2.5} />
    </button>
  );
}
