"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSubscription } from "@/hooks/use-subscription";
import { LockedModule } from "@/components/locked-module";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  ReferenceLine,
  Bar,
  BarChart,
  Cell,
  Legend,
} from "recharts";
import {
  Rocket,
  Target,
  TrendingUp,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  DollarSign,
  Calendar,
  Flame,
  MapPin,
  ArrowRight,
  RefreshCw,
  Zap,
  Coffee,
  Sparkles,
  Crown,
  ChevronRight,
  HelpCircle,
  RefreshCcw,
  Wallet,
  BarChart3,
  Activity,
} from "lucide-react";
import type { NetWorthEntry } from "@/lib/types";
import {
  calculateFIReadiness,
  simulateWithdrawals,
  calculateLifestyleBudget,
  calculateCoastFI,
  calculateSemiRetirementBridge,
  calculateBurnRate,
  calculateFreedomMilestones,
  formatCurrency,
  formatPercent,
  formatYears,
  type EarlyRetirementInputs,
  type FIStage,
  type LifestyleMode,
  type FIReadinessResult,
  type WithdrawalSimulationResult,
  type LifestyleBudget,
  type CoastFIResult,
  type SemiRetirementBridge,
  type BurnRateResult,
  type FIMilestone,
} from "@/lib/early-retirement-calculator";
import { FeedbackWidget } from "@/components/feedback-widget";

// ============================================================================
// COMPONENT
// ============================================================================

