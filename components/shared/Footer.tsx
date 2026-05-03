"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("common");

  return (
    <footer
      className="bg-slate-50 w-full border-t border-slate-200 mt-auto"
      role="contentinfo"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-12 py-12 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="text-lg font-semibold text-primary-container flex items-center gap-2">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden="true"
            >
              how_to_vote
            </span>
            {tc("appName")}
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            © {new Date().getFullYear()} {tc("appName")}. {t("disclaimer")}
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col md:items-end gap-2 text-sm text-slate-600">
          <nav
            className="flex flex-col md:items-end gap-3"
            role="navigation"
            aria-label="Footer navigation"
          >
            <a
              className="text-slate-500 hover:text-primary-container hover:underline focus:ring-2 focus:ring-blue-500 rounded outline-none"
              href="/contact"
            >
              {t("contact")}
            </a>
            <a
              className="text-slate-500 hover:text-primary-container hover:underline focus:ring-2 focus:ring-blue-500 rounded outline-none"
              href="/privacy"
            >
              {t("privacy")}
            </a>
            <a
              className="text-slate-500 hover:text-primary-container hover:underline focus:ring-2 focus:ring-blue-500 rounded outline-none"
              href="/terms"
            >
              {t("terms")}
            </a>
            <a
              className="text-slate-500 hover:text-primary-container hover:underline focus:ring-2 focus:ring-blue-500 rounded outline-none"
              href="/accessibility"
            >
              {t("accessibility")}
            </a>
            <a
              className="text-slate-500 hover:text-primary-container hover:underline focus:ring-2 focus:ring-blue-500 rounded outline-none"
              href="/gigw-compliance"
            >
              {t("gigw")}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

