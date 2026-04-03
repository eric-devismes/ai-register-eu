/**
 * Privacy Policy Page — GDPR-compliant privacy practices for AI Compass EU.
 *
 * URL: /privacy
 */

import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — AI Compass EU",
  description: "How AI Compass EU collects, uses, and protects your personal data. GDPR-compliant privacy practices.",
};

export default function PrivacyPage() {
  const lastUpdated = "3 April 2026";

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: {lastUpdated}</p>

          <div className="mt-10 space-y-10 text-sm leading-relaxed text-gray-700">

            {/* 1. Who we are */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">1. Who We Are</h2>
              <p className="mt-3">
                AI Compass EU is an independent AI compliance intelligence platform for European decision-makers.
                We rate AI systems against EU regulatory frameworks (AI Act, GDPR, DORA, and sector-specific regulations).
              </p>
              <p className="mt-2">
                For the purposes of the General Data Protection Regulation (GDPR), the data controller is AI Compass EU.
                Contact: <a href="mailto:privacy@aicompass.eu" className="text-[#003399] hover:underline">privacy@aicompass.eu</a>
              </p>
            </section>

            {/* 2. What data we collect */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">2. What Data We Collect</h2>
              <p className="mt-3">We collect the minimum data necessary to provide our services:</p>
              <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Data</th>
                      <th className="px-4 py-3">Purpose</th>
                      <th className="px-4 py-3">Legal Basis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 font-medium">Email address</td>
                      <td className="px-4 py-3">Account creation, magic link authentication, digest delivery</td>
                      <td className="px-4 py-3">Consent (Art. 6(1)(a))</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Topic preferences</td>
                      <td className="px-4 py-3">Personalise your news feed and digest emails (which frameworks and AI systems you follow)</td>
                      <td className="px-4 py-3">Consent (Art. 6(1)(a))</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Consent record</td>
                      <td className="px-4 py-3">Prove that you gave consent, as required by GDPR</td>
                      <td className="px-4 py-3">Legal obligation (Art. 6(1)(c))</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Digest delivery log</td>
                      <td className="px-4 py-3">Track which digests were sent (date, item count, delivery status)</td>
                      <td className="px-4 py-3">Legitimate interest (Art. 6(1)(f))</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 font-semibold text-gray-900">What we do NOT collect:</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>No names, phone numbers, or physical addresses</li>
                <li>No payment or financial information (we do not process payments yet)</li>
                <li>No browsing history, cookies for tracking, or behavioural profiling</li>
                <li>No IP address logging beyond standard server access logs</li>
                <li>No third-party analytics or advertising trackers</li>
              </ul>
            </section>

            {/* 3. How we use your data */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">3. How We Use Your Data</h2>
              <p className="mt-3">Your data is used exclusively for:</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li><strong>Authentication:</strong> Sending you a magic link to sign in (no password stored)</li>
                <li><strong>Personalisation:</strong> Showing you news about the frameworks and AI systems you selected</li>
                <li><strong>Email digest:</strong> Sending you periodic updates about your selected topics</li>
              </ul>
              <p className="mt-3">We will never sell, rent, or share your data with third parties for marketing purposes.</p>
            </section>

            {/* 4. Your rights */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">4. Your Rights Under GDPR</h2>
              <p className="mt-3">As an EU/EEA resident, you have the following rights:</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">Right of access (Article 15)</p>
                  <p className="mt-1 text-gray-600">You can view all data we hold about you on your <a href="/account" className="text-[#003399] hover:underline">account page</a>.</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">Right to data portability (Article 20)</p>
                  <p className="mt-1 text-gray-600">You can download all your data as a JSON file from your <a href="/account" className="text-[#003399] hover:underline">account page</a> using the &ldquo;Download JSON&rdquo; button.</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">Right to erasure (Article 17)</p>
                  <p className="mt-1 text-gray-600">You can permanently delete your account and all associated data from your <a href="/account" className="text-[#003399] hover:underline">account page</a>. Deletion is immediate and irreversible.</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">Right to withdraw consent</p>
                  <p className="mt-1 text-gray-600">You can unsubscribe from digest emails at any time using the one-click link in any email, or by changing your preferences on your <a href="/account" className="text-[#003399] hover:underline">account page</a>.</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">Right to rectification (Article 16)</p>
                  <p className="mt-1 text-gray-600">You can update your topic preferences at any time. To change your email address, delete your account and create a new one.</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">Right to lodge a complaint</p>
                  <p className="mt-1 text-gray-600">You have the right to lodge a complaint with your national data protection authority. In France: <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#003399] hover:underline">CNIL</a>.</p>
                </div>
              </div>
            </section>

            {/* 5. Data storage and security */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">5. Data Storage &amp; Security</h2>
              <ul className="mt-3 list-disc pl-5 space-y-1">
                <li>Data is stored in a PostgreSQL database hosted in the EU/EEA</li>
                <li>All data is encrypted at rest (AES-256) and in transit (TLS 1.2+)</li>
                <li>Authentication uses cryptographically signed tokens (JWT) — no passwords are stored</li>
                <li>Magic link tokens are hashed (SHA-256) before storage and are single-use with a 15-minute expiry</li>
                <li>Session tokens expire after 30 days</li>
                <li>Access to the database is restricted to authorised personnel only</li>
              </ul>
            </section>

            {/* 6. Data retention */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">6. Data Retention</h2>
              <ul className="mt-3 list-disc pl-5 space-y-1">
                <li><strong>Active accounts:</strong> Data retained for as long as your account exists</li>
                <li><strong>Deleted accounts:</strong> All data permanently removed immediately upon deletion — no backup retention</li>
                <li><strong>Digest logs:</strong> Retained for 12 months for delivery monitoring, then automatically purged</li>
                <li><strong>Consent records:</strong> Retained as long as the account exists, as required by GDPR Article 7(1)</li>
              </ul>
            </section>

            {/* 7. Third-party processors */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">7. Third-Party Processors</h2>
              <p className="mt-3">We use the following third-party services to operate the platform:</p>
              <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Purpose</th>
                      <th className="px-4 py-3">Data Processed</th>
                      <th className="px-4 py-3">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 font-medium">Vercel</td>
                      <td className="px-4 py-3">Website hosting</td>
                      <td className="px-4 py-3">Standard web requests</td>
                      <td className="px-4 py-3">EU (Frankfurt)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Resend</td>
                      <td className="px-4 py-3">Email delivery</td>
                      <td className="px-4 py-3">Email address, email content</td>
                      <td className="px-4 py-3">US (with EU SCCs)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">All third-party processors are bound by data processing agreements. We do not share data with any other parties.</p>
            </section>

            {/* 8. International transfers */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">8. International Data Transfers</h2>
              <p className="mt-3">
                Email delivery via Resend may involve processing in the United States.
                This transfer is protected by EU Standard Contractual Clauses (SCCs) in accordance with GDPR Chapter V.
                All other data processing occurs within the EU/EEA.
              </p>
            </section>

            {/* 9. Cookies */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">9. Cookies</h2>
              <p className="mt-3">We use only strictly necessary cookies:</p>
              <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Cookie</th>
                      <th className="px-4 py-3">Purpose</th>
                      <th className="px-4 py-3">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs">subscriber-session</td>
                      <td className="px-4 py-3">Keeps you signed in</td>
                      <td className="px-4 py-3">30 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">We do not use tracking cookies, analytics cookies, or third-party advertising cookies. No cookie consent banner is needed because we only use strictly necessary cookies (GDPR Recital 30, ePrivacy Directive Art. 5(3) exemption).</p>
            </section>

            {/* 10. Changes */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">10. Changes to This Policy</h2>
              <p className="mt-3">
                We may update this privacy policy from time to time. If we make material changes,
                we will notify affected users via email before the changes take effect.
                The &ldquo;last updated&rdquo; date at the top of this page indicates when the policy was last revised.
              </p>
            </section>

            {/* 11. Contact */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">11. Contact Us</h2>
              <p className="mt-3">
                For any questions about this privacy policy or to exercise your data rights, contact us at:
              </p>
              <p className="mt-2">
                <a href="mailto:privacy@aicompass.eu" className="text-[#003399] hover:underline">privacy@aicompass.eu</a>
              </p>
              <p className="mt-4 text-xs text-gray-400">
                If you are not satisfied with our response, you have the right to lodge a complaint
                with your national data protection supervisory authority.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
