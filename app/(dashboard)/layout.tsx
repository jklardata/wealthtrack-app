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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/net-worth", label: "Net Worth", icon: TrendingUp },
  { href: "/credit-cards", label: "Credit Cards", icon: CreditCard, disabled: true },
  { href: "/award-programs", label: "Award Programs", icon: Award, disabled: true },
  { href: "/settings", label: "Settings", icon: Settings, disabled: true },
];

function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-orange-500" />
          <span className="font-bold text-lg">WealthTrack</span>
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
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-orange-500/10 text-orange-500"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                item.disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={(e) => item.disabled && e.preventDefault()}
            >
              <Icon className="h-4 w-4" />
              {item.label}
              {item.disabled && (
                <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded">Soon</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <span className="text-sm text-muted-foreground">My Account</span>
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
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card">
        <Sidebar />
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col">
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-card">
          <Link href="/dashboard" className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <span className="font-bold">WealthTrack</span>
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
    </div>
  );
}
