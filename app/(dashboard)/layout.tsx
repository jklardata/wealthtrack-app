"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  Award,
  Settings,
  Menu,
  PieChart,
  Calculator,
  Receipt,
  Globe,
  Sparkles,
  Lightbulb,
  Sunrise,
  BookOpen,
  User,
  LineChart,
  Activity,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FeedbackWidget } from "@/components/feedback-widget";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/net-worth", label: "Net Worth", icon: TrendingUp },
  { href: "/lifetime-income", label: "Net Worth Projected", icon: LineChart },
  { href: "/credit-cards", label: "Credit Cards", icon: CreditCard },
  { href: "/portfolio-optimizer", label: "Portfolio Optimizer", icon: PieChart },
  { href: "/retirement", label: "Retirement Calculator", icon: Calculator },
  { href: "/early-retirement", label: "Early Retirement", icon: Sunrise },
  { href: "/withdrawal-stress-test", label: "Withdrawal Stress Test", icon: Activity },
  { href: "/tax-calculator", label: "Tax Calculator", icon: Receipt },
  { href: "/tax-optimization", label: "Tax Optimization", icon: Lightbulb },
  { href: "/roth-conversion", label: "Roth Conversion", icon: RefreshCw },
  { href: "/geo-arbitrage", label: "Geo Arbitrage", icon: Globe },
  { href: "/blog", label: "Resources", icon: BookOpen },
  { href: "/founder-notes", label: "Founder Notes", icon: MessageSquare },
  { href: "/award-programs", label: "Award Programs", icon: Award, disabled: true },
  { href: "/pricing", label: "Pricing", icon: Sparkles },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-6 border-b border-slate-200">
        <Link href="https://solofi.io" className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-emerald-600" />
          <span className="text-lg font-semibold text-slate-900">
            <span className="text-emerald-600">Solo</span>fi
          </span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                item.disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={(e) => item.disabled && e.preventDefault()}
            >
              <Icon className="h-4 w-4" />
              {item.label}
              {item.disabled && (
                <span className="ml-auto text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Soon</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <span className="text-sm text-slate-500">My Account</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white">
        <Sidebar />
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 bg-white">
          <Link href="https://solofi.io" className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <span className="font-semibold text-slate-900">
              <span className="text-emerald-600">Solo</span>fi
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <Sidebar />
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>

      {/* Feedback Widget - Floating */}
      <FeedbackWidget pageName="dashboard" variant="floating" />
    </div>
  );
}
