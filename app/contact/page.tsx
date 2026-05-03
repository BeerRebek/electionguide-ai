import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | ElectionGuide AI",
  description: "Contact ElectionGuide AI for support, partnerships, media enquiries, or accessibility help.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">
            ← Back to ElectionGuide AI
          </Link>
          <h1 className="text-4xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-gray-400">
            We&apos;re here to help with civic education, technical support, and partnerships.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {[
            {
              icon: "🔒",
              title: "Privacy & Data Rights",
              email: "privacy@electionguide.ai",
              desc: "Data access, deletion, DPDP Act requests",
              responseTime: "72 hours",
            },
            {
              icon: "⚖️",
              title: "Grievances & Legal",
              email: "grievance@electionguide.ai",
              desc: "Formal complaints, legal notices, compliance",
              responseTime: "72 hours",
            },
            {
              icon: "♿",
              title: "Accessibility",
              email: "accessibility@electionguide.ai",
              desc: "Accessibility barriers and feedback",
              responseTime: "72 hours",
            },
            {
              icon: "🛡️",
              title: "Security",
              email: "security@electionguide.ai",
              desc: "Vulnerability reports (responsible disclosure)",
              responseTime: "48 hours",
            },
            {
              icon: "🤝",
              title: "Partnerships & Media",
              email: "partnerships@electionguide.ai",
              desc: "NGOs, government agencies, media enquiries",
              responseTime: "5 business days",
            },
            {
              icon: "💬",
              title: "General Support",
              email: "support@electionguide.ai",
              desc: "Technical issues, account help, feedback",
              responseTime: "2 business days",
            },
          ].map(({ icon, title, email, desc, responseTime }) => (
            <div
              key={email}
              className="p-5 bg-gray-900 border border-gray-800 rounded-2xl hover:border-gray-600 transition-colors"
            >
              <div className="text-2xl mb-3">{icon}</div>
              <h2 className="text-white font-semibold mb-1">{title}</h2>
              <a
                href={`mailto:${email}`}
                className="text-blue-400 text-sm hover:text-blue-300 block mb-2"
              >
                {email}
              </a>
              <p className="text-gray-500 text-sm">{desc}</p>
              <p className="text-gray-600 text-xs mt-2">⏱ Response: {responseTime}</p>
            </div>
          ))}
        </div>

        {/* Official Notice */}
        <div className="p-6 bg-orange-500/10 border border-orange-500/30 rounded-2xl mb-12">
          <h2 className="text-orange-300 font-bold text-lg mb-2">
            🗳️ Not the Election Commission of India
          </h2>
          <p className="text-orange-200 text-sm">
            For official voter registration, ECI complaints, or electoral roll issues, please contact
            the Election Commission of India directly:
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href="https://eci.gov.in/contact-us"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-300 hover:text-orange-200 text-sm underline"
            >
              ECI Contact Page ↗
            </a>
            <span className="text-orange-500">|</span>
            <a
              href="https://voters.eci.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-300 hover:text-orange-200 text-sm underline"
            >
              Voter Services Portal ↗
            </a>
            <span className="text-orange-500">|</span>
            <span className="text-orange-200 text-sm">1950 (Voter Helpline)</span>
          </div>
        </div>

        {/* Response Times */}
        <div className="p-6 bg-gray-900 rounded-2xl">
          <h2 className="text-white font-semibold mb-4">Response Time Policy</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Security vulnerabilities: 48 hours (acknowledgement)</li>
            <li>• Privacy / DPDP Act requests: 72 hours (acknowledgement), 15 days (resolution)</li>
            <li>• Accessibility complaints: 72 hours (acknowledgement), 14 days (resolution)</li>
            <li>• General support: 2 business days</li>
            <li>• Partnerships / Media: 5 business days</li>
          </ul>
          <p className="text-gray-500 text-xs mt-4">
            Working hours: Monday–Friday, 9 AM – 6 PM IST (excluding Indian public holidays)
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-wrap gap-4 text-sm text-gray-500">
          <Link href="/privacy-policy" className="hover:text-gray-300">Privacy Policy</Link>
          <Link href="/grievance-officer" className="hover:text-gray-300">Grievance Officer</Link>
          <Link href="/disclaimer" className="hover:text-gray-300">Disclaimer</Link>
        </div>
      </div>
    </main>
  );
}
