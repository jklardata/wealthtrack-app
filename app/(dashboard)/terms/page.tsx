import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileText, AlertTriangle, CreditCard, User, Ban, Shield, Scale, Mail } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "Terms of Service - SoloFI",
  description: "Terms of Service for SoloFI financial tracking application",
};

function Section({ icon: Icon, title, children, variant = "default" }: { icon: React.ElementType; title: string; children: React.ReactNode; variant?: "default" | "warning" }) {
  const bgColor = variant === "warning" ? "bg-amber-50" : "bg-[#0D3F4A]/10";
  const iconColor = variant === "warning" ? "text-amber-600" : "text-[#0D3F4A]";

  return (
    <Card className="mb-6 border-slate-200">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${bgColor}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <h2 className="text-[20px] font-semibold text-[#10182C]">{title}</h2>
        </div>
        <div className="text-slate-700 space-y-3 text-[15px]">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function TermsOfServicePage() {
  const { userId } = await auth();
  const backUrl = userId ? "/dashboard" : "/sign-in";
  const backText = userId ? "Back to Dashboard" : "Back to Sign In";

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

      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link href={backUrl}>
            <Button variant="ghost" size="sm" className="gap-2 text-[#0D3F4A] hover:text-[#0a2f37]">
              <ArrowLeft className="h-4 w-4" />
              {backText}
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="h-8 w-8 text-[#0D3F4A]" />
            <h1 className="text-[36px] font-semibold text-[#10182C]">Terms of Service</h1>
          </div>
          <p className="text-[15px] text-slate-600">Last updated: February 4, 2025</p>
        </div>

        {/* Intro */}
        <Card className="mb-8 bg-white border-slate-200">
          <CardContent className="pt-6">
            <p className="text-center text-slate-700 text-[15px]">
              By accessing or using SoloFI, you agree to be bound by these Terms of Service and our{" "}
              <Link href="/privacy" className="text-[#0D3F4A] hover:text-[#0a2f37] hover:underline font-medium">Privacy Policy</Link>.
            </p>
          </CardContent>
        </Card>

        {/* Important Disclaimer */}
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <h2 className="text-[20px] font-semibold text-amber-900">Important Disclaimer</h2>
            </div>
            <div className="text-amber-900 space-y-3 text-[15px]">
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
              <p className="font-medium text-[#10182C] mb-1">Plans</p>
              <p>We offer free and paid plans. Paid plans unlock additional features.</p>
            </div>
            <div>
              <p className="font-medium text-[#10182C] mb-1">Billing</p>
              <p>Subscriptions are billed monthly or annually via Stripe.</p>
            </div>
            <div>
              <p className="font-medium text-[#10182C] mb-1">Cancellation</p>
              <p>Cancel anytime. Access continues until your billing period ends.</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <p className="font-medium text-emerald-900">14-Day Money-Back Guarantee</p>
              <p className="text-emerald-800 text-[14px]">Full refund within 14 days of purchase, no questions asked.</p>
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
              <strong className="text-[#10182C]">Governing Law:</strong> California, United States
            </p>
            <p>
              <strong className="text-[#10182C]">Changes:</strong> We may update these terms. Continued use constitutes acceptance.
            </p>
            <p>
              <strong className="text-[#10182C]">Termination:</strong> We may suspend accounts for violations at our discretion.
            </p>
          </div>
        </Section>

        <Section icon={Mail} title="Contact Us">
          <p>Questions about these terms? Contact us at:</p>
          <p className="mt-2">
            <a href="mailto:legal@solofi.io" className="text-[#0D3F4A] hover:text-[#0a2f37] hover:underline font-medium">
              legal@solofi.io
            </a>
          </p>
        </Section>

        {/* Footer */}
        <Card className="bg-white border-slate-200">
          <CardContent className="py-4">
            <p className="text-center text-[14px] text-slate-600">
              By using SoloFI, you acknowledge that you have read, understood, and agree to these Terms of Service.
            </p>
          </CardContent>
        </Card>
      </div>

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
