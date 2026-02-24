"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Download,
  FileText,
  CheckCircle2,
  Circle,
  Printer,
  Building2,
  Landmark,
  Receipt,
  PiggyBank,
  Shield,
  FileSignature,
  Calendar,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { EmailCaptureCard } from "@/components/email-capture-card";
import { analytics } from "@/lib/analytics";

const VARIANT = "lead_magnet_freelance_checklist";

type Stage = "landing" | "checklist";

interface ChecklistSection {
  title: string;
  icon: React.ReactNode;
  description: string;
  items: { task: string; details: string; priority: "high" | "medium" | "low" }[];
}

const CHECKLIST_SECTIONS: ChecklistSection[] = [
  {
    title: "Business Structure",
    icon: <Building2 className="h-5 w-5" />,
    description: "Set up your business legally",
    items: [
      { task: "Choose your business structure", details: "Sole proprietorship is simplest to start. Consider LLC for liability protection ($50-500 depending on state).", priority: "high" },
      { task: "Register your business name", details: "File a DBA (Doing Business As) if using a name other than your own. Check your state's requirements.", priority: "medium" },
      { task: "Get an EIN from the IRS", details: "Free at irs.gov. Takes 5 minutes. You'll need this for business banking and taxes.", priority: "high" },
      { task: "Check local business licenses", details: "Some cities/counties require business licenses. Check with your local clerk's office.", priority: "medium" },
    ],
  },
  {
    title: "Banking & Finances",
    icon: <Landmark className="h-5 w-5" />,
    description: "Separate business and personal",
    items: [
      { task: "Open a business checking account", details: "Keep business income separate from personal. Many banks offer free business checking.", priority: "high" },
      { task: "Get a business credit card", details: "Build business credit and earn rewards. Keep business expenses separate.", priority: "medium" },
      { task: "Set up an accounting system", details: "Use QuickBooks Self-Employed, Wave (free), or a simple spreadsheet. Track from day one.", priority: "high" },
      { task: "Create an invoice template", details: "Include your business name, EIN, payment terms, and accepted payment methods.", priority: "high" },
    ],
  },
  {
    title: "Tax Setup",
    icon: <Receipt className="h-5 w-5" />,
    description: "Avoid surprises at tax time",
    items: [
      { task: "Understand self-employment tax", details: "You'll pay 15.3% SE tax on top of income tax. Budget 25-35% of income for taxes.", priority: "high" },
      { task: "Set up quarterly estimated taxes", details: "Due dates: April 15, June 15, Sept 15, Jan 15. Use IRS Form 1040-ES.", priority: "high" },
      { task: "Create a tax savings account", details: "Transfer 25-35% of each payment to a separate savings account for taxes.", priority: "high" },
      { task: "Track deductible expenses", details: "Home office, equipment, software, travel, meals (50%), health insurance, education.", priority: "high" },
      { task: "Learn about QBI deduction", details: "You may be able to deduct 20% of business income. Huge tax saver.", priority: "medium" },
    ],
  },
  {
    title: "Retirement Accounts",
    icon: <PiggyBank className="h-5 w-5" />,
    description: "Start saving tax-advantaged",
    items: [
      { task: "Open a Solo 401(k) or SEP IRA", details: "Solo 401(k) allows up to $69K/year contributions. SEP IRA is simpler but less flexible.", priority: "medium" },
      { task: "Set up automatic contributions", details: "Even $500/month adds up. Contributions reduce your taxable income.", priority: "medium" },
      { task: "Consider a Roth IRA", details: "$7,000/year limit. Grows tax-free. Good if you expect higher taxes later.", priority: "low" },
      { task: "Open an HSA if eligible", details: "Triple tax-advantaged. $4,300/year (individual). Requires high-deductible health plan.", priority: "medium" },
    ],
  },
  {
    title: "Insurance",
    icon: <Shield className="h-5 w-5" />,
    description: "Protect yourself and your business",
    items: [
      { task: "Get health insurance", details: "Healthcare.gov marketplace, spouse's plan, or professional association plans. Premiums are tax-deductible.", priority: "high" },
      { task: "Consider liability insurance", details: "Professional liability (E&O) protects against client claims. ~$500-1,500/year for most.", priority: "medium" },
      { task: "Review disability insurance", details: "Your income depends on your ability to work. Consider short and long-term disability.", priority: "low" },
      { task: "Life insurance if you have dependents", details: "Term life is affordable. 10-12x your income is a common recommendation.", priority: "low" },
    ],
  },
  {
    title: "Contracts & Legal",
    icon: <FileSignature className="h-5 w-5" />,
    description: "Protect your work and get paid",
    items: [
      { task: "Create a standard contract template", details: "Include scope, timeline, payment terms, revision limits, ownership/IP rights, cancellation policy.", priority: "high" },
      { task: "Define your payment terms", details: "50% upfront is common. Net 15 or Net 30 for ongoing clients. Late fees for overdue invoices.", priority: "high" },
      { task: "Set up a payment system", details: "Stripe, PayPal, or bank transfers. Make it easy for clients to pay you.", priority: "high" },
      { task: "Consider an LLC operating agreement", details: "Even single-member LLCs should have one. Documents your business structure.", priority: "low" },
    ],
  },
  {
    title: "First 90 Days",
    icon: <Calendar className="h-5 w-5" />,
    description: "Build momentum",
    items: [
      { task: "Calculate your minimum viable income", details: "What's the minimum you need monthly to cover expenses? This is your first target.", priority: "high" },
      { task: "Set your rates", details: "Research market rates. Start with hourly, consider moving to project-based. Don't undercharge.", priority: "high" },
      { task: "Build an emergency fund", details: "3-6 months of expenses. Income will be irregular—prepare for it.", priority: "medium" },
      { task: "Track your net worth monthly", details: "Monitor your financial progress. Adjust spending and rates as needed.", priority: "medium" },
      { task: "Network and market yourself", details: "LinkedIn, referrals, content marketing. Consistent visibility = consistent leads.", priority: "medium" },
    ],
  },
];

