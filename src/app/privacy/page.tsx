import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Openbase',
  description: 'Privacy policy and data protection information for Openbase',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-6 text-lg">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            1. Information We Collect
          </h2>
          <p>
            We collect information you provide directly to us, such as when you
            create an account, subscribe to our newsletter, or contact us for
            support.
          </p>
          <h3 className="mt-4 mb-2 text-xl font-semibold">
            Personal Information
          </h3>
          <ul className="list-disc space-y-2 pl-6">
            <li>Name and email address</li>
            <li>Account credentials</li>
            <li>
              Payment information (processed securely through third-party
              providers)
            </li>
            <li>Communication preferences</li>
          </ul>
          <h3 className="mt-4 mb-2 text-xl font-semibold">Usage Information</h3>
          <ul className="list-disc space-y-2 pl-6">
            <li>Log data and device information</li>
            <li>Usage patterns and preferences</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            2. How We Use Your Information
          </h2>
          <p>We use the information we collect to:</p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>
              Send technical notices, updates, security alerts, and support
              messages
            </li>
            <li>
              Respond to your comments, questions, and customer service requests
            </li>
            <li>
              Communicate with you about products, services, offers, and events
            </li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>
              Detect, investigate, and prevent fraudulent transactions and other
              illegal activities
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            3. Information Sharing
          </h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal
            information to third parties. We may share your information in the
            following situations:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>With your consent or at your direction</li>
            <li>With service providers who perform services on our behalf</li>
            <li>To comply with legal obligations</li>
            <li>To protect and defend our rights and property</li>
            <li>
              In connection with a business transaction (merger, acquisition,
              etc.)
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction. However, no method of
            transmission over the Internet or electronic storage is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            5. Your Rights and Choices
          </h2>
          <h3 className="mt-4 mb-2 text-xl font-semibold">
            Account Information
          </h3>
          <p>
            You may update, correct, or delete your account information at any
            time by logging into your account settings.
          </p>
          <h3 className="mt-4 mb-2 text-xl font-semibold">Communications</h3>
          <p>
            You may opt-out of receiving promotional emails by following the
            instructions in those emails or through your account settings.
          </p>
          <h3 className="mt-4 mb-2 text-xl font-semibold">Cookies</h3>
          <p>
            Most web browsers are set to accept cookies by default. You can
            usually choose to set your browser to remove or reject browser
            cookies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            6. Children&apos;s Privacy
          </h2>
          <p>
            Our service is not directed to individuals under the age of 13. We
            do not knowingly collect personal information from children under
            13. If you become aware that a child has provided us with personal
            information, please contact us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            7. International Data Transfers
          </h2>
          <p>
            Your information may be transferred to and maintained on computers
            located outside of your state, province, country, or other
            governmental jurisdiction where the data protection laws may differ
            from those from your jurisdiction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            8. Changes to This Policy
          </h2>
          <p>
            We may update this privacy policy from time to time. We will notify
            you of any changes by posting the new privacy policy on this page
            and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at:
          </p>
          <p className="mt-2">
            Email: privacy@openbase.com
            <br />
            Address: 123 Tech Street, San Francisco, CA 94105
            <br />
            Phone: +1 (555) 123-4567
          </p>
        </section>
      </div>
    </div>
  );
}
