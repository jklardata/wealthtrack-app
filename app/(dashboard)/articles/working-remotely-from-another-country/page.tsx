"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, MapPin, AlertTriangle } from "lucide-react";

export default function WorkingRemotelyArticle() {
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
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&h=600&fit=crop"
          alt="Working remotely from another country"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-sm font-medium text-white bg-blue-500 px-3 py-1 rounded-full">Remote Work</span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-3">A US Guide for Working Remotely From Another Country</h1>
          <div className="flex items-center gap-4 mt-3 text-white/80 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              January 2026
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
        <p className="text-xl text-muted-foreground leading-relaxed">
          Working remotely from another country as a US citizen or resident comes with unique tax, visa, and logistical considerations. This comprehensive guide covers everything you need to know to work legally and tax-efficiently from abroad.
        </p>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Understanding Your Tax Obligations</h2>
          <p className="text-muted-foreground leading-relaxed">
            As a US citizen or green card holder, you're taxed on your <strong>worldwide income</strong> regardless of where you live or work. This is different from most other countries that use territorial taxation. However, several provisions can significantly reduce your tax burden:
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Foreign Earned Income Exclusion (FEIE)</strong>
                <p className="text-muted-foreground">Exclude up to $130,000 (2026) of foreign earned income from federal taxes</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Foreign Tax Credit (FTC)</strong>
                <p className="text-muted-foreground">Receive credit for taxes paid to foreign governments to avoid double taxation</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Foreign Housing Exclusion</strong>
                <p className="text-muted-foreground">Additional exclusion for qualified housing expenses while living abroad</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Image break */}
        <div className="relative h-48 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1000&h=400&fit=crop"
            alt="Travel destination"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">The Physical Presence Test</h2>
          <p className="text-muted-foreground leading-relaxed">
            To qualify for FEIE, you must be physically present in a foreign country for at least <strong>330 full days</strong> during a 12-month period. Here's what you need to know:
          </p>
          <Card className="bg-muted/30">
            <CardContent className="p-6 space-y-3">
              <h4 className="font-semibold">Key Requirements</h4>
              <ul className="space-y-2 text-sm">
                <li>• Days don't need to be consecutive</li>
                <li>• The 12-month period can begin on any day</li>
                <li>• Time spent in international waters or airspace doesn't count</li>
                <li>• Brief trips back to the US count against you</li>
                <li>• A full day means the entire 24-hour period (midnight to midnight)</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardContent className="p-4 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-600">Watch Out</h4>
                <p className="text-sm text-muted-foreground">A two-week trip home for the holidays could disqualify you if you're close to the 330-day threshold. Plan your US visits carefully and track every day.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Visa Considerations</h2>
          <p className="text-muted-foreground leading-relaxed">
            Tourist visas typically <strong>don't allow you to work legally</strong> in a foreign country, even if you're working for US clients remotely. Here are your options:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <h4 className="font-semibold">Digital Nomad Visas</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Portugal, Spain, Croatia, Estonia, and 50+ other countries now offer specific visas for remote workers.</p>
                <p className="text-xs text-muted-foreground">Duration: 1-2 years typically</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5 text-green-500" />
                  <h4 className="font-semibold">Freelancer Visas</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Germany, Netherlands, and other countries have self-employment visas for freelancers and consultants.</p>
                <p className="text-xs text-muted-foreground">Duration: 1-3 years typically</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 4 - Popular Destinations */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Popular Digital Nomad Destinations</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="overflow-hidden">
              <div className="h-32 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=200&fit=crop" alt="Lisbon Portugal" className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold">Portugal</h4>
                <p className="text-sm text-muted-foreground">D7 visa, NHR tax regime (10% flat tax for 10 years), thriving tech scene in Lisbon and Porto</p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <div className="h-32 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=400&h=200&fit=crop" alt="Mexico City" className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold">Mexico</h4>
                <p className="text-sm text-muted-foreground">180-day tourist visa, same time zones as US, low cost of living, excellent internet</p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <div className="h-32 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=200&fit=crop" alt="Thailand" className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold">Thailand</h4>
                <p className="text-sm text-muted-foreground">New LTR visa for remote workers, extremely affordable, excellent infrastructure in Bangkok/Chiang Mai</p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <div className="h-32 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&h=200&fit=crop" alt="Medellin Colombia" className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold">Colombia</h4>
                <p className="text-sm text-muted-foreground">Digital nomad visa available, Medellin's perfect weather, growing expat community</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Banking and Money</h2>
          <p className="text-muted-foreground leading-relaxed">
            Having the right financial setup is crucial for international remote work. Here are the essentials:
          </p>
          <ul className="space-y-3 ml-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Charles Schwab Investor Checking</strong>
                <p className="text-muted-foreground">No foreign transaction fees, unlimited ATM rebates worldwide</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Wise (formerly TransferWise)</strong>
                <p className="text-muted-foreground">Multi-currency account with real exchange rates, local bank details in 10+ currencies</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Mercury</strong>
                <p className="text-muted-foreground">Business banking with international wire support and no monthly fees</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Key Takeaways */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Key Takeaways</h2>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">1.</span>
                  <span>You're still subject to US taxes on worldwide income as a US citizen</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">2.</span>
                  <span>FEIE can exclude $130,000+ if you meet the physical presence or bona fide residence test</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">3.</span>
                  <span>Get proper visas - tourist visas usually don't allow remote work legally</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">4.</span>
                  <span>Set up international-friendly banking before you leave</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">5.</span>
                  <span>Consider your state tax residency carefully - some states continue taxing you</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
