"use client";

const QUALIFYING_DATES = [
  { date: "January 1", month: 1, day: 1, label: "Q1" },
  { date: "April 1", month: 4, day: 1, label: "Q2" },
  { date: "July 1", month: 7, day: 1, label: "Q3" },
  { date: "October 1", month: 10, day: 1, label: "Q4" },
];

function getQualifyingDate(dob: string): string {
  if (!dob) return "";
  const birth = new Date(dob);
  const now = new Date();
  const currentYear = now.getFullYear();

  for (const q of QUALIFYING_DATES) {
    const qDate = new Date(currentYear, q.month - 1, q.day);
    const ageOnQDate = (qDate.getTime() - birth.getTime()) / (365.25 * 24 * 3600 * 1000);
    if (ageOnQDate >= 18) {
      return q.date + ", " + currentYear;
    }
  }

  // Try next year
  for (const q of QUALIFYING_DATES) {
    const qDate = new Date(currentYear + 1, q.month - 1, q.day);
    const ageOnQDate = (qDate.getTime() - birth.getTime()) / (365.25 * 24 * 3600 * 1000);
    if (ageOnQDate >= 18) {
      return q.date + ", " + (currentYear + 1);
    }
  }

  return "More than 2 years away";
}

interface Props {
  dob: string;
  onDobChange: (val: string) => void;
}

export function QualifyingDates({ dob, onDobChange }: Props) {
  const qualifyingDate = dob ? getQualifyingDate(dob) : null;
  const today = new Date();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-on-surface mb-2">Qualifying Dates</h2>
        <p className="text-on-surface-variant">
          India has four qualifying dates each year. You must be 18 years old by one of these dates
          to be eligible to register.
        </p>
      </div>

      {/* Calendar Visual */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {QUALIFYING_DATES.map((q) => {
          const qDate = new Date(today.getFullYear(), q.month - 1, q.day);
          const isPast = qDate < today;
          return (
            <div
              key={q.label}
              className={`rounded-xl p-4 border-2 text-center transition-colors ${
                isPast
                  ? "border-outline-variant bg-surface-container-low opacity-60"
                  : "border-primary bg-primary-container/20"
              }`}
            >
              <div
                className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                  isPast ? "text-outline" : "text-primary"
                }`}
              >
                {q.label}
              </div>
              <div className="text-2xl font-bold text-on-surface">{q.day}</div>
              <div className="text-sm text-on-surface-variant">
                {new Date(today.getFullYear(), q.month - 1, 1).toLocaleString("default", {
                  month: "long",
                })}
              </div>
              {isPast && (
                <div className="text-[10px] text-outline mt-1">Past</div>
              )}
            </div>
          );
        })}
      </div>

      {/* DOB Input */}
      <div className="bg-surface-container rounded-xl p-5 border border-outline-variant mb-6">
        <h3 className="font-semibold text-on-surface mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">cake</span>
          Calculate Your Qualifying Date
        </h3>
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1.5">
            Date of Birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => onDobChange(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-3 bg-surface border border-outline rounded-xl text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
          />
        </div>

        {qualifyingDate && (
          <div className="mt-4 bg-primary-container rounded-xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[28px]">event_available</span>
            <div>
              <p className="text-xs text-on-surface-variant">Your earliest qualifying date</p>
              <p className="text-lg font-bold text-on-surface">{qualifyingDate}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                You can apply to register on or after this date
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info box */}
      <div className="bg-secondary-container/30 rounded-xl p-4 flex items-start gap-3 border border-secondary-container">
        <span className="material-symbols-outlined text-secondary text-[20px] flex-shrink-0 mt-0.5">info</span>
        <p className="text-sm text-on-surface-variant">
          The qualifying date is used to determine the revision period during which your name can be
          included. Even if your birthday is after these dates, you can still apply during the next
          revision period.
        </p>
      </div>
    </div>
  );
}
