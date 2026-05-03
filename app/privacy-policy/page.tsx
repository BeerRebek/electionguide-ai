import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | ElectionGuide AI",
  description:
    "Privacy Policy for ElectionGuide AI — compliant with India's DPDP Act 2023 and GDPR principles.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block"
          >
            ← Back to ElectionGuide AI
          </Link>
          <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">
            Last updated: May 3, 2025 · Effective: May 3, 2025
          </p>
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="text-blue-300 text-sm">
              This policy applies to ElectionGuide AI (<strong>electionguide.ai</strong>) and
              complies with India&apos;s <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>{" "}
              and GDPR principles.
            </p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-10">
          <Section title="1. Who We Are">
            <p>
              ElectionGuide AI is a civic technology platform designed to educate Indian citizens about
              elections, voter rights, and democratic participation. We are not affiliated with the
              Election Commission of India (ECI) or any political party.
            </p>
            <p className="mt-3">
              <strong>Grievance Officer:</strong> For privacy-related complaints, contact our Grievance
              Officer at{" "}
              <a href="mailto:privacy@electionguide.ai" className="text-blue-400">
                privacy@electionguide.ai
              </a>{" "}
              (response within 72 hours as required by DPDP Act).
            </p>
          </Section>

          <Section title="2. Data We Collect">
            <ul className="space-y-3 list-none pl-0">
              {[
                {
                  item: "Account Data",
                  desc: "Email address, name, profile photo (via Google OAuth or email signup)",
                },
                {
                  item: "Voter Profile",
                  desc: "State, constituency, voter ID (optional — used only for eligibility checks)",
                },
                {
                  item: "Usage Data",
                  desc: "Quiz scores, wizard completions, chat conversations, pages visited",
                },
                {
                  item: "Device Data",
                  desc: "Browser type, IP address (anonymised after 30 days), language preference",
                },
                {
                  item: "Push Tokens",
                  desc: "Browser push notification tokens (only if you opt in)",
                },
              ].map(({ item, desc }) => (
                <li key={item} className="flex gap-3 p-3 bg-gray-900 rounded-lg">
                  <span className="font-semibold text-white min-w-36">{item}</span>
                  <span className="text-gray-400">{desc}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="3. How We Use Your Data">
            <p>We use your data <strong>only</strong> for:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5 text-gray-300">
              <li>Providing personalised election guidance and quiz recommendations</li>
              <li>Remembering your voter profile and constituency for relevant information</li>
              <li>Sending push notifications about elections (only if you opt in)</li>
              <li>Improving platform quality through anonymised usage analytics</li>
              <li>Detecting and preventing fraud or abuse</li>
            </ul>
            <p className="mt-4 text-yellow-400">
              ⚠️ We never sell your data, share it with political parties, or use it for targeted
              political advertising.
            </p>
          </Section>

          <Section title="4. Legal Basis for Processing (DPDP Act 2023)">
            <ul className="space-y-2 list-disc pl-5 text-gray-300">
              <li><strong>Consent:</strong> Push notifications, optional voter ID verification</li>
              <li><strong>Contract:</strong> Account creation and service delivery</li>
              <li><strong>Legitimate Interest:</strong> Security, fraud prevention, service improvement</li>
            </ul>
          </Section>

          <Section title="5. Data Retention">
            <ul className="space-y-2 list-disc pl-5 text-gray-300">
              <li>Account data: Until account deletion</li>
              <li>Chat conversations: 90 days (then permanently deleted)</li>
              <li>Quiz scores: Until account deletion</li>
              <li>IP addresses: Anonymised after 30 days</li>
              <li>Deleted accounts: Fully purged within 30 days</li>
            </ul>
          </Section>

          <Section title="6. Your Rights (DPDP Act + GDPR)">
            <ul className="space-y-2 list-disc pl-5 text-gray-300">
              <li>✅ <strong>Access</strong> — Request a copy of all data we hold about you</li>
              <li>✅ <strong>Correction</strong> — Correct inaccurate personal data</li>
              <li>✅ <strong>Erasure</strong> — Delete your account and all associated data</li>
              <li>✅ <strong>Portability</strong> — Export your data in JSON format</li>
              <li>✅ <strong>Withdraw Consent</strong> — Disable notifications, delete voter profile</li>
              <li>✅ <strong>Nominate</strong> — Under DPDP Act, nominate a person to exercise your rights</li>
            </ul>
            <p className="mt-4">
              Exercise any right by emailing{" "}
              <a href="mailto:privacy@electionguide.ai" className="text-blue-400">
                privacy@electionguide.ai
              </a>{" "}
              with subject &quot;Data Rights Request&quot;.
            </p>
          </Section>

          <Section title="7. Third-Party Services">
            <ul className="space-y-3 list-none pl-0">
              {[
                { name: "Supabase", use: "Database & Authentication", privacy: "supabase.com/privacy" },
                { name: "Google Gemini AI", use: "AI responses", privacy: "policies.google.com/privacy" },
                { name: "Google Maps", use: "Polling booth locations", privacy: "policies.google.com/privacy" },
                { name: "Vercel / Cloud Run", use: "Hosting infrastructure", privacy: "vercel.com/legal/privacy-policy" },
              ].map(({ name, use, privacy }) => (
                <li key={name} className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg">
                  <span className="font-semibold text-white min-w-40">{name}</span>
                  <span className="text-gray-400 flex-1">{use}</span>
                  <a href={`https://${privacy}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm">
                    Privacy Policy ↗
                  </a>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="8. Cookies">
            <p>
              We use essential cookies only (authentication session). No tracking or advertising cookies.
              See our{" "}
              <Link href="/cookie-policy" className="text-blue-400">
                Cookie Policy
              </Link>{" "}
              for details.
            </p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>
              ElectionGuide AI is intended for users 18 years and older (voting age in India). We do not
              knowingly collect data from minors. If you believe a minor has registered, contact{" "}
              <a href="mailto:privacy@electionguide.ai" className="text-blue-400">
                privacy@electionguide.ai
              </a>
              .
            </p>
          </Section>

          <Section title="10. Security">
            <p>
              All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We employ row-level
              security in our database, and conduct regular security audits. No system is 100% secure —
              if you discover a vulnerability, please report it to{" "}
              <a href="mailto:security@electionguide.ai" className="text-blue-400">
                security@electionguide.ai
              </a>
              .
            </p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>
              We will notify registered users of material changes via in-app notification at least 7 days
              before they take effect. Continued use of the platform constitutes acceptance.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              For any privacy concerns:{" "}
              <a href="mailto:privacy@electionguide.ai" className="text-blue-400">
                privacy@electionguide.ai
              </a>
            </p>
          </Section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-wrap gap-4 text-sm text-gray-500">
          <Link href="/terms-of-service" className="hover:text-gray-300">Terms of Service</Link>
          <Link href="/cookie-policy" className="hover:text-gray-300">Cookie Policy</Link>
          <Link href="/accessibility-statement" className="hover:text-gray-300">Accessibility</Link>
          <Link href="/grievance-officer" className="hover:text-gray-300">Grievance Officer</Link>
          <Link href="/disclaimer" className="hover:text-gray-300">Disclaimer</Link>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-gray-800">
        {title}
      </h2>
      <div className="text-gray-300 leading-relaxed">{children}</div>
    </section>
  );
}
