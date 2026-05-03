"use client";

import { useState, useRef, useEffect } from "react";
import { setLocaleCookie } from "@/lib/supabase/actions";
import { useRouter } from "next/navigation";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "ur", label: "Urdu", native: "اردو" },
  { code: "as", label: "Assamese", native: "অসমীয়া" },
  { code: "sa", label: "Sanskrit", native: "संस्कृतम्" },
  { code: "ne", label: "Nepali", native: "नेपाली" },
] as const;

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("en");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Initialize from cookie
  useEffect(() => {
    const match = document.cookie.match(/NEXT_LOCALE=(\w+)/);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (match?.[1]) setSelected(match[1]);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLang = LANGUAGES.find((l) => l.code === selected);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Language: ${selectedLang?.label}. Click to change`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="p-1 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-primary-container flex items-center gap-1"
      >
        <span className="material-symbols-outlined text-xl">language</span>
        <span className="text-xs font-medium hidden sm:inline uppercase">
          {selected}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 w-64 max-h-80 overflow-y-auto py-2"
          role="listbox"
          aria-label="Select language"
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              role="option"
              aria-selected={selected === lang.code}
              onClick={() => {
                setSelected(lang.code);
                setLocaleCookie(lang.code);
                setIsOpen(false);
                router.refresh();
              }}
              className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors
                ${selected === lang.code
                  ? "bg-surface-container-highest text-primary font-medium"
                  : "text-on-surface hover:bg-surface-container-low"
                }`}
            >
              <span className="text-sm">{lang.native}</span>
              <span className="text-xs text-on-surface-variant">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
