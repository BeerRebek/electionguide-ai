"use client";

interface Option {
  emoji: string;
  title: string;
  description: string;
  form: string;
  color: string;
}

const OPTIONS: Option[] = [
  {
    emoji: "🆕",
    title: "First-time Registration",
    description: "Register as a voter for the very first time in India",
    form: "Form 6",
    color: "primary",
  },
  {
    emoji: "🌍",
    title: "NRI / Overseas Voter",
    description: "Indian citizen living abroad wanting to register",
    form: "Form 6A",
    color: "secondary",
  },
  {
    emoji: "❌",
    title: "Remove My Name",
    description: "Your name is incorrectly on the electoral roll",
    form: "Form 7",
    color: "error",
  },
  {
    emoji: "✏️",
    title: "Update My Details",
    description: "Change address, name correction, photo update",
    form: "Form 8",
    color: "tertiary",
  },
];

const colorMap: Record<string, string> = {
  primary: "border-primary bg-primary-container/20 hover:bg-primary-container/40",
  secondary: "border-secondary bg-secondary-container/20 hover:bg-secondary-container/40",
  error: "border-error bg-error-container/20 hover:bg-error-container/40",
  tertiary: "border-tertiary bg-tertiary-container/20 hover:bg-tertiary-container/40",
};

const activeColorMap: Record<string, string> = {
  primary: "border-primary bg-primary-container ring-2 ring-primary",
  secondary: "border-secondary bg-secondary-container ring-2 ring-secondary",
  error: "border-error bg-error-container ring-2 ring-error",
  tertiary: "border-tertiary bg-tertiary-container ring-2 ring-tertiary",
};

const badgeColorMap: Record<string, string> = {
  primary: "bg-primary text-on-primary",
  secondary: "bg-secondary text-on-secondary",
  error: "bg-error text-on-error",
  tertiary: "bg-tertiary text-on-tertiary",
};

interface Props {
  selectedForm: string | null;
  onSelect: (form: string) => void;
}

export function LogicQuestionnaire({ selectedForm, onSelect }: Props) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-on-surface mb-2">
          Let&apos;s find the right form for you
        </h2>
        <p className="text-on-surface-variant">
          Select the option that best describes your situation to get personalized guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {OPTIONS.map((opt) => {
          const isSelected = selectedForm === opt.form;
          return (
            <button
              key={opt.form}
              onClick={() => onSelect(opt.form)}
              className={`text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                isSelected ? activeColorMap[opt.color] : colorMap[opt.color]
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0">{opt.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-on-surface">{opt.title}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColorMap[opt.color]}`}
                    >
                      {opt.form}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant">{opt.description}</p>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-primary flex-shrink-0 mt-0.5">
                    check_circle
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedForm && (
        <div className="mt-6 bg-surface-container rounded-xl p-4 flex items-start gap-3 border border-outline-variant">
          <span className="material-symbols-outlined text-primary">info</span>
          <div>
            <p className="text-sm font-medium text-on-surface mb-0.5">
              You&apos;ll be guided for <strong>{selectedForm}</strong>
            </p>
            <p className="text-xs text-on-surface-variant">
              {selectedForm === "Form 6" && "Standard registration form for first-time voters."}
              {selectedForm === "Form 6A" &&
                "For NRIs — requires passport and overseas address proof."}
              {selectedForm === "Form 7" &&
                "Objection form — you can object to inclusion of any name including your own."}
              {selectedForm === "Form 8" &&
                "For corrections or transposition of entries in the electoral roll."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
