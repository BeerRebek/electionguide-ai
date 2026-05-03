import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy | ElectionGuide AI",
  description: "Cookie Policy for ElectionGuide AI — we use essential cookies only.",
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">
            ← Back to ElectionGuide AI
          </Link>
          <h1 className="text-4xl font-bold text-white mb-3">Cookie Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: May 3, 2025</p>
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="text-blue-300 text-sm">
              ✅ <strong>We use essential cookies only.</strong> No tracking, advertising, or
              analytics cookies without your consent.
            </p>
          </div>
        </div>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <Section title="What Are Cookies?">
            <p>
              Cookies are small text files stored on your device when you visit a website. They help
              websites remember your preferences and maintain login sessions.
            </p>
          </Section>

          <Section title="Cookies We Use">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-white py-3 pr-4">Cookie Name</th>
                    <th className="text-left text-white py-3 pr-4">Type</th>
                    <th className="text-left text-white py-3 pr-4">Purpose</th>
                    <th className="text-left text-white py-3">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {[
                    {
                      name: "sb-*-auth-token",
                      type: "Essential",
                      purpose: "Supabase authentication session",
                      duration: "Session",
                    },
                    {
                      name: "next-intl-locale",
                      type: "Functional",
                      purpose: "Remember your language preference (EN/HI)",
                      duration: "1 year",
                    },
                    {
                      name: "theme",
                      type: "Functional",
                      purpose: "Remember dark/light mode preference",
                      duration: "1 year",
                    },
                  ].map(({ name, type, purpose, duration }) => (
                    <tr key={name}>
                      <td className="py-3 pr-4 font-mono text-xs text-blue-300">{name}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            type === "Essential"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-blue-500/20 text-blue-300"
                          }`}
                        >
                          {type}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-400">{purpose}</td>
                      <td className="py-3 text-gray-400">{duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Cookies We Do NOT Use">
            <ul className="space-y-2 list-none pl-0">
              {[
                "❌ Google Analytics or any analytics tracking cookies",
                "❌ Facebook Pixel or social media tracking",
                "❌ Advertising or retargeting cookies",
                "❌ Cross-site tracking cookies",
                "❌ Fingerprinting scripts",
              ].map((item) => (
                <li key={item} className="p-3 bg-gray-900/50 rounded-lg text-gray-300">
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Third-Party Cookies">
            <p>
              Google Maps (used in Booth Finder) may set cookies when loaded. These are governed by
              Google&apos;s{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400"
              >
                Privacy Policy ↗
              </a>
              . We minimise Google Maps usage to only the Booth Finder page.
            </p>
          </Section>

          <Section title="Managing Cookies">
            <p>
              You can control cookies through your browser settings. Disabling essential cookies will
              prevent you from logging in. To clear cookies:
            </p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>
                <strong>Chrome:</strong> Settings → Privacy → Clear browsing data
              </li>
              <li>
                <strong>Firefox:</strong> Settings → Privacy → Cookies and Site Data
              </li>
              <li>
                <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
              </li>
            </ul>
          </Section>

          <Section title="Contact">
            <p>
              Questions about our cookie practices:{" "}
              <a href="mailto:privacy@electionguide.ai" className="text-blue-400">
                privacy@electionguide.ai
              </a>
            </p>
          </Section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-wrap gap-4 text-sm text-gray-500">
          <Link href="/privacy-policy" className="hover:text-gray-300">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-gray-300">Terms of Service</Link>
          <Link href="/accessibility-statement" className="hover:text-gray-300">Accessibility</Link>
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
