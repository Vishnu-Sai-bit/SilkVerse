"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Plus,
  ShieldCheck,
  Trash2,
  CheckCircle2,
  Lock,
  Smartphone,
  Building,
  Check,
  AlertCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface SavedCard {
  id: string;
  bankName: string;
  cardType: "Visa" | "Mastercard" | "RuPay";
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
  isDefault: boolean;
}

interface SavedUpi {
  id: string;
  vpa: string;
  app: "Google Pay" | "PhonePe" | "Paytm" | "BHIM UPI";
  isDefault: boolean;
}

const CARDS_STORAGE_KEY = "silkverse-saved-cards";
const UPIS_STORAGE_KEY = "silkverse-saved-upis";

export default function PaymentMethodsPage() {
  const { user } = useAuth();

  const [cards, setCards] = useState<SavedCard[]>([]);
  const [upis, setUpis] = useState<SavedUpi[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"card" | "upi">("card");

  // Add Card Form State
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardHolder, setNewCardHolder] = useState(user?.name || "");
  const [newExpiry, setNewExpiry] = useState("");
  const [newCvv, setNewCvv] = useState("");

  // Add UPI Form State
  const [newVpa, setNewVpa] = useState("");
  const [newUpiApp, setNewUpiApp] = useState<SavedUpi["app"]>("Google Pay");

  useEffect(() => {
    try {
      const savedCards = localStorage.getItem(CARDS_STORAGE_KEY);
      if (savedCards) {
        const parsed = JSON.parse(savedCards);
        if (Array.isArray(parsed)) setCards(parsed);
      }
      const savedUpis = localStorage.getItem(UPIS_STORAGE_KEY);
      if (savedUpis) {
        const parsed = JSON.parse(savedUpis);
        if (Array.isArray(parsed)) setUpis(parsed);
      }
    } catch {
      // ignore storage error
    }
  }, []);

  const handleSetDefaultCard = (id: string) => {
    setCards((prev) => {
      const updated = prev.map((c) => ({
        ...c,
        isDefault: c.id === id,
      }));
      try {
        localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    toast.success("Default payment card updated.");
  };

  const handleDeleteCard = (id: string) => {
    setCards((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    toast.success("Card removed successfully.");
  };

  const handleSetDefaultUpi = (id: string) => {
    setUpis((prev) => {
      const updated = prev.map((u) => ({
        ...u,
        isDefault: u.id === id,
      }));
      try {
        localStorage.setItem(UPIS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    toast.success("Default UPI ID updated.");
  };

  const handleDeleteUpi = (id: string) => {
    setUpis((prev) => {
      const updated = prev.filter((u) => u.id !== id);
      try {
        localStorage.setItem(UPIS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    toast.success("UPI ID removed successfully.");
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber.trim() || newCardNumber.replace(/\s/g, "").length < 16) {
      toast.error("Please enter a valid 16-digit card number.");
      return;
    }
    if (!newExpiry.trim() || !newExpiry.includes("/")) {
      toast.error("Please enter expiry in MM/YY format.");
      return;
    }

    const [month, year] = newExpiry.split("/");
    const cleanNum = newCardNumber.replace(/\s/g, "");

    const newCard: SavedCard = {
      id: `card_${Date.now()}`,
      bankName: "Primary Bank",
      cardType: cleanNum.startsWith("4") ? "Visa" : cleanNum.startsWith("5") ? "Mastercard" : "RuPay",
      last4: cleanNum.slice(-4),
      expiryMonth: month.trim(),
      expiryYear: year.trim(),
      cardholderName: newCardHolder || user?.name || "Cardholder",
      isDefault: cards.length === 0,
    };

    setCards((prev) => {
      const updated = [...prev, newCard];
      try {
        localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setIsAddModalOpen(false);
    setNewCardNumber("");
    setNewExpiry("");
    setNewCvv("");
    toast.success("New payment card saved securely.");
  };

  const handleSaveUpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVpa.trim() || !newVpa.includes("@")) {
      toast.error("Please enter a valid UPI ID (e.g., username@bank).");
      return;
    }

    const newUpiItem: SavedUpi = {
      id: `upi_${Date.now()}`,
      vpa: newVpa.trim(),
      app: newUpiApp,
      isDefault: upis.length === 0,
    };

    setUpis((prev) => {
      const updated = [...prev, newUpiItem];
      try {
        localStorage.setItem(UPIS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setIsAddModalOpen(false);
    setNewVpa("");
    toast.success("New UPI ID saved successfully.");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6D001A]">
            <CreditCard size={15} />
            <span>Secure Vault</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2A26] mt-1">
            Saved Payment Methods
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage your saved cards, UPI handles, and preferred payment preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#6D001A] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#520013] transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Add Payment Method</span>
        </button>
      </div>

      {/* Security Banner */}
      <div className="rounded-2xl bg-amber-50/60 border border-amber-200/80 p-4 flex items-center gap-3.5 text-xs text-stone-700">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-[#C9A227] shrink-0">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h4 className="font-bold text-[#6D001A]">
            100% RBI Tokenization &amp; 256-Bit SSL Encrypted
          </h4>
          <p className="text-[11px] text-stone-600 mt-0.5">
            Your card credentials are secure and tokenized in compliance with RBI guidelines. We never store raw CVV numbers.
          </p>
        </div>
      </div>

      {/* SECTION 1: SAVED CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-[#2D2A26] flex items-center gap-2">
            <span>Credit &amp; Debit Cards</span>
            <span className="text-xs font-sans text-stone-400 font-normal">
              ({cards.length} saved)
            </span>
          </h3>
        </div>

        {cards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-200 p-8 text-center text-xs text-stone-500">
            No credit or debit cards saved yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((c) => (
              <div
                key={c.id}
                className={`relative rounded-2xl p-5 border transition-all ${
                  c.isDefault
                    ? "border-[#6D001A] bg-gradient-to-br from-[#6D001A] to-[#450010] text-white shadow-md"
                    : "border-stone-200 bg-white text-stone-800 hover:border-stone-300 shadow-2xs"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        c.isDefault
                          ? "bg-[#D4AF37] text-[#450010]"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {c.bankName}
                    </span>
                    <p
                      className={`font-mono text-lg font-bold tracking-widest mt-3 ${
                        c.isDefault ? "text-amber-100" : "text-stone-800"
                      }`}
                    >
                      •••• •••• •••• {c.last4}
                    </p>
                  </div>
                  <span
                    className={`font-serif text-base font-bold italic ${
                      c.isDefault ? "text-[#D4AF37]" : "text-[#6D001A]"
                    }`}
                  >
                    {c.cardType}
                  </span>
                </div>

                <div className="mt-4 flex items-end justify-between pt-3 border-t border-white/10">
                  <div>
                    <span
                      className={`text-[9px] uppercase tracking-wider block ${
                        c.isDefault ? "text-amber-200/70" : "text-stone-400"
                      }`}
                    >
                      Cardholder
                    </span>
                    <span className="text-xs font-semibold capitalize">
                      {c.cardholderName}
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[9px] uppercase tracking-wider block ${
                        c.isDefault ? "text-amber-200/70" : "text-stone-400"
                      }`}
                    >
                      Expires
                    </span>
                    <span className="text-xs font-semibold font-mono">
                      {c.expiryMonth}/{c.expiryYear}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2">
                  {!c.isDefault ? (
                    <button
                      type="button"
                      onClick={() => handleSetDefaultCard(c.id)}
                      className="text-[11px] font-bold text-[#6D001A] hover:underline cursor-pointer"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                      <Check size={12} /> Default Method
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteCard(c.id)}
                    className={`text-xs hover:text-red-600 transition p-1 cursor-pointer ${
                      c.isDefault ? "text-white/70 hover:text-white" : "text-stone-400"
                    }`}
                    title="Remove Card"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: SAVED UPI IDS */}
      <div className="space-y-4 pt-4 border-t border-stone-200">
        <h3 className="font-serif text-base font-bold text-[#2D2A26] flex items-center gap-2">
          <span>Unified Payments Interface (UPI)</span>
          <span className="text-xs font-sans text-stone-400 font-normal">
            ({upis.length} saved)
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upis.map((u) => (
            <div
              key={u.id}
              className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#6D001A] shrink-0 font-bold text-xs">
                  <Smartphone size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-800">
                      {u.vpa}
                    </span>
                    {u.isDefault && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">{u.app}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!u.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefaultUpi(u.id)}
                    className="text-[11px] font-bold text-[#6D001A] hover:underline cursor-pointer"
                  >
                    Set Default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteUpi(u.id)}
                  className="text-stone-400 hover:text-red-600 transition p-1 cursor-pointer"
                  title="Remove UPI"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: OTHER SUPPORTED MODES */}
      <div className="rounded-2xl border border-stone-200 bg-[#FAF9F6] p-5 space-y-3">
        <h4 className="font-serif text-sm font-bold text-[#2D2A26]">
          More Available Payment Methods at Checkout
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-stone-200">
            <Building size={16} className="text-[#6D001A]" />
            <span>Net Banking (50+ Banks)</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-stone-200">
            <Lock size={16} className="text-[#6D001A]" />
            <span>Razorpay Secured</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-stone-200">
            <CheckCircle2 size={16} className="text-[#6D001A]" />
            <span>Cash on Delivery (Eligible)</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-stone-200">
            <CreditCard size={16} className="text-[#6D001A]" />
            <span>Silk Points &amp; Gift Cards</span>
          </div>
        </div>
      </div>

      {/* ADD PAYMENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5 border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#2D2A26]">
                Add Payment Method
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setModalTab("card")}
                className={`flex-1 py-2 rounded-lg transition ${
                  modalTab === "card"
                    ? "bg-[#6D001A] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Credit / Debit Card
              </button>
              <button
                type="button"
                onClick={() => setModalTab("upi")}
                className={`flex-1 py-2 rounded-lg transition ${
                  modalTab === "upi"
                    ? "bg-[#6D001A] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                UPI Handle
              </button>
            </div>

            {modalTab === "card" ? (
              <form onSubmit={handleSaveCard} className="space-y-4">
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-stone-700">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={newCardHolder}
                    onChange={(e) => setNewCardHolder(e.target.value)}
                    placeholder="Name as printed on card"
                    className="w-full rounded-xl border border-stone-300 p-2.5 text-xs focus:border-[#6D001A] focus:outline-none"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-stone-700">Card Number</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={newCardNumber}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                      setNewCardNumber(v.replace(/(\d{4})(?=\d)/g, "$1 "));
                    }}
                    placeholder="1234 5678 9012 3456"
                    className="w-full rounded-xl border border-stone-300 p-2.5 text-xs font-mono focus:border-[#6D001A] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={newExpiry}
                      onChange={(e) => setNewExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs font-mono focus:border-[#6D001A] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">CVV</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={newCvv}
                      onChange={(e) => setNewCvv(e.target.value.replace(/\D/g, ""))}
                      placeholder="•••"
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs font-mono focus:border-[#6D001A] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#6D001A] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#520013] transition shadow-xs cursor-pointer"
                >
                  Save Card Securely
                </button>
              </form>
            ) : (
              <form onSubmit={handleSaveUpi} className="space-y-4">
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-stone-700">Virtual Payment Address (VPA)</label>
                  <input
                    type="text"
                    required
                    value={newVpa}
                    onChange={(e) => setNewVpa(e.target.value)}
                    placeholder="e.g. mobile@upi or name@okaxis"
                    className="w-full rounded-xl border border-stone-300 p-2.5 text-xs font-mono focus:border-[#6D001A] focus:outline-none"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-stone-700">UPI Application</label>
                  <select
                    value={newUpiApp}
                    onChange={(e) => setNewUpiApp(e.target.value as any)}
                    className="w-full rounded-xl border border-stone-300 p-2.5 text-xs focus:border-[#6D001A] focus:outline-none"
                  >
                    <option value="Google Pay">Google Pay</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="Paytm">Paytm</option>
                    <option value="BHIM UPI">BHIM UPI</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#6D001A] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#520013] transition shadow-xs cursor-pointer"
                >
                  Save UPI ID
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
