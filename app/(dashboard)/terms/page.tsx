import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service - SoloFI",
  description: "Terms of Service for SoloFI financial tracking application",
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 30, 2026</p>

        <p className="lead">
          Welcome to SoloFI. By accessing or using our service, you agree to be bound by these Terms of Service.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By creating an account or using SoloFI, you agree to these Terms of Service and our Privacy Policy. If you do not agree, do not use our service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          SoloFI is a financial tracking and planning application designed for self-employed professionals and consultants. Our services include:
        </p>
        <ul>
          <li>Net worth tracking and visualization</li>
          <li>Tax optimization calculators and analysis</li>
          <li>Credit card tracking and bonus management</li>
          <li>Retirement planning and projections</li>
          <li>Portfolio optimization recommendations</li>
          <li>Geo-arbitrage analysis</li>
        </ul>

        <h2>3. Not Financial Advice</h2>
        <p>
          <strong>SoloFI is for informational and educational purposes only.</strong> Our tools, calculators, and content do not constitute financial, tax, legal, or investment advice. Always consult with qualified professionals (CPAs, financial advisors, attorneys) before making financial decisions.
        </p>
        <p>
          We make no guarantees about the accuracy, completeness, or suitability of any calculations, projections, or recommendations provided by our service.
        </p>

        <h2>4. User Accounts</h2>
        <p>You are responsible for:</p>
        <ul>
          <li>Maintaining the confidentiality of your account credentials</li>
          <li>All activities that occur under your account</li>
          <li>Providing accurate and complete information</li>
          <li>Notifying us immediately of any unauthorized access</li>
        </ul>

        <h2>5. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the service for any unlawful purpose</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Interfere with or disrupt the service</li>
          <li>Reverse engineer or attempt to extract source code</li>
          <li>Use automated systems to access the service without permission</li>
          <li>Share your account with others</li>
        </ul>

        <h2>6. Subscriptions and Payments</h2>
        <h3>6.1 Free and Paid Plans</h3>
        <p>
          SoloFI offers both free and paid subscription plans. Paid plans provide access to additional features as described on our pricing page.
        </p>

        <h3>6.2 Billing</h3>
        <p>
          Paid subscriptions are billed in advance on a monthly or annual basis. Payment is processed through Stripe.
        </p>

        <h3>6.3 Cancellation</h3>
        <p>
          You may cancel your subscription at any time. Upon cancellation, you will retain access to paid features until the end of your current billing period.
        </p>

        <h3>6.4 Refunds</h3>
        <p>
          We offer a 14-day money-back guarantee for new subscriptions. Contact us within 14 days of your initial purchase for a full refund.
        </p>

        <h2>7. Data and Privacy</h2>
        <p>
          Your use of SoloFI is also governed by our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, which describes how we collect, use, and protect your data.
        </p>

        <h2>8. Intellectual Property</h2>
        <p>
          SoloFI and its content, features, and functionality are owned by us and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute our content without permission.
        </p>

        <h2>9. Third-Party Services</h2>
        <p>
          Our service integrates with third-party services including Clerk, Stripe, and Google Sheets. Your use of these integrations is subject to the respective third-party terms and privacy policies.
        </p>

        <h2>10. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
        </p>

        <h2>11. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, SOLOFI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR OTHER INTANGIBLE LOSSES.
        </p>

        <h2>12. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless SoloFI from any claims, damages, or expenses arising from your use of the service or violation of these terms.
        </p>

        <h2>13. Changes to Terms</h2>
        <p>
          We may modify these Terms at any time. We will notify you of significant changes by posting the updated terms and updating the &quot;Last updated&quot; date. Continued use after changes constitutes acceptance.
        </p>

        <h2>14. Termination</h2>
        <p>
          We may suspend or terminate your account at any time for violation of these terms or for any other reason at our discretion. Upon termination, your right to use the service will cease immediately.
        </p>

        <h2>15. Governing Law</h2>
        <p>
          These Terms shall be governed by the laws of the State of California, United States, without regard to conflict of law principles.
        </p>

        <h2>16. Contact Us</h2>
        <p>
          For questions about these Terms, contact us at:
        </p>
        <ul>
          <li>Email: <a href="mailto:legal@solofi.io">legal@solofi.io</a></li>
          <li>Website: <a href="https://solofi.io">solofi.io</a></li>
        </ul>

        <hr className="my-8" />

        <p className="text-sm text-muted-foreground">
          By using SoloFI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
        </p>
      </div>
    </div>
  );
}
