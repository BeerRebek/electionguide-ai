"use client";

import { useVoiceNarration } from "@/hooks/useVoiceNarration";

interface VoiceNarrationButtonProps {
  /** The text to be narrated */
  text: string;
  /** Optional label for the button */
  label?: string;
  /** Compact mode — icon only */
  compact?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * A button that reads text aloud using the Web Speech API.
 * Shows play/pause/stop states with appropriate icons.
 * Only renders if the browser supports speechSynthesis.
 */
export function VoiceNarrationButton({
  text,
  label = "Listen",
  compact = false,
  className = "",
}: VoiceNarrationButtonProps) {
  const { toggle, stop, isPlaying, isPaused, isSupported } = useVoiceNarration();

  if (!isSupported) return null;

  const icon = isPlaying && !isPaused ? "pause" : isPaused ? "play_arrow" : "volume_up";
  const statusText = isPlaying && !isPaused ? "Pause" : isPaused ? "Resume" : label;
  const ariaLabel = isPlaying && !isPaused
    ? "Pause narration"
    : isPaused
    ? "Resume narration"
    : `Listen to ${label}`;

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <button
        onClick={() => toggle(text)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          isPlaying
            ? "bg-primary/10 text-primary border border-primary/30"
            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high border border-outline-variant"
        }`}
        aria-label={ariaLabel}
      >
        <span className="material-symbols-outlined text-[16px]" aria-hidden="true">{icon}</span>
        {!compact && <span>{statusText}</span>}
      </button>

      {/* Stop button — only visible when playing */}
      {(isPlaying || isPaused) && (
        <button
          onClick={stop}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-on-surface-variant bg-surface-container hover:bg-error-container hover:text-on-error-container border border-outline-variant transition-colors"
          aria-label="Stop narration"
        >
          <span className="material-symbols-outlined text-[14px]" aria-hidden="true">stop</span>
        </button>
      )}
    </div>
  );
}
