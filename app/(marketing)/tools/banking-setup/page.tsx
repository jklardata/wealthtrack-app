"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  DollarSign,
  Calculator,
  Mail,
  CheckCircle,
  Lock,
  AlertTriangle,
  Landmark,
} from "lucide-react";
import Link from "next/link";
import { analytics, type CTALocation } from "@/lib/analytics";
import { EmailCaptureCard } from "@/components/email-capture-card";

const VARIANT = "lead_magnet_banking_setup";

type Step = 1 | 2 | 3 | 4 | 5;
type Structure = "sole_prop" | "llc" | "scorp";
type Revenue = "under_5k" | "5k_15k" | "15k_30k" | "over_30k";
type CurrentSetup = "just_personal" | "separate_checking" | "full_setup";

interface BankingPlan {
  priority: "essential" | "optimization" | "advanced";
  accounts: {
    name: string;
    purpose: string;
    recommendation: string;
    urgency: "immediate" | "soon" | "when_ready";
  }[];
  topTip: string;
  warningNote: string | null;
}

function generatePlan(structure: Structure, revenue: Revenue, currentSetup: CurrentSetup): BankingPlan {
  const isHighRevenue = revenue === "over_30k" || revenue === "15k_30k";
  const needsStructure = currentSetup === "just_personal";
  const hasBasics = currentSetup !== "just_personal";

  const accounts: BankingPlan["accounts"] = [];

  // 1. Business checking — always first
  if (needsStructure) {
    accounts.push({
      name: "Business Checking Account",
      purpose: "Separate all business income and expenses from personal finances",
      recommendation: structure === "scorp"
        ? "Required for S-Corp payroll. Use Mercury, Relay, or your local bank. Open this first."
        : "Mercury (free, online) or Relay (multi-account) are ideal for freelancers. Avoid big bank minimums.",
      urgency: "immediate",
    });
  }

  // 2. High-yield savings for tax reserve
  accounts.push({
    name: "Tax Reserve Account (High-Yield Savings)",
    purpose: "Hold 25-30% of every payment for quarterly estimated taxes",
    recommendation: "Marcus by Goldman Sachs, Ally, or SoFi. Keep this separate so you're never tempted to spend it. Transfer automatically on every invoice paid.",
    urgency: needsStructure ? "immediate" : "soon",
  });

  // 3. Operating buffer
  if (isHighRevenue || hasBasics) {
    accounts.push({
      name: "Operating Buffer Account",
      purpose: "3-6 months of business expenses as a float for slow months",
      recommendation: "Keep in the same bank as your business checking for easy transfers. Target: cover 2-3 months of fixed expenses minimum.",
      urgency: "soon",
    });
  }

  // 4. S-Corp specific: payroll account
  if (structure === "scorp") {
    accounts.push({
      name: "Payroll Account",
      purpose: "Dedicated account for running W-2 payroll to yourself",
      recommendation: "Some payroll providers (Gusto, QuickBooks Payroll) prefer or require a dedicated payroll account. Fund it before each payroll run.",
      urgency: "immediate",
    });
  }

  // 5. Business savings / investments
  if (isHighRevenue) {
    accounts.push({
      name: "Business Savings / Investment Account",
      purpose: "Excess revenue beyond operating needs — put it to work",
      recommendation: "Treasury bills via Fidelity or Vanguard for excess cash. If regularly profitable, consider a taxable brokerage for longer-term holdings.",
      urgency: "when_ready",
    });
  }

  const topTip = needsStructure
    ? "Open your business checking account today — mixing personal and business finances is the single most expensive bookkeeping mistake freelancers make."
    : isHighRevenue
    ? "At your revenue level, a dedicated tax reserve account is your highest-leverage move — it makes quarterly taxes predictable and stress-free."
    : "Set up automatic transfers on every payment received: 25-30% to taxes, the rest to operating. Automation removes the temptation to spend it.";

  const warningNote = structure === "scorp"
    ? "S-Corp owners: you must run payroll before distributing profits. Mixing payroll and distribution accounts creates audit risk."
    : needsStructure
    ? "Using a personal account for business income makes tax filing significantly harder and can disqualify deductions if audited."
    : null;

  const priority: BankingPlan["priority"] = needsStructure ? "essential" : isHighRevenue ? "optimization" : "optimization";

  return { priority, accounts, topTip, warningNote };
}

interface GuideState {
  structure: Structure;
  revenue: Revenue;
  currentSetup: CurrentSetup;
  email: string;
  currentStep: Step;
  isSubmitting: boolean;
  submitError: string | null;
  emailSubmitted: boolean;
}

