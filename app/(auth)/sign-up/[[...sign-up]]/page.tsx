import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-semibold text-slate-900">SoloFI</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-slate-900 mb-2">
              Start your journey
            </h1>
            <p className="text-slate-600">
              Join thousands of professionals building financial independence
            </p>
          </div>

          {/* Clerk Sign Up Component */}
          <div className="flex justify-center">
            <SignUp
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-white shadow-lg border border-slate-200 rounded-xl",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "bg-white border-slate-300 hover:bg-slate-50 text-slate-700",
                  formButtonPrimary:
                    "bg-emerald-600 hover:bg-emerald-700 text-sm normal-case",
                  footerActionLink: "text-emerald-600 hover:text-emerald-700",
                  identityPreviewEditButton: "text-emerald-600 hover:text-emerald-700",
                  formFieldLabel: "text-slate-700",
                  formFieldInput:
                    "border-slate-300 focus:border-emerald-500 focus:ring-emerald-500",
                  dividerLine: "bg-slate-200",
                  dividerText: "text-slate-500",
                },
              }}
            />
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm text-slate-600">
            <p>
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full py-6 text-center text-sm text-slate-500">
        <p>© 2025 SoloFI. Built for independent professionals.</p>
      </footer>
    </div>
  );
}
