import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FBF7F0]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-700 to-teal-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-semibold text-[#10182C]">SoloFI</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Link */}
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 text-[14px] text-[#0D3F4A] hover:text-[#0a2f37] font-medium mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-8 w-8 text-[#0D3F4A]" />
            <h1 className="text-[36px] font-semibold text-[#10182C]">Privacy Policy</h1>
          </div>
          <p className="text-[15px] text-slate-600">
            Last updated: February 4, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Introduction</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                At SoloFI, we take your privacy seriously. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you use our financial planning platform.
                Please read this privacy policy carefully. If you do not agree with the terms of this
                privacy policy, please do not access the site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Information We Collect</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-slate-700 mb-4">
                <li>Account information (name, email address, password)</li>
                <li>Financial information (income, expenses, retirement goals)</li>
                <li>Profile information (age, location, employment status)</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Communication data (support requests, feedback)</li>
              </ul>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                We automatically collect certain information when you visit our platform:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-slate-700">
                <li>Log data (IP address, browser type, pages visited)</li>
                <li>Device information (operating system, device identifiers)</li>
                <li>Usage data (features used, time spent, interactions)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">How We Use Your Information</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-slate-700">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send transaction notifications</li>
                <li>Provide personalized financial calculations and recommendations</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, prevent, and address technical issues and fraudulent activity</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Data Security</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-slate-700">
                <li><strong>Encryption:</strong> All data is encrypted in transit using 256-bit SSL/TLS encryption</li>
                <li><strong>Authentication:</strong> Secure authentication powered by Clerk with optional two-factor authentication</li>
                <li><strong>Storage:</strong> Data is stored securely using Supabase with row-level security policies</li>
                <li><strong>Access Controls:</strong> Strict access controls limit who can view your information</li>
                <li><strong>Regular Audits:</strong> We conduct regular security audits and updates</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Sharing Your Information</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-slate-700">
                <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (Clerk for authentication, Stripe for payments, Supabase for data storage)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to respond to legal process</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Your Rights and Choices</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                You have the following rights regarding your information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-slate-700">
                <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Export:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-out:</strong> Opt out of marketing communications at any time</li>
              </ul>
              <p className="text-[15px] text-slate-700 leading-relaxed mt-4">
                To exercise any of these rights, please contact us at <a href="mailto:privacy@solofi.io" className="text-[#0D3F4A] hover:text-[#0a2f37] font-medium">privacy@solofi.io</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Cookies and Tracking</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to collect and track information about your
                use of our platform. You can control cookies through your browser settings, though some
                features may not function properly if cookies are disabled.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Children's Privacy</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed">
                Our platform is not intended for children under 18 years of age. We do not knowingly
                collect personal information from children under 18. If you believe we have collected
                information from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Changes to This Policy</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes
                by posting the new privacy policy on this page and updating the "Last updated" date.
                We encourage you to review this privacy policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Contact Us</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                If you have questions or concerns about this privacy policy or our data practices,
                please contact us:
              </p>
              <div className="bg-slate-50 rounded-lg p-4 text-[15px] text-slate-700">
                <p className="mb-2"><strong>Email:</strong> <a href="mailto:privacy@solofi.io" className="text-[#0D3F4A] hover:text-[#0a2f37]">privacy@solofi.io</a></p>
                <p className="mb-2"><strong>Website:</strong> <a href="https://solofi.io" className="text-[#0D3F4A] hover:text-[#0a2f37]">solofi.io</a></p>
                <p><strong>Mailing Address:</strong> SoloFI, [Your Address]</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-[13px] text-slate-600">
              <Link href="/privacy" className="hover:text-[#10182C] font-medium">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#10182C]">
                Terms of Service
              </Link>
              <span>© 2025 SoloFI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
