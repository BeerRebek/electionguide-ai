"use client";

import Link from "next/link";

const footerLinks = [
  {
    heading: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/disclaimer", label: "Disclaimer" },
      { href: "/cookie-policy", label: "Cookie Policy" },
    ],
  },
  {
    heading: "Support",
    links: [
      { href: "/contact", label: "Contact Us" },
      { href: "/grievance-officer", label: "Grievance Officer" },
      { href: "/accessibility-statement", label: "Accessibility" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/quiz", label: "Civic Quiz" },
      { href: "/guides", label: "Voter Guides" },
      { href: "/booth-finder", label: "Booth Finder" },
      { href: "/timeline", label: "Election Timeline" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-gray-800 bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <p className="text-white font-bold text-lg mb-2">🗳️ ElectionGuide AI</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Civic education for every Indian voter. Not affiliated with ECI.
            </p>
            <p className="text-xs text-gray-600 mt-3">
              © {new Date().getFullYear()} ElectionGuide AI. All rights reserved.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map(({ heading, links }) => (
            <div key={heading}>
              <p className="text-white text-sm font-semibold mb-3">{heading}</p>
              <ul className="space-y-2">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-gray-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-600">
          <p>
            Official voter info:{" "}
            <a
              href="https://eci.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400"
            >
              eci.gov.in
            </a>{" "}
            · Voter Helpline:{" "}
            <span className="text-gray-500">1950</span>
          </p>
          <p className="text-gray-700">
            WCAG 2.1 AA · GIGW 3.0 · DPDP Act 2023
          </p>
        </div>
      </div>
    </footer>
  );
}
