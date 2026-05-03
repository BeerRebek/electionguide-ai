"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface VoiceOutputProps {
  text: string;
  language?: string;
}

// Language → BCP 47 tag mapping for speechSynthesis
const LANG_MAP: Record<string, string> = {
  // Names
  "English": "en-IN",
  "हिन्दी": "hi-IN",
  "বাংলা": "bn-IN",
  "తెలుగు": "te-IN",
  "தமிழ்": "ta-IN",
  "ગુજરાતી": "gu-IN",
  "ಕನ್ನಡ": "kn-IN",
  "മലയാളം": "ml-IN",
  "ਪੰਜਾਬੀ": "pa-IN",
  "मराठी": "mr-IN",
  "অসমীয়া": "as-IN",
  "ଓଡ଼ିଆ": "or-IN",
  "اردو": "ur-IN",
  // Codes
  "en": "en-IN",
  "hi": "hi-IN",
  "bn": "bn-IN",
  "te": "te-IN",
  "ta": "ta-IN",
  "gu": "gu-IN",
  "kn": "kn-IN",
  "ml": "ml-IN",
  "pa": "pa-IN",
  "mr": "mr-IN",
};

/**
 * Text-to-speech component for AI responses.
 * Uses Web Speech Synthesis API with language-aware voice selection,
 * progress tracking, and ARIA announcements.
 */
export function VoiceOutput({ text, language = "English" }: VoiceOutputProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [supported, setSupported] = useState(true);
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const estimatedDurationRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
    }
    return () => {
      window.speechSynthesis?.cancel();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Strip markdown formatting for cleaner TTS
  const cleanText = useCallback((raw: string) => {
    return raw
      .replace(/🍿\s*\*{0,2}Quick Answer\*{0,2}:?\s*/g, "Quick Answer: ")
      .replace(/🥪\s*\*{0,2}Key Details\*{0,2}:?\s*/g, "Key Details: ")
      .replace(/🍽️\s*\*{0,2}Full Explanation\*{0,2}:?\s*/g, "Full Explanation: ")
      .replace(/📚\s*\*{0,2}Legal References\*{0,2}:?\s*/g, "Legal References: ")
      .replace(/🔗\s*\*{0,2}Sources\*{0,2}:?\s*/g, "Sources: ")
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1") // **bold** → bold
      .replace(/\[Source \d+\]/g, "") // remove citation markers
      .replace(/#{1,6}\s/g, "") // remove markdown headings
      .replace(/[-*]\s/g, "") // remove list markers
      .replace(/\n{2,}/g, ". ")
      .replace(/\n/g, " ")
      .trim();
  }, []);

  const startProgressTracking = useCallback((durationMs: number) => {
    startTimeRef.current = Date.now();
    estimatedDurationRef.current = durationMs;
    setProgress(0);

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / durationMs) * 100, 98);
      setProgress(pct);
    }, 100);
  }, []);

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgress(0);
  }, []);

  const handlePlay = useCallback(() => {
    if (!supported) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      // Re-start progress tracking from where we left off
      const remaining = estimatedDurationRef.current * (1 - progress / 100);
      startProgressTracking(remaining);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const cleaned = cleanText(text);
    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.rate = speed;
    utterance.lang = LANG_MAP[language] || "en-IN";

    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const langCode = LANG_MAP[language] || "en-IN";
    const matchedVoice =
      voices.find((v) => v.lang === langCode) ||
      voices.find((v) => v.lang.startsWith(langCode.split("-")[0]));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      stopProgressTracking();
      setTimeout(() => {
        if (!isPlaying && !isPaused) setProgress(0);
      }, 500);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      stopProgressTracking();
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);

    // Estimate duration: ~150 words per minute at 1x speed
    const wordCount = cleaned.split(/\s+/).length;
    const durationMs = (wordCount / (150 * speed)) * 60 * 1000;
    startProgressTracking(durationMs);
  }, [supported, isPaused, text, speed, language, cleanText, progress, startProgressTracking, stopProgressTracking]);

  const handlePause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    stopProgressTracking();
  }, [stopProgressTracking]);

  const cycleSpeed = useCallback(() => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    setSpeed(speeds[nextIdx]);

    // If currently playing, restart with new speed
    if (isPlaying || isPaused) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      stopProgressTracking();
    }
  }, [speed, isPlaying, isPaused, stopProgressTracking]);

  if (!supported) return null;

  const isActive = isPlaying || isPaused;

  return (
    <div
      className="inline-flex items-center gap-0.5 relative"
      role="group"
      aria-label="Text-to-speech controls"
    >
      {/* Progress Bar (visible when active) */}
      {isActive && (
        <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-surface-container-highest rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Play/Pause */}
      <button
        onClick={isPlaying ? handlePause : handlePlay}
        className={`p-1.5 rounded transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center ${
          isActive
            ? "text-primary bg-primary/10 hover:bg-primary/15"
            : "text-outline hover:text-on-surface hover:bg-surface-container"
        }`}
        title={isPlaying ? "Pause" : isPaused ? "Resume" : "Listen"}
        aria-label={isPlaying ? "Pause speech" : isPaused ? "Resume speech" : "Read aloud"}
        aria-pressed={isPlaying}
      >
        <span className="material-symbols-outlined text-[18px]">
          {isPlaying ? "pause" : "play_arrow"}
        </span>
      </button>

      {/* Stop (only when playing/paused) */}
      {isActive && (
        <button
          onClick={handleStop}
          className="p-1.5 text-outline hover:text-error hover:bg-error-container/20 rounded transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
          title="Stop"
          aria-label="Stop speech"
        >
          <span className="material-symbols-outlined text-[18px]">stop</span>
        </button>
      )}

      {/* Speed control */}
      <button
        onClick={cycleSpeed}
        className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-outline hover:text-on-surface hover:bg-surface-container rounded transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
        title={`Playback speed: ${speed}x (click to change)`}
        aria-label={`Playback speed ${speed}x, click to change`}
      >
        {speed}×
      </button>

      {/* Screen reader announcement */}
      {isActive && (
        <span className="sr-only" role="status" aria-live="polite">
          {isPlaying ? "Reading aloud" : "Paused"}
        </span>
      )}
    </div>
  );
}
