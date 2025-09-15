import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Openbase',
  description: 'Terms and conditions for using Openbase services',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-6 text-lg">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using Openbase, you accept and agree to be bound by
            the terms and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">2. Use License</h2>
          <p>
            Permission is granted to temporarily use Openbase for personal,
            non-commercial transitory viewing only. This is the grant of a
            license, not a transfer of title, and under this license you may
            not:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>modify or copy the materials;</li>
            <li>
              use the materials for any commercial purpose, or for any public
              display (commercial or non-commercial);
            </li>
            <li>
              attempt to decompile or reverse engineer any software contained on
              Openbase;
            </li>
            <li>
              remove any copyright or other proprietary notations from the
              materials;
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide information
            that is accurate, complete, and current at all times. You are
            responsible for safeguarding the password and for all activities
            that occur under your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">4. Privacy</h2>
          <p>
            Your use of our service is also governed by our Privacy Policy.
            Please review our Privacy Policy, which also governs the site and
            informs users of our data collection practices.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">5. Prohibited Uses</h2>
          <p>You may not use our service:</p>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              For any unlawful purpose or to solicit others to perform unlawful
              acts;
            </li>
            <li>
              To violate any international, federal, provincial, or state
              regulations, rules, laws, or local ordinances;
            </li>
            <li>
              To infringe upon or violate our intellectual property rights or
              the intellectual property rights of others;
            </li>
            <li>
              To harass, abuse, insult, harm, defame, slander, disparage,
              intimidate, or discriminate;
            </li>
            <li>To submit false or misleading information;</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">6. Disclaimer</h2>
          <p>
            The materials on Openbase are provided on an &apos;as is&apos;
            basis. Openbase makes no warranties, expressed or implied, and
            hereby disclaims and negates all other warranties including, without
            limitation, implied warranties or conditions of merchantability,
            fitness for a particular purpose, or non-infringement of
            intellectual property or other violation of rights.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">7. Limitations</h2>
          <p>
            In no event shall Openbase or its suppliers be liable for any
            damages (including, without limitation, damages for loss of data or
            profit, or due to business interruption) arising out of the use or
            inability to use the materials on Openbase, even if Openbase or an
            Openbase authorized representative has been notified orally or in
            writing of the possibility of such damage.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">8. Revisions</h2>
          <p>
            Openbase may revise these terms of service at any time without
            notice. By using this service, you are agreeing to be bound by the
            current version of these terms of service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">
            9. Contact Information
          </h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="mt-2">
            Email: legal@openbase.com
            <br />
            Address: 123 Tech Street, San Francisco, CA 94105
          </p>
        </section>
      </div>
    </div>
  );
}
