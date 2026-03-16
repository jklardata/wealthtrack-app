"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { OnboardingModal } from "@/app/(dashboard)/onboarding/OnboardingModal";
import {
  LayoutDashboard,
  TrendingUp,
  CreditCard,
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
  FileText,
  User,
  LineChart,
  Activity,
  MessageSquare,
  GraduationCap,
  RefreshCw,
  Target,
  Map,
  Calendar,
  DollarSign,
  Percent,
  Heart,
  ClipboardList,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FeedbackWidget } from "@/components/feedback-widget";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Your Details",
    items: [
      { href: "/profile", label: "Profile", icon: User },
      { href: "/net-worth", label: "Net Worth", icon: TrendingUp },
      { href: "/freelance-rate", label: "Rate & Revenue Planner", icon: DollarSign },
      { href: "/feie-eligibility", label: "Foreign Income Exclusion", icon: Globe },
    ],
  },
  {
    label: "Analysis",
    items: [
      { href: "/portfolio-optimizer", label: "Portfolio Optimizer", icon: PieChart },
      { href: "/lifetime-income", label: "Trajectory", icon: LineChart },
      { href: "/retirement", label: "Retirement Calculator", icon: Calculator },
      { href: "/early-retirement", label: "Early Retirement", icon: Sunrise },
      { href: "/withdrawal-stress-test", label: "Withdrawal Stress Test", icon: Activity },
      { href: "/roth-conversion", label: "Roth Conversion", icon: RefreshCw },
      { href: "/geo-arbitrage", label: "Geo Arbitrage", icon: Globe },
    ],
  },
  {
    label: "Tax Optimization",
    items: [
      { href: "/tax-calculator", label: "Tax Calculator", icon: Receipt },
      { href: "/scorp-salary", label: "S-Corp Salary Optimizer", icon: Building2 },
      { href: "/tax-optimization", label: "Tax Optimization", icon: Lightbulb },
      { href: "/quarterly-estimated-taxes", label: "Quarterly Est. Taxes", icon: Calendar },
      { href: "/tax-bracket-filling", label: "Fill Your Tax Brackets", icon: Target },
      { href: "/lifetime-tax-map", label: "Lifetime Tax Map", icon: Map },
      { href: "/qbi-deduction", label: "20% Business Deduction", icon: Percent },
      { href: "/hsa-calculator", label: "HSA Calculator", icon: Heart },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/learn", label: "Documentation", icon: FileText },
      { href: "/tools", label: "Resources", icon: BookOpen },
      { href: "/blog", label: "Learn", icon: GraduationCap },
      { href: "/pricing", label: "Pricing", icon: Sparkles },
      { href: "/founder-notes", label: "Founder Notes", icon: MessageSquare },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-full bg-slate-100", className)}>
      {/* Logo */}
      <div className="px-3 py-4 border-b border-slate-200">
        <Link href="https://solofi.io" className="flex items-center gap-1.5">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          <span className="text-base font-semibold text-slate-900">
            <span className="text-emerald-600">Solo</span>fi
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto space-y-5">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            {group.label && (
              <p className="px-2 mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.disabled ? "#" : item.href}
                    className={cn(
                      "flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150",
                      isActive
                        ? "bg-white text-emerald-700 font-medium shadow-sm"
                        : "text-slate-600 hover:bg-slate-200 hover:text-slate-900",
                      item.disabled && "opacity-40 cursor-not-allowed"
                    )}
                    onClick={(e) => item.disabled && e.preventDefault()}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{item.label}</span>
                    {item.disabled && (
                      <span className="ml-auto text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                        Soon
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Account */}
      <div className="px-4 py-3 border-t border-slate-200 bg-slate-100">
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <span className="text-xs text-slate-500">My Account</span>
        </div>
      </div>
    </div>
  );
}

function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (!data?.data?.onboarding_completed) {
          setShowOnboarding(true);
        }
      })
      .catch(() => {
        // If fetch fails, show onboarding to be safe
        setShowOnboarding(true);
      });
  }, [isLoaded]);

  return (
    <>
      {showOnboarding && (
        <OnboardingModal
          firstName={user?.firstName ?? undefined}
          onComplete={() => setShowOnboarding(false)}
        />
      )}
      {children}
    </>
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
      <aside className="hidden md:flex w-56 flex-col border-r border-slate-200 bg-slate-100 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 bg-white">
          <Link href="https://solofi.io" className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
            <span className="text-lg font-semibold text-slate-900">
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
              <SheetContent side="left" className="w-56 p-0">
                <Sidebar />
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 overflow-auto min-w-0">
          <OnboardingGate>{children}</OnboardingGate>
        </main>
      </div>

      {/* Feedback Widget - Floating */}
      <FeedbackWidget pageName="dashboard" variant="floating" />
    </div>
  );
}
