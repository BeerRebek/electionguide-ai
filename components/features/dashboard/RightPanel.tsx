"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function NotificationsPanel() {
  const t = useTranslations("dashboard.panels.notifications");
  
  const NOTIFICATIONS = [
    {
      text: t("items.voterId"),
      time: t("items.timeNow"),
      isNew: true,
    },
    {
      text: t("items.pollingBooth"),
      time: t("items.timeYesterday"),
      isNew: true,
    },
    {
      text: t("items.reminder"),
      time: t("items.timeDaysAgo", { count: 3 }),
      isNew: false,
    },
    {
      text: t("items.guide"),
      time: t("items.timeWeeksAgo", { count: 1 }),
      isNew: false,
    },
    {
      text: t("items.welcome"),
      time: t("items.timeWeeksAgo", { count: 2 }),
      isNew: false,
    },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm">
      <div className="flex justify-between items-center mb-4 border-b border-surface-dim pb-2">
        <h3 className="text-sm font-medium text-on-surface font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">
            notifications
          </span>
          {t("title")}
        </h3>
        <span className="bg-error text-on-error text-xs px-2 py-0.5 rounded-full">
          5
        </span>
      </div>
      <ul className="space-y-4">
        {NOTIFICATIONS.map((n, i) => (
          <li
            key={i}
            className={`flex gap-3 items-start relative ${
              !n.isNew ? "opacity-70" : ""
            }`}
          >
            {n.isNew && (
              <div className="absolute -left-1 top-1.5 w-2 h-2 rounded-full bg-primary-container" />
            )}
            <div className="pl-3">
              <p className="text-[13px] font-medium leading-snug text-on-surface">
                {n.text}
              </p>
              <span className="text-[10px] text-on-surface-variant">
                {n.time}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BookmarksPanel() {
  const t = useTranslations("dashboard.panels.bookmarks");

  const BOOKMARKS = [
    { icon: "article", label: t("item1") },
    { icon: "picture_as_pdf", label: t("item2") },
    { icon: "gavel", label: t("item3") },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm">
      <h3 className="text-sm font-medium text-on-surface font-bold flex items-center gap-2 mb-4 border-b border-surface-dim pb-2">
        <span className="material-symbols-outlined text-lg">bookmark</span>
        {t("title")}
      </h3>
      <ul className="space-y-3">
        {BOOKMARKS.map((b) => (
          <li key={b.label}>
            <Link
              href="#"
              className="flex items-center gap-3 group p-2 hover:bg-surface-container-low rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-sm">
                  {b.icon}
                </span>
              </div>
              <span className="text-[13px] font-medium text-on-surface group-hover:text-primary transition-colors truncate">
                {b.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TrendingQuestions() {
  const t = useTranslations("dashboard.panels.trending");

  const TRENDING = [
    { key: "evm", label: t("items.evm") },
    { key: "nota", label: t("items.nota") },
    { key: "proxy", label: t("items.proxy") },
    { key: "limits", label: t("items.limits") },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm flex-grow">
      <h3 className="text-sm font-medium text-on-surface font-bold flex items-center gap-2 mb-4 border-b border-surface-dim pb-2">
        <span className="material-symbols-outlined text-lg">trending_up</span>
        {t("title")}
      </h3>
      <div className="flex flex-wrap gap-2">
        {TRENDING.map((q) => (
          <Link
            key={q.key}
            href={`/chat?q=${encodeURIComponent(q.label)}`}
            className="bg-surface-container-low text-on-surface-variant border border-outline-variant text-[11px] px-3 py-1.5 rounded-full hover:bg-surface-container hover:text-primary cursor-pointer transition-colors"
          >
            {q.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
