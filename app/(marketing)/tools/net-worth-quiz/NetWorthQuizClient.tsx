"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  ArrowLeft,
  Wallet,
  Mail,
  CheckCircle,
  Trophy,
  Target,
  Rocket,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { EmailCaptureCard } from "@/components/email-capture-card";
import { analytics } from "@/lib/analytics";

const VARIANT = "lead_magnet_net_worth_quiz";

type QuizStage = "intro" | "questions" | "email" | "results";

interface Question {
  id: number;
  question: string;
  options: { text: string; points: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "How often do you check your total net worth?",
    options: [
      { text: "Weekly", points: 4 },
      { text: "Monthly", points: 3 },
      { text: "Quarterly", points: 2 },
      { text: "Yearly or less", points: 1 },
      { text: "I don't track it", points: 0 },
    ],
  },
  {
    id: 2,
    question: "Do you know how much you have across ALL your accounts?",
    options: [
      { text: "Yes, to the dollar", points: 4 },
      { text: "Roughly, within a few thousand", points: 3 },
      { text: "I have a general idea", points: 2 },
      { text: "Not really", points: 1 },
      { text: "No idea", points: 0 },
    ],
  },
  {
    id: 3,
    question: "How do you currently track your finances?",
    options: [
      { text: "Dedicated app or spreadsheet, updated regularly", points: 4 },
      { text: "I check my banking apps separately", points: 2 },
      { text: "Mental notes", points: 1 },
      { text: "I don't really track", points: 0 },
    ],
  },
  {
    id: 4,
    question: "Can you name your 3 largest assets right now?",
    options: [
      { text: "Yes, with exact values", points: 4 },
      { text: "Yes, with rough values", points: 3 },
      { text: "I could probably guess", points: 1 },
      { text: "No", points: 0 },
    ],
  },
  {
    id: 5,
    question: "Do you know your debt-to-asset ratio?",
    options: [
      { text: "Yes, I calculate it regularly", points: 4 },
      { text: "I have a rough idea", points: 2 },
      { text: "I've never calculated it", points: 0 },
    ],
  },
  {
    id: 6,
    question: "How confident are you about your path to financial independence?",
    options: [
      { text: "Very confident—I have a clear timeline", points: 4 },
      { text: "Somewhat confident", points: 2 },
      { text: "Not very confident", points: 1 },
      { text: "I haven't really thought about FI", points: 0 },
    ],
  },
];

interface ScoreCategory {
  min: number;
  max: number;
  title: string;
  emoji: string;
  description: string;
  tips: string[];
  color: string;
}

const SCORE_CATEGORIES: ScoreCategory[] = [
  {
    min: 20,
    max: 24,
    title: "Net Worth Pro",
    emoji: "trophy",
    description: "You're on top of your finances! You track consistently and know exactly where you stand.",
    tips: [
      "Optimize your tax strategy with advanced tools",
      "Run Monte Carlo simulations for retirement planning",
      "Explore geo-arbitrage to accelerate your FI timeline",
    ],
    color: "emerald",
  },
  {
    min: 14,
    max: 19,
    title: "Tracking Apprentice",
    emoji: "target",
    description: "Good foundation! You're aware of your finances but might be missing some optimization opportunities.",
    tips: [
      "Consolidate all accounts into one dashboard",
      "Set up automated net worth tracking",
      "Calculate your exact FI number",
    ],
    color: "blue",
  },
  {
    min: 8,
    max: 13,
    title: "Getting Started",
    emoji: "rocket",
    description: "You know the basics but need a system. A proper tracking habit could transform your financial future.",
    tips: [
      "Start with a simple net worth snapshot",
      "Track monthly to see trends over time",
      "Understand where your money actually goes",
    ],
    color: "amber",
  },
  {
    min: 0,
    max: 7,
    title: "Time to Level Up",
    emoji: "sparkles",
    description: "No judgment—most people start here! The good news? Small tracking habits lead to big financial wins.",
    tips: [
      "List all your accounts in one place",
      "Check your net worth just once this month",
      "Set a simple financial goal to work toward",
    ],
    color: "purple",
  },
];

function getCategory(score: number): ScoreCategory {
  return SCORE_CATEGORIES.find((c) => score >= c.min && score <= c.max) || SCORE_CATEGORIES[3];
}

function getCategoryIcon(emoji: string) {
  switch (emoji) {
    case "trophy":
      return <Trophy className="h-8 w-8" />;
    case "target":
      return <Target className="h-8 w-8" />;
    case "rocket":
      return <Rocket className="h-8 w-8" />;
    default:
      return <Sparkles className="h-8 w-8" />;
  }
}

