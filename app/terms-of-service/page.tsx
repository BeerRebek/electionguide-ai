import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | ElectionGuide AI",
  description: "Terms of Service for ElectionGuide AI — your civic education companion.",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">
            ← Back to ElectionGuide AI
          </Link>
          <h1 className="text-4xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-gray-400 text-sm">Last updated: May 3, 2025</p>
        </div>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <Section title="1. Acceptance of Terms">
            <p>
              By accessing or using ElectionGuide AI (&quot;the Service&quot;), you agree to be bound by
              these Terms of Service. If you do not agree, please do not use the Service.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              ElectionGuide AI is a civic education platform that provides information about Indian
              elections, voter registration guidance, civic quizzes, and AI-powered electoral information.
              The Service is provided for educational purposes only.
            </p>
            <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
              <p className="text-orange-300 font-medium">
                ⚠️ Important: ElectionGuide AI is NOT affiliated with, endorsed by, or officially
                connected to the Election Commission of India (ECI). All information is for educational
                purposes only. Always verify information with official ECI sources at eci.gov.in.
              </p>
            </div>
          </Section>

          <Section title="3. Eligibility">
            <p>
              The Service is intended for Indian citizens aged 18 years or older. By using the Service,
              you represent that you meet these requirements.
            </p>
          </Section>

          <Section title="4. User Accounts">
            <ul className="list-disc pl-5 space-y-2">
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must provide accurate information during registration</li>
              <li>You may not share your account credentials with others</li>
              <li>You may delete your account at any time from Settings</li>
            </ul>
          </Section>

          <Section title="5. Acceptable Use">
            <p>You agree NOT to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Use the Service to spread electoral misinformation</li>
              <li>Attempt to manipulate quiz leaderboards or scores fraudulently</li>
              <li>Use automated bots to access the Service</li>
              <li>Scrape or harvest data from the Service</li>
              <li>Impersonate election officials or ECI representatives</li>
              <li>Use the AI assistant for political campaigning or propaganda</li>
            </ul>
          </Section>

          <Section title="6. AI-Generated Content Disclaimer">
            <p>
              The AI assistant uses Google Gemini and retrieval-augmented generation (RAG) with curated
              electoral documents. While we strive for accuracy:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>AI responses may contain errors or outdated information</li>
              <li>Always verify critical information with official sources</li>
              <li>We are not liable for decisions made based on AI responses</li>
            </ul>
          </Section>

          <Section title="7. Intellectual Property">
            <p>
              The ElectionGuide AI platform, design, and code are proprietary. Content sourced from
              government documents (ECI, Representation of People Act, etc.) remains in the public
              domain. Quiz content and original writing are © 2025 ElectionGuide AI.
            </p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, ElectionGuide AI shall not be liable for any
              indirect, incidental, special, or consequential damages arising from your use of the
              Service. Our total liability shall not exceed ₹1,000.
            </p>
          </Section>

          <Section title="9. Governing Law">
            <p>
              These Terms are governed by the laws of India. Any disputes shall be subject to the
              exclusive jurisdiction of courts in Mumbai, Maharashtra.
            </p>
          </Section>

          <Section title="10. Changes to Terms">
            <p>
              We may update these Terms at any time. We will notify users of material changes via
              in-app notification. Continued use after changes constitutes acceptance.
            </p>
          </Section>

          <Section title="11. Contact">
            <p>
              For questions about these Terms:{" "}
              <a href="mailto:legal@electionguide.ai" className="text-blue-400">
                legal@electionguide.ai
              </a>
            </p>
          </Section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-wrap gap-4 text-sm text-gray-500">
          <Link href="/privacy-policy" className="hover:text-gray-300">Privacy Policy</Link>
          <Link href="/disclaimer" className="hover:text-gray-300">Disclaimer</Link>
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
