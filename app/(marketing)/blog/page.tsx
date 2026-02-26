"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Sparkles } from "lucide-react";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  readTime: string;
  date: string;
  image: string;
  featured?: boolean;
}

const ARTICLES: Article[] = [
  {
    slug: "roth-conversion-strategy-engine-launch",
    title: "Building a Roth Conversion Strategy Engine: Why Early Retirement Changes Everything",
    excerpt: "Deep dive into building production-ready tax optimization tools for early retirees. Why gap years are goldmines, how we model lifetime tax exposure, and implementing Pro feature gating.",
    category: "Product Update",
    categoryColor: "bg-emerald-500",
    readTime: "12 min read",
    date: "February 2026",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=450&fit=crop",
    featured: true,
  },
  {
    slug: "tax-strategies-2026-self-employed",
    title: "Tax Strategies in 2026 for Self-Employed Workers",
    excerpt: "Self-employment comes with a significant tax burden—but also unique opportunities for tax optimization. Here are the most effective strategies for 2026.",
    category: "Taxes",
    categoryColor: "bg-purple-500",
    readTime: "15 min read",
    date: "January 2026",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop",
    featured: true,
  },
  {
    slug: "become-self-employed-freelancer-2026",
    title: "How to Become a Self-Employed Freelancer in 2026",
    excerpt: "Everything you need to know about making the leap to self-employment, from legal setup to finding your first clients.",
    category: "Getting Started",
    categoryColor: "bg-pink-500",
    readTime: "15 min read",
    date: "January 2026",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=450&fit=crop",
    featured: true,
  },
  {
    slug: "why-track-net-worth",
    title: "Why Tracking Your Net Worth Over Time is Useful",
    excerpt: "Your net worth is the single most important number in personal finance. Here's why tracking it regularly can transform your financial life.",
    category: "Wealth Building",
    categoryColor: "bg-amber-500",
    readTime: "8 min read",
    date: "January 2026",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop",
  },
  {
    slug: "how-feie-works",
    title: "How the Foreign Earned Income Exclusion (FEIE) Works",
    excerpt: "Living abroad as a US citizen? The FEIE could save you up to $130,000 in taxes. Here's everything you need to know.",
    category: "Tax Planning",
    categoryColor: "bg-cyan-500",
    readTime: "12 min read",
    date: "January 2026",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=450&fit=crop",
  },
  {
    slug: "best-bank-accounts-for-consultants",
    title: "Best Bank Accounts for Remote Workers and Independent Consultants",
    excerpt: "The right bank account can save you money and headaches. Here are the best options for self-employed professionals in 2026.",
    category: "Banking",
    categoryColor: "bg-green-500",
    readTime: "10 min read",
    date: "January 2026",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=450&fit=crop",
  },
  {
    slug: "working-remotely-from-another-country",
    title: "A US Guide for Working Remotely From Another Country",
    excerpt: "Dreaming of working from Portugal or Mexico? Here's what US-based remote workers need to know about taxes, visas, and logistics.",
    category: "Remote Work",
    categoryColor: "bg-blue-500",
    readTime: "12 min read",
    date: "January 2026",
    image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&h=450&fit=crop",
  },
  {
    slug: "overlooked-tax-deductions-consultants",
    title: "Top 10 Overlooked Tax Deductions for Consultants",
    excerpt: "Many self-employed professionals miss out on thousands in tax savings by overlooking common deductions. Here are the top 10 you shouldn't miss.",
    category: "Tax Deductions",
    categoryColor: "bg-indigo-500",
    readTime: "12 min read",
    date: "February 2026",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=450&fit=crop",
  },
  {
    slug: "30-percent-rule-self-employment-taxes",
    title: "The 30% Rule: Why You Should Set Aside This Much for Taxes",
    excerpt: "Self-employment taxes can be shocking if you're not prepared. Learn why the 30% rule works and how to implement it in your business.",
    category: "Tax Planning",
    categoryColor: "bg-cyan-500",
    readTime: "10 min read",
    date: "February 2026",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=450&fit=crop",
  },
  {
    slug: "sole-proprietor-vs-llc",
    title: "Sole Proprietor vs. LLC: Which Structure Saves You More Money?",
    excerpt: "Choosing between a sole proprietorship and LLC can save you thousands. Compare the tax implications, liability protection, and costs of each structure.",
    category: "Business Structure",
    categoryColor: "bg-violet-500",
    readTime: "14 min read",
    date: "February 2026",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=450&fit=crop",
  },
];

