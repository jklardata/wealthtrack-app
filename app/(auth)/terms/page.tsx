import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
            <FileText className="h-8 w-8 text-[#0D3F4A]" />
            <h1 className="text-[36px] font-semibold text-[#10182C]">Terms of Service</h1>
          </div>
          <p className="text-[15px] text-slate-600">
            Last updated: February 4, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Agreement to Terms</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                These Terms of Service ("Terms") govern your access to and use of SoloFI's website,
                services, and applications (collectively, the "Service"). By accessing or using the
                Service, you agree to be bound by these Terms. If you do not agree to these Terms,
                do not use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Description of Service</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                SoloFI is a financial planning platform designed for independent professionals and
                self-employed individuals. Our Service provides:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-slate-700">
                <li>Financial independence calculations and retirement planning tools</li>
                <li>Tax optimization strategies and calculators</li>
                <li>Net worth projections and lifetime income modeling</li>
                <li>Educational content and financial guidance</li>
              </ul>
              <p className="text-[15px] text-slate-700 leading-relaxed mt-4">
                <strong>Important:</strong> SoloFI provides educational information and planning tools only.
                We are not financial advisors, tax professionals, or investment advisors. Our Service does
                not constitute financial, tax, or investment advice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Eligibility</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed">
                You must be at least 18 years old to use the Service. By using the Service, you represent
                and warrant that you meet this age requirement and have the legal capacity to enter into
                these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Account Registration</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                To access certain features of the Service, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-slate-700">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your information to keep it accurate and current</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized access or security breach</li>
                <li>Accept responsibility for all activities that occur under your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Subscription and Payment</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                SoloFI offers both free and paid subscription tiers:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-slate-700 mb-4">
                <li><strong>Free Tier:</strong> Access to basic financial planning tools and calculators</li>
                <li><strong>Pro Tier:</strong> Access to advanced features including lifetime income projections, retirement scenarios, and premium calculators</li>
              </ul>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                <strong>Billing and Renewals:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-slate-700 mb-4">
                <li>Pro subscriptions are billed on a recurring basis (monthly or annually)</li>
                <li>Your subscription will automatically renew unless canceled before the renewal date</li>
                <li>You can cancel your subscription at any time through your account settings</li>
                <li>All payments are processed securely through Stripe</li>
                <li>Refunds are provided in accordance with our refund policy</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Acceptable Use</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-slate-700">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Infringe on our or any third party's intellectual property rights</li>
                <li>Transmit any viruses, malware, or other malicious code</li>
                <li>Attempt to gain unauthorized access to the Service or related systems</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use automated systems (bots, scrapers) to access the Service</li>
                <li>Impersonate another person or entity</li>
                <li>Share your account credentials with others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Intellectual Property</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                The Service and its original content, features, and functionality are owned by SoloFI
                and are protected by international copyright, trademark, patent, trade secret, and other
                intellectual property laws.
              </p>
              <p className="text-[15px] text-slate-700 leading-relaxed">
                You may not copy, modify, distribute, sell, or lease any part of our Service or included
                software without our express written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Disclaimer of Warranties</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-[15px] text-slate-700 leading-relaxed font-medium mb-2">
                  IMPORTANT DISCLAIMER:
                </p>
                <p className="text-[15px] text-slate-700 leading-relaxed">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
                  EITHER EXPRESS OR IMPLIED. SOLOFI DOES NOT PROVIDE FINANCIAL, TAX, OR INVESTMENT ADVICE.
                  ALL CALCULATIONS, PROJECTIONS, AND RECOMMENDATIONS ARE FOR EDUCATIONAL PURPOSES ONLY.
                </p>
              </div>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                We make no warranties that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-slate-700">
                <li>The Service will meet your requirements or expectations</li>
                <li>The Service will be uninterrupted, timely, secure, or error-free</li>
                <li>The results or calculations obtained from the Service will be accurate or reliable</li>
                <li>Any errors in the Service will be corrected</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Limitation of Liability</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, SOLOFI SHALL NOT BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR
                REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL,
                OR OTHER INTANGIBLE LOSSES.
              </p>
              <p className="text-[15px] text-slate-700 leading-relaxed">
                This includes any damages resulting from financial decisions made based on information
                or calculations provided by the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Indemnification</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed">
                You agree to indemnify, defend, and hold harmless SoloFI, its officers, directors,
                employees, and agents from any claims, liabilities, damages, losses, and expenses,
                including reasonable attorney's fees, arising out of or in any way connected with
                your access to or use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Third-Party Services</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                Our Service uses third-party services including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[15px] text-slate-700">
                <li><strong>Clerk:</strong> Authentication and user management</li>
                <li><strong>Stripe:</strong> Payment processing</li>
                <li><strong>Supabase:</strong> Data storage and management</li>
              </ul>
              <p className="text-[15px] text-slate-700 leading-relaxed mt-4">
                Your use of these third-party services is subject to their respective terms and privacy policies.
                We are not responsible for the practices or content of third-party services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Termination</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                We reserve the right to suspend or terminate your access to the Service at any time,
                with or without notice, for any reason, including violation of these Terms.
              </p>
              <p className="text-[15px] text-slate-700 leading-relaxed">
                You may terminate your account at any time by contacting us. Upon termination, your
                right to use the Service will immediately cease, but certain provisions of these
                Terms will survive termination.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Changes to Terms</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed">
                We may modify these Terms at any time. We will notify you of material changes by
                posting the new Terms on this page and updating the "Last updated" date. Your
                continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Governing Law</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of
                [Your State/Country], without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-[24px] font-semibold text-[#10182C] mb-4">Contact Us</h2>
              <p className="text-[15px] text-slate-700 leading-relaxed mb-4">
                If you have questions about these Terms, please contact us:
              </p>
              <div className="bg-slate-50 rounded-lg p-4 text-[15px] text-slate-700">
                <p className="mb-2"><strong>Email:</strong> <a href="mailto:support@solofi.io" className="text-[#0D3F4A] hover:text-[#0a2f37]">support@solofi.io</a></p>
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
              <Link href="/privacy" className="hover:text-[#10182C]">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#10182C] font-medium">
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
