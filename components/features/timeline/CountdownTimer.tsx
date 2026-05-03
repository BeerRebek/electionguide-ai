"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string; // ISO date string
  label?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function DigitBox({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16 md:w-20 md:h-20 bg-surface-container-lowest border border-outline-variant rounded-xl flex items-center justify-center shadow-sm overflow-hidden">
        {/* Flip line */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-outline-variant/30" />
        <span className="text-2xl md:text-3xl font-bold text-on-surface tabular-nums tracking-tight">
          {str}
        </span>
      </div>
      <span className="text-[11px] font-medium text-on-surface-variant mt-1.5 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer({ targetDate, label }: CountdownTimerProps) {
  const [time, setTime] = useState<TimeLeft>(calcTimeLeft(targetDate));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const interval = setInterval(() => setTime(calcTimeLeft(targetDate)), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const isExpired = time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0;

  if (!mounted) {
    return (
      <div className="flex items-center gap-3">
        {["Days", "Hours", "Min", "Sec"].map((l) => (
          <DigitBox key={l} value={0} label={l} />
        ))}
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-tertiary-container/20 border border-tertiary-fixed rounded-xl">
        <span className="material-symbols-outlined text-on-tertiary-container text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          check_circle
        </span>
        <span className="text-sm font-medium text-on-tertiary-container">
          {label || "This event has concluded"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <p className="text-sm text-on-surface-variant font-medium">{label}</p>
      )}
      <div className="flex items-center gap-2 md:gap-3">
        <DigitBox value={time.days} label="Days" />
        <span className="text-xl font-bold text-on-surface-variant mt-[-20px]">:</span>
        <DigitBox value={time.hours} label="Hours" />
        <span className="text-xl font-bold text-on-surface-variant mt-[-20px]">:</span>
        <DigitBox value={time.minutes} label="Min" />
        <span className="text-xl font-bold text-on-surface-variant mt-[-20px]">:</span>
        <DigitBox value={time.seconds} label="Sec" />
      </div>
    </div>
  );
}
