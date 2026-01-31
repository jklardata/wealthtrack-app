import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Quote } from "lucide-react";
import { LandingAnalytics, TrackedLink } from "@/components/analytics";

// Style 6: Story-Driven - Personal narrative approach
export const metadata = {
  title: "SoloFI - From Freelancer Anxiety to Financial Freedom",
};

const VARIANT = "landing_6_story";

export default function Landing6() {
  return (
    <div className="min-h-screen bg-stone-50">
      <LandingAnalytics variant={VARIANT} />
      {/* Nav */}
      <nav className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/" className="text-2xl font-serif text-stone-900">SoloFI</Link>
      </nav>

      {/* Story Hero */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <article className="prose prose-stone prose-lg max-w-none">
          <p className="text-xl text-stone-600 italic mb-8">
            A letter to my fellow self-employed friends
          </p>

          <h1 className="text-4xl font-serif text-stone-900 mb-8 leading-tight">
            I used to lie awake at night wondering if I&apos;d ever be able to retire.
          </h1>

          <p>
            Three years ago, I left my corporate job to become a consultant. The freedom was incredible—
            setting my own hours, choosing my clients, working from anywhere.
          </p>

          <p>
            But at 2 AM, the anxiety would hit. <em>What about retirement? There&apos;s no 401(k) match anymore.
            No pension. No safety net.</em>
          </p>

          <p>
            I started Googling. Solo 401(k). SEP IRA. S-Corp election. QBI deductions. The jargon was overwhelming.
            I tried spreadsheets, but they became a mess of nested formulas that broke every time I updated them.
          </p>

          <p className="font-medium text-stone-900">
            That&apos;s when I decided to build what I wished existed.
          </p>
        </article>
      </section>

      {/* Middle Section */}
      <section className="bg-stone-900 text-white py-20">
        <div className="max-w-3xl mx-auto px-6">
          <Quote className="h-12 w-12 text-stone-600 mb-6" />
          <p className="text-2xl font-serif leading-relaxed mb-8">
            &quot;In my first year using SoloFI, I discovered I was leaving $31,000 on the table in unused
            tax-advantaged account contributions. That&apos;s money that would have gone to the IRS.&quot;
          </p>
          <p className="text-stone-400">— Me, the founder</p>
        </div>
      </section>

      {/* Continue Story */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <article className="prose prose-stone prose-lg max-w-none">
          <h2 className="font-serif">Here&apos;s what I learned</h2>

          <p>
            Being self-employed is actually a <em>superpower</em> for building wealth. You have access to
            retirement accounts that W-2 employees can only dream of. A Solo 401(k) lets you contribute
            up to $70,000 per year. That&apos;s nearly three times the employee limit.
          </p>

          <p>
            But here&apos;s the thing—nobody tells you this. There&apos;s no HR department sending reminder emails.
            No automatic enrollment. You have to figure it out yourself.
          </p>

          <h2 className="font-serif">So I built SoloFI</h2>

          <p>
            It&apos;s everything I wish I had when I started:
          </p>

          <ul>
            <li><strong>Net worth tracking</strong> that actually makes sense for variable income</li>
            <li><strong>Tax optimization tools</strong> that show you exactly how much you can contribute to each account</li>
            <li><strong>Retirement projections</strong> that account for the uncertainty of self-employment</li>
            <li><strong>A clear answer</strong> to the question: <em>When can I actually retire?</em></li>
          </ul>

          <p>
            Today, I know my FI number. I know my timeline. I know exactly how much to put in my Solo 401(k)
            each quarter. The 2 AM anxiety? Gone.
          </p>

          <h2 className="font-serif">Your turn</h2>

          <p>
            If you&apos;re self-employed and wondering about your financial future, I built this for you.
            It&apos;s free to start, and you can see your complete picture in about 10 minutes.
          </p>
        </article>

        <div className="mt-12">
          <TrackedLink
            href="/dashboard"
            trackingAction="get_started"
            trackingLocation="cta_section"
            trackingVariant={VARIANT}
            buttonProps={{ size: "lg", className: "bg-stone-900 hover:bg-stone-800" }}
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-4 w-4" />
          </TrackedLink>
          <p className="text-stone-500 text-sm mt-4">No credit card required</p>
        </div>
      </section>

      {/* Author Section */}
      <section className="max-w-3xl mx-auto px-6 py-16 border-t border-stone-200">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-stone-300 rounded-full flex-shrink-0" />
          <div>
            <p className="font-medium text-stone-900">Built by a freelancer, for freelancers</p>
            <p className="text-stone-600 mt-2">
              SoloFI was created by someone who understands the unique financial challenges of
              self-employment. Every feature was born from real problems I faced building my own
              path to financial independence.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-stone-200">
        <div className="flex justify-between items-center text-sm text-stone-500">
          <span className="font-serif">© 2026 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-stone-900">Privacy</Link>
            <Link href="/terms" className="hover:text-stone-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
