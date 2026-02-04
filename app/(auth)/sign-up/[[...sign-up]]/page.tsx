import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Shield, Lock } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#FBF7F0]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="https://solofi.io" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-700 to-teal-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-semibold text-[#10182C]">SoloFI</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-6 py-16 min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-[#10182C] mb-4">
              Start your journey
            </h1>
            <p className="text-lg text-slate-600">
              Model your data and improve your future
            </p>
          </div>

          {/* Clerk Sign Up Component */}
          <div className="flex justify-center">
            <SignUp
              afterSignUpUrl="https://app.solofi.io/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-white shadow-sm border border-slate-200 rounded-lg",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "bg-white border-slate-300 hover:bg-slate-50 text-[#10182C] font-normal h-[38px]",
                  formButtonPrimary:
                    "bg-[#0D3F4A] hover:bg-[#0a2f37] text-white text-[15px] normal-case font-medium h-[38px] shadow-sm",
                  footerActionLink: "text-[#0D3F4A] hover:text-[#0a2f37] font-medium",
                  identityPreviewEditButton: "text-[#0D3F4A] hover:text-[#0a2f37]",
                  formFieldLabel: "text-[#10182C] font-medium text-[13px]",
                  formFieldInput:
                    "border-slate-300 focus:border-[#0D3F4A] focus:ring-[#0D3F4A] text-[15px] h-[38px]",
                  dividerLine: "bg-slate-200",
                  dividerText: "text-slate-500 text-[13px]",
                  formFieldInputShowPasswordButton: "text-slate-600 hover:text-[#10182C]",
                  identityPreviewText: "text-[#10182C]",
                  formHeaderTitle: "text-[#10182C]",
                  formHeaderSubtitle: "text-slate-600",
                },
              }}
            />
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center text-[14px] text-slate-600">
            <p>
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-[#0D3F4A] hover:text-[#0a2f37] font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Trust Indicators */}
            <div className="flex items-center gap-4 text-[13px] text-slate-600">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-600" />
                <span>256-bit encryption</span>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-4 text-[13px] text-slate-600">
              <Link href="/privacy" className="hover:text-[#10182C]">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#10182C]">
                Terms of Service
              </Link>
              <span>© 2025 SoloFI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
