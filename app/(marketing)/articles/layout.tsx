import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link href="/" className="text-xl font-medium tracking-tight">
          SoloFI
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/blog" className="text-sm text-white/60 hover:text-white hidden md:block">
            Blog
          </Link>
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

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 pb-16">
        {children}
      </main>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Newsletter */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-medium mb-4">
            Get more insights like this
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
