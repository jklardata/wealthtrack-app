import { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare } from "lucide-react";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | SoloFI",
  description: "Get in touch with the SoloFI team. Questions, feedback, feature requests, or just say hi.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider mb-3">Get in touch</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Contact</h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
            Questions, feedback, or just want to say hi — I read every message.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid md:grid-cols-5 gap-10 lg:gap-16">
          {/* Left column - context */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Email</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Reach me directly at{" "}
                <a
                  href="mailto:justin@solofi.io"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  justin@solofi.io
                </a>
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Common topics</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">→</span>
                  Feature requests or product feedback
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">→</span>
                  Questions about your subscription
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">→</span>
                  Bug reports or technical issues
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">→</span>
                  Press or partnership inquiries
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">→</span>
                  Anything else on your mind
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-slate-700">
              <p className="font-medium text-slate-800 mb-1">Not financial advice</p>
              <p>
                SoloFI is a planning tool, not a licensed financial advisor. For personalized advice, please consult a qualified CPA or financial planner.
              </p>
            </div>
          </div>

          {/* Right column - form */}
          <div className="md:col-span-3">
            <ContactForm />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <span>© 2026 SoloFI</span>
            <div className="flex gap-6">
              <Link href="/about" className="hover:text-slate-700">About</Link>
              <Link href="/blog" className="hover:text-slate-700">Resources</Link>
              <Link href="/glossary" className="hover:text-slate-700">Glossary</Link>
              <Link href="/privacy" className="hover:text-slate-700">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-700">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
