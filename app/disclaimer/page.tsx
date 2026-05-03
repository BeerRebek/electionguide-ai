import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer | ElectionGuide AI",
  description: "Official disclaimer — ElectionGuide AI is not affiliated with the Election Commission of India.",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">
            ← Back to ElectionGuide AI
          </Link>
          <h1 className="text-4xl font-bold text-white mb-3">Disclaimer</h1>
          <p className="text-gray-400 text-sm">Last updated: May 3, 2025</p>
        </div>

        {/* Critical Disclaimer Box */}
        <div className="mb-10 p-6 bg-red-500/10 border-2 border-red-500/50 rounded-2xl">
          <h2 className="text-red-400 font-bold text-lg mb-3">
            ⚠️ Not Affiliated with Election Commission of India
          </h2>
          <p className="text-red-200">
            ElectionGuide AI is an independent civic education project. It is{" "}
            <strong>NOT</strong> affiliated with, endorsed by, or officially connected to:
          </p>
          <ul className="mt-3 space-y-1 text-red-200 list-disc pl-5">
            <li>Election Commission of India (ECI)</li>
            <li>Ministry of Law and Justice, Government of India</li>
            <li>Any state election commission</li>
            <li>Any political party or candidate</li>
          </ul>
          <p className="mt-4 text-red-200">
            For official electoral information, always visit{" "}
            <a
              href="https://eci.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-300 underline font-medium"
            >
              eci.gov.in ↗
            </a>
          </p>
        </div>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <Section title="Educational Purpose Only">
            <p>
              All content on ElectionGuide AI — including AI-generated responses, guides, quizzes, and
              voter information — is provided for <strong>educational and informational purposes only</strong>.
              It does not constitute legal advice, official government guidance, or authoritative
              electoral information.
            </p>
          </Section>

          <Section title="Accuracy of Information">
            <p>
              While we strive to keep information accurate and up-to-date using verified government
              sources, electoral laws, dates, and procedures change frequently. We cannot guarantee
              the accuracy, completeness, or timeliness of any information on this platform.
            </p>
            <p className="mt-3">
              <strong>Always verify critical information</strong> through official channels before
              taking any action related to voting or voter registration.
            </p>
          </Section>

          <Section title="AI Response Disclaimer">
            <p>
              Responses from the AI assistant are generated using language models and may contain
              errors, hallucinations, or outdated information. AI responses are not a substitute for
              official legal or electoral guidance.
            </p>
          </Section>

          <Section title="Polling Booth Information">
            <p>
              Polling booth locations shown in the Booth Finder are based on available data and may not
              reflect real-time changes. Always verify your polling station on your official Voter
              Information Slip or at the Voter Services Portal (voters.eci.gov.in).
            </p>
          </Section>

          <Section title="No Political Affiliation">
            <p>
              ElectionGuide AI does not endorse, support, or oppose any political party, candidate, or
              electoral outcome. All information is presented neutrally for voter education.
            </p>
          </Section>

          <Section title="External Links">
            <p>
              We link to official government sources and third-party websites for reference. We are not
              responsible for the content or availability of external websites.
            </p>
          </Section>

          <Section title="Official Sources">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {[
                { name: "Election Commission of India", url: "https://eci.gov.in" },
                { name: "Voter Services Portal", url: "https://voters.eci.gov.in" },
                { name: "NVSP", url: "https://nvsp.in" },
                { name: "Lok Sabha", url: "https://loksabha.nic.in" },
                { name: "Rajya Sabha", url: "https://rajyasabha.nic.in" },
                { name: "National Informatics Centre", url: "https://nic.in" },
              ].map(({ name, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <span className="text-blue-400">🔗</span>
                  <span className="text-sm">{name}</span>
                </a>
              ))}
            </div>
          </Section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-wrap gap-4 text-sm text-gray-500">
          <Link href="/privacy-policy" className="hover:text-gray-300">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-gray-300">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-300">Contact</Link>
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
