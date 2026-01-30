import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - SoloFI",
  description: "Privacy Policy for SoloFI financial tracking application",
};

export default function PrivacyPolicyPage() {
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
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 30, 2026</p>

        <p className="lead">
          SoloFI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our financial tracking application.
        </p>

        <h2>1. Information We Collect</h2>

        <h3>1.1 Account Information</h3>
        <p>When you create an account, we collect:</p>
        <ul>
          <li>Email address</li>
          <li>Name (optional)</li>
          <li>Authentication data managed by Clerk (our authentication provider)</li>
        </ul>

        <h3>1.2 Financial Data You Provide</h3>
        <p>To provide our services, you may voluntarily enter:</p>
        <ul>
          <li><strong>Net Worth Data:</strong> Asset values (stocks, bonds, cash, real estate, commodities), debt amounts, income, and expenses</li>
          <li><strong>Credit Card Information:</strong> Card names, last four digits, annual fees, signup bonuses, and spending tracking (we never collect full card numbers)</li>
          <li><strong>Tax Information:</strong> Tax return data you upload or enter for tax optimization analysis</li>
          <li><strong>Consulting/Income Data:</strong> Gross income, tax rates, and client information for retirement planning</li>
          <li><strong>Portfolio Holdings:</strong> Investment symbols, shares, cost basis, and account types</li>
          <li><strong>Financial Scenarios:</strong> Location preferences, spending estimates, and retirement projections</li>
        </ul>

        <h3>1.3 Payment Information</h3>
        <p>
          Payment processing is handled by Stripe. We do not store your full credit card details. Stripe may collect payment card numbers, billing addresses, and transaction history. See <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripe&apos;s Privacy Policy</a>.
        </p>

        <h3>1.4 Google Sheets Integration</h3>
        <p>
          If you connect Google Sheets, we store only the Sheet ID to sync your data. We access only the specific sheets you authorize and do not access other Google account data.
        </p>

        <h3>1.5 Newsletter Subscription</h3>
        <p>
          If you subscribe to our newsletter, we collect your email address. You can unsubscribe at any time.
        </p>

        <h3>1.6 Automatically Collected Information</h3>
        <p>We may automatically collect:</p>
        <ul>
          <li>Device and browser information</li>
          <li>IP address</li>
          <li>Usage analytics (via Vercel Analytics)</li>
          <li>Cookies for authentication and preferences</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide and maintain our financial tracking services</li>
          <li>Calculate net worth, tax estimates, and retirement projections</li>
          <li>Process payments and manage subscriptions</li>
          <li>Send service-related communications</li>
          <li>Send newsletter updates (with your consent)</li>
          <li>Improve our services and user experience</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>3. Data Storage and Security</h2>
        <p>
          Your data is stored securely using Supabase (PostgreSQL database) with encryption at rest and in transit. We implement industry-standard security measures including:
        </p>
        <ul>
          <li>TLS/SSL encryption for all data transmission</li>
          <li>Row-level security policies</li>
          <li>Secure authentication via Clerk</li>
          <li>Regular security updates</li>
        </ul>

        <h2>4. Data Sharing</h2>
        <p>We do not sell your personal data. We may share data with:</p>
        <ul>
          <li><strong>Service Providers:</strong> Clerk (authentication), Stripe (payments), Supabase (database), Vercel (hosting)</li>
          <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
        </ul>

        <h2>5. Your Rights and Choices</h2>
        <p>You have the right to:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of your data</li>
          <li><strong>Correction:</strong> Update or correct your information</li>
          <li><strong>Deletion:</strong> Request deletion of your account and data</li>
          <li><strong>Export:</strong> Export your data in a portable format</li>
          <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
        </ul>
        <p>
          To exercise these rights, contact us at <a href="mailto:privacy@solofi.io">privacy@solofi.io</a>.
        </p>

        <h2>6. Data Retention</h2>
        <p>
          We retain your data for as long as your account is active or as needed to provide services. Upon account deletion, we will delete your personal data within 30 days, except where retention is required by law.
        </p>

        <h2>7. Children&apos;s Privacy</h2>
        <p>
          SoloFI is not intended for users under 18 years of age. We do not knowingly collect data from children.
        </p>

        <h2>8. International Data Transfers</h2>
        <p>
          Your data may be processed in the United States and other countries where our service providers operate. We ensure appropriate safeguards are in place for international transfers.
        </p>

        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
        </p>

        <h2>10. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at:
        </p>
        <ul>
          <li>Email: <a href="mailto:privacy@solofi.io">privacy@solofi.io</a></li>
          <li>Website: <a href="https://solofi.io">solofi.io</a></li>
        </ul>

        <hr className="my-8" />

        <p className="text-sm text-muted-foreground">
          By using SoloFI, you acknowledge that you have read and understood this Privacy Policy.
        </p>
      </div>
    </div>
  );
}
