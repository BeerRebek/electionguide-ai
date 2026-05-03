"use client";

type Mode = "online" | "offline" | null;

const COMPARISON = [
  { aspect: "Convenience", online: "Apply from home, 24/7", offline: "Visit BLO office in person" },
  { aspect: "Time taken", online: "15–20 minutes", offline: "30–60 minutes at office" },
  { aspect: "Documents", online: "Digital copies (scan/photo)", offline: "Original + photocopies" },
  { aspect: "Status tracking", online: "Real-time SMS & online", offline: "Manual follow-up" },
  { aspect: "Help available", online: "Chat + FAQ support", offline: "BLO staff assistance" },
];

interface Props {
  selected: Mode;
  onSelect: (mode: Mode) => void;
}

export function ModeSelection({ selected, onSelect }: Props) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-on-surface mb-2">How would you like to apply?</h2>
        <p className="text-on-surface-variant">
          Choose the application method that works best for you.
        </p>
      </div>

      {/* Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Online */}
        <button
          onClick={() => onSelect("online")}
          className={`text-left p-6 rounded-2xl border-2 transition-all ${
            selected === "online"
              ? "border-primary bg-primary-container/20 ring-2 ring-primary"
              : "border-outline-variant hover:border-primary/40 hover:bg-surface-container"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                selected === "online" ? "bg-primary" : "bg-surface-container"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[24px] ${
                  selected === "online" ? "text-on-primary" : "text-on-surface-variant"
                }`}
              >
                laptop
              </span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-lg">💻 Online via NVSP</h3>
              <p className="text-xs text-on-surface-variant">voters.eci.gov.in</p>
            </div>
            {selected === "online" && (
              <span className="material-symbols-outlined text-primary ml-auto">check_circle</span>
            )}
          </div>
          <p className="text-sm text-on-surface-variant mb-3">
            Apply digitally through the National Voters&apos; Service Portal. Track your application
            status in real-time.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Fast", "Convenient", "Trackable"].map((tag) => (
              <span
                key={tag}
                className="text-xs bg-primary-container text-on-primary-container px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </button>

        {/* Offline */}
        <button
          onClick={() => onSelect("offline")}
          className={`text-left p-6 rounded-2xl border-2 transition-all ${
            selected === "offline"
              ? "border-secondary bg-secondary-container/20 ring-2 ring-secondary"
              : "border-outline-variant hover:border-secondary/40 hover:bg-surface-container"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                selected === "offline" ? "bg-secondary" : "bg-surface-container"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[24px] ${
                  selected === "offline" ? "text-on-secondary" : "text-on-surface-variant"
                }`}
              >
                description
              </span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-lg">📋 Offline at BLO Office</h3>
              <p className="text-xs text-on-surface-variant">Booth Level Officer</p>
            </div>
            {selected === "offline" && (
              <span className="material-symbols-outlined text-secondary ml-auto">check_circle</span>
            )}
          </div>
          <p className="text-sm text-on-surface-variant mb-3">
            Visit your local Booth Level Officer. Get personal assistance with your form. Best if
            you prefer in-person support.
          </p>
          <div className="flex flex-wrap gap-2">
            {["In-person help", "No internet needed", "Staff guided"].map((tag) => (
              <span
                key={tag}
                className="text-xs bg-secondary-container text-on-secondary-container px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </button>
      </div>

      {/* Comparison Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
        <div className="px-4 py-3 border-b border-outline-variant bg-surface-container">
          <h3 className="text-sm font-semibold text-on-surface">Comparison</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="px-4 py-3 text-left text-xs text-on-surface-variant font-medium">Aspect</th>
              <th className="px-4 py-3 text-left text-xs text-primary font-medium">Online</th>
              <th className="px-4 py-3 text-left text-xs text-secondary font-medium">Offline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {COMPARISON.map((row) => (
              <tr key={row.aspect} className="hover:bg-surface-container/50">
                <td className="px-4 py-3 text-on-surface-variant text-xs font-medium">{row.aspect}</td>
                <td className="px-4 py-3 text-on-surface text-xs">{row.online}</td>
                <td className="px-4 py-3 text-on-surface text-xs">{row.offline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
