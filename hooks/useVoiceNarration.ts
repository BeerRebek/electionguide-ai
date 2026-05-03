"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface UseVoiceNarrationOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
}

/**
 * Custom hook for Web Speech API voice narration.
 * Provides play/pause/stop controls and status for TTS.
 */
export function useVoiceNarration(options: UseVoiceNarrationOptions = {}) {
  const { rate = 0.9, pitch = 1, lang = "en-IN" } = options;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported) return;

      // Stop any current speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = lang;

      // Try to find an Indian English voice
      const voices = window.speechSynthesis.getVoices();
      const indiaVoice = voices.find((v) => v.lang === "en-IN");
      const enVoice = voices.find((v) => v.lang.startsWith("en"));
      utterance.voice = indiaVoice || enVoice || null;

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, rate, pitch, lang]
  );

  const pause = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }, [isSupported]);

  const toggle = useCallback(
    (text: string) => {
      if (isPlaying && !isPaused) {
        pause();
      } else if (isPaused) {
        resume();
      } else {
        speak(text);
      }
    },
    [isPlaying, isPaused, speak, pause, resume]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    speak,
    pause,
    resume,
    stop,
    toggle,
    isPlaying,
    isPaused,
    isSupported,
  };
}
