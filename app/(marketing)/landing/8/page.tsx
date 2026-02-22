import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star, Quote, Users, Award } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";

// Style 8: Social Proof Heavy - Testimonials and trust signals first
export const metadata = {
  title: "SoloFI - Trusted by 10,000+ Freelancers",
  alternates: {
    canonical: "https://solofi.io",
  },
};

const VARIANT = "landing_8_social";

export default function Landing8() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "UX Designer, Freelance",
      quote: "I saved $23,000 in taxes my first year. SoloFI showed me I was missing out on Solo 401k contributions.",
      avatar: "SC",
    },
    {
      name: "Marcus Johnson",
      role: "Software Consultant",
      quote: "Finally understand when I can actually retire. The Monte Carlo simulations gave me real confidence.",
      avatar: "MJ",
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Strategist",
      quote: "The geo-arbitrage calculator helped me realize I could retire 5 years earlier by moving to Portugal.",
      avatar: "ER",
    },
    {
      name: "David Park",
      role: "Photographer, Self-Employed",
      quote: "As a creative, finances always stressed me out. SoloFI makes it simple enough that I actually use it.",
      avatar: "DP",
    },
    {
      name: "Lisa Thompson",
      role: "Executive Coach",
      quote: "Switched from S-Corp to LLC based on SoloFI's analysis. Saved $8,000 in annual compliance costs.",
      avatar: "LT",
    },
    {
      name: "James Wilson",
      role: "Tech Consultant",
      quote: "The net worth tracking alone is worth it. I check my progress every week now. Super motivating.",
      avatar: "JW",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <LandingAnalytics variant={VARIANT} />
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <span className="text-xl font-bold text-gray-900">SoloFI</span>
        <TrackedLink
          href="/dashboard"
          trackingAction="get_started"
          trackingLocation="nav"
          trackingVariant={VARIANT}
          buttonProps={{}}
        >
          Join 10,000+ Users
        </TrackedLink>
      </nav>

      {/* Hero - Social proof focused */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-gray-600 mb-6">Rated 4.9/5 by 2,000+ self-employed professionals</p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Join the freelancers who&apos;ve found their path to FI
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            10,000+ consultants, freelancers, and self-employed professionals use SoloFI to track wealth and plan for financial independence.
          </p>

          <TrackedLink
            href="/dashboard"
            trackingAction="start_free"
            trackingLocation="hero"
            trackingVariant={VARIANT}
            buttonProps={{ size: "lg" }}
          >
            Start Free Today
            <ArrowRight className="ml-2 h-4 w-4" />
          </TrackedLink>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-8 py-8 border-y">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-5 w-5" />
            <span>10,000+ users</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Award className="h-5 w-5" />
            <span>$500M+ tracked</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span>4.9/5 rating</span>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What our users are saying
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="bg-white">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-gray-200 mb-4" />
                  <p className="text-gray-700 mb-6">&quot;{t.quote}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonial */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <Card className="bg-gray-900 text-white">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-2xl font-medium leading-relaxed mb-8">
                &quot;SoloFI completely changed how I think about my finances. In 6 months, I went from
                financial anxiety to having a clear roadmap. I now know exactly when I&apos;ll reach FI
                and what it takes to get there.&quot;
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center text-lg font-medium">
                  AK
                </div>
                <div className="text-left">
                  <p className="font-medium">Alex Kim</p>
                  <p className="text-gray-400">Independent Software Developer</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats from users */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-white mb-12">
            Results from real users
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <p className="text-5xl font-bold mb-2">$47K</p>
              <p className="text-blue-200">Avg tax savings found</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">8.2</p>
              <p className="text-blue-200">Avg years to FI</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">$1.2M</p>
              <p className="text-blue-200">Avg FI target</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">93%</p>
              <p className="text-blue-200">Would recommend</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join the community
          </h2>
          <p className="text-gray-600 mb-8">
            Start tracking your path to financial independence today.
          </p>
          <TrackedLink
            href="/dashboard"
            trackingAction="create_account"
            trackingLocation="cta_section"
            trackingVariant={VARIANT}
            buttonProps={{ size: "lg" }}
          >
            Create Free Account
            <ArrowRight className="ml-2 h-4 w-4" />
          </TrackedLink>
          <p className="text-sm text-gray-500 mt-4">No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-gray-500">
          <span>© 2026 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