export default function EarlyRetirementPage() {
  const { isPro, isLoading: subscriptionLoading } = useSubscription();

  // -------------------------------------------------------------------------
  // State: User Inputs
  // -------------------------------------------------------------------------
  const [currentAge, setCurrentAge] = useState(35);
  const [targetRetirementAge, setTargetRetirementAge] = useState(50);
  const [currentPortfolio, setCurrentPortfolio] = useState(500000);
  const [annualIncome, setAnnualIncome] = useState(5000);
  const [annualExpenses, setAnnualExpenses] = useState(50000);
  const [annualSavings, setAnnualSavings] = useState(0);

  // Assumptions
  const [withdrawalRate, setWithdrawalRate] = useState(4);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [volatility, setVolatility] = useState(15);
  const [inflationRate, setInflationRate] = useState(3);

  // Semi-retirement
  const [semiRetirementIncome, setSemiRetirementIncome] = useState(30000);
  const [semiRetirementYears, setSemiRetirementYears] = useState(5);

  // Lifestyle mode
  const [lifestyleMode, setLifestyleMode] = useState<LifestyleMode>("base");

  // Geographic adjustment
  const [costOfLivingMultiplier, setCostOfLivingMultiplier] = useState(1.0);

  // Roth Conversion
  const [traditionalBalance, setTraditionalBalance] = useState(200000);
  const [currentMarginalRate, setCurrentMarginalRate] = useState(24);
  const [retirementMarginalRate, setRetirementMarginalRate] = useState(12);

  // UI State
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // Fetch Net Worth Data and User Settings to Pre-populate
  // -------------------------------------------------------------------------
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user settings for age and retirement age
        const settingsResponse = await fetch("/api/settings");
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          if (settingsData.data) {
            // Pre-populate age from profile if available
            if (settingsData.data.current_age) {
              setCurrentAge(settingsData.data.current_age);
            }
            // Pre-populate target retirement age from profile if available
            if (settingsData.data.desired_retirement_age) {
              setTargetRetirementAge(settingsData.data.desired_retirement_age);
            }
          }
        }

        // Fetch net worth data
        const response = await fetch("/api/net-worth");
        if (response.ok) {
          const result = await response.json();
          const entries: NetWorthEntry[] = result.data || [];

          if (entries.length > 0) {
            // Sort by date descending and get most recent
            const sorted = [...entries].sort(
              (a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            const latest = sorted[0];

            // Use net_worth directly from the entry
            const netWorth = latest.net_worth || (latest.total_assets - latest.total_debts);

            if (netWorth > 0) {
              setCurrentPortfolio(netWorth);
            }

            // Use income and expenses if available
            // pre_tax_income is annual, monthly_expenses is monthly
            if (latest.pre_tax_income && latest.pre_tax_income > 0) {
              setAnnualIncome(latest.pre_tax_income);
            }
            if (latest.monthly_expenses && latest.monthly_expenses > 0) {
              setAnnualExpenses(latest.monthly_expenses * 12);
            }

            // Calculate savings
            const annualInc = latest.pre_tax_income || 0;
            const annualExp = (latest.monthly_expenses || 0) * 12;
            const annualSav = annualInc - annualExp;
            if (annualSav > 0) {
              setAnnualSavings(annualSav);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // -------------------------------------------------------------------------
  // Build Inputs Object
  // -------------------------------------------------------------------------
  const inputs: EarlyRetirementInputs = useMemo(
    () => ({
      currentAge,
      currentPortfolio,
      annualIncome,
      annualExpenses,
      annualSavings,
      targetRetirementAge,
      retirementDurationYears: 100 - targetRetirementAge, // Plan to age 100
      withdrawalRate: withdrawalRate / 100,
      expectedReturn: expectedReturn / 100,
      volatility: volatility / 100,
      inflationRate: inflationRate / 100,
      semiRetirementIncome,
      semiRetirementYears,
      lifestyleMode,
      costOfLivingMultiplier,
    }),
    [
      currentAge,
      currentPortfolio,
      annualIncome,
      annualExpenses,
      annualSavings,
      targetRetirementAge,
      withdrawalRate,
      expectedReturn,
      volatility,
      inflationRate,
      semiRetirementIncome,
      semiRetirementYears,
      lifestyleMode,
      costOfLivingMultiplier,
    ]
  );

  // -------------------------------------------------------------------------
  // Calculations (memoized for performance)
  // -------------------------------------------------------------------------
  const fiReadiness = useMemo(() => calculateFIReadiness(inputs), [inputs]);

  const withdrawalSimulation = useMemo(
    () => simulateWithdrawals(inputs, 1000),
    [inputs]
  );

  const lifestyleBudgets = useMemo(
    () => ({
      lean: calculateLifestyleBudget(inputs, "lean"),
      base: calculateLifestyleBudget(inputs, "base"),
      chubby: calculateLifestyleBudget(inputs, "chubby"),
      fat: calculateLifestyleBudget(inputs, "fat"),
    }),
    [inputs]
  );

  const coastFI = useMemo(() => calculateCoastFI(inputs), [inputs]);

  const semiRetirementBridge = useMemo(
    () => calculateSemiRetirementBridge(inputs),
    [inputs]
  );

  const burnRate = useMemo(() => calculateBurnRate(inputs), [inputs]);

  const milestones = useMemo(
    () => calculateFreedomMilestones(inputs),
    [inputs]
  );

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  if (loading || subscriptionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 flex items-center gap-3">
            <Rocket className="h-7 w-7 text-emerald-600" />
            Early Retirement Control Center
          </h1>
          <p className="text-slate-500 mt-1">
            Your decision dashboard for financial independence - not predictions,
            but clarity
          </p>
        </div>

        {/* Educational Introduction */}
        <Card className="bg-gradient-to-br from-orange-50 via-white to-amber-50 border-orange-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Flame className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    The Self-Employed Path to Early Retirement
                  </h3>
                  <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
                    <p>
                      <strong>If you&apos;re self-employed, you control the two most powerful levers for early retirement: income growth and expense optimization.</strong> Unlike traditional employees constrained by salary schedules and corporate benefit structures, you can directly influence how much you earn and how efficiently you deploy that capital. This flexibility makes early retirement not just possible, but potentially accelerated—if you understand the mechanics and commit to disciplined execution.
                    </p>
                    <p>
                      The FIRE movement (Financial Independence, Retire Early) has validated what many self-employed professionals intuitively understand: your savings rate determines your timeline more than your absolute income. Here&apos;s the math that matters: at a 50% savings rate, you can retire in approximately 17 years. Increase that to 70%, and you&apos;re looking at under 9 years. For self-employed individuals who can scale income without proportionally scaling lifestyle, these aggressive savings rates aren&apos;t theoretical—they&apos;re achievable through strategic business decisions and intentional lifestyle design.
                    </p>
                    <p>
                      <strong>Your income trajectory is uniquely non-linear.</strong> A traditional employee might see 3-5% annual raises. You can double your effective income by landing one major client, launching a leveraged product, or optimizing pricing strategy. But here&apos;s the critical insight: increasing income only accelerates retirement if you resist lifestyle inflation. That extra $50,000 in annual revenue becomes 3-4 additional years of financial runway when invested, or zero additional freedom when absorbed into a larger home or luxury vehicle.
                    </p>
                    <p>
                      <strong>Savings rate is the compounding force multiplier.</strong> Consider two self-employed professionals: One earns $150,000 annually and saves 30% ($45,000). Another earns $100,000 but saves 50% ($50,000). The lower earner retires earlier because they&apos;ve optimized the relationship between earning and spending. For self-employed individuals, this often means strategic decisions around business expenses (is that office necessary, or does remote work suffice?), tax-advantaged retirement account contributions (maximize Solo 401(k) and SEP-IRA limits), and ruthless evaluation of recurring subscriptions and tools that don&apos;t directly generate revenue.
                    </p>
                    <p className="text-slate-600 italic">
                      Think of early retirement planning as engineering your escape velocity. Your income is the initial thrust, but your savings rate determines whether you break free from the gravitational pull of perpetual work. Every percentage point increase in savings rate translates to months or years of reclaimed life. The control center below helps you model these variables, explore scenarios, and identify the specific combination of income, savings, and timeline that aligns with your definition of financial independence. The path exists—you just need to illuminate it with data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Panel */}
        <Card className="bg-white border-2 border-black shadow-sm">
          <CardContent className="pt-4 pb-3">
            {/* Row 1: Core inputs */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
              <div>
                <Label className="text-xs text-slate-500">Age</Label>
                <Input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(parseInt(e.target.value) || 0)}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Retire At</Label>
                <Input
                  type="number"
                  value={targetRetirementAge}
                  onChange={(e) => setTargetRetirementAge(parseInt(e.target.value) || 0)}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Portfolio</Label>
                <Input
                  type="number"
                  value={currentPortfolio}
                  onChange={(e) => setCurrentPortfolio(parseInt(e.target.value) || 0)}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Income</Label>
                <Input
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(parseInt(e.target.value) || 0)}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Expenses</Label>
                <Input
                  type="number"
                  value={annualExpenses}
                  onChange={(e) => setAnnualExpenses(parseInt(e.target.value) || 0)}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Savings</Label>
                <Input
                  type="number"
                  value={annualSavings}
                  onChange={(e) => setAnnualSavings(parseInt(e.target.value) || 0)}
                  className="h-8"
                />
              </div>
            </div>

            {/* Row 2: Sliders */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Withdrawal Rate</span>
                  <span className="font-medium text-foreground">{withdrawalRate}%</span>
                </div>
                <Slider
                  value={[withdrawalRate * 100]}
                  onValueChange={([v]) => setWithdrawalRate(v / 100)}
                  min={200}
                  max={600}
                  step={25}
                  className="h-5"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Expected Return</span>
                  <span className="font-medium text-foreground">{expectedReturn}%</span>
                </div>
                <Slider
                  value={[expectedReturn * 100]}
                  onValueChange={([v]) => setExpectedReturn(v / 100)}
                  min={300}
                  max={1000}
                  step={50}
                  className="h-5"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Volatility</span>
                  <span className="font-medium text-foreground">{volatility}%</span>
                </div>
                <Slider
                  value={[volatility * 100]}
                  onValueChange={([v]) => setVolatility(v / 100)}
                  min={500}
                  max={2500}
                  step={100}
                  className="h-5"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Bridge Income</span>
                  <span className="font-medium text-foreground">${(semiRetirementIncome/1000).toFixed(0)}k</span>
                </div>
                <Slider
                  value={[semiRetirementIncome]}
                  onValueChange={([v]) => setSemiRetirementIncome(v)}
                  min={0}
                  max={100000}
                  step={5000}
                  className="h-5"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Freedom Milestones - Right under filters */}
        <FreedomMilestonesModule milestones={milestones} />

        {/* Scenario Planner Callout */}
        <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Compare Multiple Retirement Paths</h3>
                <p className="text-sm text-slate-600">
                  Create and compare different scenarios side-by-side to find your optimal strategy.
                </p>
              </div>
              <Link href="/retirement-scenarios">
                <Button className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap ml-4">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Scenario Planner
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Stress Test Callout */}
        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Test Your Withdrawal Strategy</h3>
                <p className="text-sm text-slate-600">
                  Run Monte Carlo simulations to understand the probability your retirement plan will succeed.
                </p>
              </div>
              <Link href="/withdrawal-stress-test">
                <Button className="bg-orange-600 hover:bg-orange-700 whitespace-nowrap ml-4">
                  <Activity className="h-4 w-4 mr-2" />
                  Stress Test
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* FIRE Framework Explanation */}
        <Card className="bg-gradient-to-br from-purple-50 via-white to-pink-50 border-purple-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  Understanding FIRE Strategies
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  The FIRE framework provides additional nuance: <strong>CoastFI</strong> (the point where you can stop saving because invested assets will grow to retirement needs), <strong>BaristaFI</strong> (semi-retirement where part-time work covers living expenses while investments compound), and <strong>FatFIRE</strong> (retirement with a more comfortable lifestyle budget). As a self-employed professional, you have the flexibility to design hybrid scenarios: perhaps you dial down client work by 50% once you hit CoastFI, maintaining creative fulfillment while your portfolio does the heavy lifting.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FI Readiness + Lifestyle Budget side by side */}
        {isPro ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <FIReadinessDashboard
              readiness={fiReadiness}
              portfolio={currentPortfolio}
              expenses={annualExpenses}
              withdrawalRate={withdrawalRate}
            />
            <LifestyleBudgetModule
              budgets={lifestyleBudgets}
              selectedMode={lifestyleMode}
              setSelectedMode={setLifestyleMode}
              withdrawalRate={withdrawalRate}
            />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <LockedModule
              title="FI Readiness"
              description="Comprehensive FI readiness assessment"
              icon={<Target className="h-5 w-5 text-emerald-600" />}
              benefits={["FI stage tracking", "Readiness metrics", "Progress tracking"]}
            />
            <LockedModule
              title="Lifestyle Budget"
              description="Model different spending scenarios"
              icon={<Coffee className="h-5 w-5 text-emerald-600" />}
              benefits={["Lean/Base/Fat FI budgets", "Lifestyle comparisons", "Spending scenarios"]}
            />
          </div>
        )}

        {/* Semi-Retirement Bridge */}
        {isPro ? (
          <SemiRetirementBridgeModule
            bridge={semiRetirementBridge}
            semiRetirementIncome={semiRetirementIncome}
            setSemiRetirementIncome={setSemiRetirementIncome}
            semiRetirementYears={semiRetirementYears}
            setSemiRetirementYears={setSemiRetirementYears}
          />
        ) : (
          <LockedModule
            title="Semi-Retirement Bridge"
            description="Plan a gradual transition to full retirement"
            icon={<Clock className="h-5 w-5 text-emerald-600" />}
            benefits={["Bridge strategy planning", "Part-time income modeling", "Gradual FI transition"]}
          />
        )}

        {/* Roth Conversion Ladder */}
        {isPro ? (
          <RothConversionLadderModule
            currentAge={currentAge}
            targetRetirementAge={targetRetirementAge}
            traditionalBalance={traditionalBalance}
            setTraditionalBalance={setTraditionalBalance}
            currentMarginalRate={currentMarginalRate}
            setCurrentMarginalRate={setCurrentMarginalRate}
            retirementMarginalRate={retirementMarginalRate}
            setRetirementMarginalRate={setRetirementMarginalRate}
            annualExpenses={annualExpenses}
          />
        ) : (
          <LockedModule
            title="Roth Conversion Ladder"
            description="Optimize your Roth conversion strategy"
            icon={<Wallet className="h-5 w-5 text-emerald-600" />}
            benefits={["Tax-optimized conversions", "5-year rule planning", "Marginal rate optimization"]}
          />
        )}

        {/* Module 6: Geo-Arbitrage Link */}
        {isPro ? (
          <GeoArbitrageLink
            costOfLivingMultiplier={costOfLivingMultiplier}
            setCostOfLivingMultiplier={setCostOfLivingMultiplier}
            requiredPortfolio={fiReadiness.requiredPortfolio}
          />
        ) : (
          <LockedModule
            title="Geographic Flexibility"
            description="Explore cost-of-living arbitrage opportunities"
            icon={<MapPin className="h-5 w-5 text-emerald-600" />}
            benefits={["Location-based FI planning", "Cost-of-living adjustments", "Geo-arbitrage calculator"]}
          />
        )}

        {/* Module 7: Burn Rate Clock */}
        {isPro ? (
          <BurnRateClockModule burnRate={burnRate} />
        ) : (
          <LockedModule
            title="Burn Rate Clock"
            description="Track your spending rate and runway"
            icon={<Flame className="h-5 w-5 text-emerald-600" />}
            benefits={["Real-time burn rate", "Portfolio runway", "Emergency fund analysis"]}
          />
        )}

        {/* Feedback Widget */}
        <div className="flex justify-center">
          <FeedbackWidget
            pageName="early-retirement"
            variant="inline"
            triggerText="Missing something? Let us know"
          />
        </div>

        {/* Disclaimer */}
        <Card className="bg-amber-50/50 border-amber-200">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-slate-600">
              <strong className="text-slate-900">Important:</strong> These projections are for educational
              purposes only and should not be considered financial advice. All
              calculations involve simplifying assumptions. Market returns are
              unpredictable, and past performance does not guarantee future
              results. Consult a qualified financial advisor before making major
              financial decisions.
            </p>
          </CardContent>
        </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}

