"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { TrendingUp, FileText, BookOpen, Cpu, ArrowLeft, HelpCircle } from "lucide-react";

const docNav = [
  {
    label: "Documentation",
    items: [
      { href: "/learn", label: "Overview", icon: BookOpen, exact: true },
      { href: "/learn/methodology", label: "Methodology", icon: Cpu },
      { href: "/learn/glossary", label: "Glossary", icon: FileText },
      { href: "/learn/faq", label: "FAQ", icon: HelpCircle, exact: true },
    ],
  },
];

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white">
      {/* Top header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1.5">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <span className="text-base font-semibold text-slate-900">
                <span className="text-emerald-600">Solo</span>FI
              </span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-sm text-slate-500 font-medium">Documentation</span>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            App
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-0">
        {/* Left sidebar */}
        <aside className="hidden md:flex w-52 flex-shrink-0 flex-col pt-8 pr-6 border-r border-slate-100 sticky top-[53px] self-start h-[calc(100vh-53px)]">
          {docNav.map((group) => (
            <div key={group.label} className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all",
                        isActive
                          ? "bg-emerald-50 text-emerald-700 font-medium"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden w-full border-b border-slate-100 flex gap-1 py-3 mb-2">
          {docNav[0].items.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex-1 text-center text-xs py-1.5 rounded-lg font-medium transition-colors",
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Content */}
        <main className="flex-1 min-w-0 py-8 md:pl-10">
          {children}
        </main>
      </div>
    </div>
  );
}
