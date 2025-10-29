import { Navbar } from "@/components/Navbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-8">
              Privacy Policy
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-8">
                <strong>Effective Date:</strong> October 29th, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed">
                  Welcome to Tiny 11 ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Windows 11 optimization services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-medium mb-3">Personal Information</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When you use our services, we may collect:
                </p>
                <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6">
                  <li>Name and email address for account creation and communication</li>
                  <li>Payment information (processed securely through PayPal)</li>
                  <li>HT & Apidus license keys and subscription details</li>
                  <li>Support communications and feedback</li>
                  <li>System specifications for custom builds (when provided)</li>
                </ul>

                <h3 className="text-xl font-medium mb-3">Technical Information</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We automatically collect certain technical information:
                </p>
                <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                  <li>IP address and browser information</li>
                  <li>Device and operating system details</li>
                  <li>Usage patterns and service interactions</li>
                  <li>Download logs only (anonymized)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use your information to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                  <li>Provide and maintain our Windows 11 optimization services</li>
                  <li>Process payments and manage subscriptions</li>
                  <li>Create custom Tiny 11 builds tailored to your specifications</li>
                  <li>Send important service updates and notifications</li>
                  <li>Provide customer support and technical assistance</li>
                  <li>Improve our services and develop new features</li>
                  <li>Ensure compliance with our terms of service</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                  <li><strong>Service Providers:</strong> With trusted third-party vendors who assist in payment processing, email delivery, and technical support</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Business Transfers:</strong> In connection with any merger, sale, or acquisition of our business</li>
                  <li><strong>Consent:</strong> When you explicitly consent to sharing your information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Your Rights and Choices</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your account and associated data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request a copy of your data</li>
                  <li>Withdraw consent for data processing</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  To exercise these rights, please contact us at <a href="mailto:support@tiny11.ch" className="text-gray-800 hover:underline">support@tiny11.ch</a>.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed">
                  We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Account data is typically retained for the duration of your subscription plus a reasonable period thereafter.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us immediately.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top. Your continued use of our services after any changes constitutes acceptance of the updated Privacy Policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> <a href="mailto:support@tiny11.ch" className="text-gray-800 hover:underline">support@tiny11.ch</a>
                  </p>
                  <p className="text-gray-700 mt-2">
                    <strong>Discord:</strong> <a href="https://discord.gg/xBhDZ3abbx" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">Join our community</a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
