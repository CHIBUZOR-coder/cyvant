import type { Metadata } from "next";
import DarkSection from "@/components/ui/DarkSection";
import FadeIn from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How CYVANT collects, uses, and protects your personal data in accordance with the NDPR.",
};

const LAST_UPDATED = "14 August 2026";

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <DarkSection className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <FadeIn delay={0}>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Legal</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Privacy Policy
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-4 text-gray-400 text-sm">Last updated: {LAST_UPDATED}</p>
          </FadeIn>
        </div>
      </DarkSection>

      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8 prose prose-slate prose-headings:font-bold prose-a:text-blue-700 max-w-none">
        <FadeIn>
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Who We Are</h2>
            <p className="text-gray-600 leading-8">
              CYVANT is an AI and cybersecurity education company operating at{" "}
              <span className="font-medium text-gray-800">cyvant.org</span>. We are committed to protecting
              your personal data and complying with the Nigeria Data Protection Regulation (NDPR) 2019 and
              the Nigeria Data Protection Act (NDPA) 2023.
            </p>
            <p className="mt-3 text-gray-600 leading-8">
              For any data-related enquiries, contact us at:{" "}
              <a href="mailto:hello@cyvant.org" className="text-blue-700 hover:underline">
                hello@cyvant.org
              </a>
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. What Data We Collect</h2>
            <p className="text-gray-600 leading-8 mb-3">
              We only collect data you actively provide to us through our website forms:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><span className="font-medium text-gray-800">Full name</span> — to address you correctly</li>
              <li><span className="font-medium text-gray-800">Email address</span> — to send confirmations and follow-ups</li>
              <li><span className="font-medium text-gray-800">Phone / WhatsApp number</span> — to reach you about your enquiry</li>
              <li><span className="font-medium text-gray-800">Course or service interest</span> — to route your enquiry to the right team member</li>
              <li><span className="font-medium text-gray-800">Message content</span> — where you choose to include it</li>
            </ul>
            <p className="mt-4 text-gray-600 leading-8">
              We do not collect payment details, ID documents, or any sensitive personal data through this website.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Why We Collect It</h2>
            <p className="text-gray-600 leading-8 mb-3">
              Your data is collected solely to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Respond to your course or service enquiry</li>
              <li>Send you information about CYVANT programs relevant to your interest</li>
              <li>Confirm your webinar or discovery call registration</li>
              <li>Send you updates about upcoming programs (only where you have consented)</li>
            </ul>
            <p className="mt-4 text-gray-600 leading-8">
              We do not use your data for advertising, profiling, or any purpose beyond what is stated above.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. How We Store Your Data</h2>
            <p className="text-gray-600 leading-8">
              Your data is stored in HubSpot CRM, a cloud-based platform with SOC 2 Type II and ISO 27001
              certification. HubSpot processes data in accordance with GDPR and applicable international
              data protection standards. Data is retained for as long as you remain an active contact or
              enquirer. You may request deletion at any time (see Section 6).
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Who We Share It With</h2>
            <p className="text-gray-600 leading-8 mb-3">
              We do not sell your data. We share it only with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                <span className="font-medium text-gray-800">HubSpot</span> — our CRM for storing contact records
              </li>
              <li>
                <span className="font-medium text-gray-800">Resend</span> — our email delivery provider for sending confirmations
              </li>
              <li>
                <span className="font-medium text-gray-800">Calendly</span> — only if you proceed to book a discovery call
              </li>
            </ul>
            <p className="mt-4 text-gray-600 leading-8">
              All third-party providers are contractually bound to process your data only as instructed by
              CYVANT and to maintain appropriate security standards.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Your Rights</h2>
            <p className="text-gray-600 leading-8 mb-3">
              Under the NDPR and NDPA, you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><span className="font-medium text-gray-800">Access</span> — request a copy of the data we hold about you</li>
              <li><span className="font-medium text-gray-800">Correction</span> — ask us to correct inaccurate data</li>
              <li><span className="font-medium text-gray-800">Deletion</span> — request that we delete your data</li>
              <li><span className="font-medium text-gray-800">Withdrawal of consent</span> — opt out of communications at any time</li>
              <li><span className="font-medium text-gray-800">Objection</span> — object to how your data is being used</li>
            </ul>
            <p className="mt-4 text-gray-600 leading-8">
              To exercise any of these rights, email{" "}
              <a href="mailto:hello@cyvant.org" className="text-blue-700 hover:underline">
                hello@cyvant.org
              </a>{" "}
              with the subject line <span className="font-medium">"Data Request"</span>. We will respond within 30 days.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Cookies</h2>
            <p className="text-gray-600 leading-8">
              This website does not currently use tracking cookies, advertising pixels, or analytics tools
              that identify individual users. If this changes, this policy will be updated and you will be
              notified.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Changes to This Policy</h2>
            <p className="text-gray-600 leading-8">
              We may update this policy from time to time. The date at the top of this page reflects the
              most recent revision. Continued use of the site after changes are posted constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact</h2>
            <p className="text-gray-600 leading-8">
              CYVANT — Data Controller<br />
              Email:{" "}
              <a href="mailto:hello@cyvant.org" className="text-blue-700 hover:underline">
                hello@cyvant.org
              </a>
              <br />
              Website: cyvant.org
            </p>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