export default function BlogPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "blog_page" }),
      });

      if (response.ok) {
        setSubmitMessage("Subscribed!");
        setEmail("");
      } else {
        setSubmitMessage("Error. Please try again.");
      }
    } catch (error) {
      setSubmitMessage("Error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const featuredArticles = ARTICLES.filter((a) => a.featured);
  const regularArticles = ARTICLES.filter((a) => !a.featured);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-medium tracking-tight text-slate-900">
            <span className="text-emerald-600">Solo</span>FI
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/tools" className="text-sm text-slate-600 hover:text-slate-900 hidden md:block">
              Resources
            </Link>
            <Link href="/dashboard">
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-4 py-2 rounded-full text-sm mb-6">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span className="text-slate-700">Insights for the self-employed</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 leading-[1.1] text-slate-900">
              Learn
            </h1>

            <p className="text-xl text-slate-700 font-semibold max-w-2xl">
              Financial insights, tax strategies, and wealth-building tips for consultants, freelancers, and business owners.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-8">
            Featured
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredArticles.map((article) => (
              <Link key={article.slug} href={`/articles/${article.slug}`}>
                <article className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-emerald-300 hover:shadow-lg transition-all">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className={`text-xs font-medium text-white ${article.categoryColor} px-3 py-1 rounded-full`}>
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-slate-600 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>{article.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Handbooks */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-8">
            Handbooks
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/handbooks/self-employed-tax-handbook">
              <div className="group rounded-2xl border border-slate-200 bg-white p-8 hover:border-emerald-300 hover:shadow-lg transition-all h-full cursor-pointer">
                <div className="p-3 rounded-xl bg-emerald-50 w-fit mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 group-hover:text-emerald-600 transition-colors">The Self-Employed Tax Handbook</h3>
                <p className="text-sm text-slate-600">Everything you need to minimize your tax burden: Solo 401k, S-Corp election, HSA, FEIE, and quarterly estimates — all in one place.</p>
              </div>
            </Link>
            <Link href="/handbooks/early-retirement-handbook">
              <div className="group rounded-2xl border border-slate-200 bg-white p-8 hover:border-blue-300 hover:shadow-lg transition-all h-full cursor-pointer">
                <div className="p-3 rounded-xl bg-blue-50 w-fit mb-4">
                  <span className="text-2xl">🏔️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 group-hover:text-blue-600 transition-colors">The Early Retirement Handbook</h3>
                <p className="text-sm text-slate-600">A practical guide to retiring early as a self-employed professional: FI numbers, Roth conversions, healthcare, and how to use the gap years window.</p>
              </div>
            </Link>
            <Link href="/handbooks/freelancer-financial-setup-guide">
              <div className="group rounded-2xl border border-slate-200 bg-white p-8 hover:border-violet-300 hover:shadow-lg transition-all h-full cursor-pointer">
                <div className="p-3 rounded-xl bg-violet-50 w-fit mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 group-hover:text-violet-600 transition-colors">The Freelancer's Financial Setup Guide</h3>
                <p className="text-sm text-slate-600">From your first client to a complete financial system: business banking, tax reserves, retirement accounts, and protecting your income.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* All Articles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-8">
            All Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regularArticles.map((article) => (
              <Link key={article.slug} href={`/articles/${article.slug}`}>
                <article className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-emerald-300 hover:shadow-lg transition-all h-full">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-medium text-white ${article.categoryColor} px-2 py-0.5 rounded-full`}>
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2 text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 text-base">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{article.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-medium mb-4 text-slate-900">
            Get financial insights in your inbox
          </h2>
          <p className="text-slate-600 mb-8">
            Join 10,000+ self-employed professionals getting weekly tips on taxes, investing, and building wealth.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || submitMessage === "Subscribed!"}
              className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-slate-900 placeholder:text-slate-400 disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={isSubmitting || submitMessage === "Subscribed!"}
              className="bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSubmitting ? "Subscribing..." : submitMessage || "Subscribe"}
            </Button>
          </form>
          {submitMessage && (
            <p className={`text-sm mt-2 ${submitMessage === "Subscribed!" ? "text-emerald-600" : "text-red-600"}`}>
              {submitMessage}
            </p>
          )}
          <p className="text-xs text-slate-500 mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-50 via-white to-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-medium mb-6 text-slate-900">
            Ready to optimize your finances?
          </h2>
          <p className="text-slate-600 mb-10 text-lg">
            SoloFI helps self-employed professionals track net worth, optimize taxes, and plan for financial independence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/tools">
              <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                Explore Free Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Free Tools */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-8">
            Free Tools
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            <Link href="https://solofi.io/tools">
              <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-lg transition-all h-full">
                <h3 className="font-medium mb-2 text-slate-900">Tax Savings Calculator</h3>
                <p className="text-sm text-slate-600">Find your Solo 401k, S-Corp, and HSA opportunities.</p>
              </div>
            </Link>
            <Link href="https://solofi.io/tools">
              <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-lg transition-all h-full">
                <h3 className="font-medium mb-2 text-slate-900">FI Calculator</h3>
                <p className="text-sm text-slate-600">Calculate your path to financial independence.</p>
              </div>
            </Link>
            <Link href="https://solofi.io/tools">
              <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-lg transition-all h-full">
                <h3 className="font-medium mb-2 text-slate-900">Roth Conversion Ladder</h3>
                <p className="text-sm text-slate-600">Access retirement funds before 59½.</p>
              </div>
            </Link>
            <Link href="https://solofi.io/tools">
              <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-lg transition-all h-full">
                <h3 className="font-medium mb-2 text-slate-900">Net Worth Quiz</h3>
                <p className="text-sm text-slate-600">Assess your financial tracking habits.</p>
              </div>
            </Link>
            <Link href="https://solofi.io/tools">
              <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-lg transition-all h-full">
                <h3 className="font-medium mb-2 text-slate-900">Freelance Checklist</h3>
                <p className="text-sm text-slate-600">First-year financial setup guide.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-400">
          <span>© 2026 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/blog" className="hover:text-white transition-colors">Learn</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
