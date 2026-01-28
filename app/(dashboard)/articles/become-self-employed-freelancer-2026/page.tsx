"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, Calendar, Clock, CheckCircle, AlertTriangle, Users, DollarSign, Building } from "lucide-react";

export default function BecomeFreelancerArticle() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop"
          alt="Freelancer working"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-sm font-medium text-white bg-pink-500 px-3 py-1 rounded-full">Getting Started</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-3">How to Become a Self-Employed Freelancer in 2026</h1>
          <div className="flex items-center gap-4 mt-3 text-white/80 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              January 2026
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              15 min read
            </span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="space-y-8">
        {/* Intro */}
        <p className="text-xl text-muted-foreground leading-relaxed">
          Ready to leave the 9-to-5 behind? This comprehensive guide covers everything you need to know about starting your freelance or consulting business in 2026.
        </p>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Step 1: Validate Your Skills and Market</h2>
          <p className="text-muted-foreground leading-relaxed">
            Before quitting your job, make sure there's demand for your services.
          </p>

          <h3 className="text-lg font-semibold mt-4">Questions to Answer</h3>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
              <span>What specific problems can you solve?</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
              <span>Who has these problems and will pay to solve them?</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
              <span>What makes you different from other freelancers?</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
              <span>What's the going rate for these services?</span>
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-6">Market Research</h3>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span>Look at freelance platforms (Upwork, Toptal) for demand signals</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span>Talk to potential clients about their pain points</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span>Network with other freelancers in your space</span>
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Step 2: Start While Employed</h2>
          <p className="text-muted-foreground leading-relaxed">
            The safest path is to start freelancing on the side before going full-time.
          </p>

          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="p-6">
              <h4 className="font-semibold text-green-600 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Before You Quit Checklist
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>3-6 months of expenses saved</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>At least one paying client</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Health insurance plan identified</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Basic business structure chosen</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Pipeline of potential clients</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Image break */}
        <div className="relative h-48 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1000&h=400&fit=crop"
            alt="Business planning"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Step 3: Choose Your Business Structure</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your legal structure affects taxes, liability, and complexity.
          </p>

          <div className="grid gap-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="h-5 w-5 text-gray-500" />
                  <h4 className="font-semibold">Sole Proprietorship</h4>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-green-600">Pros</p>
                    <p className="text-muted-foreground">Simplest, no setup required, low cost</p>
                  </div>
                  <div>
                    <p className="font-medium text-red-600">Cons</p>
                    <p className="text-muted-foreground">No liability protection, higher SE tax</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-600">Best for</p>
                    <p className="text-muted-foreground">Just starting out, income under $80K</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="h-5 w-5 text-blue-500" />
                  <h4 className="font-semibold">Single-Member LLC</h4>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-green-600">Pros</p>
                    <p className="text-muted-foreground">Liability protection, professional appearance</p>
                  </div>
                  <div>
                    <p className="font-medium text-red-600">Cons</p>
                    <p className="text-muted-foreground">State fees, some paperwork</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-600">Best for</p>
                    <p className="text-muted-foreground">Moderate income, want liability protection</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-500/30">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="h-5 w-5 text-green-500" />
                  <h4 className="font-semibold">S-Corporation</h4>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-green-600">Pros</p>
                    <p className="text-muted-foreground">Significant tax savings on SE tax</p>
                  </div>
                  <div>
                    <p className="font-medium text-red-600">Cons</p>
                    <p className="text-muted-foreground">Payroll complexity, compliance requirements</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-600">Best for</p>
                    <p className="text-muted-foreground">Consistent income over $80-100K</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Step 4: Set Up Your Business</h2>
          <h3 className="text-lg font-semibold">Essential Steps</h3>
          <ol className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <div>
                <strong>Get an EIN</strong>
                <p className="text-muted-foreground">Free from IRS, takes 5 minutes online</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <div>
                <strong>Open a business bank account</strong>
                <p className="text-muted-foreground">Keep personal and business separate</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <div>
                <strong>Set up invoicing</strong>
                <p className="text-muted-foreground">Use software like Wave, Freshbooks, or Bonsai</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              <div>
                <strong>Track expenses</strong>
                <p className="text-muted-foreground">From day one, categorize everything</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
              <div>
                <strong>Get contracts</strong>
                <p className="text-muted-foreground">Never work without a signed agreement</p>
              </div>
            </li>
          </ol>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Step 5: Find Clients</h2>
          <p className="text-muted-foreground leading-relaxed">
            The most important skill in freelancing is business development.
          </p>

          <h3 className="text-lg font-semibold mt-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Client Acquisition Channels
          </h3>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Your network</strong>
                <p className="text-muted-foreground">Tell everyone you're freelancing</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>LinkedIn</strong>
                <p className="text-muted-foreground">Optimize profile, post content, reach out</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Referrals</strong>
                <p className="text-muted-foreground">Ask happy clients to refer others</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Freelance platforms</strong>
                <p className="text-muted-foreground">Upwork, Toptal, Contra</p>
              </div>
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            Pricing Strategies
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold">Hourly</h4>
                <p className="text-sm text-muted-foreground">Simple but limits income</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold">Project-based</h4>
                <p className="text-sm text-muted-foreground">Better margins, requires scoping skill</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold">Retainer</h4>
                <p className="text-sm text-muted-foreground">Predictable income, recurring revenue</p>
              </CardContent>
            </Card>
            <Card className="border-green-500/30">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-600">Value-based</h4>
                <p className="text-sm text-muted-foreground">Price based on value delivered, not time</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Step 6: Set Up Your Financial Systems</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5">
                <h4 className="font-semibold mb-3">Banking</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Business checking (Mercury, Relay)</li>
                  <li>High-yield savings for taxes (25-30%)</li>
                  <li>Separate business credit card</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h4 className="font-semibold mb-3">Retirement</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Solo 401(k) - highest limits</li>
                  <li>SEP-IRA as simpler alternative</li>
                  <li>Backdoor Roth IRA</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h4 className="font-semibold mb-3">Insurance</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Health: Marketplace or spouse's plan</li>
                  <li>Professional liability (E&O)</li>
                  <li>Disability insurance</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 7 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Step 7: Build Systems for Scale</h2>
          <p className="text-muted-foreground leading-relaxed">
            As you grow, invest in systems that save time:
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <span>Templated proposals and contracts</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <span>Automated invoicing and payment reminders</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <span>Project management tools (Notion, Asana)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <span>Time tracking for hourly work</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <span>Regular financial reviews (monthly)</span>
            </li>
          </ul>
        </section>

        {/* Common Mistakes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Common Mistakes to Avoid</h2>
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Underpricing your services</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Not saving for taxes</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Working without contracts</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Neglecting business development when busy</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Mixing personal and business finances</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Not setting boundaries with clients</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Key Takeaways */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Key Takeaways</h2>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">1.</span>
                  <span>Start freelancing while employed to reduce risk</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">2.</span>
                  <span>Choose the right business structure for your situation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">3.</span>
                  <span>Separate personal and business finances from day one</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">4.</span>
                  <span>Business development is the #1 skill to develop</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">5.</span>
                  <span>Set aside 25-30% for taxes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">6.</span>
                  <span>Invest in retirement accounts early (Solo 401k)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">7.</span>
                  <span>Build systems and processes as you grow</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
