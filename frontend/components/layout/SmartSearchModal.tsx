"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X, ArrowLeft, Clock, Sparkles, TrendingUp } from "lucide-react";
import { getProducts } from "@/services/api";
import { getProductImageUrl } from "@/utils/image";
import { useLanguage } from "@/context/LanguageContext";

interface ProductSuggestion {
  _id: string;
  name: string;
  category?: string;
  image?: string;
  price?: number;
}

interface SmartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AI_SEMANTIC_EXAMPLES = [
  "Maroon silk saree for a wedding",
  "Bridal Kanchipuram saree under 25000",
  "Festive soft silk below 15000",
  "పెళ్లి కోసం మెరూన్ పట్టు చీర",
];

const TRENDING_KEYWORDS = [
  "Kanchipuram Silk Saree",
  "Banarasi Silk Saree",
  "Wedding Collection",
  "Bridal Sarees",
  "Festive Collection",
  "Designer Sarees",
];

const RECENT_SEARCHES_KEY = "silkverse-recent-searches";
const MAX_RECENT_SEARCHES = 6;

export default function SmartSearchModal({ isOpen, onClose }: SmartSearchModalProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Paithani Silk Saree",
    "Organza Silk Saree",
  ]);
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const API =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5001";

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentSearches(parsed);
        }
      }
    } catch {
      // fallback to initial state
    }
  }, []);

  // Autofocus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search suggestions
  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let active = true;
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await getProducts({
          keyword: term,
          page: 1,
          limit: 6,
        });
        if (active) {
          setSuggestions(data.products || []);
        }
      } catch (err) {
        if (active) {
          setSuggestions([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const saveRecentSearch = (text: string) => {
    const item = text.trim();
    if (!item) return;
    const updated = [
      item,
      ...recentSearches.filter((s) => s.toLowerCase() !== item.toLowerCase()),
    ].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // ignore
    }
  };

  const executeSearch = (searchTerm: string) => {
    const term = searchTerm.trim();
    if (!term) return;
    saveRecentSearch(term);
    onClose();
    router.push(`/search?keyword=${encodeURIComponent(term)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 lg:p-10 transition-opacity">
      {/* Modal Card */}
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-[#D4AF37]/40 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Search Header */}
        <div className="border-b border-[#E8E4DF] p-3 sm:p-5 bg-[#FAF8F5]">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200/70 hover:text-gray-900 transition shrink-0"
              aria-label="Close search"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="relative flex-1 min-w-0">
              <Search
                size={18}
                className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-[#6D001A]"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("search.placeholder", "Try 'maroon silk saree for a wedding under 20000'...")}
                className="w-full rounded-2xl border border-[#D4AF37]/30 bg-white py-2.5 sm:py-3 pl-9 sm:pl-11 pr-8 sm:pr-10 text-base text-[#2D2A26] placeholder-gray-400 focus:border-[#6D001A] focus:outline-none focus:ring-1 focus:ring-[#6D001A] transition"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-[#6D001A] px-3.5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#5B0D16] transition shrink-0"
            >
              {t("search.button", "Search")}
            </button>
          </form>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Live Autocomplete Results */}
          {query.trim().length >= 2 ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6D001A]">
                  <Sparkles size={13} className="text-[#D4AF37]" />
                  <span>{loading ? "AI Semantic Searching..." : `AI Semantic Matches for "${query}"`}</span>
                </span>
                {suggestions.length > 0 && (
                  <button
                    onClick={() => executeSearch(query)}
                    className="text-xs font-bold text-[#6D001A] hover:underline"
                  >
                    View All ({suggestions.length}+)
                  </button>
                )}
              </div>

              {suggestions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestions.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        saveRecentSearch(item.name);
                        onClose();
                        router.push(`/products/${item._id}`);
                      }}
                      className="group flex items-center gap-3.5 p-2.5 rounded-xl border border-gray-100 hover:border-[#D4AF37] hover:bg-[#FFF8F0] cursor-pointer transition"
                    >
                      <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-gray-100 shrink-0 border border-gray-200">
                        <Image
                          src={getProductImageUrl(item.image)}
                          alt={item.name}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition"
                          sizes="56px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="font-serif text-xs sm:text-sm font-bold text-[#2D2A26] truncate group-hover:text-[#6D001A]">
                          {item.name}
                        </h5>
                        <p className="text-[11px] text-gray-500 truncate">
                          {item.category || "Authentic Silk"}
                        </p>
                        {item.price && (
                          <span className="text-xs font-bold text-[#6D001A] mt-0.5 block">
                            ₹{item.price.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !loading && (
                  <div className="text-center py-8 text-sm text-gray-500">
                    No sarees found matching "{query}". Try one of the AI Semantic Search examples below.
                  </div>
                )
              )}
            </div>
          ) : null}

          {/* AI SEMANTIC SEARCH EXAMPLES */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={15} className="text-[#D4AF37]" />
              <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#6D001A]">
                {t("search.aiTitle", "AI SEMANTIC SEARCH EXAMPLES")}
              </h4>
            </div>

            <div className="flex flex-wrap gap-2">
              {AI_SEMANTIC_EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => {
                    setQuery(example);
                    executeSearch(example);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/60 bg-gradient-to-r from-[#FFF8F0] to-[#F9F5EC] px-3.5 py-1.5 text-xs font-medium text-[#6D001A] shadow-2xs hover:bg-[#6D001A] hover:text-white transition-all active:scale-95 cursor-pointer"
                >
                  <Sparkles size={12} className="text-[#D4AF37] shrink-0" />
                  <span>“{example}”</span>
                </button>
              ))}
            </div>
          </div>

          {/* TRENDING SEARCHES matching Page 04 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={15} className="text-[#D4AF37]" />
              <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#6D001A]">
                {t("search.trendingTitle", "TRENDING SEARCHES")}
              </h4>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {TRENDING_KEYWORDS.map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => executeSearch(keyword)}
                  className="rounded-full border border-[#D4AF37]/50 bg-[#FFF8F0] px-3.5 py-1.5 text-xs font-medium text-[#2D2A26] shadow-xs hover:border-[#6D001A] hover:bg-[#6D001A] hover:text-white transition-all active:scale-95"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          {/* RECENT SEARCHES matching Page 04 */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-gray-400" />
                  <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-gray-700">
                    {t("search.recentTitle", "RECENT SEARCHES")}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleClearRecent}
                  className="text-xs font-semibold text-[#6D001A] hover:underline"
                >
                  Clear All
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => executeSearch(keyword)}
                    className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs text-gray-700 shadow-xs hover:border-[#D4AF37] hover:bg-gray-50 transition active:scale-95"
                  >
                    <span>{keyword}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
