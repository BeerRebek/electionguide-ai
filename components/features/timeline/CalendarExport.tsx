"use client";

import { LOK_SABHA_2024_PHASES } from "@/lib/data/election-data";

function generateICS(): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ElectionGuide AI//Election Timeline//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Indian Election Timeline 2024",
  ];

  LOK_SABHA_2024_PHASES.forEach((phase) => {
    const start = phase.startDate.replace(/-/g, "");
    const end = phase.endDate.replace(/-/g, "");
    const uid = `${phase.id}@electionguide.ai`;

    lines.push(
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      `SUMMARY:${phase.title}`,
      `DESCRIPTION:${phase.bite.replace(/,/g, "\\,")}`,
      "BEGIN:VALARM",
      "TRIGGER:-P7D",
      "ACTION:DISPLAY",
      `DESCRIPTION:${phase.title} starts in 1 week`,
      "END:VALARM",
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      `DESCRIPTION:${phase.title} starts tomorrow`,
      "END:VALARM",
      "END:VEVENT"
    );
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function CalendarExport() {
  function handleExport() {
    const icsContent = generateICS();
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "indian-election-timeline-2024.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container transition-colors shadow-sm min-h-[44px]"
    >
      <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
      Add to Calendar
    </button>
  );
}
