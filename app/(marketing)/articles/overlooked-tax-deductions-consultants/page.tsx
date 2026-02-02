import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator, Calendar, Clock, AlertTriangle, DollarSign, CheckCircle2, Home, Coffee, Wifi, Car, BookOpen, Smartphone, Brain, Plane, Heart, Users } from "lucide-react";

export const metadata = {
  title: "Top 10 Overlooked Tax Deductions for Consultants - SoloFI",
  description: "Most consultants miss thousands in legitimate tax deductions. Here are the 10 most commonly overlooked write-offs that could save you money.",
};

export default function OverlookedDeductionsArticle() {
  return (
    <article>
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
        <img
          src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1200&h=600&fit=crop"
          alt="Tax deductions and financial planning"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-sm font-medium text-white bg-purple-500 px-3 py-1 rounded-full">Tax Deductions</span>
          <h1 className="text-3xl md:text-4xl font-medium text-white mt-3">Top 10 Overlooked Tax Deductions for Consultants</h1>
          <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              February 2026
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              12 min read
            </span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="space-y-8">
        {/* Intro */}
        <p className="text-xl text-slate-600 leading-relaxed">
          Most consultants miss thousands in legitimate tax deductions every year. These aren't questionable gray areas—they're IRS-approved write-offs that can significantly reduce your tax bill. Here are the 10 most commonly overlooked deductions.
        </p>

        {/* Disclaimer */}
        <div className="rounded-xl border border-slate-200 bg-yellow-50 p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900">Tax Disclaimer</h4>
            <p className="text-sm text-slate-600">This article is for educational purposes only. Always consult a qualified CPA or tax professional for advice specific to your situation.</p>
          </div>
        </div>

        {/* Deduction 1 */}
        <section className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Home className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">1. Home Office Expenses (Beyond the Basics)</h2>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Most consultants know about the home office deduction, but many miss additional expenses you can claim:
          </p>

          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Internet and phone</strong>
                <p className="text-slate-600">Business-use percentage of your internet and cell phone bills</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Office furniture and equipment</strong>
                <p className="text-slate-600">Desks, chairs, monitors, standing desk converters</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Repairs and maintenance</strong>
                <p className="text-slate-600">Portion of home repairs that benefit your office space</p>
              </div>
            </li>
          </ul>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <h4 className="font-semibold mb-2 text-emerald-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Potential Savings
            </h4>
            <p className="text-sm text-slate-700">
              A consultant with a 200 sq ft home office could deduct <strong>$2,000-$4,000</strong> annually in home-related expenses beyond the simplified deduction.
            </p>
          </div>
        </section>

        {/* Deduction 2 */}
        <section className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Coffee className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">2. Meals with Clients and Prospects</h2>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Business meals are <strong>50% deductible</strong> when discussing business with clients, prospects, or other business contacts.
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h4 className="font-semibold mb-3 text-slate-900">What Qualifies</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span className="text-slate-600 text-sm">Coffee meetings with potential clients</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span className="text-slate-600 text-sm">Lunch or dinner while discussing projects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span className="text-slate-600 text-sm">Networking meals at conferences</span>
              </li>
            </ul>
            <p className="text-xs text-slate-500 mt-3 italic">Pro tip: Note who attended and what was discussed on the receipt</p>
          </div>
        </section>

        {/* Deduction 3 */}
        <section className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Wifi className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">3. Coworking Space and Coffee Shop Expenses</h2>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            If you work from coworking spaces or coffee shops, these are fully deductible:
          </p>

          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Monthly coworking memberships</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Day passes at coworking spaces</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Coffee and light snacks while working</span>
            </li>
          </ul>
        </section>

        {/* Deduction 4 */}
        <section className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Car className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">4. Vehicle Expenses (Even Without a Dedicated Business Car)</h2>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            You don't need a separate business vehicle to deduct car expenses. Track business mileage for:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="font-semibold mb-2 text-slate-900">2026 Standard Mileage Rate</h4>
              <p className="text-3xl font-bold text-amber-600">$0.70</p>
              <p className="text-xs text-slate-500 mt-1">per business mile</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="font-semibold mb-2 text-slate-900">Deductible Trips</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Client meetings</li>
                <li>• Coworking space</li>
                <li>• Bank deposits</li>
                <li>• Office supply runs</li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm text-amber-900">
              <strong>Example:</strong> 5,000 business miles × $0.70 = <strong>$3,500 deduction</strong>
            </p>
          </div>
        </section>

        {/* Deduction 5 */}
        <section className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">5. Professional Development and Education</h2>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Anything that improves your skills in your current field is deductible:
          </p>

          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Online courses and certifications</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Conference tickets and registration fees</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Books, ebooks, and audiobooks</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Professional memberships and subscriptions</span>
            </li>
          </ul>
        </section>

        {/* Image break */}
        <div className="relative h-48 rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1554224311-beee2091c527?w=1000&h=400&fit=crop"
            alt="Business planning and organization"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Deduction 6 */}
        <section className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">6. Software and Digital Tools</h2>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            All the apps and software you use for business are fully deductible:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <p className="text-sm font-medium text-slate-900">CRM Tools</p>
              <p className="text-xs text-slate-500">HubSpot, Salesforce</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <p className="text-sm font-medium text-slate-900">Design Software</p>
              <p className="text-xs text-slate-500">Adobe, Figma</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <p className="text-sm font-medium text-slate-900">Project Tools</p>
              <p className="text-xs text-slate-500">Asana, Monday</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <p className="text-sm font-medium text-slate-900">Cloud Storage</p>
              <p className="text-xs text-slate-500">Dropbox, Google</p>
            </div>
          </div>
        </section>

        {/* Deduction 7 */}
        <section className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Brain className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">7. Marketing and Advertising Expenses</h2>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Everything you spend to promote your services is deductible:
          </p>

          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Website hosting and domain renewals</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Social media ads and promoted posts</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Business cards and promotional materials</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Email marketing tools (Mailchimp, ConvertKit)</span>
            </li>
          </ul>
        </section>

        {/* Deduction 8 */}
        <section className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Plane className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">8. Business Travel Expenses</h2>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            When traveling for business, these expenses are fully deductible:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="font-semibold mb-3 text-slate-900">Transportation</h4>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Flights and train tickets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Rental cars and Uber/Lyft</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Parking and tolls</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="font-semibold mb-3 text-slate-900">Lodging & Meals</h4>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Hotels and Airbnbs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Meals while traveling (50%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Wifi and phone charges</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Deduction 9 */}
        <section className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">9. Health Insurance Premiums</h2>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Self-employed individuals can deduct 100% of health insurance premiums as an above-the-line deduction.
          </p>

          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <h4 className="font-semibold mb-2 text-red-900">What's Deductible</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-600">✓</span>
                <span className="text-slate-700 text-sm">Medical, dental, and vision insurance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">✓</span>
                <span className="text-slate-700 text-sm">Long-term care insurance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">✓</span>
                <span className="text-slate-700 text-sm">Premiums for spouse and dependents</span>
              </li>
            </ul>
            <p className="text-sm text-slate-600 mt-3 italic">This reduces both income and self-employment tax!</p>
          </div>
        </section>

        {/* Deduction 10 */}
        <section className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">10. Contract Labor and Outsourcing</h2>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Money you pay to contractors and freelancers is fully deductible:
          </p>

          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Graphic designers and web developers</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Virtual assistants and bookkeepers</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Content writers and editors</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Legal and accounting professionals</span>
            </li>
          </ul>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-600">
              <strong>Remember:</strong> If you pay a contractor more than $600 in a year, you'll need to file a 1099-NEC form.
            </p>
          </div>
        </section>

        {/* Quick Reference */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Quick Reference: Estimated Annual Savings</h2>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">Combined deductions from all 10 categories:</p>
                <p className="text-3xl font-bold text-emerald-600">$15,000 - $30,000</p>
                <p className="text-xs text-slate-500 mt-1">Typical consultant range</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">Potential tax savings at 30% effective rate:</p>
                <p className="text-3xl font-bold text-emerald-600">$4,500 - $9,000</p>
                <p className="text-xs text-slate-500 mt-1">Real dollars back in your pocket</p>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Best Practices for Tracking Deductions</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">1. Use Separate Bank Accounts</h4>
              <p className="text-sm text-slate-600">Keep business and personal expenses separate for easier tracking</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">2. Save All Receipts</h4>
              <p className="text-sm text-slate-600">Use apps like Expensify or QuickBooks to digitally store receipts</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">3. Track Mileage Automatically</h4>
              <p className="text-sm text-slate-600">Use MileIQ or Stride to automatically log business miles</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">4. Document Business Purpose</h4>
              <p className="text-sm text-slate-600">Note who you met with and what you discussed for meals and travel</p>
            </div>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-slate-200 pb-2">Key Takeaways</h2>
          <div className="rounded-xl border border-amber-500/30 bg-amber-50 p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold">1.</span>
                <span className="text-slate-700">Track ALL business expenses—the small ones add up</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold">2.</span>
                <span className="text-slate-700">Use technology to automate expense tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold">3.</span>
                <span className="text-slate-700">When in doubt, ask your CPA—it's better than missing deductions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold">4.</span>
                <span className="text-slate-700">Keep receipts and documentation for at least 3 years</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600 font-bold">5.</span>
                <span className="text-slate-700">These deductions can save you $5,000-$10,000+ annually</span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-8 text-center">
          <h3 className="text-xl font-bold mb-3">Calculate Your Tax Savings</h3>
          <p className="text-slate-600 mb-6">Use our free tax calculator to estimate how much these deductions could save you.</p>
          <Link href="/tools/tax-savings">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Calculator className="mr-2 h-4 w-4" />
              Free Tax Calculator
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
