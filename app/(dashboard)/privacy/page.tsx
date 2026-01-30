import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Shield, Database, Lock, Users, Mail, Globe, FileText } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - SoloFI",
  description: "Privacy Policy for SoloFI financial tracking application",
};

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="text-muted-foreground space-y-3">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

function ListItem({ title, description }: { title: string; description: string }) {
  return (
    <li className="flex gap-2">
      <span className="text-blue-500 mt-1">•</span>
      <span><strong className="text-foreground">{title}:</strong> {description}</span>
    </li>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
          <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: January 30, 2026</p>
      </div>

      {/* Intro */}
      <Card className="mb-8 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            SoloFI is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.
          </p>
        </CardContent>
      </Card>

      {/* Sections */}
      <Section icon={Database} title="Information We Collect">
        <p className="font-medium text-foreground mb-2">Account Information</p>
        <ul className="list-none space-y-1 mb-4 ml-4">
          <li>• Email address and name (via Clerk authentication)</li>
        </ul>

        <p className="font-medium text-foreground mb-2">Financial Data You Provide</p>
        <ul className="list-none space-y-2 ml-4">
          <ListItem title="Net Worth" description="Assets, debts, income, and expenses" />
          <ListItem title="Credit Cards" description="Card names, last 4 digits, fees, bonuses (never full card numbers)" />
          <ListItem title="Tax Info" description="Tax return data for optimization analysis" />
          <ListItem title="Portfolio" description="Investment holdings and account types" />
          <ListItem title="Scenarios" description="Retirement projections and location preferences" />
        </ul>
      </Section>

      <Section icon={Lock} title="Payment & Third-Party Services">
        <p className="mb-3">
          <strong className="text-foreground">Stripe</strong> handles all payment processing. We never store your full credit card details.
        </p>
        <p className="mb-3">
          <strong className="text-foreground">Google Sheets</strong> integration only accesses sheets you explicitly authorize.
        </p>
        <p>
          <strong className="text-foreground">Vercel Analytics</strong> collects anonymous usage data to improve our service.
        </p>
      </Section>

      <Section icon={FileText} title="How We Use Your Data">
        <ul className="list-none space-y-2 ml-4">
          <li>• Provide financial tracking, calculations, and projections</li>
          <li>• Process payments and manage subscriptions</li>
          <li>• Send service updates and newsletters (with consent)</li>
          <li>• Improve our services and user experience</li>
          <li>• Comply with legal obligations</li>
        </ul>
      </Section>

      <Section icon={Shield} title="Data Security">
        <p className="mb-3">Your data is protected with:</p>
        <ul className="list-none space-y-2 ml-4">
          <li>• <strong className="text-foreground">Encryption:</strong> TLS/SSL for all data transmission</li>
          <li>• <strong className="text-foreground">Secure Storage:</strong> Supabase with row-level security</li>
          <li>• <strong className="text-foreground">Authentication:</strong> Enterprise-grade security via Clerk</li>
        </ul>
      </Section>

      <Section icon={Users} title="Data Sharing">
        <p className="mb-3 font-medium text-foreground">We never sell your data.</p>
        <p>We only share data with service providers (Clerk, Stripe, Supabase, Vercel) and when required by law.</p>
      </Section>

      <Section icon={Globe} title="Your Rights">
        <ul className="list-none space-y-2 ml-4">
          <ListItem title="Access" description="Request a copy of your data" />
          <ListItem title="Correction" description="Update or correct your information" />
          <ListItem title="Deletion" description="Request deletion within 30 days" />
          <ListItem title="Export" description="Download your data in portable format" />
          <ListItem title="Opt-out" description="Unsubscribe from marketing emails anytime" />
        </ul>
      </Section>

      <Section icon={Mail} title="Contact Us">
        <p>Questions about this policy? Contact us at:</p>
        <p className="mt-2">
          <a href="mailto:privacy@solofi.io" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            privacy@solofi.io
          </a>
        </p>
      </Section>

      {/* Footer */}
      <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
        <CardContent className="py-4">
          <p className="text-center text-sm text-muted-foreground">
            By using SoloFI, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
