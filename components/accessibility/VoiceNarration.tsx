"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";

export function VoiceNarration() {
  const [isReading, setIsReading] = useState(false);
  const t = useTranslations("accessibility");
  const locale = useLocale();

  // Handle cancellation when component unmounts or locale changes
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [locale]);

  const stopReading = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsReading(false);
  }, []);

  const startReading = useCallback(() => {
    if (!window.speechSynthesis) return;

    // Stop any current reading
    window.speechSynthesis.cancel();

    // Get content to read
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    // Extract text and clean it up a bit
    // We want to skip elements with aria-hidden="true" or hidden from screen readers
    const text = Array.from(mainContent.querySelectorAll("h1, h2, h3, h4, h5, h6, p, li, span:not([aria-hidden='true'])"))
      .map(el => el.textContent)
      .join(". ");

    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    utterance.lang = locale === "en" ? "en-IN" : locale === "hi" ? "hi-IN" : locale;
    
    // Attempt to find a better voice if possible
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith(locale));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    utterance.onstart = () => setIsReading(true);

    window.speechSynthesis.speak(utterance);
  }, [locale]);

  const toggleNarration = () => {
    if (isReading) {
      stopReading();
    } else {
      startReading();
    }
  };

  return (
    <button
      onClick={toggleNarration}
      className={`p-1 rounded-full transition-colors flex items-center justify-center ${
        isReading 
          ? "bg-primary-container text-on-primary" 
          : "hover:bg-surface-container-low text-on-surface-variant hover:text-primary-container"
      }`}
      aria-label={isReading ? t("stop_narration") : t("start_narration")}
      title={isReading ? t("stop_narration") : t("start_narration")}
    >
      <span className="material-symbols-outlined text-xl">
        {isReading ? "volume_off" : "volume_up"}
      </span>
    </button>
  );
}
