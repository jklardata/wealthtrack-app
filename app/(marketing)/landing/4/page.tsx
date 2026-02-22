import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Coffee, Heart, Sparkles } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";

// Style 4: Friendly/Casual - FIRE community feel, conversational
export const metadata = {
  title: "SoloFI - Your Friendly Guide to Financial Freedom",
  alternates: {
    canonical: "https://solofi.io",
  },
};

const VARIANT = "landing_4_friendly";

export default function Landing4() {
  return (
    <div className="min-h-screen bg-amber-50">
      <LandingAnalytics variant={VARIANT} />

      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center">
        <span className="text-2xl font-bold text-amber-900">SoloFI</span>
        <TrackedLink
          href="/dashboard"
          trackingAction="sign_in"
          trackingLocation="nav"
          trackingVariant={VARIANT}
          buttonProps={{ variant: "outline", className: "border-amber-900 text-amber-900 hover:bg-amber-100" }}
        >
          Sign In
        </TrackedLink>
      </nav>

      {/* Hero - Conversational */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full mb-8">
          <Coffee className="h-4 w-4" />
          <span className="text-sm font-medium">Made by a freelancer, for freelancers</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6 leading-tight">
          Hey there, future retiree!
        </h1>

        <p className="text-xl text-amber-800 mb-8 max-w-2xl mx-auto leading-relaxed">
          You work hard for yourself. Shouldn&apos;t your money do the same? SoloFI helps you track your wealth,
          save on taxes, and figure out exactly when you can tell clients &quot;thanks, but I&apos;m done.&quot;
        </p>

        <TrackedLink
          href="/dashboard"
          trackingAction="get_started"
          trackingLocation="hero"
          trackingVariant={VARIANT}
          buttonProps={{ size: "lg", className: "bg-amber-900 hover:bg-amber-800 text-white rounded-full px-8" }}
        >
          Let&apos;s do this!
          <ArrowRight className="ml-2 h-5 w-5" />
        </TrackedLink>

        <p className="text-amber-700 text-sm mt-4">Free to start. No credit card needed. Pinky promise.</p>
      </section>

      {/* Story Section */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">
            Here&apos;s the thing about being self-employed...
          </h2>

          <div className="space-y-6 text-amber-800 leading-relaxed">
            <p>
              Nobody teaches you how to handle money when you&apos;re your own boss. How much should go into a Solo 401k?
              What&apos;s a SEP IRA? Is an S-Corp worth it? When can you actually retire?
            </p>
            <p>
              I built SoloFI because I was asking all these same questions. Spreadsheets got messy.
              Generic finance apps didn&apos;t get self-employment. So I made something that does.
            </p>
            <p className="font-medium text-amber-900">
              Now you can see your whole financial picture in one place, find tax savings you didn&apos;t know existed,
              and actually plan for the day you get to work because you <em>want</em> to, not because you have to.
            </p>
          </div>
        </div>
      </section>

      {/* Features - Casual */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-amber-900 text-center mb-12">
          What you get (it&apos;s pretty great)
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">Net Worth Tracking</h3>
            <p className="text-amber-700">
              Watch your wealth grow over time. It&apos;s like a fitness tracker, but for your bank accounts.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6">
            <div className="text-3xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">Tax Optimization</h3>
            <p className="text-amber-700">
              Find out how to keep more of what you earn. Spoiler: it&apos;s a lot more than you think.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6">
            <div className="text-3xl mb-4">🏖️</div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">Retirement Planning</h3>
            <p className="text-amber-700">
              When can you actually retire? We crunch the numbers so you can start daydreaming.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6">
            <div className="text-3xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">Geo-Arbitrage</h3>
            <p className="text-amber-700">
              What if you moved somewhere cheaper? See how much faster you&apos;d reach FI.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial-style */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-amber-900 rounded-3xl p-8 md:p-12 text-white text-center">
          <Sparkles className="h-8 w-8 mx-auto mb-6 text-amber-300" />
          <p className="text-xl md:text-2xl font-medium leading-relaxed mb-6">
            &quot;I saved $23,000 on taxes in my first year just by maxing out the right retirement accounts.
            SoloFI showed me exactly what to do.&quot;
          </p>
          <p className="text-amber-300">— Sarah, Freelance Designer</p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Heart className="h-6 w-6 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-amber-900 mb-4">
          Ready to take control?
        </h2>
        <p className="text-amber-700 mb-8">
          Your future self will thank you. Probably with a drink on a beach somewhere.
        </p>
        <TrackedLink
          href="/dashboard"
          trackingAction="create_account"
          trackingLocation="cta_section"
          trackingVariant={VARIANT}
          buttonProps={{ size: "lg", className: "bg-amber-900 hover:bg-amber-800 text-white rounded-full px-8" }}
        >
          Start for free
          <ArrowRight className="ml-2 h-5 w-5" />
        </TrackedLink>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-amber-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-amber-700 text-sm">
          <span>© 2026 SoloFI — Built with love by freelancers</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-amber-900">Privacy</Link>
            <Link href="/terms" className="hover:text-amber-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
