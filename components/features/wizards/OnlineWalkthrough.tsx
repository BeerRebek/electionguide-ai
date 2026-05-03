"use client";

const STEPS = [
  {
    number: 1,
    title: "Go to voters.eci.gov.in",
    description: "Open the National Voters' Service Portal on your browser. Click on 'New Registration for Voter Registration (Form 6)'.",
    tip: "Use Chrome or Firefox for best compatibility. Avoid Safari on older versions.",
    icon: "language",
  },
  {
    number: 2,
    title: "Create / Login to your account",
    description: "Register with your mobile number. You'll receive an OTP to verify. If you already have an account, simply log in.",
    tip: "Keep your mobile handy — the OTP expires in 10 minutes.",
    icon: "person_add",
  },
  {
    number: 3,
    title: "Fill in Personal Details",
    description: "Enter your full name (as per official documents), date of birth, gender, and father's / mother's name.",
    tip: "Ensure your name matches exactly with your age proof document.",
    icon: "edit_note",
  },
  {
    number: 4,
    title: "Enter Residential Address",
    description: "Fill in your complete current address in the constituency where you want to register. This should match your address proof.",
    tip: "Flat/House number, Street, Village/Town, District, State, PIN Code — all are required.",
    icon: "home_pin",
  },
  {
    number: 5,
    title: "Upload Documents",
    description: "Upload your photograph, age proof, and address proof. Each file must be under 2MB in JPG or PDF format.",
    tip: "Compress images if they exceed the size limit. Use tools like iLovePDF or Smallpdf for free compression.",
    icon: "upload_file",
  },
  {
    number: 6,
    title: "Solve Captcha & Submit",
    description: "Type the captcha characters exactly as shown — they are case-sensitive. Click 'Submit' to file your application.",
    tip: "Click 'New Captcha' if you can't read the characters. It refreshes immediately.",
    icon: "security",
  },
  {
    number: 7,
    title: "Save Your Reference Number",
    description: "After submission, you'll receive a reference number via SMS and on-screen. Save this to track your application status.",
    tip: "Screenshot the confirmation page. The reference number is your only way to track the application.",
    icon: "confirmation_number",
  },
];

export function OnlineWalkthrough() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-on-surface mb-2">Online Application Walkthrough</h2>
        <p className="text-on-surface-variant">
          Follow these step-by-step instructions to submit your Form 6 on the NVSP portal.
        </p>
      </div>

      {/* Portal Link Banner */}
      <a
        href="https://voters.eci.gov.in"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-primary-container/20 border border-primary rounded-xl p-4 mb-6 hover:bg-primary-container/30 transition-colors group"
      >
        <span className="material-symbols-outlined text-primary text-[28px]">open_in_new</span>
        <div>
          <p className="font-semibold text-on-surface group-hover:text-primary transition-colors">
            voters.eci.gov.in
          </p>
          <p className="text-xs text-on-surface-variant">National Voters&apos; Service Portal — Official ECI website</p>
        </div>
        <span className="material-symbols-outlined text-primary ml-auto">arrow_forward</span>
      </a>

      {/* Step-by-step guide */}
      <div className="space-y-4">
        {STEPS.map((step, idx) => (
          <div
            key={step.number}
            className="flex gap-4"
          >
            {/* Step connector */}
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                {step.number}
              </div>
              {idx < STEPS.length - 1 && (
                <div className="w-0.5 flex-1 bg-outline-variant mt-2 min-h-[20px]" />
              )}
            </div>

            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  {step.icon}
                </span>
                <h3 className="font-semibold text-on-surface">{step.title}</h3>
              </div>
              <p className="text-sm text-on-surface-variant mb-2">{step.description}</p>
              <div className="bg-tertiary-container/30 rounded-lg px-3 py-2 flex items-start gap-2 border border-tertiary-container">
                <span className="material-symbols-outlined text-tertiary text-[14px] mt-0.5 flex-shrink-0">
                  lightbulb
                </span>
                <p className="text-xs text-on-surface-variant">{step.tip}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Common Mistakes Alert */}
      <div className="mt-6 bg-error-container/30 rounded-xl p-4 border border-error-container">
        <h4 className="font-semibold text-on-surface flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-error">warning</span>
          Common Mistakes to Avoid
        </h4>
        <ul className="space-y-1.5">
          {[
            "Uploading a photo with a coloured background",
            "Name mismatch between form and documents",
            "Address not matching the constituency",
            "File size exceeding 2MB",
            "Forgetting to save the reference number",
          ].map((mistake) => (
            <li key={mistake} className="flex items-start gap-2 text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-error text-[16px] mt-0.5 flex-shrink-0">close</span>
              {mistake}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
