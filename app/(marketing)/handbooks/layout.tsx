import Link from "next/link";
import { Button } from "@/components/ui/button";
import NewsletterForm from "../articles/components/NewsletterForm";

export default function HandbooksLayout({
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
          <Link href="https://solofi.io/blog" className="text-sm text-slate-600 hover:text-slate-900 hidden md:block">
            Learn
          </Link>
          <Link href="/tools" className="text-sm text-slate-600 hover:text-slate-900 hidden md:block">
            Resources
          </Link>
          <Link href="/sign-up">
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
        <NewsletterForm />
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <span>© 2026 SoloFI</span>
          <div className="flex gap-6">
            <Link href="https://solofi.io/blog" className="hover:text-slate-900">Learn</Link>
            <Link href="/tools" className="hover:text-slate-900">Resources</Link>
            <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
