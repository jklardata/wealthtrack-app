import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Minus } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";

// Style 18: Slate/Gray Minimal - Ultra clean, sophisticated, Apple-inspired
export const metadata = {
  title: "SoloFI - Financial Planning, Simplified",
  alternates: {
    canonical: "https://solofi.io",
  },
};

const VARIANT = "landing_18_minimal";

export default function Landing18() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <LandingAnalytics variant={VARIANT} />
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <span className="text-lg font-medium tracking-tight">SoloFI</span>
        <TrackedLink
          href="/dashboard"
          trackingAction="sign_in"
          trackingLocation="nav"
          trackingVariant={VARIANT}
          buttonProps={{ variant: "ghost", className: "text-neutral-600 hover:text-neutral-900" }}
        >
          Sign in
        </TrackedLink>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-32 text-center">
        <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-8">
          Financial clarity.
          <br />
          <span className="text-neutral-400">Nothing more.</span>
        </h1>

        <p className="text-xl text-neutral-500 mb-12 max-w-xl mx-auto">
          The essential toolkit for self-employed professionals.
          Track wealth. Optimize taxes. Plan retirement.
        </p>

        <TrackedLink
          href="/dashboard"
          trackingAction="get_started"
          trackingLocation="hero"
          trackingVariant={VARIANT}
          buttonProps={{ size: "lg", className: "bg-neutral-900 hover:bg-neutral-800 text-white rounded-full px-8" }}
        >
          Get started free
        </TrackedLink>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="h-px bg-neutral-200" />
      </div>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <Minus className="h-6 w-6 text-neutral-300 mb-6" />
              <h3 className="text-lg font-medium mb-3">Net Worth</h3>
              <p className="text-neutral-500">
                See everything in one place. Assets, debts, investments. Updated automatically.
              </p>
            </div>

            <div>
              <Minus className="h-6 w-6 text-neutral-300 mb-6" />
              <h3 className="text-lg font-medium mb-3">Tax Tools</h3>
              <p className="text-neutral-500">
                Solo 401k. SEP IRA. HSA. S-Corp analysis. Know exactly how much you can save.
              </p>
            </div>

            <div>
              <Minus className="h-6 w-6 text-neutral-300 mb-6" />
              <h3 className="text-lg font-medium mb-3">Retirement</h3>
              <p className="text-neutral-500">
                Monte Carlo projections. 1,000 scenarios. Your probability of success, calculated.
              </p>
            </div>

            <div>
              <Minus className="h-6 w-6 text-neutral-300 mb-6" />
              <h3 className="text-lg font-medium mb-3">Geo-Arbitrage</h3>
              <p className="text-neutral-500">
                200+ cities compared. See how location affects your timeline to independence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-neutral-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <p className="text-4xl font-medium text-neutral-900 mb-2">$47K</p>
              <p className="text-neutral-400 text-sm">Average tax savings</p>
            </div>
            <div>
              <p className="text-4xl font-medium text-neutral-900 mb-2">10K+</p>
              <p className="text-neutral-400 text-sm">Users</p>
            </div>
            <div>
              <p className="text-4xl font-medium text-neutral-900 mb-2">4.9</p>
              <p className="text-neutral-400 text-sm">Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-medium text-center mb-12">Pricing</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl border border-neutral-200">
              <h3 className="font-medium mb-2">Free</h3>
              <p className="text-3xl font-medium mb-6">$0</p>
              <ul className="space-y-3 mb-8">
                {["Net worth tracking", "Tax calculator", "FI projections", "Geo-arbitrage"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-neutral-600 text-sm">
                    <Check className="h-4 w-4 text-neutral-400" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full rounded-full">Get started</Button>
              </Link>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-900 text-white">
              <h3 className="font-medium mb-2">Pro</h3>
              <p className="text-3xl font-medium mb-6">$29<span className="text-lg text-neutral-400">/mo</span></p>
              <ul className="space-y-3 mb-8">
                {["Everything in Free", "S-Corp analysis", "Unlimited scenarios", "Priority support"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-neutral-300 text-sm">
                    <Check className="h-4 w-4 text-neutral-500" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button className="w-full rounded-full bg-white text-neutral-900 hover:bg-neutral-100">
                  Start trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-medium mb-8">Ready to simplify?</h2>
          <Link href="/dashboard">
            <Button size="lg" className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-full px-8">
              Create account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center text-sm text-neutral-400">
          <span>© 2026 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-neutral-900">Privacy</Link>
            <Link href="/terms" className="hover:text-neutral-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