export default function BankingSetup() {
  const [state, setState] = useState<GuideState>({
    structure: "sole_prop",
    revenue: "5k_15k",
    currentSetup: "just_personal",
    email: "",
    currentStep: 1,
    isSubmitting: false,
    submitError: null,
    emailSubmitted: false,
  });

  const plan = generatePlan(state.structure, state.revenue, state.currentSetup);

  const update = (updates: Partial<GuideState>) => setState((prev) => ({ ...prev, ...updates }));

  const goToStep = (step: Step) => {
    update({ currentStep: step });
    analytics.ctaClick("calculator_step", `step_${step}` as CTALocation, VARIANT);
  };

  const handleEmailSubmit = async () => {
    if (!state.email || !state.email.includes("@")) {
      update({ submitError: "Please enter a valid email address" });
      return;
    }
    update({ isSubmitting: true, submitError: null });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: state.email,
          source: "banking_setup",
          metadata: {
            structure: state.structure,
            revenue: state.revenue,
            currentSetup: state.currentSetup,
            accountsRecommended: plan.accounts.length,
          },
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }
      analytics.ctaClick("calculator_email_submit", "email_gate", VARIANT);
      update({ emailSubmitted: true, currentStep: 5 });
    } catch (err) {
      update({ submitError: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    } finally {
      update({ isSubmitting: false });
    }
  };

  const urgencyLabel = { immediate: "Open now", soon: "Open soon", when_ready: "When profitable" };
  const urgencyColor = { immediate: "emerald", soon: "amber", when_ready: "slate" };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-emerald-600" />
            <span className="font-semibold text-lg">SoloFI</span>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Freelancer Banking Setup Guide
          </h1>
          <p className="text-lg text-slate-600">
            Which accounts do you actually need? Get a personalized banking plan in 2 minutes.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  state.currentStep >= step ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
                }`}
              >
                {state.currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
              </div>
            ))}
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${((state.currentStep - 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Business Structure */}
        {state.currentStep === 1 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Your Business Structure</h2>
                  <p className="text-sm text-slate-500">This affects which accounts you need and how they work</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { value: "sole_prop", label: "Sole Proprietor", desc: "You freelance under your own name, no separate business entity" },
                  { value: "llc", label: "LLC", desc: "You've formed a Limited Liability Company" },
                  { value: "scorp", label: "S-Corp", desc: "You've elected S-Corp tax treatment" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update({ structure: opt.value as Structure })}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      state.structure === opt.value
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <p className="font-medium text-slate-900">{opt.label}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <Button onClick={() => goToStep(2)} className="bg-emerald-600 hover:bg-emerald-700">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Revenue */}
        {state.currentStep === 2 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Your Monthly Revenue</h2>
                  <p className="text-sm text-slate-500">Average monthly freelance income</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { value: "under_5k", label: "Under $5,000/month", desc: "Getting started or part-time" },
                  { value: "5k_15k", label: "$5,000 – $15,000/month", desc: "Established freelance practice" },
                  { value: "15k_30k", label: "$15,000 – $30,000/month", desc: "High-earning consultant" },
                  { value: "over_30k", label: "Over $30,000/month", desc: "Top-tier income, complex needs" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update({ revenue: opt.value as Revenue })}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      state.revenue === opt.value
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <p className="font-medium text-slate-900">{opt.label}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => goToStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => goToStep(3)} className="bg-emerald-600 hover:bg-emerald-700">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Current Setup */}
        {state.currentStep === 3 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Landmark className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Your Current Banking</h2>
                  <p className="text-sm text-slate-500">Where are you starting from?</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { value: "just_personal", label: "Personal account only", desc: "All income goes into my personal checking account" },
                  { value: "separate_checking", label: "Separate business checking", desc: "I have a dedicated business account but nothing else" },
                  { value: "full_setup", label: "Business checking + savings", desc: "I have multiple accounts set up for my business" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update({ currentSetup: opt.value as CurrentSetup })}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      state.currentSetup === opt.value
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <p className="font-medium text-slate-900">{opt.label}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => goToStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => goToStep(4)} className="bg-emerald-600 hover:bg-emerald-700">
                  Get My Plan <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Email Gate */}
        {state.currentStep === 4 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Mail className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Get Your Banking Plan</h2>
                  <p className="text-sm text-slate-500">Personalized account recommendations for your setup</p>
                </div>
              </div>

              <div className="text-center py-6 rounded-xl mb-6 bg-gradient-to-b from-emerald-50 to-white">
                <p className="text-sm text-slate-500 mb-2">Accounts recommended for your situation</p>
                <p className="text-6xl font-bold text-emerald-600">{plan.accounts.length}</p>
                <p className="text-sm text-slate-500 mt-2">accounts with specific recommendations</p>
              </div>

              <div className="relative mb-6">
                <div className="blur-sm select-none pointer-events-none space-y-3">
                  {plan.accounts.slice(0, 2).map((acct) => (
                    <div key={acct.name} className="p-3 bg-slate-50 rounded-lg">
                      <p className="font-medium">{acct.name}</p>
                      <p className="text-sm text-slate-500">{acct.purpose}</p>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                  <div className="text-center px-4">
                    <Lock className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                    <p className="font-semibold text-slate-800 mb-1">Unlock Your Banking Plan</p>
                    <p className="text-sm text-slate-500">Specific account and bank recommendations</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={state.email}
                    onChange={(e) => update({ email: e.target.value, submitError: null })}
                    className="mt-2"
                  />
                  {state.submitError && (
                    <p className="text-sm text-red-600 mt-2">{state.submitError}</p>
                  )}
                </div>

                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-slate-600 font-medium">You&apos;ll receive:</p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {[
                      "Personalized account setup plan",
                      "Specific bank recommendations",
                      "Tax reserve setup guide",
                      "Automation tips for every payment received",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-slate-500 pt-2">Unsubscribe anytime.</p>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => goToStep(3)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={handleEmailSubmit}
                  disabled={state.isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {state.isSubmitting ? "Submitting..." : "Get My Plan"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Full Results */}
        {state.currentStep === 5 && (
          <div className="space-y-6">
            <Card className="shadow-lg border-2 border-emerald-300 bg-gradient-to-b from-emerald-50 to-white">
              <CardContent className="p-8 text-center">
                <Landmark className="h-12 w-12 mx-auto mb-4 text-emerald-600" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Banking Setup Plan</h2>
                <p className="text-slate-600">{plan.accounts.length} accounts recommended for your situation</p>
              </CardContent>
            </Card>

            {plan.warningNote && (
              <Card className="shadow-lg border border-amber-300 bg-amber-50">
                <CardContent className="p-6">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">{plan.warningNote}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Accounts */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-semibold text-lg mb-4">Your Account Roadmap</h3>
                <div className="space-y-4">
                  {plan.accounts.map((acct, i) => {
                    const color = urgencyColor[acct.urgency];
                    return (
                      <div key={acct.name} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white ${
                              color === "emerald" ? "bg-emerald-600" : color === "amber" ? "bg-amber-500" : "bg-slate-400"
                            }`}>{i + 1}</span>
                            <p className="font-medium text-slate-900">{acct.name}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                            color === "emerald" ? "bg-emerald-100 text-emerald-700" :
                            color === "amber" ? "bg-amber-100 text-amber-700" :
                            "bg-slate-100 text-slate-600"
                          }`}>
                            {urgencyLabel[acct.urgency]}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{acct.purpose}</p>
                        <p className="text-sm text-slate-500 bg-white p-3 rounded border border-slate-200">
                          <span className="font-medium text-slate-700">Recommendation: </span>{acct.recommendation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Top Tip */}
            <Card className="shadow-lg border border-emerald-200 bg-emerald-50">
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-800 mb-1">Top Priority</p>
                    <p className="text-sm text-emerald-700">{plan.topTip}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Automation tip */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-semibold text-lg mb-4">Set It and Forget It: Automation Rules</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { title: "Every invoice paid", action: "Auto-transfer 28-30% to your tax reserve account immediately" },
                    { title: "Monthly", action: "Review balance in operating buffer — top up to your 3-month target if below" },
                    { title: "Quarterly", action: "Pay estimated taxes from your reserve account before the IRS deadline" },
                    { title: "Annually", action: "Review account structure — upgrade as your revenue grows" },
                  ].map(({ title, action }) => (
                    <div key={title} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{title}</p>
                        <p className="text-slate-500">{action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <EmailCaptureCard
              toolName="Banking Setup Guide"
              resultsSummary={`${plan.accounts.length} accounts recommended`}
              className="mt-6"
            />

            <Card className="shadow-lg bg-emerald-600 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Track All Your Accounts in One Place</h3>
                <p className="text-emerald-100 mb-6">
                  SoloFI tracks your net worth across all accounts, estimates quarterly taxes automatically, and gives you a clear picture of your financial health.
                </p>
                <Link href="/sign-up">
                  <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
                    Try SoloFI Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500">
                  <strong>Disclaimer:</strong> Bank and account recommendations are general guidance only. Specific products, rates, and features change frequently.
                  Always review current terms before opening an account. This tool does not constitute financial or banking advice.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Share */}
      <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-center gap-3 flex-wrap">
        <span className="text-sm text-slate-500">Share this free tool:</span>
        <a
          href="https://twitter.com/intent/tweet?text=Free%20US%20banking%20setup%20checklist%20for%20digital%20nomads%20%26%20expats%E2%80%94by%20SoloFI%20solofi.io/tools/banking-setup%20%23DigitalNomad%20%23Expat"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-black text-white hover:bg-slate-800 transition-colors"
        >
          𝕏 Twitter/X
        </a>
        <a
          href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A//solofi.io/tools/banking-setup"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-700 text-white hover:bg-blue-800 transition-colors"
        >
          in LinkedIn
        </a>
      </div>

      <footer className="border-t mt-12 py-8">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center text-sm text-slate-500">
          <span>&copy; 2025 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
