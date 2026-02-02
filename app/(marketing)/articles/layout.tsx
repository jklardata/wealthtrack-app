import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link href="/" className="text-xl font-medium tracking-tight text-slate-900">
          SoloFI
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/blog" className="text-sm text-slate-600 hover:text-slate-900 hidden md:block">
            Blog
          </Link>
          <Link href="/tools/tax-savings" className="text-sm text-slate-600 hover:text-slate-900 hidden md:block">
            Free Tools
          </Link>
          <Link href="/dashboard">
            <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 pb-16">
        {children}
      </main>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* Newsletter */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-medium mb-4 text-slate-900">
            Get more insights like this
          </h2>
          <p className="text-slate-600 mb-8">
            Join 10,000+ self-employed professionals getting weekly tips on taxes, investing, and building wealth.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
            />
            <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <span>© 2026 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/blog" className="hover:text-slate-900">Blog</Link>
            <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
