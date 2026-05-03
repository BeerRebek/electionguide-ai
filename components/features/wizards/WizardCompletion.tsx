"use client";

import Link from "next/link";

interface CompletedStep {
  label: string;
  icon: string;
}

interface Props {
  completedSteps: CompletedStep[];
  selectedForm: string;
  wizardTitle: string;
  nextHref?: string;
  nextLabel?: string;
}

export function WizardCompletion({
  completedSteps,
  selectedForm,
  wizardTitle,
  nextHref = "/guides/find-booth",
  nextLabel = "Find Your Polling Booth",
}: Props) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "I completed the Voter Registration Guide!",
        text: "I just completed the voter registration wizard on ElectionGuide AI. Join me!",
        url: window.location.origin + "/guides/voter-registration",
      });
    }
  };

  const handleDownload = () => {
    const today = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const stepsHtml = completedSteps
      .map(
        (s) =>
          `<li style="display:flex;align-items:center;gap:8px;font-size:13px;color:#475569;padding:4px 0;">
            <span style="color:#10b981;font-weight:700;">&#10003;</span>${s.label}
          </li>`
      )
      .join("");

    const certHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Certificate of Completion — ElectionGuide AI</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: Inter, sans-serif;
    background: #f0f4ff;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 32px;
  }
  .cert {
    background: #fff;
    border: 4px solid #1a3a6e;
    border-radius: 16px;
    padding: 56px 64px;
    max-width: 780px;
    width: 100%;
    text-align: center;
    box-shadow: 0 8px 40px rgba(0,0,0,.12);
  }
  .top-bar {
    height: 8px;
    background: linear-gradient(90deg, #1a3a6e, #2563eb, #7c3aed);
    border-radius: 4px;
    margin-bottom: 40px;
  }
  .seal {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1a3a6e, #2563eb);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    font-size: 36px;
    color: white;
  }
  .org {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: #64748b;
    margin-bottom: 8px;
  }
  h1 { font-size: 28px; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
  .subtitle { font-size: 14px; color: #64748b; margin-bottom: 32px; }
  hr { border: none; border-top: 1px dashed #cbd5e1; margin: 24px 0; }
  .label { font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: .08em; }
  .recipient { font-size: 24px; font-weight: 700; color: #2563eb; margin: 8px 0 4px; }
  .course { font-size: 17px; color: #334155; margin-top: 6px; }
  .badge {
    display: inline-block;
    background: #eff6ff;
    color: #1d4ed8;
    padding: 4px 14px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 600;
    border: 1px solid #bfdbfe;
    margin-top: 8px;
  }
  .steps {
    margin: 24px 0;
    background: #f8fafc;
    border-radius: 10px;
    padding: 16px 20px;
    text-align: left;
  }
  .date { font-size: 13px; color: #94a3b8; margin-top: 20px; }
  .bottom-bar {
    height: 6px;
    background: linear-gradient(90deg, #7c3aed, #2563eb, #1a3a6e);
    border-radius: 4px;
    margin-top: 40px;
  }
  .footer { font-size: 11px; color: #94a3b8; margin-top: 16px; }
  @media print {
    body { background: #fff; padding: 0; }
    .cert { box-shadow: none; border: 3px solid #1a3a6e; }
  }
</style>
</head>
<body>
<div class="cert">
  <div class="top-bar"></div>
  <div class="seal">&#128505;</div>
  <div class="org">ElectionGuide AI</div>
  <h1>Certificate of Completion</h1>
  <p class="subtitle">This certifies the successful completion of a voter education module</p>
  <hr />
  <div class="label">Awarded to</div>
  <div class="recipient">Civic Learner</div>
  <div class="label" style="margin-top:20px;">has successfully completed</div>
  <div class="course"><strong>${wizardTitle}</strong></div>
  <span class="badge">Registration Mode: ${selectedForm}</span>
  <div class="steps">
    <ul style="list-style:none;padding:0;">${stepsHtml}</ul>
  </div>
  <div class="date">Issued on ${today}</div>
  <div class="bottom-bar"></div>
  <div class="footer">
    ElectionGuide AI is an independent educational platform. Not an official ECI portal.<br />
    Information should be verified with official sources at voters.eci.gov.in
  </div>
</div>
<script>
  window.onload = function() {
    setTimeout(function() { window.print(); }, 600);
  };
<\/script>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(certHtml);
      win.document.close();
    }
  };

  return (
    <div className="text-center">
      {/* Celebration */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span
            className="material-symbols-outlined text-primary text-[48px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            celebration
          </span>
        </div>

        {/* Floating confetti dots */}
        {["🎉", "🌟", "🗳️", "✅", "🎊"].map((emoji, i) => (
          <span
            key={i}
            className="absolute text-2xl animate-bounce"
            style={{
              top: `${[0, 10, 5, 0, 10][i]}%`,
              left: `${[10, 25, 50, 75, 90][i]}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: "1s",
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      <h2 className="text-3xl font-bold text-on-surface mb-2">You&apos;re All Set! 🎉</h2>
      <p className="text-on-surface-variant mb-2">
        You&apos;ve completed the <strong>{wizardTitle}</strong> guide for{" "}
        <strong>{selectedForm}</strong>.
      </p>
      <p className="text-sm text-on-surface-variant mb-8">
        Now follow the steps and submit your application. Voter registration typically takes 15–30
        days for verification.
      </p>

      {/* Summary */}
      <div className="bg-surface-container rounded-xl p-5 border border-outline-variant text-left mb-6">
        <h3 className="font-semibold text-on-surface mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">checklist</span>
          What you learned
        </h3>
        <ul className="space-y-2">
          {completedSteps.map((step) => (
            <li key={step.label} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-tertiary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-tertiary text-[14px]">check</span>
              </div>
              <span className="text-sm text-on-surface">{step.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Certificate Download */}
      <div className="bg-gradient-to-r from-primary-container to-secondary-container rounded-xl p-5 border border-primary-container mb-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[32px]">workspace_premium</span>
          <div className="text-left flex-1">
            <p className="font-semibold text-on-surface">Completion Certificate</p>
            <p className="text-xs text-on-surface-variant">
              Download your personalized certificate of completion
            </p>
          </div>
          <button
            onClick={handleDownload}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-fixed transition-colors flex items-center gap-1 min-h-[44px]"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Download
          </button>
        </div>
      </div>

      {/* Next Step */}
      <Link
        href={nextHref}
        className="flex items-center justify-center gap-2 w-full bg-primary text-on-primary py-4 rounded-xl font-semibold text-base hover:bg-primary-fixed transition-colors mb-4 min-h-[56px] shadow-sm"
      >
        {nextLabel}
        <span className="material-symbols-outlined">arrow_forward</span>
      </Link>

      {/* Share */}
      <button
        onClick={handleShare}
        className="flex items-center justify-center gap-2 w-full border border-outline-variant py-3 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors min-h-[48px]"
      >
        <span className="material-symbols-outlined text-[18px]">share</span>
        Share your completion
      </button>
    </div>
  );
}
