import { Navbar } from "@/components/Navbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-8">
              Terms of Service
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-8">
                <strong>Effective Date:</strong> October 29th, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using Tiny 11&apos;s services, you accept and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you may not use our services. These terms apply to all users of our Windows 11 optimization services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tiny 11 provides professional Windows 11 optimization services, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                  <li>Custom Windows 11 builds tailored to your hardware and preferences</li>
                  <li>System debloating and performance optimization</li>
                  <li>Privacy enhancement and security improvements</li>
                  <li>Access to pre-built optimized Windows 11 releases</li>
                  <li>Technical support and consultation services</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  <strong>Important:</strong> You are purchasing our optimization service, not Windows 11 itself. Microsoft Windows 11 must be obtained separately through official channels.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. User Accounts and Registration</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To access our services, you must:
                </p>
                <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                  <li>Create an account with accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Be at least 18 years old or have parental consent</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  You are responsible for all activities that occur under your account.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Payment Terms and Refunds</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Payment:</strong> All payments are processed securely through PayPal. Prices are in USD and are subject to change with notice.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Refund Policy:</strong> All purchases are final and non-refundable. This includes:
                </p>
                <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                  <li>Subscription plans and one-time purchases</li>
                  <li>Custom builds and optimization services</li>
                  <li>License keys and access codes</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  <strong>Customer Responsibility:</strong> It is your responsibility to ensure your PC meets the minimum requirements and can run the software before purchase.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. License and Usage Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Service License:</strong> We grant you a limited, non-exclusive, non-transferable license to use our optimization services for personal use only.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Restrictions:</strong> You may not:
                </p>
                <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                  <li>Resell, redistribute, or share our custom builds</li>
                  <li>Reverse engineer or attempt to extract our optimization methods</li>
                  <li>Use our services for commercial purposes without permission</li>
                  <li>Create derivative works based on our services</li>
                  <li>Reupload our work to any platform without written permission</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. User Responsibilities and Prohibited Uses</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You agree to use our services only for lawful purposes and in accordance with these terms. You may not:
                </p>
                <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                  <li>Use our services for any illegal or unauthorized purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt our services</li>
                  <li>Upload or transmit malicious code or harmful content</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on the rights of others</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Our Content:</strong> All content, trademarks, and intellectual property on our platform are owned by Tiny 11 or our licensors and are protected by copyright and other intellectual property laws.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Microsoft Windows:</strong> Windows 11 is a trademark of Microsoft Corporation. We are not affiliated with Microsoft and do not claim ownership of Windows 11.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>User Content:</strong> You retain ownership of any content you provide to us, but grant us a license to use it for providing our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Disclaimers and Warranties</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Service Availability:</strong> We strive to maintain high service availability but cannot guarantee uninterrupted access.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>No Warranties:</strong> Our services are provided &quot;as is&quot; without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Third-Party Software:</strong> We are not responsible for the performance or compatibility of third-party software or hardware with our optimized builds.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  To the fullest extent permitted by law, Tiny 11 shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising from your use of our services. Our total liability shall not exceed the amount you paid for the specific service giving rise to the claim.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
                <p className="text-gray-700 leading-relaxed">
                  You agree to indemnify and hold harmless Tiny 11 and its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of our services or violation of these terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may terminate or suspend your account and access to our services immediately, without prior notice, for any reason, including violation of these terms.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Upon termination, your right to use our services ceases immediately. Provisions of these terms that by their nature should survive termination shall remain in effect.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">12. Governing Law and Dispute Resolution</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  These terms shall be governed by and construed in accordance with International Law, applicable to all countries.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Any disputes arising from these terms or your use of our services shall be resolved through binding arbitration in accordance with international arbitration rules.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">13. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these terms at any time. We will notify users of significant changes by posting the updated terms on our website and updating the &quot;Effective Date.&quot; Your continued use of our services after changes constitutes acceptance of the updated terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">14. Severability</h2>
                <p className="text-gray-700 leading-relaxed">
                  If any provision of these terms is found to be unenforceable or invalid, the remaining provisions shall remain in full force and effect.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">15. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
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
