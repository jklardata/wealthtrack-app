import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sun, Heart } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";

// Style 13: Warm Coral/Peach - Friendly, approachable, warm
export const metadata = {
  title: "SoloFI - Friendly Financial Planning",
  alternates: {
    canonical: "https://solofi.io",
  },
};

const VARIANT = "landing_13_coral";

export default function Landing13() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-rose-50">
      <LandingAnalytics variant={VARIANT} />
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <span className="text-xl font-bold text-orange-900">SoloFI</span>
        <TrackedLink
          href="/dashboard"
          trackingAction="get_started"
          trackingLocation="nav"
          trackingVariant={VARIANT}
          buttonProps={{ className: "bg-orange-500 hover:bg-orange-600 text-white" }}
        >
          Get Started
        </TrackedLink>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sun className="h-4 w-4" />
            Built for freelancers & consultants
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-orange-950 mb-8 leading-tight">
            Financial planning that actually feels
            <span className="text-orange-500"> good</span>
          </h1>

          <p className="text-xl text-orange-800/70 mb-12">
            No jargon. No stress. Just clear answers about your money,
            retirement, and path to freedom.
          </p>

          <TrackedLink
            href="/dashboard"
            trackingAction="start_free"
            trackingLocation="hero"
            trackingVariant={VARIANT}
            buttonProps={{ size: "lg", className: "bg-orange-500 hover:bg-orange-600 text-white text-lg px-8" }}
          >
            Start for free
            <Heart className="ml-2 h-5 w-5" />
          </TrackedLink>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-orange-950 mb-3">See everything</h3>
              <p className="text-orange-800/60">
                All your accounts, investments, and debts in one beautiful dashboard.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100">
              <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-orange-950 mb-3">Save on taxes</h3>
              <p className="text-orange-800/60">
                Discover how much you can save with Solo 401k, SEP IRA, and smart structures.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🌴</span>
              </div>
              <h3 className="text-xl font-semibold text-orange-950 mb-3">Plan your freedom</h3>
              <p className="text-orange-800/60">
                Know exactly when you can retire and what it takes to get there.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-2xl font-medium text-orange-950 mb-8">
            "I finally understand my finances. SoloFI turned my anxiety into a clear plan."
          </p>
          <p className="text-orange-600">— Sarah, Freelance Designer</p>

          <div className="flex justify-center gap-12 mt-16">
            <div>
              <p className="text-4xl font-bold text-orange-500">10K+</p>
              <p className="text-orange-800/60">Happy users</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-rose-500">$47K</p>
              <p className="text-orange-800/60">Avg savings found</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-amber-500">4.9★</p>
              <p className="text-orange-800/60">User rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-orange-950 mb-4">Simple, friendly pricing</h2>
          <p className="text-center text-orange-800/60 mb-12">Start free, upgrade when you're ready</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-orange-100">
              <h3 className="text-xl font-semibold text-orange-950 mb-2">Free Forever</h3>
              <p className="text-4xl font-bold text-orange-950 mb-6">$0</p>
              <ul className="space-y-3 mb-8">
                {["Net worth tracking", "Tax calculator", "Retirement projections", "Geo-arbitrage tool"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-orange-800/70">
                    <Check className="h-5 w-5 text-orange-500" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full border-orange-200 text-orange-700 hover:bg-orange-50">
                  Get started
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-rose-500 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-4xl font-bold mb-6">$29<span className="text-lg opacity-70">/mo</span></p>
              <ul className="space-y-3 mb-8">
                {["Everything in Free", "S-Corp analysis", "Advanced scenarios", "Priority support"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/90">
                    <Check className="h-5 w-5" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button className="w-full bg-white text-orange-600 hover:bg-orange-50">
                  Start free trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-orange-950 mb-6">Ready to feel good about money?</h2>
          <Link href="/dashboard">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
              Start your journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-orange-200">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-orange-800/50">
          <span>© 2026 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-orange-900">Privacy</Link>
            <Link href="/terms" className="hover:text-orange-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
