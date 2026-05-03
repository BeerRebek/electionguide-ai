"use client";

export function CountingVisualization() {
  const SECURITY_TIERS = [
    { label: "Outer Ring", force: "CAPF (Central Armed Police Forces)", icon: "military_tech", color: "primary" },
    { label: "Middle Ring", force: "State Armed Police (SAP)", icon: "local_police", color: "secondary" },
    { label: "Inner Ring", force: "District Armed Police (DAP)", icon: "shield", color: "tertiary" },
  ];

  const COUNTING_STEPS = [
    { icon: "lock_open", title: "Strong Room Opening", desc: "EVMs brought from strong rooms under armed escort. Seal integrity verified by RO in presence of candidates." },
    { icon: "mail", title: "Postal Ballot Count", desc: "Postal ballots (service voters, elderly, PwD) are counted first. Each ballot authenticated by the RO." },
    { icon: "analytics", title: "Round-wise EVM Count", desc: "Counting in rounds — each round covers a fixed set of booths. CU display shows round totals." },
    { icon: "receipt", title: "Form 17C Part II", desc: "Returning Officer prepares the final result tally. Shared with all counting agents for verification." },
    { icon: "verified", title: "VVPAT Verification", desc: "5 randomly selected booths per assembly segment — VVPAT slips physically counted and matched against CU totals." },
    { icon: "celebration", title: "Result Declaration", desc: "Final result declared on Form 21C (Assembly) / 21E (Parliamentary). Winner issued Certificate of Election." },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-on-surface mb-2">Counting Process</h2>
      <p className="text-sm text-on-surface-variant mb-8">
        Multi-layered security ensures transparent, auditable vote counting.
      </p>

      {/* 3-Tier Security */}
      <div className="mb-10">
        <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wider mb-4">3-Tier Security Cordon</h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {SECURITY_TIERS.map((tier, i) => (
            <div key={tier.label} className="flex items-center gap-3">
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 flex flex-col items-center justify-center ${
                i === 0 ? "border-primary bg-primary-container/10" :
                i === 1 ? "border-secondary bg-secondary-container/10" :
                "border-tertiary bg-tertiary-container/10"
              }`}>
                <span className={`material-symbols-outlined text-[24px] ${i === 0 ? "text-primary" : i === 1 ? "text-secondary" : "text-tertiary"}`}>
                  {tier.icon}
                </span>
                <span className="text-[9px] font-bold text-on-surface-variant mt-1">{tier.label}</span>
              </div>
              {i < SECURITY_TIERS.length - 1 && (
                <span className="material-symbols-outlined text-outline-variant text-[20px] hidden md:block">arrow_forward</span>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {SECURITY_TIERS.map((tier) => (
            <p key={tier.label} className="text-xs text-on-surface-variant text-center">
              <strong>{tier.label}:</strong> {tier.force}
            </p>
          ))}
        </div>
      </div>

      {/* Counting Steps */}
      <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wider mb-4">Counting Sequence</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COUNTING_STEPS.map((step, i) => (
          <div key={step.title} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                {i + 1}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-on-surface">{step.title}</h4>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