// ============================================================================
// MODULE 1: FI READINESS DASHBOARD
// ============================================================================

function FIReadinessDashboard({
  readiness,
  portfolio,
  expenses,
  withdrawalRate,
}: {
  readiness: FIReadinessResult;
  portfolio: number;
  expenses: number;
  withdrawalRate: number;
}) {
  const stages: { stage: FIStage; label: string }[] = [
    { stage: "not-ready", label: "Not Ready" },
    { stage: "progressing", label: "Progress" },
    { stage: "coast-fi", label: "Coast" },
    { stage: "fi", label: "FI" },
    { stage: "work-optional", label: "Optional" },
  ];

  const getStageIndex = (stage: FIStage) =>
    stages.findIndex((s) => s.stage === stage);
  const currentIndex = getStageIndex(readiness.stage);

  return (
    <Card className="bg-white border-2 border-black shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-slate-900 flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-600" />
          FI Readiness
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Stage Gauge */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            {stages.map((s, i) => (
              <div
                key={s.stage}
                className={`flex flex-col items-center ${
                  i <= currentIndex ? "text-emerald-600" : "text-slate-500"
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    i <= currentIndex ? "bg-emerald-600" : "bg-muted"
                  } ${i === currentIndex ? "ring-2 ring-primary ring-offset-1" : ""}`}
                />
                <span className="text-xs sm:text-[10px] mt-1 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 via-amber-500 via-blue-500 to-green-500 rounded-full"
              style={{ width: `${Math.min(readiness.fiCoveragePercent, 125)}%` }}
            />
          </div>
        </div>

        {/* Current Stage */}
        <div
          className="p-2 rounded-lg flex items-center gap-2"
          style={{ backgroundColor: `${readiness.progressColor}10` }}
        >
          <div
            className="p-1.5 rounded-full"
            style={{ backgroundColor: `${readiness.progressColor}25` }}
          >
            {readiness.stage === "work-optional" ? (
              <Crown className="h-4 w-4" style={{ color: readiness.progressColor }} />
            ) : readiness.stage === "fi" ? (
              <CheckCircle className="h-4 w-4" style={{ color: readiness.progressColor }} />
            ) : (
              <TrendingUp className="h-4 w-4" style={{ color: readiness.progressColor }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-semibold" style={{ color: readiness.progressColor }}>
              {readiness.stageLabel}
            </span>
            <span className="text-sm text-slate-500 ml-2">
              {readiness.stageDescription}
            </span>
          </div>
        </div>

        {/* Metrics 2x2 */}
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 rounded bg-muted/30">
            <p className="text-xl font-bold">{formatPercent(readiness.fiCoveragePercent, 0)}</p>
            <p className="text-xs text-slate-500">Coverage</p>
          </div>
          <div className="text-center p-2 rounded bg-muted/30">
            <p className="text-xl font-bold">{formatYears(readiness.yearsToFI)}</p>
            <p className="text-xs text-slate-500">Years to FI</p>
          </div>
          <div className="text-center p-2 rounded bg-muted/30">
            <p className="text-xl font-bold">{formatCurrency(readiness.requiredPortfolio)}</p>
            <p className="text-xs text-slate-500">FI Number</p>
          </div>
          <div className="text-center p-2 rounded bg-muted/30">
            <p className="text-xl font-bold">{formatCurrency(readiness.monthlySpend)}</p>
            <p className="text-xs text-slate-500">Safe Monthly</p>
          </div>
        </div>

        {/* Formula with actual numbers */}
        <div className="text-xs text-slate-500 space-y-1 pt-2 border-t">
          <p><strong className="text-foreground">FI Number:</strong> {formatCurrency(expenses)} ÷ {withdrawalRate}% = <strong className="text-foreground">{formatCurrency(readiness.requiredPortfolio)}</strong></p>
          <p><strong className="text-foreground">Coverage:</strong> {formatCurrency(portfolio)} ÷ {formatCurrency(readiness.requiredPortfolio)} = <strong className="text-foreground">{formatPercent(readiness.fiCoveragePercent, 0)}</strong></p>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MODULE 2: WITHDRAWAL STRESS SIMULATOR
// ============================================================================

function WithdrawalStressSimulator({
  simulation,
}: {
  simulation: WithdrawalSimulationResult;
}) {
  const riskColors = {
    low: "#10b981",
    moderate: "#f59e0b",
    high: "#ef4444",
    "very-high": "#7f1d1d",
  };

  // Use all projections for more detail
  const chartData = simulation.projections;

  return (
    <Card className="bg-white border-2 border-black shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-slate-900 flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-600" />
          Withdrawal Stress Test (Monte Carlo)
        </CardTitle>
        <CardDescription>
          1,000 simulated market scenarios over 30+ years
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* How it works - no background */}
        <p className="text-xs text-slate-500">
          Simulates 1,000 different market return sequences using your expected return ± volatility.
          Green = 75th percentile (optimistic), Blue = median, Red = 10th percentile (worst case).
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p
              className="text-base sm:text-xl md:text-2xl font-bold"
              style={{ color: riskColors[simulation.riskLevel] }}
            >
              {formatPercent(simulation.successProbability, 0)}
            </p>
            <p className="text-[9px] sm:text-[10px] text-slate-500">Success Rate</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-base sm:text-xl md:text-2xl font-bold text-blue-600">
              {formatCurrency(simulation.medianEndingBalance)}
            </p>
            <p className="text-[9px] sm:text-[10px] text-slate-500">Median Balance</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-base sm:text-xl md:text-2xl font-bold text-green-600">
              {formatCurrency(simulation.percentile75Balance)}
            </p>
            <p className="text-[9px] sm:text-[10px] text-slate-500">75th Percentile</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-base sm:text-xl md:text-2xl font-bold text-red-600">
              {formatCurrency(simulation.percentile25Balance)}
            </p>
            <p className="text-[9px] sm:text-[10px] text-slate-500">25th Percentile</p>
          </div>
        </div>

        {/* Larger Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="age"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${v}`}
                label={{ value: 'Age', position: 'insideBottom', offset: -5, fontSize: 12 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                label={{ value: 'Portfolio', angle: -90, position: 'insideLeft', fontSize: 12 }}
              />
              <RechartsTooltip
                formatter={(value) => formatCurrency(value as number)}
                labelFormatter={(label) => `Age ${label}`}
              />
              <Area
                type="monotone"
                dataKey="percentile75"
                stroke="#10b981"
                fill="#10b98130"
                name="75th Percentile"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="median"
                stroke="#3b82f6"
                fill="#3b82f640"
                name="Median"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="percentile25"
                stroke="#f59e0b"
                fill="#f59e0b20"
                name="25th Percentile"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="percentile10"
                stroke="#ef4444"
                fill="#ef444420"
                name="10th Percentile (Failure Zone)"
                strokeWidth={1}
              />
              <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Assessment */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <div
              className="px-2 py-1 rounded text-xs font-medium"
              style={{
                backgroundColor: `${riskColors[simulation.riskLevel]}20`,
                color: riskColors[simulation.riskLevel],
              }}
            >
              {simulation.riskLevel === "low" ? "Low Risk" : simulation.riskLevel === "moderate" ? "Moderate Risk" : simulation.riskLevel === "high" ? "High Risk" : "Very High Risk"}
            </div>
            {simulation.yearsUntilDepletion && (
              <span className="text-xs text-slate-500">
                Depletion at ~{simulation.yearsUntilDepletion} years in worst case
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500">
            {simulation.assumptions[0]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MODULE 3: LIFESTYLE BUDGET
// ============================================================================

function LifestyleBudgetModule({
  budgets,
  selectedMode,
  setSelectedMode,
  withdrawalRate,
}: {
  budgets: { lean: LifestyleBudget; base: LifestyleBudget; chubby: LifestyleBudget; fat: LifestyleBudget };
  selectedMode: LifestyleMode;
  setSelectedMode: (mode: LifestyleMode) => void;
  withdrawalRate: number;
}) {
  const currentBudget = budgets[selectedMode];

  const modeIcons: Record<LifestyleMode, React.ReactNode> = {
    lean: <Zap className="h-4 w-4" />,
    base: <Coffee className="h-4 w-4" />,
    chubby: <TrendingUp className="h-4 w-4" />,
    fat: <Sparkles className="h-4 w-4" />,
  };

  return (
    <Card className="bg-white border-2 border-black shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-slate-900 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-emerald-600" />
          Retirement Lifestyle Budget
        </CardTitle>
        <CardDescription>
          2026 FIRE thresholds: Lean $0.5-1M, Base $1-2.5M, Chubby $2.5-5M, Fat $5M+
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(["lean", "base", "chubby", "fat"] as LifestyleMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedMode === mode
                  ? "border-primary bg-emerald-600/5"
                  : "border-muted hover:border-muted-foreground/30"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {modeIcons[mode]}
                <span className="font-medium">{budgets[mode].modeLabel}</span>
              </div>
              <p className="text-xl font-bold mt-1">
                {formatCurrency(budgets[mode].requiredPortfolio)}
              </p>
              <p className="text-xs text-slate-500">required</p>
            </button>
          ))}
        </div>

        {/* Expense Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Monthly Budget</span>
            <span className="font-bold">
              {formatCurrency(currentBudget.totalMonthly)}
            </span>
          </div>

          {/* Stacked Bar */}
          <div className="h-8 rounded-lg overflow-hidden flex">
            {currentBudget.categories.map((cat, i) => (
              <Tooltip key={cat.name}>
                <TooltipTrigger asChild>
                  <div
                    style={{
                      width: `${cat.percent}%`,
                      backgroundColor: cat.color,
                    }}
                    className="h-full cursor-help"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{cat.name}</p>
                  <p>{formatCurrency(cat.annual / 12)}/mo ({cat.percent}%)</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {currentBudget.categories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span>{cat.name}</span>
                <span className="text-slate-500 ml-auto">
                  {formatCurrency(cat.annual / 12)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Formula with actual numbers */}
        <div className="text-xs text-slate-500 space-y-1 pt-3 border-t">
          <p><strong className="text-foreground">Annual Spending:</strong> {formatCurrency(currentBudget.totalAnnual)} ({currentBudget.modeLabel} lifestyle)</p>
          <p><strong className="text-foreground">Required Portfolio:</strong> {formatCurrency(currentBudget.totalAnnual)} ÷ {withdrawalRate}% = <strong className="text-foreground">{formatCurrency(currentBudget.requiredPortfolio)}</strong></p>
          <p><strong className="text-foreground">Monthly Budget:</strong> {formatCurrency(currentBudget.totalAnnual)} ÷ 12 = <strong className="text-foreground">{formatCurrency(currentBudget.totalMonthly)}/mo</strong></p>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MODULE 4: COAST FI CALCULATOR
// ============================================================================

function CoastFICalculator({
  coastFI,
  currentAge,
}: {
  coastFI: CoastFIResult;
  currentAge: number;
}) {
  // Sample chart data
  const chartData = coastFI.growthOnlyProjection.filter(
    (_, i) => i % 5 === 0 || i === coastFI.growthOnlyProjection.length - 1
  );

  return (
    <Card className="bg-white border-2 border-black shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-slate-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          Coast FI
        </CardTitle>
        <CardDescription>
          When can you stop saving?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Formula - no background */}
        <p className="text-xs text-slate-500">
          <strong className="text-foreground">Coast FI:</strong> When your portfolio, growing at expected returns with no contributions, will reach your FI number by retirement age.
        </p>

        {/* Status Banner */}
        <div
          className={`p-4 rounded-lg ${
            coastFI.isCoastFI
              ? "bg-green-500/10 border border-green-500/30"
              : "bg-amber-500/10 border border-amber-500/30"
          }`}
        >
          <div className="flex items-center gap-3">
            {coastFI.isCoastFI ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <Clock className="h-6 w-6 text-amber-500" />
            )}
            <div>
              <p className="font-semibold">
                {coastFI.isCoastFI
                  ? "You've reached Coast FI!"
                  : `${formatYears(coastFI.yearsUntilCoastFI)} until Coast FI`}
              </p>
              <p className="text-sm text-slate-500">
                {coastFI.isCoastFI
                  ? "Your portfolio will grow to FI without additional savings"
                  : `At age ${coastFI.coastFIAge}, you can stop saving`}
              </p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{coastFI.currentCoastFIAge}</p>
            <p className="text-xs text-slate-500">Retire at (if stop saving)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {formatCurrency(coastFI.minimumIncomeToCoast)}
            </p>
            <p className="text-xs text-slate-500">Min income to coast</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {formatCurrency(coastFI.portfolioAtRetirement)}
            </p>
            <p className="text-xs text-slate-500">Projected at retirement</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="age" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
              />
              <RechartsTooltip
                formatter={(value) => formatCurrency(value as number)}
                labelFormatter={(label) => `Age ${label}`}
              />
              <Area
                type="monotone"
                dataKey="portfolio"
                fill="#3b82f640"
                stroke="#3b82f6"
                name="Portfolio (No Savings)"
              />
              <ReferenceLine
                y={chartData[0]?.requiredSpendLine}
                stroke="#10b981"
                strokeDasharray="5 5"
                label={{ value: "FI Target", fontSize: 10, fill: "#10b981" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MODULE 5: SEMI-RETIREMENT BRIDGE
// ============================================================================

function SemiRetirementBridgeModule({
  bridge,
  semiRetirementIncome,
  setSemiRetirementIncome,
  semiRetirementYears,
  setSemiRetirementYears,
}: {
  bridge: SemiRetirementBridge;
  semiRetirementIncome: number;
  setSemiRetirementIncome: (v: number) => void;
  semiRetirementYears: number;
  setSemiRetirementYears: (v: number) => void;
}) {
  const phaseColors = {
    "full-work": "#3b82f6",
    "partial-work": "#8b5cf6",
    "portfolio-support": "#10b981",
    "full-fi": "#f59e0b",
  };

  return (
    <Card className="bg-white border-2 border-black shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-slate-900 flex items-center gap-2">
          <ArrowRight className="h-5 w-5 text-emerald-600" />
          Semi-Retirement Bridge
        </CardTitle>
        <CardDescription>
          Reduce sequence risk with part-time work
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* How it helps - no background */}
        <p className="text-xs text-slate-500">
          <strong className="text-foreground">How it helps:</strong> Part-time income reduces portfolio withdrawals, protecting against sequence-of-returns risk.
        </p>

        {/* Controls - Bridge Years only (income is at top) */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Bridge Years</span>
            <span className="font-medium">{semiRetirementYears} years @ ${(semiRetirementIncome/1000).toFixed(0)}k/yr</span>
          </div>
          <Slider
            value={[semiRetirementYears]}
            onValueChange={([v]) => setSemiRetirementYears(v)}
            min={0}
            max={15}
            step={1}
          />
        </div>

        {/* Timeline Visualization - Taller for readability */}
        <div className="space-y-1">
          <p className="text-xs font-medium">Retirement Timeline</p>
          <div className="flex h-8 rounded-lg overflow-hidden">
            {bridge.timeline.map((phase) => {
              const duration = phase.endAge - phase.startAge;
              const totalYears = bridge.timeline.reduce(
                (sum, p) => sum + (p.endAge - p.startAge),
                0
              );
              const width = (duration / totalYears) * 100;
              // Abbreviate labels for small sections
              const shortLabel = phase.phase === "full-work" ? "Work"
                : phase.phase === "partial-work" ? "Bridge"
                : phase.phase === "portfolio-support" ? "Draw"
                : "FI";

              return (
                <Tooltip key={phase.phase}>
                  <TooltipTrigger asChild>
                    <div
                      className="h-full flex items-center justify-center cursor-help border-r border-white/20 last:border-r-0"
                      style={{
                        width: `${width}%`,
                        backgroundColor: phaseColors[phase.phase],
                        minWidth: '30px',
                      }}
                    >
                      <span className="text-xs sm:text-[10px] font-medium text-white">
                        {width > 15 ? phase.label : shortLabel}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{phase.label}</p>
                    <p className="text-xs">Ages {phase.startAge} - {phase.endAge}</p>
                    <p className="text-xs">{phase.incomeSource}</p>
                    {phase.portfolioWithdrawal > 0 && (
                      <p className="text-xs">Withdrawal: {formatCurrency(phase.portfolioWithdrawal)}/yr</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center p-3 rounded-lg bg-green-500/10">
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(bridge.portfolioSavings)}
            </p>
            <p className="text-xs text-slate-500">Less portfolio needed</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-500/10">
            <p className="text-xl font-bold text-blue-600">
              {bridge.sequenceRiskMitigationYears} yrs
            </p>
            <p className="text-xs text-slate-500">Sequence risk reduced</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-purple-500/10">
            <p className="text-xl font-bold text-purple-600">
              {formatPercent(bridge.withdrawalOffsetPercent, 0)}
            </p>
            <p className="text-xs text-slate-500">Expenses covered</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MODULE 6: GEO-ARBITRAGE LINK
// ============================================================================

function GeoArbitrageLink({
  costOfLivingMultiplier,
  setCostOfLivingMultiplier,
  requiredPortfolio,
}: {
  costOfLivingMultiplier: number;
  setCostOfLivingMultiplier: (v: number) => void;
  requiredPortfolio: number;
}) {
  // Calculate impact of different COL scenarios
  const scenarios = [
    { label: "LCOL", multiplier: 0.6, color: "#10b981", examples: "Thailand, Portugal, Mexico" },
    { label: "MCOL", multiplier: 0.8, color: "#3b82f6", examples: "Austin, Denver, Raleigh" },
    { label: "Baseline", multiplier: 1.0, color: "#6b7280", examples: "Average US city" },
    { label: "HCOL", multiplier: 1.3, color: "#f59e0b", examples: "Seattle, Boston, LA" },
    { label: "VHCOL", multiplier: 1.6, color: "#ef4444", examples: "SF, NYC, Zurich" },
  ];

  const baselinePortfolio = requiredPortfolio / costOfLivingMultiplier;
  const currentSavings = baselinePortfolio - requiredPortfolio;

  return (
    <Card className="bg-white border-2 border-black shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-slate-900 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-emerald-600" />
          Geographic Flexibility
        </CardTitle>
        <CardDescription>
          How location changes your FI number
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* How it works - no background */}
        <p className="text-xs text-slate-500">
          <strong className="text-foreground">How it works:</strong> FI Number = Annual Expenses / Withdrawal Rate.
          Move to a 60% COL area → expenses drop 40% → portfolio requirement drops 40%.
        </p>

        {/* COL Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Cost of Living Adjustment</span>
            <span className="font-medium">{(costOfLivingMultiplier * 100).toFixed(0)}% of baseline</span>
          </div>
          <Slider
            value={[costOfLivingMultiplier * 100]}
            onValueChange={([v]) => setCostOfLivingMultiplier(v / 100)}
            min={50}
            max={180}
            step={5}
          />
          {costOfLivingMultiplier !== 1.0 && (
            <p className="text-xs text-slate-500">
              {costOfLivingMultiplier < 1.0
                ? `Saves ${formatCurrency(Math.abs(currentSavings))} vs baseline`
                : `Costs ${formatCurrency(Math.abs(currentSavings))} more than baseline`}
            </p>
          )}
        </div>

        {/* Scenario Comparison */}
        <div className="grid grid-cols-5 gap-1">
          {scenarios.map((s) => (
            <Tooltip key={s.label}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setCostOfLivingMultiplier(s.multiplier)}
                  className={`p-2 rounded-lg border transition-all ${
                    Math.abs(costOfLivingMultiplier - s.multiplier) < 0.05
                      ? "border-primary bg-emerald-600/5"
                      : "border-muted hover:border-muted-foreground/30"
                  }`}
                >
                  <p className="text-xs font-medium">{s.label}</p>
                  <p className="text-[10px] text-slate-500">{s.multiplier}x</p>
                  <p
                    className="text-xs sm:text-sm font-bold"
                    style={{ color: s.color }}
                  >
                    {formatCurrency(baselinePortfolio * s.multiplier)}
                  </p>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{s.label} Examples</p>
                <p className="text-xs">{s.examples}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Link to Geo-Arbitrage */}
        <Link href="/geo-arbitrage">
          <Button variant="outline" className="w-full gap-2">
            <MapPin className="h-4 w-4" />
            Explore Geo-Arbitrage Calculator
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
        </Link>

        <p className="text-xs text-slate-500">
          <Info className="h-3 w-3 inline mr-1" />
          Formula: <code className="bg-muted px-1 rounded">Required Portfolio = (Annual Expenses × COL Multiplier) / Withdrawal Rate</code>
        </p>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MODULE 7: BURN RATE CLOCK
// ============================================================================

function BurnRateClockModule({ burnRate }: { burnRate: BurnRateResult }) {
  return (
    <Card className="bg-white border-2 border-black shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-slate-900 flex items-center gap-2">
          <Flame className="h-5 w-5 text-emerald-600" />
          Burn Rate Clock
        </CardTitle>
        <CardDescription>
          At current spend, portfolio longevity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Portfolio lasts</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">
                {burnRate.yearsRemaining >= 100 ? "100+" : burnRate.yearsRemaining.toFixed(1)}
              </span>
              <span className="text-xl text-slate-500">years</span>
            </div>
            <p className="text-xs text-slate-500">
              Range: {burnRate.yearsRemainingPessimistic.toFixed(0)} - {burnRate.yearsRemainingOptimistic.toFixed(0)} years
            </p>
          </div>

          <div className="text-right">
            <div className="space-y-1">
              <div>
                <p className="text-xs text-slate-500">Monthly Burn</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(burnRate.monthlyBurnRate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Annual Burn</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(burnRate.annualBurnRate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {burnRate.yearsRemaining < 30 && (
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Consider reducing expenses or increasing income to extend your runway.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MODULE 9: FREEDOM MILESTONES
// ============================================================================

function FreedomMilestonesModule({ milestones }: { milestones: FIMilestone[] }) {
  const milestoneIcons: Record<string, React.ReactNode> = {
    "Coast FI": <TrendingUp className="h-4 w-4" />,
    "Barista FI": <Coffee className="h-4 w-4" />,
    "Lean FI": <Zap className="h-4 w-4" />,
    "Full FI": <CheckCircle className="h-4 w-4" />,
    "Fat FI": <Crown className="h-4 w-4" />,
  };

  return (
    <Card className="bg-white border-2 border-black shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-slate-900 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-600" />
          Freedom Milestones
        </CardTitle>
        <CardDescription>
          Retirement is progress, not a binary switch
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Tiles Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {milestones.map((milestone) => (
            <Tooltip key={milestone.name}>
              <TooltipTrigger asChild>
                <div
                  className={`p-3 rounded-lg border cursor-help transition-all hover:shadow-md ${
                    milestone.isAchieved
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-slate-50 border-2 border-black"
                  }`}
                >
                  {/* Icon & Status */}
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`p-1.5 rounded-full ${
                        milestone.isAchieved ? "bg-emerald-100" : "bg-slate-100"
                      }`}
                    >
                      {milestone.isAchieved ? (
                        <CheckCircle className="h-3 w-3 text-emerald-600" />
                      ) : (
                        milestoneIcons[milestone.name] || <Target className="h-3 w-3" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {milestone.progress.toFixed(0)}%
                    </span>
                  </div>

                  {/* Name */}
                  <p className="font-medium text-sm truncate">{milestone.name}</p>

                  {/* Target */}
                  <p className="text-lg font-bold">
                    {formatCurrency(milestone.portfolioTarget)}
                  </p>

                  {/* Status */}
                  <p className={`text-xs ${milestone.isAchieved ? "text-emerald-600" : "text-slate-500"}`}>
                    {milestone.isAchieved
                      ? "Achieved!"
                      : milestone.yearsAway
                      ? `${formatYears(milestone.yearsAway)} away`
                      : "—"}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        milestone.isAchieved ? "bg-emerald-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(milestone.progress, 100)}%` }}
                    />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="font-medium">{milestone.name}</p>
                <p className="text-xs text-slate-500 mb-1">{milestone.description}</p>
                <p className="text-xs italic">&ldquo;{milestone.lifestyleImplication}&rdquo;</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MODULE 8: ROTH CONVERSION LADDER
// ============================================================================

interface RothConversionYear {
  year: number;
  age: number;
  conversionAmount: number;
  taxOnConversion: number;
  availableYear: number; // 5-year rule
  availableAge: number;
  cumulativeConverted: number;
  remainingTraditional: number;
}

function calculateRothConversionLadder(
  currentAge: number,
  retirementAge: number,
  traditionalBalance: number,
  retirementMarginalRate: number,
  annualExpenses: number
): {
  conversions: RothConversionYear[];
  totalTaxPaid: number;
  yearsUntilPenaltyFree: number;
  optimalConversionAmount: number;
  taxSavingsVsLater: number;
  canAccessFundsAge: number;
} {
  const PENALTY_FREE_AGE = 59.5;
  const FIVE_YEAR_RULE = 5;

  const yearsInLadder = Math.max(0, Math.min(PENALTY_FREE_AGE - retirementAge, 15));
  const yearsUntilPenaltyFree = Math.max(0, PENALTY_FREE_AGE - currentAge);

  // Optimal conversion: aim to fill up low tax brackets
  // Standard deduction 2026: ~$15,000 single
  // 10% bracket: $0-$11,600, 12% bracket: $11,600-$47,150
  // So ~$62,000 can be converted at 10-12% rate
  const lowBracketLimit = 62000;
  const optimalConversionAmount = Math.min(
    lowBracketLimit,
    annualExpenses * 1.2, // Slightly more than expenses to build buffer
    traditionalBalance / Math.max(yearsInLadder, 1)
  );

  const conversions: RothConversionYear[] = [];
  let remainingBalance = traditionalBalance;
  let cumulativeConverted = 0;

  for (let i = 0; i < yearsInLadder && remainingBalance > 0; i++) {
    const conversionAmount = Math.min(optimalConversionAmount, remainingBalance);
    const taxOnConversion = conversionAmount * (retirementMarginalRate / 100);

    cumulativeConverted += conversionAmount;
    remainingBalance -= conversionAmount;

    conversions.push({
      year: i + 1,
      age: retirementAge + i,
      conversionAmount,
      taxOnConversion,
      availableYear: i + 1 + FIVE_YEAR_RULE,
      availableAge: retirementAge + i + FIVE_YEAR_RULE,
      cumulativeConverted,
      remainingTraditional: remainingBalance,
    });
  }

  const totalTaxPaid = conversions.reduce((sum, c) => sum + c.taxOnConversion, 0);

  // Compare to withdrawing later at potentially higher rate (assume 22% marginal)
  const laterTaxRate = 0.22;
  const totalIfWithdrawnLater = traditionalBalance * laterTaxRate;
  const taxSavingsVsLater = totalIfWithdrawnLater - totalTaxPaid;

  // First year funds become available (5 years after first conversion)
  const canAccessFundsAge = conversions.length > 0
    ? conversions[0].availableAge
    : PENALTY_FREE_AGE;

  return {
    conversions,
    totalTaxPaid,
    yearsUntilPenaltyFree,
    optimalConversionAmount,
    taxSavingsVsLater,
    canAccessFundsAge,
  };
}

function RothConversionLadderModule({
  currentAge,
  targetRetirementAge,
  traditionalBalance,
  setTraditionalBalance,
  currentMarginalRate,
  setCurrentMarginalRate,
  retirementMarginalRate,
  setRetirementMarginalRate,
  annualExpenses,
}: {
  currentAge: number;
  targetRetirementAge: number;
  traditionalBalance: number;
  setTraditionalBalance: (v: number) => void;
  currentMarginalRate: number;
  setCurrentMarginalRate: (v: number) => void;
  retirementMarginalRate: number;
  setRetirementMarginalRate: (v: number) => void;
  annualExpenses: number;
}) {
  const ladder = useMemo(
    () => calculateRothConversionLadder(
      currentAge,
      targetRetirementAge,
      traditionalBalance,
      retirementMarginalRate,
      annualExpenses
    ),
    [currentAge, targetRetirementAge, traditionalBalance, retirementMarginalRate, annualExpenses]
  );

  const taxBrackets = [
    { rate: 10, label: "10%" },
    { rate: 12, label: "12%" },
    { rate: 22, label: "22%" },
    { rate: 24, label: "24%" },
    { rate: 32, label: "32%" },
    { rate: 35, label: "35%" },
  ];

  return (
    <Card className="bg-white border-2 border-black shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-slate-900 flex items-center gap-2">
          <RefreshCcw className="h-5 w-5 text-emerald-600" />
          Roth Conversion Ladder
        </CardTitle>
        <CardDescription>
          Access retirement funds before 59½ penalty-free
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Explanation */}
        <p className="text-xs text-slate-500">
          <strong className="text-foreground">Strategy:</strong> Convert Traditional IRA/401k to Roth during low-income early retirement years.
          After 5 years, withdraw conversions tax and penalty-free—even before age 59½.
        </p>

        {/* Inputs */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs text-slate-500">Traditional Balance</Label>
            <Input
              type="number"
              value={traditionalBalance}
              onChange={(e) => setTraditionalBalance(parseInt(e.target.value) || 0)}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-500">Current Tax Rate</Label>
            <Select
              value={currentMarginalRate.toString()}
              onValueChange={(v) => setCurrentMarginalRate(parseInt(v))}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {taxBrackets.map((b) => (
                  <SelectItem key={b.rate} value={b.rate.toString()}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-slate-500">Retirement Tax Rate</Label>
            <Select
              value={retirementMarginalRate.toString()}
              onValueChange={(v) => setRetirementMarginalRate(parseInt(v))}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {taxBrackets.map((b) => (
                  <SelectItem key={b.rate} value={b.rate.toString()}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-lg bg-blue-500/10">
            <p className="text-base sm:text-lg md:text-xl font-bold text-blue-600">
              {formatCurrency(ladder.optimalConversionAmount)}
            </p>
            <p className="text-[9px] sm:text-[10px] text-slate-500">Convert Per Year</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-500/10">
            <p className="text-base sm:text-lg md:text-xl font-bold text-green-600">
              {formatCurrency(ladder.taxSavingsVsLater)}
            </p>
            <p className="text-[9px] sm:text-[10px] text-slate-500">Tax Savings</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-purple-500/10">
            <p className="text-base sm:text-lg md:text-xl font-bold text-purple-600">
              {ladder.canAccessFundsAge.toFixed(0)}
            </p>
            <p className="text-[9px] sm:text-[10px] text-slate-500">First Access Age</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-amber-500/10">
            <p className="text-base sm:text-lg md:text-xl font-bold text-amber-600">
              {formatCurrency(ladder.totalTaxPaid)}
            </p>
            <p className="text-[9px] sm:text-[10px] text-slate-500">Total Tax on Conversions</p>
          </div>
        </div>

        {/* Conversion Timeline Visualization */}
        {ladder.conversions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium">Conversion Ladder Timeline</p>
            <div className="relative">
              {/* Timeline bar */}
              <div className="h-12 rounded-lg bg-muted/30 relative overflow-hidden">
                <div className="absolute inset-0 flex">
                  {ladder.conversions.slice(0, 10).map((conv, i) => (
                    <Tooltip key={i}>
                      <TooltipTrigger asChild>
                        <div
                          className="h-full flex flex-col items-center justify-center cursor-help border-r border-white/20 last:border-r-0"
                          style={{
                            width: `${100 / Math.min(ladder.conversions.length, 10)}%`,
                            backgroundColor: i < 5 ? "#ef444440" : "#10b98140",
                          }}
                        >
                          <span className="text-xs sm:text-[10px] font-medium">
                            {conv.age}
                          </span>
                          <span className="text-[10px] sm:text-[8px] text-slate-500">
                            ${(conv.conversionAmount / 1000).toFixed(0)}k
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">Year {conv.year} (Age {conv.age})</p>
                        <p className="text-xs">Convert: {formatCurrency(conv.conversionAmount)}</p>
                        <p className="text-xs">Tax: {formatCurrency(conv.taxOnConversion)}</p>
                        <p className="text-xs text-green-600">
                          Available: Age {conv.availableAge} (Year {conv.availableYear})
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
              {/* Legend */}
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded bg-red-400/40" />
                  Locked (5-year rule)
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded bg-green-400/40" />
                  Available penalty-free
                </span>
              </div>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="pt-3 border-t space-y-2">
          <p className="text-xs font-medium flex items-center gap-1">
            <Info className="h-3 w-3" />
            How the Roth Conversion Ladder Works
          </p>
          <ol className="text-xs text-slate-500 space-y-1 ml-4">
            <li>1. Retire early and enter a low-income year</li>
            <li>2. Convert Traditional IRA → Roth IRA (pay tax at low rate)</li>
            <li>3. Wait 5 years for conversions to become accessible</li>
            <li>4. Withdraw converted amounts tax and penalty-free</li>
            <li>5. Repeat each year until age 59½ when all funds are accessible</li>
          </ol>
        </div>

        {/* Warning */}
        {targetRetirementAge >= 54 && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Retiring at {targetRetirementAge} leaves limited time for the Roth ladder.
                Consider the Rule of 55 (401k access) or SEPP/72(t) distributions instead.
              </p>
            </div>
          </div>
        )}

        {/* Link to lead magnet */}
        <Link href="/tools/roth-conversion">
          <Button variant="outline" className="w-full gap-2">
            <Wallet className="h-4 w-4" />
            Try Full Roth Conversion Calculator
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

function MetricCard({
  label,
  value,
  subtext,
  icon,
}: {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-3 rounded-lg bg-muted/50">
      <div className="flex items-center gap-2 text-slate-500 mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-slate-500">{subtext}</p>
    </div>
  );
}
