import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">SoloFI</span>
          </Link>
          <SignInButton mode="modal">
            <Button variant="outline">Sign In</Button>
          </SignInButton>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            The Financial Roadmap for <span className="text-primary">Independent Consultants</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Plan your path to financial independence. Track net worth, optimize your portfolio,
            and explore geographic arbitrage to retire on your terms.
          </p>
          <SignInButton mode="modal">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </SignInButton>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SoloFI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
