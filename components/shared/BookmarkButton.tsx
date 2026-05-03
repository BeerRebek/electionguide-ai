"use client";

import { useState, useEffect } from "react";

interface BookmarkButtonProps {
  itemId: string;
  itemType: "guide" | "quiz" | "candidate" | "election" | "document" | "chat";
  itemTitle?: string;
  variant?: "icon" | "button";
  className?: string;
}

const STORAGE_KEY = "electionguide_bookmarks";

function getBookmarks(): Record<string, { id: string; type: string; title?: string; savedAt: string }> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveBookmarks(bookmarks: Record<string, { id: string; type: string; title?: string; savedAt: string }>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch {}
}

export function BookmarkButton({
  itemId,
  itemType,
  itemTitle,
  variant = "icon",
  className = "",
}: BookmarkButtonProps) {
  const key = `${itemType}:${itemId}`;
  const [bookmarked, setBookmarked] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const bookmarks = getBookmarks();
    setBookmarked(!!bookmarks[key]);
  }, [key]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const bookmarks = getBookmarks();
    if (bookmarks[key]) {
      delete bookmarks[key];
      setBookmarked(false);
    } else {
      bookmarks[key] = {
        id: itemId,
        type: itemType,
        title: itemTitle,
        savedAt: new Date().toISOString(),
      };
      setBookmarked(true);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 1500);
    }
    saveBookmarks(bookmarks);

    // Dispatch custom event so other components can react
    window.dispatchEvent(new CustomEvent("bookmarks-updated"));
  };

  if (variant === "button") {
    return (
      <button
        onClick={toggle}
        aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
          bookmarked
            ? "bg-primary-container border-primary/30 text-primary"
            : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
        } ${className}`}
      >
        <span className="material-symbols-outlined text-[18px]">
          {bookmarked ? "bookmark" : "bookmark_border"}
        </span>
        {bookmarked ? "Saved" : "Save"}
        {showFeedback && (
          <span className="text-xs bg-primary text-on-primary px-1.5 py-0.5 rounded-full ml-1 animate-bounce">
            ✓
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggle}
        aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
        className={`relative w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
          bookmarked
            ? "text-primary bg-primary-container"
            : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
        } ${className}`}
      >
        <span
          className={`material-symbols-outlined text-[20px] transition-transform ${
            bookmarked ? "scale-110" : "scale-100"
          }`}
        >
          {bookmarked ? "bookmark" : "bookmark_border"}
        </span>
      </button>
      {showFeedback && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] px-2 py-1 rounded whitespace-nowrap animate-fade-in-down z-50">
          Bookmarked!
        </div>
      )}
    </div>
  );
}

/** Utility hook for reading bookmarks list */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<
    Array<{ key: string; id: string; type: string; title?: string; savedAt: string }>
  >([]);

  const reload = () => {
    const raw = getBookmarks();
    setBookmarks(
      Object.entries(raw).map(([key, val]) => ({ key, ...val }))
        .sort((a, b) => b.savedAt.localeCompare(a.savedAt))
    );
  };

  useEffect(() => {
    reload();
    window.addEventListener("bookmarks-updated", reload);
    return () => window.removeEventListener("bookmarks-updated", reload);
  }, []);

  return bookmarks;
}
