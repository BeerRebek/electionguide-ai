"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
}

function getCountdown(targetDate: Date): CountdownValues {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  };
}

export function HeroCard() {
  const t = useTranslations("dashboard.hero");
  
  // Example target date: 18 days from now
  const [target] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 18);
    return d;
  });
  const [countdown, setCountdown] = useState<CountdownValues>({
    days: 18,
    hours: 4,
    minutes: 22,
  });

  useEffect(() => {
    setCountdown(getCountdown(target));
    const interval = setInterval(() => setCountdown(getCountdown(target)), 60000);
    return () => clearInterval(interval);
  }, [target]);

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-2 tracking-tight">
            {t("greeting", { name: "Citizen" })}
          </h1>
          <div className="flex items-center gap-2 text-on-surface-variant mb-6">
            <span className="material-symbols-outlined text-sm">event</span>
            <span className="text-sm font-medium">
              {t("nextElection")}: <span className="text-primary font-bold">{t("lokSabha")}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-surface-container p-3 rounded-xl border border-outline-variant min-w-[120px]">
              <span className="text-[10px] uppercase tracking-wider text-on-surface-variant block mb-1 font-bold">
                {t("nextElection")}
              </span>
              <span className="text-xl font-bold text-on-surface font-mono">
                {t("countdown", { 
                  days: countdown.days, 
                  hours: countdown.hours, 
                  minutes: countdown.minutes 
                })}
              </span>
            </div>
            <div className="bg-surface-container p-3 rounded-xl border border-outline-variant min-w-[120px]">
              <span className="text-[10px] uppercase tracking-wider text-on-surface-variant block mb-1 font-bold">
                {t("voterReadiness")}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-on-surface">
                  80%
                </span>
                <div className="w-16 h-2 bg-surface-dim rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary-container"
                    style={{ width: "80%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="bg-surface-container p-4 rounded-xl border border-outline-variant flex flex-col items-center justify-center text-center group hover:bg-primary-container/20 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-secondary-container mb-2 text-2xl group-hover:scale-110 transition-transform">
              how_to_reg
            </span>
            <span className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-tight">
              {t("registrationStatus")}
            </span>
            <span className="text-xs font-bold text-on-surface">
              {t("verified")}
            </span>
          </div>
          <div className="bg-surface-container p-4 rounded-xl border border-outline-variant flex flex-col items-center justify-center text-center group hover:bg-primary-container/20 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-primary mb-2 text-2xl group-hover:scale-110 transition-transform">
              badge
            </span>
            <span className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-tight">
              {t("ePicStatus")}
            </span>
            <span className="text-xs font-bold text-on-surface">
              {t("digitalCopyReady")}
            </span>
          </div>
          <div className="bg-surface-container p-4 rounded-xl border border-outline-variant flex flex-col items-center justify-center text-center group hover:bg-primary-container/20 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-secondary mb-2 text-2xl group-hover:scale-110 transition-transform">
              location_on
            </span>
            <span className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-tight">
              {t("assignedBooth")}
            </span>
            <span className="text-xs font-bold text-on-surface truncate max-w-[80px]">
              Ward 12, Delhi
            </span>
          </div>
          <div className="bg-primary-container p-4 rounded-xl border border-primary/20 flex flex-col items-center justify-center text-center shadow-sm">
            <span className="material-symbols-outlined text-on-primary-container mb-2 text-2xl animate-pulse">
              check_circle
            </span>
            <span className="text-xs font-bold text-on-primary-container leading-tight">
              {t("readyToVote")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
