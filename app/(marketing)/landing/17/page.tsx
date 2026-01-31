import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Heart, Flower2 } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";

// Style 17: Rose/Pink Soft - Elegant, gentle, refined
export const metadata = {
  title: "SoloFI - Thoughtful Financial Planning",
};

const VARIANT = "landing_17_rose";

export default function Landing17() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50">
      <LandingAnalytics variant={VARIANT} />
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Flower2 className="h-5 w-5 text-rose-500" />
          <span className="text-xl font-semibold text-rose-900">SoloFI</span>
        </div>
        <TrackedLink
          href="/dashboard"
          trackingAction="get_started"
          trackingLocation="nav"
          trackingVariant={VARIANT}
          buttonProps={{ className: "bg-rose-500 hover:bg-rose-600 text-white" }}
        >
          Get Started
        </TrackedLink>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-semibold text-rose-950 mb-8 leading-tight">
          Financial planning with
          <span className="text-rose-500"> intention</span>
        </h1>

        <p className="text-xl text-rose-800/60 mb-12 max-w-2xl mx-auto">
          A thoughtful approach to wealth building for self-employed professionals.
          Track, plan, and grow at your own pace.
        </p>

        <TrackedLink
          href="/dashboard"
          trackingAction="start_free"
          trackingLocation="hero"
          trackingVariant={VARIANT}
          buttonProps={{ size: "lg", className: "bg-rose-500 hover:bg-rose-600 text-white" }}
        >
          Begin your journey
          <Heart className="ml-2 h-4 w-4" />
        </TrackedLink>
      </section>

      {/* Features */}
      <section className="py-20 bg-white/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-rose-900 mb-2">Net Worth Tracking</h3>
                <p className="text-rose-800/60">
                  A clear view of everything you own and owe. Updated in real-time as your wealth grows.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-rose-900 mb-2">Tax Optimization</h3>
                <p className="text-rose-800/60">
                  Discover opportunities to keep more of what you earn. Solo 401k, SEP IRA, HSA guidance.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-rose-900 mb-2">Retirement Planning</h3>
                <p className="text-rose-800/60">
                  Understand when you can step back. Monte Carlo projections for confidence in your timeline.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-rose-900 mb-2">Geo-Arbitrage</h3>
                <p className="text-rose-800/60">
                  Explore how different locations affect your path to freedom. 200+ cities compared.
                </p>
              </div>
            </div>

            <div className="bg-rose-100/50 rounded-3xl p-8 flex items-center justify-center">
              <div className="text-center">
                <p className="text-5xl font-semibold text-rose-500 mb-4">$47K</p>
                <p className="text-rose-800/60">Average tax savings discovered by our users</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-2xl font-medium text-rose-900 leading-relaxed mb-8">
            "SoloFI gave me peace of mind. I finally understand my path to financial independence
            and feel confident about my future."
          </p>
          <p className="text-rose-500">— Independent Consultant</p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white/50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-rose-900 text-center mb-4">Gentle pricing</h2>
          <p className="text-rose-800/60 text-center mb-12">Start free, grow at your own pace</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-rose-100">
              <h3 className="text-xl font-semibold text-rose-900 mb-2">Free</h3>
              <p className="text-4xl font-semibold text-rose-900 mb-6">$0</p>
              <ul className="space-y-3 mb-8">
                {["Net worth tracking", "Tax calculator", "Retirement projections", "Geo-arbitrage"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-rose-800/70">
                    <Check className="h-5 w-5 text-rose-500" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full border-rose-200 text-rose-700 hover:bg-rose-50">
                  Get started
                </Button>
              </Link>
            </div>

            <div className="bg-rose-500 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-4xl font-semibold mb-6">$29<span className="text-lg opacity-70">/mo</span></p>
              <ul className="space-y-3 mb-8">
                {["Everything in Free", "S-Corp vs LLC analysis", "Advanced scenarios", "Priority support"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/90">
                    <Check className="h-5 w-5" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button className="w-full bg-white text-rose-600 hover:bg-rose-50">
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
          <h2 className="text-3xl font-semibold text-rose-900 mb-6">Ready to begin?</h2>
          <p className="text-rose-800/60 mb-10">
            Join thousands of thoughtful professionals planning their future.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white">
              Create free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-rose-200">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-rose-400">
          <span>© 2026 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-rose-900">Privacy</Link>
            <Link href="/terms" className="hover:text-rose-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
