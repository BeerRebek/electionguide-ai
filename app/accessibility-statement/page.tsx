import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility Statement | ElectionGuide AI",
  description: "Our commitment to WCAG 2.1 AA accessibility and GIGW 3.0 compliance.",
};

export default function AccessibilityStatementPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">
            ← Back to ElectionGuide AI
          </Link>
          <h1 className="text-4xl font-bold text-white mb-3">Accessibility Statement</h1>
          <p className="text-gray-400 text-sm">Last updated: May 3, 2025</p>
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <p className="text-green-300 text-sm">
              ElectionGuide AI is committed to ensuring digital accessibility for people with
              disabilities. We comply with{" "}
              <strong>WCAG 2.1 Level AA</strong> and{" "}
              <strong>GIGW (Guidelines for Indian Government Websites) 3.0</strong>.
            </p>
          </div>
        </div>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <Section title="Our Commitment">
            <p>
              We believe every Indian citizen — regardless of disability — has the right to access
              electoral information. Democracy requires accessible civic tools.
            </p>
          </Section>

          <Section title="Conformance Status">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { standard: "WCAG 2.1 AA", status: "Partially Conformant", color: "yellow" },
                { standard: "GIGW 3.0", status: "Partially Conformant", color: "yellow" },
                { standard: "Section 508", status: "Not Assessed", color: "gray" },
              ].map(({ standard, status, color }) => (
                <div
                  key={standard}
                  className={`p-4 rounded-xl border ${
                    color === "green"
                      ? "bg-green-500/10 border-green-500/30"
                      : color === "yellow"
                      ? "bg-yellow-500/10 border-yellow-500/30"
                      : "bg-gray-800 border-gray-700"
                  }`}
                >
                  <p className="font-semibold text-white">{standard}</p>
                  <p className={`text-sm mt-1 ${
                    color === "green" ? "text-green-300" : color === "yellow" ? "text-yellow-300" : "text-gray-400"
                  }`}>
                    {status}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Accessibility Features">
            <ul className="space-y-2 list-disc pl-5">
              <li>Keyboard-navigable interface (Tab, Enter, Arrow keys throughout)</li>
              <li>ARIA labels on all interactive elements</li>
              <li>High-contrast color ratios (minimum 4.5:1 for normal text)</li>
              <li>Screen reader compatible (tested with NVDA and VoiceOver)</li>
              <li>Text-to-speech for AI assistant responses</li>
              <li>Responsive design for mobile and tablet</li>
              <li>Language support: English + Hindi (हिन्दी)</li>
              <li>Resizable text without horizontal scrolling up to 200%</li>
              <li>Descriptive alt text on all meaningful images</li>
              <li>Focus indicators visible on all interactive elements</li>
            </ul>
          </Section>

          <Section title="Known Limitations">
            <p>
              Despite our efforts, some content may not yet be fully accessible:
            </p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>
                <strong>Interactive maps</strong> (Booth Finder) — Google Maps embeds have limited
                screen reader support. We provide text-based alternatives for all map information.
              </li>
              <li>
                <strong>PDF documents</strong> — Some linked government PDFs may not be accessible.
                We are working to provide HTML alternatives.
              </li>
              <li>
                <strong>Live AI responses</strong> — Dynamic content may require refresh for
                screen reader announcements.
              </li>
            </ul>
          </Section>

          <Section title="Technical Approach">
            <ul className="space-y-2 list-disc pl-5">
              <li>Semantic HTML5 with proper heading hierarchy</li>
              <li>Role attributes and ARIA live regions for dynamic content</li>
              <li>Skip navigation links</li>
              <li>Logical tab order throughout all pages</li>
              <li>Colour is never the only means of conveying information</li>
            </ul>
          </Section>

          <Section title="Feedback & Contact">
            <p>
              We welcome feedback on accessibility barriers. If you experience difficulty using any
              part of ElectionGuide AI, please contact us:
            </p>
            <div className="mt-4 p-4 bg-gray-900 rounded-xl">
              <p>
                📧{" "}
                <a href="mailto:accessibility@electionguide.ai" className="text-blue-400">
                  accessibility@electionguide.ai
                </a>
              </p>
              <p className="text-gray-400 text-sm mt-2">
                We aim to respond within 72 hours and resolve accessibility issues within 14 days.
              </p>
            </div>
          </Section>

          <Section title="Formal Complaints">
            <p>
              If you are not satisfied with our response, you may contact the{" "}
              <strong>Grievance Officer</strong> or the{" "}
              <a href="https://meity.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-400">
                Ministry of Electronics and IT (MeitY) ↗
              </a>
              .
            </p>
            <p className="mt-3">
              <Link href="/grievance-officer" className="text-blue-400">
                → View Grievance Officer Details
              </Link>
            </p>
          </Section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-wrap gap-4 text-sm text-gray-500">
          <Link href="/privacy-policy" className="hover:text-gray-300">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-gray-300">Terms of Service</Link>
          <Link href="/grievance-officer" className="hover:text-gray-300">Grievance Officer</Link>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-gray-800">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