export default function FreelanceChecklist() {
  const [stage, setStage] = useState<Stage>("landing");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setSubmitError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "freelance_checklist",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      analytics.ctaClick("calculator_email_submit", "email_gate", VARIANT);
      setStage("checklist");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleItem = (sectionTitle: string, task: string) => {
    const key = `${sectionTitle}-${task}`;
    const newChecked = new Set(checkedItems);
    if (newChecked.has(key)) {
      newChecked.delete(key);
    } else {
      newChecked.add(key);
    }
    setCheckedItems(newChecked);
  };

  const totalItems = CHECKLIST_SECTIONS.reduce((sum, s) => sum + s.items.length, 0);
  const completedItems = checkedItems.size;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 print:hidden">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-orange-600" />
            <span className="font-semibold text-lg">SoloFI</span>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Landing Page */}
        {stage === "landing" && (
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-8 w-8 text-orange-600" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                    The First-Year Freelancer Financial Checklist
                  </h1>
                  <p className="text-slate-600">
                    Everything you need to set up your finances when going self-employed.
                    30+ actionable tasks organized by category.
                  </p>
                </div>

                {/* Preview */}
                <div className="bg-slate-50 rounded-xl p-6 mb-8">
                  <p className="text-sm font-medium text-slate-700 mb-4">What&apos;s inside:</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {CHECKLIST_SECTIONS.map((section) => (
                      <div key={section.title} className="flex items-center gap-2 text-slate-600">
                        <CheckCircle2 className="h-4 w-4 text-orange-500" />
                        {section.title}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setSubmitError(null);
                      }}
                      className="mt-2"
                    />
                    {submitError && (
                      <p className="text-sm text-red-600 mt-2">{submitError}</p>
                    )}
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    {isSubmitting ? "Loading..." : "Get the Free Checklist"}
                    <Download className="ml-2 h-4 w-4" />
                  </Button>

                  <p className="text-xs text-slate-500 text-center">
                    We&apos;ll also send you tips for freelancer finances. Unsubscribe anytime.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Full Checklist */}
        {stage === "checklist" && (
          <div>
            {/* Header */}
            <div className="text-center mb-8 print:mb-4">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                First-Year Freelancer Financial Checklist
              </h1>
              <p className="text-slate-600 print:hidden">
                Check off tasks as you complete them. Print or save this page for reference.
              </p>
              <p className="text-slate-600 hidden print:block text-sm">
                From SoloFI.io - Financial tools for self-employed professionals
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8 print:hidden">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Progress</span>
                <span>{completedItems} of {totalItems} complete</span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${(completedItems / totalItems) * 100}%` }}
                />
              </div>
            </div>

            {/* Print Button */}
            <div className="flex justify-end mb-6 print:hidden">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print / Save as PDF
              </Button>
            </div>

            {/* Checklist Sections */}
            <div className="space-y-8 print:space-y-6">
              {CHECKLIST_SECTIONS.map((section) => (
                <Card key={section.title} className="shadow-sm print:shadow-none print:border">
                  <CardContent className="p-6 print:p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-100 rounded-lg text-orange-600 print:bg-orange-50">
                        {section.icon}
                      </div>
                      <div>
                        <h2 className="font-semibold text-lg text-slate-900">{section.title}</h2>
                        <p className="text-sm text-slate-500">{section.description}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {section.items.map((item) => {
                        const key = `${section.title}-${item.task}`;
                        const isChecked = checkedItems.has(key);

                        return (
                          <div
                            key={item.task}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors print:cursor-default ${
                              isChecked
                                ? "bg-orange-50 border-orange-200"
                                : "bg-white border-slate-200 hover:border-orange-300"
                            }`}
                            onClick={() => toggleItem(section.title, item.task)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 print:hidden">
                                {isChecked ? (
                                  <CheckCircle2 className="h-5 w-5 text-orange-600" />
                                ) : (
                                  <Circle className="h-5 w-5 text-slate-300" />
                                )}
                              </div>
                              <div className="hidden print:block mt-0.5">
                                <div className="w-4 h-4 border-2 border-slate-400 rounded" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className={`font-medium ${isChecked ? "text-orange-900 line-through" : "text-slate-900"}`}>
                                    {item.task}
                                  </p>
                                  {item.priority === "high" && (
                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded print:bg-red-50">
                                      Important
                                    </span>
                                  )}
                                </div>
                                <p className={`text-sm mt-1 ${isChecked ? "text-orange-700" : "text-slate-600"}`}>
                                  {item.details}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Important Note */}
            <Card className="mt-8 border-amber-200 bg-amber-50 print:bg-amber-50">
              <CardContent className="p-6 print:p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900">Important Note</p>
                    <p className="text-sm text-amber-800 mt-1">
                      This checklist provides general guidance. Tax laws and requirements vary by state and situation.
                      Consult with a CPA or tax professional for advice specific to your circumstances.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Capture */}
            <EmailCaptureCard
              toolName="Freelance Checklist"
              resultsSummary={`${completedItems} of ${totalItems} tasks completed`}
              className="mt-8 print:hidden"
            />

            {/* CTA */}
            <Card className="mt-8 bg-orange-600 text-white print:hidden">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Track Your Progress with SoloFI</h3>
                <p className="text-orange-100 mb-6">
                  Net worth tracking, tax optimization calculator, and retirement planning—all in one place.
                </p>
                <Link href="/sign-up">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Share */}
      <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-center gap-3 flex-wrap">
        <span className="text-sm text-slate-500">Share this free tool:</span>
        <a
          href="https://twitter.com/intent/tweet?text=Free%20freelance%20business%20launch%20checklist%E2%80%94by%20SoloFI%20solofi.io/tools/freelance-checklist%20%23Freelance%20%23SoloFI"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-black text-white hover:bg-slate-800 transition-colors"
        >
          𝕏 Twitter/X
        </a>
        <a
          href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A//solofi.io/tools/freelance-checklist"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-700 text-white hover:bg-blue-800 transition-colors"
        >
          in LinkedIn
        </a>
      </div>

      {/* Footer */}
      <footer className="border-t mt-12 py-8 print:hidden">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center text-sm text-slate-500">
          <span>&copy; 2026 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms</Link>
          </div>
        </div>
      </footer>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
