import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Grievance Officer | ElectionGuide AI",
  description: "Contact our Grievance Officer for complaints, data rights requests, and compliance matters.",
};

export default function GrievanceOfficerPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">
            ← Back to ElectionGuide AI
          </Link>
          <h1 className="text-4xl font-bold text-white mb-3">Grievance Officer</h1>
          <p className="text-gray-400 text-sm">
            As required under India&apos;s DPDP Act 2023 and IT Act 2000 (Section 79)
          </p>
        </div>

        {/* Officer Card */}
        <div className="mb-10 p-6 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-2xl">
          <h2 className="text-white font-bold text-xl mb-4">Designated Grievance Officer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Name</p>
              <p className="text-white font-medium">ElectionGuide AI Trust & Safety Team</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Designation</p>
              <p className="text-white font-medium">Grievance Officer</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <a href="mailto:grievance@electionguide.ai" className="text-blue-400 font-medium">
                grievance@electionguide.ai
              </a>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Response Time</p>
              <p className="text-white font-medium">Within 72 hours (acknowledgement)</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Resolution Time</p>
              <p className="text-white font-medium">Within 15 days (as per DPDP Act)</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Working Hours</p>
              <p className="text-white font-medium">Mon–Fri, 9 AM – 6 PM IST</p>
            </div>
          </div>
        </div>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <Section title="Types of Grievances We Handle">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: "🔒", title: "Privacy Complaints", desc: "Data misuse, unauthorized access, breach notifications" },
                { icon: "📋", title: "Data Rights Requests", desc: "Access, correction, deletion, portability of your data" },
                { icon: "🚫", title: "Content Complaints", desc: "Inaccurate information, misleading content, misinformation" },
                { icon: "⚖️", title: "Legal Compliance", desc: "DPDP Act requests, court orders, regulatory inquiries" },
                { icon: "🛡️", title: "Security Issues", desc: "Vulnerability reports, suspected breaches" },
                { icon: "📞", title: "General Complaints", desc: "Service issues, account problems, other concerns" },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="p-4 bg-gray-900 rounded-xl">
                  <p className="text-white font-medium">{icon} {title}</p>
                  <p className="text-gray-400 text-sm mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="How to File a Grievance">
            <ol className="space-y-4 list-none pl-0 counter-reset">
              {[
                {
                  step: "1",
                  title: "Email Us",
                  desc: 'Send your complaint to grievance@electionguide.ai with subject "Grievance: [Type]"',
                },
                {
                  step: "2",
                  title: "Include Details",
                  desc: "Your name, registered email, description of the issue, relevant dates, and any supporting evidence",
                },
                {
                  step: "3",
                  title: "Acknowledgement",
                  desc: "You will receive an acknowledgement with a ticket number within 72 hours",
                },
                {
                  step: "4",
                  title: "Resolution",
                  desc: "We aim to resolve all grievances within 15 days. Complex cases may take up to 30 days",
                },
              ].map(({ step, title, desc }) => (
                <li key={step} className="flex gap-4 p-4 bg-gray-900 rounded-xl">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step}
                  </span>
                  <div>
                    <p className="text-white font-medium">{title}</p>
                    <p className="text-gray-400 text-sm mt-1">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="Escalation">
            <p>
              If you are not satisfied with our response, you may escalate to:
            </p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>
                <strong>Data Protection Board of India</strong> (once operational under DPDP Act 2023)
              </li>
              <li>
                <strong>Ministry of Electronics and IT (MeitY)</strong> —{" "}
                <a href="https://meity.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-400">
                  meity.gov.in ↗
                </a>
              </li>
              <li>
                Consumer Forum under Consumer Protection Act 2019
              </li>
            </ul>
          </Section>

          <Section title="Data Rights Request Template">
            <div className="p-4 bg-gray-900 rounded-xl font-mono text-sm text-gray-300 whitespace-pre-line">
{`Subject: Data Rights Request — [Access/Correction/Deletion/Portability]

Name: [Your full name]
Registered Email: [Email used to register]
Request Type: [Access / Correction / Deletion / Portability]
Description: [What data you want and why]

I request that ElectionGuide AI process this request within the 
timeframe required under the DPDP Act 2023.`}
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