export default function NetWorthQuiz() {
  const [stage, setStage] = useState<QuizStage>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const totalScore = answers.reduce((sum, pts) => sum + pts, 0);
  const maxScore = QUESTIONS.reduce((sum, q) => sum + Math.max(...q.options.map((o) => o.points)), 0);
  const category = getCategory(totalScore);

  const handleStart = () => {
    setStage("questions");
    analytics.ctaClick("get_started", "hero", VARIANT);
  };

  const handleAnswer = (points: number) => {
    const newAnswers = [...answers, points];
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStage("email");
      analytics.ctaClick("calculator_step", "step_5", VARIANT);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    } else {
      setStage("intro");
      setAnswers([]);
    }
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes("@")) {
      setSubmitError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "net_worth_quiz",
          metadata: {
            score: totalScore,
            maxScore,
            category: category.title,
            answers,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      analytics.ctaClick("calculator_email_submit", "email_gate", VARIANT);
      setStage("results");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scorePercent = Math.round((totalScore / maxScore) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-indigo-600" />
            <span className="font-semibold text-lg">SoloFI</span>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-12">
        {/* Intro Screen */}
        {stage === "intro" && (
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="h-8 w-8 text-indigo-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                How Well Are You Tracking Your Net Worth?
              </h1>
              <p className="text-slate-600 mb-8">
                Take this 2-minute quiz to discover your financial tracking habits
                and get personalized tips to build wealth faster.
              </p>
              <Button
                size="lg"
                onClick={handleStart}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Start Quiz <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-xs text-slate-400 mt-4">
                6 quick questions. No signup required to start.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Questions */}
        {stage === "questions" && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-slate-500 mb-2">
                  <span>Question {currentQuestion + 1} of {QUESTIONS.length}</span>
                  <span>{Math.round(((currentQuestion + 1) / QUESTIONS.length) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                {QUESTIONS[currentQuestion].question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {QUESTIONS[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option.points)}
                    className="w-full p-4 text-left rounded-xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
                  >
                    <span className="text-slate-700 group-hover:text-indigo-700">
                      {option.text}
                    </span>
                  </button>
                ))}
              </div>

              {/* Back button */}
              <div className="mt-6">
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Email Gate */}
        {stage === "email" && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  Quiz Complete!
                </h2>
                <p className="text-slate-600">
                  Enter your email to see your personalized assessment and tips.
                </p>
              </div>

              {/* Teaser */}
              <div className="bg-indigo-50 rounded-xl p-4 mb-6 text-center">
                <p className="text-sm text-indigo-700 mb-1">Your score</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {totalScore} / {maxScore}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSubmitError(null);
                    }}
                    className="mt-2"
                  />
                  {submitError && (
                    <p className="text-sm text-red-600 mt-2">{submitError}</p>
                  )}
                </div>

                <Button
                  onClick={handleEmailSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {isSubmitting ? "Submitting..." : "See My Results"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-xs text-slate-500 text-center">
                  We&apos;ll send you tips on tracking your net worth. Unsubscribe anytime.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {stage === "results" && (
          <div className="space-y-6">
            {/* Score Card */}
            <Card className={`shadow-lg border-2 border-${category.color}-200`}>
              <CardContent className="p-8 text-center">
                <div className={`w-20 h-20 bg-${category.color}-100 rounded-full flex items-center justify-center mx-auto mb-4 text-${category.color}-600`}>
                  {getCategoryIcon(category.emoji)}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {category.title}
                </h2>
                <p className="text-slate-600 mb-6">
                  {category.description}
                </p>

                {/* Score visualization */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="12"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${scorePercent * 3.52} 352`}
                      className={`text-${category.color}-500`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-slate-900">{totalScore}</p>
                      <p className="text-xs text-slate-500">of {maxScore}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="font-semibold text-lg mb-4">Your Next Steps</h3>
                <div className="space-y-3">
                  {category.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full bg-${category.color}-100 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <CheckCircle className={`h-4 w-4 text-${category.color}-600`} />
                      </div>
                      <p className="text-slate-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Email Capture */}
            <EmailCaptureCard
              toolName="Net Worth Quiz"
              resultsSummary={`Score: ${totalScore}/${maxScore} - ${category.title}`}
              className="mt-6"
            />

            {/* CTA */}
            <Card className="shadow-lg bg-indigo-600 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Start Tracking Your Net Worth Today</h3>
                <p className="text-indigo-100 mb-6">
                  SoloFI helps self-employed professionals track wealth, optimize taxes, and plan for FI.
                </p>
                <Link href="/sign-up">
                  <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">
                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Share */}
      <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-center gap-3 flex-wrap">
        <span className="text-sm text-slate-500">Share this free tool:</span>
        <a
          href="https://twitter.com/intent/tweet?text=Take%20the%20free%20net%20worth%20health%20check%20quiz%E2%80%94by%20SoloFI%20solofi.io/tools/net-worth-quiz%20%23NetWorth%20%23PersonalFinance"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-black text-white hover:bg-slate-800 transition-colors"
        >
          𝕏 Twitter/X
        </a>
        <a
          href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A//solofi.io/tools/net-worth-quiz"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-700 text-white hover:bg-blue-800 transition-colors"
        >
          in LinkedIn
        </a>
      </div>

      {/* Footer */}
      <footer className="border-t mt-12 py-8">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center text-sm text-slate-500">
          <span>&copy; 2026 SoloFI</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
