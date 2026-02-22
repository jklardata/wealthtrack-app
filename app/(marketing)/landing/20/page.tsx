import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Coffee, BookOpen, Home } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";

// Style 20: Earth Tones/Brown - Warm, grounded, trustworthy, craftsman feel
export const metadata = {
  title: "SoloFI - Grounded Financial Planning",
  alternates: {
    canonical: "https://solofi.io",
  },
};

const VARIANT = "landing_20_earth";

export default function Landing20() {
  return (
    <div className="min-h-screen bg-stone-100">
      <LandingAnalytics variant={VARIANT} />
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5 text-amber-700" />
          <span className="text-xl font-semibold text-stone-800">SoloFI</span>
        </div>
        <TrackedLink
          href="/dashboard"
          trackingAction="get_started"
          trackingLocation="nav"
          trackingVariant={VARIANT}
          buttonProps={{ className: "bg-amber-700 hover:bg-amber-800 text-white" }}
        >
          Get Started
        </TrackedLink>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold text-stone-900 mb-8 leading-tight">
              Build wealth on a
              <span className="text-amber-700"> solid foundation</span>
            </h1>

            <p className="text-xl text-stone-600 mb-8">
              Honest, practical financial tools for self-employed professionals.
              No gimmicks. Just clarity about your money, your taxes, and your future.
            </p>

            <TrackedLink
              href="/dashboard"
              trackingAction="start_free"
              trackingLocation="hero"
              trackingVariant={VARIANT}
              buttonProps={{ size: "lg", className: "bg-amber-700 hover:bg-amber-800 text-white" }}
            >
              Start your foundation
              <ArrowRight className="ml-2 h-4 w-4" />
            </TrackedLink>
          </div>

          <div className="bg-stone-200 rounded-3xl p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-700/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Coffee className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-medium text-stone-900 mb-1">Net Worth Tracking</h3>
                  <p className="text-stone-600 text-sm">All accounts in one honest view</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-700/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-medium text-stone-900 mb-1">Tax Optimization</h3>
                  <p className="text-stone-600 text-sm">Solo 401k, SEP IRA, S-Corp guidance</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-700/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Home className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-medium text-stone-900 mb-1">Retirement Planning</h3>
                  <p className="text-stone-600 text-sm">1,000 scenario projections</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-stone-200/50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-stone-900 text-center mb-12">Built on solid principles</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🪵</div>
              <h3 className="font-medium text-stone-900 mb-2">Honest Tools</h3>
              <p className="text-stone-600 text-sm">
                No inflated promises. Just accurate calculations you can trust.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="font-medium text-stone-900 mb-2">Long-term Focus</h3>
              <p className="text-stone-600 text-sm">
                Built for sustainable wealth, not get-rich-quick schemes.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-medium text-stone-900 mb-2">Clear Guidance</h3>
              <p className="text-stone-600 text-sm">
                Plain language explanations. No confusing jargon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <p className="text-4xl font-semibold text-amber-700 mb-2">$47K</p>
              <p className="text-stone-500">Avg tax savings found</p>
            </div>
            <div>
              <p className="text-4xl font-semibold text-amber-700 mb-2">10K+</p>
              <p className="text-stone-500">Professionals trust us</p>
            </div>
            <div>
              <p className="text-4xl font-semibold text-amber-700 mb-2">4.9★</p>
              <p className="text-stone-500">User satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-amber-700 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-2xl font-medium leading-relaxed mb-8">
            "Finally, a financial tool that doesn't try to sell me something.
            SoloFI just helps me understand my money and make better decisions."
          </p>
          <p className="text-amber-200">— Freelance Architect, 12 years self-employed</p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-stone-900 text-center mb-4">Fair pricing</h2>
          <p className="text-stone-500 text-center mb-12">Start free, upgrade if it makes sense</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-stone-200">
              <h3 className="font-semibold text-stone-900 mb-2">Free</h3>
              <p className="text-3xl font-semibold text-stone-900 mb-6">$0</p>
              <ul className="space-y-3 mb-8">
                {["Net worth tracking", "Tax calculator", "Retirement projections", "Geo-arbitrage"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-stone-600 text-sm">
                    <Check className="h-4 w-4 text-amber-700" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full border-stone-300 text-stone-700 hover:bg-stone-50">
                  Get started
                </Button>
              </Link>
            </div>

            <div className="p-8 rounded-2xl bg-amber-700 text-white">
              <h3 className="font-semibold mb-2">Pro</h3>
              <p className="text-3xl font-semibold mb-6">$29<span className="text-lg opacity-70">/mo</span></p>
              <ul className="space-y-3 mb-8">
                {["Everything in Free", "S-Corp analysis", "Unlimited scenarios", "Priority support"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-amber-100 text-sm">
                    <Check className="h-4 w-4" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button className="w-full bg-white text-amber-800 hover:bg-amber-50">
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
          <h2 className="text-2xl font-semibold text-stone-900 mb-6">Ready to build your foundation?</h2>
          <Link href="/dashboard">
            <Button size="lg" className="bg-amber-700 hover:bg-amber-800 text-white">
              Create free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center text-sm text-stone-400">
          <span>© 2026 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-stone-900">Privacy</Link>
            <Link href="/terms" className="hover:text-stone-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
