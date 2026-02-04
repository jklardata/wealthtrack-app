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
    <Card className="mb-6 border-slate-200">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[#0D3F4A]/10">
            <Icon className="h-5 w-5 text-[#0D3F4A]" />
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

function ListItem({ title, description }: { title: string; description: string }) {
  return (
    <li className="flex gap-2">
      <span className="text-[#0D3F4A] mt-1">•</span>
      <span><strong className="text-[#10182C]">{title}:</strong> {description}</span>
    </li>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FBF7F0]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="https://solofi.io" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
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
          <Link href="https://solofi.io">
            <Button variant="ghost" size="sm" className="gap-2 text-[#0D3F4A] hover:text-[#0a2f37]">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-8 w-8 text-[#0D3F4A]" />
            <h1 className="text-[36px] font-semibold text-[#10182C]">Privacy Policy</h1>
          </div>
          <p className="text-[15px] text-slate-600">Last updated: February 4, 2025</p>
        </div>

        {/* Intro */}
        <Card className="mb-8 bg-white border-slate-200">
          <CardContent className="pt-6">
            <p className="text-center text-slate-700 text-[15px]">
              SoloFI is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.
            </p>
          </CardContent>
        </Card>

        {/* Sections */}
        <Section icon={Database} title="Information We Collect">
          <p className="font-medium text-[#10182C] mb-2">Account Information</p>
        <ul className="list-none space-y-1 mb-4 ml-4">
          <li>• Email address and name (via Clerk authentication)</li>
        </ul>

          <p className="font-medium text-[#10182C] mb-2">Financial Data You Provide</p>
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
            <strong className="text-[#10182C]">Stripe</strong> handles all payment processing. We never store your full credit card details.
          </p>
          <p className="mb-3">
            <strong className="text-[#10182C]">Google Sheets</strong> integration only accesses sheets you explicitly authorize.
          </p>
          <p>
            <strong className="text-[#10182C]">Vercel Analytics</strong> collects anonymous usage data to improve our service.
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
            <li>• <strong className="text-[#10182C]">Encryption:</strong> TLS/SSL for all data transmission</li>
            <li>• <strong className="text-[#10182C]">Secure Storage:</strong> Supabase with row-level security</li>
            <li>• <strong className="text-[#10182C]">Authentication:</strong> Enterprise-grade security via Clerk</li>
          </ul>
        </Section>

        <Section icon={Users} title="Data Sharing">
          <p className="mb-3 font-medium text-[#10182C]">We never sell your data.</p>
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
            <a href="mailto:privacy@solofi.io" className="text-[#0D3F4A] hover:text-[#0a2f37] hover:underline font-medium">
              privacy@solofi.io
            </a>
          </p>
        </Section>

        {/* Footer */}
        <Card className="bg-white border-slate-200">
          <CardContent className="py-4">
            <p className="text-center text-[14px] text-slate-600">
              By using SoloFI, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </div>

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
