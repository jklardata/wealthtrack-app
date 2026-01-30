import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileText, AlertTriangle, CreditCard, User, Ban, Shield, Scale, Mail } from "lucide-react";

export const metadata = {
  title: "Terms of Service - SoloFI",
  description: "Terms of Service for SoloFI financial tracking application",
};

function Section({ icon: Icon, title, children, variant = "default" }: { icon: React.ElementType; title: string; children: React.ReactNode; variant?: "default" | "warning" }) {
  const bgColor = variant === "warning" ? "bg-amber-100 dark:bg-amber-900/30" : "bg-blue-100 dark:bg-blue-900/30";
  const iconColor = variant === "warning" ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400";

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${bgColor}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
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

export default function TermsOfServicePage() {
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
          <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: January 30, 2026</p>
      </div>

      {/* Intro */}
      <Card className="mb-8 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            By accessing or using SoloFI, you agree to be bound by these Terms of Service and our{" "}
            <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>.
          </p>
        </CardContent>
      </Card>

      {/* Important Disclaimer */}
      <Card className="mb-6 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold text-amber-800 dark:text-amber-200">Important Disclaimer</h2>
          </div>
          <div className="text-amber-800 dark:text-amber-200 space-y-3">
            <p className="font-medium">
              SoloFI is for informational and educational purposes only.
            </p>
            <p>
              Our tools and calculators do not constitute financial, tax, legal, or investment advice.
              Always consult qualified professionals (CPAs, financial advisors, attorneys) before making financial decisions.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <Section icon={FileText} title="Our Services">
        <p className="mb-3">SoloFI provides financial tracking tools for self-employed professionals:</p>
        <ul className="list-none space-y-2 ml-4">
          <li>• Net worth tracking and visualization</li>
          <li>• Tax optimization calculators</li>
          <li>• Credit card tracking and bonus management</li>
          <li>• Retirement planning and projections</li>
          <li>• Portfolio optimization recommendations</li>
          <li>• Geo-arbitrage analysis</li>
        </ul>
      </Section>

      <Section icon={User} title="Your Account">
        <p className="mb-3">You are responsible for:</p>
        <ul className="list-none space-y-2 ml-4">
          <li>• Keeping your account credentials confidential</li>
          <li>• All activities under your account</li>
          <li>• Providing accurate information</li>
          <li>• Notifying us of unauthorized access</li>
        </ul>
      </Section>

      <Section icon={CreditCard} title="Subscriptions & Payments">
        <div className="space-y-4">
          <div>
            <p className="font-medium text-foreground mb-1">Plans</p>
            <p>We offer free and paid plans. Paid plans unlock additional features.</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">Billing</p>
            <p>Subscriptions are billed monthly or annually via Stripe.</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">Cancellation</p>
            <p>Cancel anytime. Access continues until your billing period ends.</p>
          </div>
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <p className="font-medium text-green-800 dark:text-green-200">14-Day Money-Back Guarantee</p>
            <p className="text-green-700 dark:text-green-300 text-sm">Full refund within 14 days of purchase, no questions asked.</p>
          </div>
        </div>
      </Section>

      <Section icon={Ban} title="Acceptable Use">
        <p className="mb-3">You agree not to:</p>
        <ul className="list-none space-y-2 ml-4">
          <li>• Use the service for unlawful purposes</li>
          <li>• Attempt unauthorized access to our systems</li>
          <li>• Interfere with or disrupt the service</li>
          <li>• Reverse engineer our software</li>
          <li>• Share your account with others</li>
        </ul>
      </Section>

      <Section icon={Shield} title="Disclaimers & Liability">
        <div className="space-y-3 text-sm">
          <p>
            The service is provided &quot;as is&quot; without warranties. We do not guarantee uninterrupted or error-free operation.
          </p>
          <p>
            We are not liable for indirect, incidental, or consequential damages, including loss of profits or data.
          </p>
          <p>
            You agree to indemnify SoloFI from claims arising from your use of the service.
          </p>
        </div>
      </Section>

      <Section icon={Scale} title="Legal">
        <div className="space-y-3">
          <p>
            <strong className="text-foreground">Governing Law:</strong> California, United States
          </p>
          <p>
            <strong className="text-foreground">Changes:</strong> We may update these terms. Continued use constitutes acceptance.
          </p>
          <p>
            <strong className="text-foreground">Termination:</strong> We may suspend accounts for violations at our discretion.
          </p>
        </div>
      </Section>

      <Section icon={Mail} title="Contact Us">
        <p>Questions about these terms? Contact us at:</p>
        <p className="mt-2">
          <a href="mailto:legal@solofi.io" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            legal@solofi.io
          </a>
        </p>
      </Section>

      {/* Footer */}
      <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
        <CardContent className="py-4">
          <p className="text-center text-sm text-muted-foreground">
            By using SoloFI, you acknowledge that you have read, understood, and agree to these Terms of Service.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
