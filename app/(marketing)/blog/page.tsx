import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Sparkles } from "lucide-react";

export const metadata = {
  title: "Blog - SoloFI",
  description: "Financial insights, tax strategies, and wealth-building tips for self-employed professionals and independent consultants.",
};

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
];

export default function BlogPage() {
  const featuredArticles = ARTICLES.filter((a) => a.featured);
  const regularArticles = ARTICLES.filter((a) => !a.featured);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link href="/" className="text-xl font-medium tracking-tight">
          SoloFI
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/tools/tax-savings" className="text-sm text-white/60 hover:text-white hidden md:block">
            Free Tools
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 rounded-full text-sm mb-8">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-white/70">Insights for the self-employed</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-6 leading-[1.1]">
            The SoloFI{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Blog
            </span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl">
            Financial insights, tax strategies, and wealth-building tips for consultants, freelancers, and business owners.
          </p>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Featured Articles */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-8">
            Featured
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredArticles.map((article) => (
              <Link key={article.slug} href={`/articles/${article.slug}`}>
                <article className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-colors">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className={`text-xs font-medium text-white ${article.categoryColor} px-3 py-1 rounded-full`}>
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-3 group-hover:text-amber-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-white/60 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-white/40">
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

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* All Articles */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-8">
            All Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regularArticles.map((article) => (
              <Link key={article.slug} href={`/articles/${article.slug}`}>
                <article className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-colors h-full">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-medium text-white ${article.categoryColor} px-2 py-0.5 rounded-full`}>
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2 group-hover:text-amber-400 transition-colors line-clamp-2 text-sm">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-white/40">
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

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Newsletter Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-medium mb-4">
            Get financial insights in your inbox
          </h2>
          <p className="text-white/60 mb-8">
            Join 10,000+ self-employed professionals getting weekly tips on taxes, investing, and building wealth.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 text-white placeholder:text-white/40"
            />
            <Button className="bg-white text-black hover:bg-white/90">
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-white/40 mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-y border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-medium mb-6">
            Ready to optimize your finances?
          </h2>
          <p className="text-white/60 mb-10 text-lg">
            SoloFI helps self-employed professionals track net worth, optimize taxes, and plan for financial independence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-black hover:bg-white/90">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/tools/tax-savings">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Try Tax Calculator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Free Tools */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-8">
            Free Tools
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            <Link href="/tools/tax-savings">
              <div className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-amber-500/50 transition-colors h-full">
                <h3 className="font-medium mb-2">Tax Savings Calculator</h3>
                <p className="text-sm text-white/60">Find your Solo 401k, S-Corp, and HSA opportunities.</p>
              </div>
            </Link>
            <Link href="/tools/fi-calculator">
              <div className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-purple-500/50 transition-colors h-full">
                <h3 className="font-medium mb-2">FI Calculator</h3>
                <p className="text-sm text-white/60">Calculate your path to financial independence.</p>
              </div>
            </Link>
            <Link href="/tools/roth-conversion">
              <div className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-pink-500/50 transition-colors h-full">
                <h3 className="font-medium mb-2">Roth Conversion Ladder</h3>
                <p className="text-sm text-white/60">Access retirement funds before 59½.</p>
              </div>
            </Link>
            <Link href="/tools/net-worth-quiz">
              <div className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-blue-500/50 transition-colors h-full">
                <h3 className="font-medium mb-2">Net Worth Quiz</h3>
                <p className="text-sm text-white/60">Assess your financial tracking habits.</p>
              </div>
            </Link>
            <Link href="/tools/freelance-checklist">
              <div className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-green-500/50 transition-colors h-full">
                <h3 className="font-medium mb-2">Freelance Checklist</h3>
                <p className="text-sm text-white/60">First-year financial setup guide.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-white/40">
          <span>© 2026 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
