"use client";

import { useEffect, useState, useCallback } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { LockedModule } from "@/components/locked-module";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  Shield,
  Target,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Info,
  TrendingDown,
  Gauge,
  Layers,
  Check,
  Minus,
  Landmark,
  PiggyBank,
  Wallet,
} from "lucide-react";
import { FeedbackWidget } from "@/components/feedback-widget";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  RiskTolerance,
  Allocation,
  OptimizationResult,
  PortfolioOptimization,
  RebalancingTrade,
  MarketValuation,
  StockBreakdown,
  Scenario,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface RiskQuestion {
  id: number;
  question: string;
  options: { text: string; score: number }[];
}

// Vibrant, distinct colors for better visibility
const COLORS = {
  stocks: "#f97316", // Bright Orange
  bonds: "#0ea5e9", // Sky Blue
  cash: "#10b981", // Emerald Green
  real_estate: "#8b5cf6", // Violet Purple
  commodities: "#f59e0b", // Amber Yellow
  other: "#64748b", // Slate Gray
};

// Gradient pairs for visual appeal
const COLOR_GRADIENTS = {
  stocks: { start: "#fb923c", end: "#ea580c" },
  bonds: { start: "#38bdf8", end: "#0284c7" },
  cash: { start: "#34d399", end: "#059669" },
  real_estate: { start: "#a78bfa", end: "#7c3aed" },
  commodities: { start: "#fbbf24", end: "#d97706" },
  other: { start: "#94a3b8", end: "#475569" },
};

const CATEGORY_LABELS: Record<keyof Allocation, string> = {
  stocks: "Stocks",
  bonds: "Bonds",
  cash: "Cash",
  real_estate: "Real Estate",
  commodities: "Commodities",
  other: "Other",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

// Risk Questionnaire Component
function RiskQuestionnaire({
  questions,
  onComplete,
}: {
  questions: RiskQuestion[];
  onComplete: (answers: { questionId: number; answer: number }[]) => void;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: number; answer: number }[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswer = (score: number) => {
    setSelectedAnswer(score);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [
      ...answers.filter((a) => a.questionId !== questions[currentQuestion].id),
      { questionId: questions[currentQuestion].id, answer: selectedAnswer },
    ];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      // Check if next question was already answered
      const existingAnswer = newAnswers.find(
        (a) => a.questionId === questions[currentQuestion + 1].id
      );
      setSelectedAnswer(existingAnswer?.answer || null);
    } else {
      onComplete(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const existingAnswer = answers.find(
        (a) => a.questionId === questions[currentQuestion - 1].id
      );
      setSelectedAnswer(existingAnswer?.answer || null);
    }
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className="bg-white border-2 border-black shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-black text-slate-900">
          <Target className="h-5 w-5 text-emerald-600" />
          Risk Assessment
        </CardTitle>
        <CardDescription className="text-slate-500">
          Question {currentQuestion + 1} of {questions.length}
        </CardDescription>
        <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
          <div
            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <h3 className="text-lg font-medium text-slate-900">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.score}
              onClick={() => handleAnswer(option.score)}
              className={cn(
                "w-full text-left p-4 rounded-lg border-2 transition-all",
                selectedAnswer === option.score
                  ? "border-emerald-600 bg-emerald-50"
                  : "border-2 border-black hover:border-emerald-300 hover:bg-slate-50"
              )}
            >
              {option.text}
            </button>
          ))}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="border-2 border-black text-slate-700 hover:bg-slate-100"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Improved Allocation Pie Chart Component with breakdown list
function AllocationChart({
  allocation,
  title,
  totalValue,
}: {
  allocation: Allocation;
  title: string;
  totalValue?: number;
}) {
  const data = Object.entries(allocation)
    .filter(([, value]) => value > 0.001)
    .map(([key, value]) => ({
      key: key as keyof Allocation,
      name: CATEGORY_LABELS[key as keyof Allocation],
      value: value * 100,
      rawValue: value,
      color: COLORS[key as keyof Allocation],
      amount: totalValue ? value * totalValue : undefined,
    }))
    .sort((a, b) => b.value - a.value); // Sort by value descending

  const totalPercent = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-4">
      {/* Title */}
      <h4 className="font-semibold text-center text-lg">{title}</h4>

      {/* Pie Chart */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <defs>
              {Object.entries(COLOR_GRADIENTS).map(([key, gradient]) => (
                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={gradient.start} />
                  <stop offset="100%" stopColor={gradient.end} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry) => (
                <Cell
                  key={`cell-${entry.key}`}
                  fill={`url(#gradient-${entry.key})`}
                  className="drop-shadow-sm"
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-gray-900 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-lg font-bold mt-1">{item.value.toFixed(1)}%</div>
                      {item.amount !== undefined && (
                        <div className="text-sm text-slate-500">
                          {formatCurrency(item.amount)}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-bold">{totalPercent.toFixed(0)}%</div>
            <div className="text-xs text-slate-500">Total</div>
          </div>
        </div>
      </div>

      {/* Breakdown List */}
      <div className="space-y-2">
        {data.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold" style={{ color: item.color }}>
                {item.value.toFixed(1)}%
              </span>
              {item.amount !== undefined && (
                <span className="text-xs text-slate-500 w-20 text-right">
                  {formatCurrency(item.amount)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Total value */}
      {totalValue !== undefined && totalValue > 0 && (
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Total Value</span>
            <span className="font-bold">{formatCurrency(totalValue)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Rebalancing Trades Component
function RebalancingTrades({
  trades,
  totalValue,
}: {
  trades: RebalancingTrade[];
  totalValue: number;
}) {
  if (trades.length === 0) {
    return (
      <div className="flex items-center gap-2 p-4 bg-green-500/10 rounded-lg text-green-600">
        <CheckCircle2 className="h-5 w-5" />
        <span>Your portfolio is well-balanced! No major rebalancing needed.</span>
      </div>
    );
  }

  const sells = trades.filter((t) => t.action === "sell");
  const buys = trades.filter((t) => t.action === "buy");

  return (
    <div className="space-y-4">
      {sells.length > 0 && (
        <div>
          <h4 className="font-medium text-red-500 mb-2">Sell</h4>
          <div className="space-y-2">
            {sells.map((trade, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[trade.category] }}
                  />
                  <span>{CATEGORY_LABELS[trade.category]}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(trade.amount)}</div>
                  <div className="text-xs text-slate-500">
                    {trade.percentage.toFixed(1)}% of portfolio
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sells.length > 0 && buys.length > 0 && (
        <div className="flex justify-center">
          <ArrowRight className="h-6 w-6 text-slate-500" />
        </div>
      )}

      {buys.length > 0 && (
        <div>
          <h4 className="font-medium text-green-600 mb-2">Buy</h4>
          <div className="space-y-2">
            {buys.map((trade, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[trade.category] }}
                  />
                  <span>{CATEGORY_LABELS[trade.category]}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(trade.amount)}</div>
                  <div className="text-xs text-slate-500">
                    {trade.percentage.toFixed(1)}% of portfolio
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded-lg text-yellow-600 text-sm">
        <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <span>
          Tax impact estimate: If selling stocks held less than 1 year, you may owe
          short-term capital gains tax (up to 37%). Long-term holdings are taxed at
          15-20%.
        </span>
      </div>
    </div>
  );
}

// Market Valuation Card Component
function MarketValuationCard({ valuation }: { valuation: MarketValuation }) {
  const getValuationColor = () => {
    switch (valuation.valuation) {
      case "cheap":
        return "text-green-600 bg-green-500/10";
      case "fair":
        return "text-blue-500 bg-blue-500/10";
      case "expensive":
        return "text-yellow-500 bg-yellow-500/10";
      case "very_expensive":
        return "text-red-500 bg-red-500/10";
    }
  };

  const getValuationLabel = () => {
    switch (valuation.valuation) {
      case "cheap":
        return "Undervalued";
      case "fair":
        return "Fair Value";
      case "expensive":
        return "Expensive";
      case "very_expensive":
        return "Very Expensive";
    }
  };

  const percentFromAvg = ((valuation.cape - valuation.historicalAvg) / valuation.historicalAvg) * 100;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-black flex items-center gap-3">
          <Gauge className="h-4 w-4" />
          Market Valuation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">{valuation.cape.toFixed(1)}</div>
            <div className="text-sm text-slate-500">CAPE Ratio</div>
          </div>
          <div className={cn("px-3 py-1 rounded-full text-sm font-medium", getValuationColor())}>
            {getValuationLabel()}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Historical Average</span>
            <span>{valuation.historicalAvg}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Deviation</span>
            <span className={percentFromAvg > 0 ? "text-red-500" : "text-green-600"}>
              {percentFromAvg > 0 ? "+" : ""}{percentFromAvg.toFixed(0)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Allocation Breakdown Card Component
function AllocationBreakdownCard({
  baseAllocation,
  marketAdjustment,
  finalAllocation,
  riskTolerance,
}: {
  baseAllocation: Allocation;
  marketAdjustment: { stocks: number; bonds: number; cash: number; reason: string } | null;
  finalAllocation: Allocation;
  riskTolerance: RiskTolerance;
}) {
  const formatPct = (val: number) => `${(val * 100).toFixed(0)}%`;
  const formatAdj = (val: number) => {
    if (val === 0) return "0%";
    return val > 0 ? `+${val}%` : `${val}%`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-black flex items-center gap-3">
          <Layers className="h-4 w-4" />
          Allocation Breakdown
        </CardTitle>
        <CardDescription>How your allocation was calculated</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-slate-700 leading-relaxed">
            Risk management through asset allocation is the primary determinant of long-term portfolio performance—more influential than individual security selection or market timing. Our optimizer analyzes your current holdings, assesses your risk profile through a comprehensive questionnaire, and calculates an efficient frontier allocation that balances growth potential with downside protection. The result is a personalized roadmap showing exactly how to rebalance: which positions to increase, which to trim, and by how much.
          </p>
        </div>
        <div className="space-y-4">
          {/* Header Row */}
          <div className="grid grid-cols-4 text-sm font-medium text-slate-500">
            <div></div>
            <div className="text-right">Stocks</div>
            <div className="text-right">Bonds</div>
            <div className="text-right">Cash</div>
          </div>

          {/* Base Allocation */}
          <div className="grid grid-cols-4 text-sm">
            <div className="font-medium">Base ({riskTolerance})</div>
            <div className="text-right">{formatPct(baseAllocation.stocks)}</div>
            <div className="text-right">{formatPct(baseAllocation.bonds)}</div>
            <div className="text-right">{formatPct(baseAllocation.cash)}</div>
          </div>

          {/* Market Adjustment */}
          {marketAdjustment && (
            <div className="grid grid-cols-4 text-sm">
              <div className="text-slate-500">Market Adj (CAPE)</div>
              <div className={cn("text-right", marketAdjustment.stocks < 0 ? "text-red-500" : marketAdjustment.stocks > 0 ? "text-green-600" : "")}>
                {formatAdj(marketAdjustment.stocks)}
              </div>
              <div className={cn("text-right", marketAdjustment.bonds < 0 ? "text-red-500" : marketAdjustment.bonds > 0 ? "text-green-600" : "")}>
                {formatAdj(marketAdjustment.bonds)}
              </div>
              <div className={cn("text-right", marketAdjustment.cash < 0 ? "text-red-500" : marketAdjustment.cash > 0 ? "text-green-600" : "")}>
                {formatAdj(marketAdjustment.cash)}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-dashed" />

          {/* Final Recommendation */}
          <div className="grid grid-cols-4 text-sm font-bold">
            <div>Final</div>
            <div className="text-right text-emerald-600">{formatPct(finalAllocation.stocks)}</div>
            <div className="text-right text-blue-500">{formatPct(finalAllocation.bonds)}</div>
            <div className="text-right text-green-600">{formatPct(finalAllocation.cash)}</div>
          </div>
        </div>

        {/* Rationale */}
        {marketAdjustment && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-slate-500">
            <p><strong>Rationale:</strong> {marketAdjustment.reason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Stock Breakdown Card Component
function StockBreakdownCard({
  breakdown,
  totalPortfolioValue,
  stockAllocation,
}: {
  breakdown: StockBreakdown;
  totalPortfolioValue: number;
  stockAllocation: number;
}) {
  const stockValue = stockAllocation * totalPortfolioValue;
  const coreValue = stockValue * breakdown.corePercentage;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-black flex items-center gap-3">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          Stock Allocation Breakdown
        </CardTitle>
        <CardDescription>
          {formatCurrency(stockValue)} ({(stockAllocation * 100).toFixed(0)}% of portfolio)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Core Holdings */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Core Holdings ({(breakdown.corePercentage * 100).toFixed(0)}% of stocks = {(stockAllocation * breakdown.corePercentage * 100).toFixed(0)}% of portfolio)
          </h4>
          <div className="space-y-2 pl-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium">Total US Stock Market</div>
                <div className="text-xs text-slate-500">VTI</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{(breakdown.coreHoldings.usTotalMarket.allocation * 100).toFixed(0)}%</div>
                <div className="text-xs text-slate-500">{formatCurrency(breakdown.coreHoldings.usTotalMarket.amount)}</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium">Total Intl Stock Market</div>
                <div className="text-xs text-slate-500">VXUS</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{(breakdown.coreHoldings.intlTotalMarket.allocation * 100).toFixed(0)}%</div>
                <div className="text-xs text-slate-500">{formatCurrency(breakdown.coreHoldings.intlTotalMarket.amount)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Factor Tilts */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            Factor Tilts ({(breakdown.tiltPercentage * 100).toFixed(0)}% of stocks = {(stockAllocation * breakdown.tiltPercentage * 100).toFixed(0)}% of portfolio)
          </h4>
          <div className="space-y-2 pl-4">
            {breakdown.factorTilts.map((tilt) => (
              <div key={tilt.ticker} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "mt-1 flex-shrink-0",
                    tilt.status === "recommended" ? "text-green-600" : tilt.status === "reduced" ? "text-yellow-500" : "text-slate-500"
                  )}>
                    {tilt.status === "recommended" ? <Check className="h-4 w-4" /> : tilt.status === "reduced" ? <Minus className="h-4 w-4" /> : <div className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="font-medium">{tilt.name}</div>
                    <div className="text-xs text-slate-500">{tilt.ticker}</div>
                    <div className="text-xs text-slate-500 mt-1">{tilt.reason}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-medium">{(tilt.allocation * 100).toFixed(0)}%</div>
                  <div className="text-xs text-slate-500">{formatCurrency(tilt.dollarAmount)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Note */}
        <div className="p-3 bg-blue-500/10 rounded-lg text-sm">
          <div className="font-medium text-blue-500 mb-1">Compared to 100% VTI:</div>
          <ul className="text-slate-500 space-y-1">
            <li>• Expected return: Similar (factor premiums offset expensive market)</li>
            <li>• Expected volatility: Lower due to value tilt</li>
            <li>• Downside protection: Better in market corrections</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// Tax Location Strategy Component
function TaxLocationStrategyCard({
  allocation,
  totalValue,
}: {
  allocation: Allocation;
  totalValue: number;
}) {
  // Tax efficiency data for each asset class
  const taxEfficiencyData = [
    {
      asset: "Bonds (Interest)",
      taxEfficiency: "Low",
      taxRate: "Ordinary income (up to 37%)",
      bestLocation: "Tax-Advantaged",
      reason: "Interest taxed as ordinary income annually",
      allocation: allocation.bonds,
      value: allocation.bonds * totalValue,
      icon: "🏛️",
    },
    {
      asset: "REITs",
      taxEfficiency: "Low",
      taxRate: "Ordinary income (up to 37%)",
      bestLocation: "Tax-Advantaged",
      reason: "Dividends don't qualify for lower rates",
      allocation: allocation.real_estate,
      value: allocation.real_estate * totalValue,
      icon: "🏢",
    },
    {
      asset: "International Stocks",
      taxEfficiency: "Medium",
      taxRate: "15-20% LTCG + foreign tax credit",
      bestLocation: "Taxable",
      reason: "Foreign tax credit lost in tax-advantaged",
      allocation: allocation.stocks * 0.3, // Assume 30% intl
      value: allocation.stocks * 0.3 * totalValue,
      icon: "🌍",
    },
    {
      asset: "US Stocks (Index)",
      taxEfficiency: "High",
      taxRate: "15-20% LTCG, qualified dividends",
      bestLocation: "Either/Taxable",
      reason: "Tax-efficient, low turnover",
      allocation: allocation.stocks * 0.7, // Assume 70% US
      value: allocation.stocks * 0.7 * totalValue,
      icon: "🇺🇸",
    },
    {
      asset: "Cash/Money Market",
      taxEfficiency: "Low",
      taxRate: "Ordinary income (up to 37%)",
      bestLocation: "Tax-Advantaged",
      reason: "Interest taxed as ordinary income",
      allocation: allocation.cash,
      value: allocation.cash * totalValue,
      icon: "💵",
    },
  ].filter(item => item.allocation > 0.001); // Filter out zero allocations

  // Calculate suggested allocations
  const taxAdvantaged = taxEfficiencyData
    .filter(item => item.bestLocation === "Tax-Advantaged")
    .reduce((sum, item) => sum + item.value, 0);

  const taxable = taxEfficiencyData
    .filter(item => item.bestLocation === "Taxable" || item.bestLocation === "Either/Taxable")
    .reduce((sum, item) => sum + item.value, 0);

  // Estimate annual tax savings from proper location
  const estimatedAnnualYield = 0.04; // 4% average yield
  const taxRateDiff = 0.22; // Difference between ordinary income and LTCG
  const annualTaxSavings = taxAdvantaged * estimatedAnnualYield * taxRateDiff;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-black flex items-center gap-3">
          <Landmark className="h-5 w-5 text-emerald-600" />
          Tax Location Strategy
        </CardTitle>
        <div className="text-sm text-slate-600 mt-2 space-y-2">
          <p>
            Asset location is the secret weapon most investors overlook. By placing tax-inefficient assets (bonds, REITs) in tax-advantaged accounts and tax-efficient assets (stocks) in taxable accounts, you can boost after-tax returns by 0.3-0.5% annually.
          </p>
          <p className="text-xs text-slate-500">
            Over 30 years, that compounds to tens of thousands in additional wealth—for doing nothing except being strategic about account placement.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank className="h-5 w-5 text-violet-500" />
              <span className="font-medium">Tax-Advantaged</span>
            </div>
            <div className="text-2xl font-bold text-violet-500">{formatCurrency(taxAdvantaged)}</div>
            <p className="text-xs text-slate-500 mt-1">401(k), IRA, HSA, Roth</p>
          </div>
          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-5 w-5 text-cyan-500" />
              <span className="font-medium">Taxable Brokerage</span>
            </div>
            <div className="text-2xl font-bold text-cyan-500">{formatCurrency(taxable)}</div>
            <p className="text-xs text-slate-500 mt-1">Regular brokerage account</p>
          </div>
        </div>

        {/* Estimated Savings */}
        {annualTaxSavings > 100 && (
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="font-medium text-emerald-600">
                  Estimated Annual Tax Savings: {formatCurrency(annualTaxSavings)}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  By holding tax-inefficient assets in tax-advantaged accounts, you avoid paying
                  ordinary income tax rates on bond interest and REIT dividends.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Class</TableHead>
                <TableHead>Tax Efficiency</TableHead>
                <TableHead>Tax Treatment</TableHead>
                <TableHead>Best Location</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxEfficiencyData.map((item) => (
                <TableRow key={item.asset}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span className="font-medium">{item.asset}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      item.taxEfficiency === "High" ? "bg-green-500/10 text-green-600" :
                      item.taxEfficiency === "Medium" ? "bg-yellow-500/10 text-yellow-500" :
                      "bg-red-500/10 text-red-500"
                    )}>
                      {item.taxEfficiency}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">{item.taxRate}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      item.bestLocation === "Tax-Advantaged" ? "bg-violet-500/10 text-violet-500" :
                      item.bestLocation === "Taxable" ? "bg-cyan-500/10 text-cyan-500" :
                      "bg-gray-500/10 text-gray-500"
                    )}>
                      {item.bestLocation}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(item.value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Info className="h-4 w-4 text-slate-500" />
            Tax Location Rules
          </h4>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/10">
              <p className="font-medium text-violet-500 text-sm mb-2">Hold in Tax-Advantaged (401k, IRA):</p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• Bonds (taxable interest)</li>
                <li>• REITs (non-qualified dividends)</li>
                <li>• High-turnover funds</li>
                <li>• Treasury I-Bonds (if in Trad IRA)</li>
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
              <p className="font-medium text-cyan-500 text-sm mb-2">Hold in Taxable Brokerage:</p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• International stocks (foreign tax credit)</li>
                <li>• US stock index funds (tax efficient)</li>
                <li>• Tax-managed funds</li>
                <li>• Municipal bonds (tax-free interest)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Note for Roth */}
        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 text-sm">
          <p className="font-medium text-amber-500 mb-1">Roth IRA Exception</p>
          <p className="text-slate-500">
            Consider holding highest-growth assets (stocks) in Roth accounts since all growth is tax-free.
            This is especially valuable for long time horizons where compounding maximizes the tax benefit.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Page Component
export default function PortfolioOptimizerPage() {
  const { isPro, isLoading: subscriptionLoading } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [questions, setQuestions] = useState<RiskQuestion[]>([]);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [riskProfile, setRiskProfile] = useState<{
    tolerance: RiskTolerance;
    score: number;
    timeHorizon: number;
  } | null>(null);
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);
  const [savedOptimization, setSavedOptimization] = useState<PortfolioOptimization | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);

  // Landing page 21 design - ensuring consistency
  const cardClass = "bg-white border-2 border-black shadow-sm";
  const headerClass = "text-slate-900 font-medium";
  const mutedTextClass = "text-slate-500";
  const primaryBtnClass = "bg-emerald-600 hover:bg-emerald-700 text-white";

  const fetchData = useCallback(async () => {
    try {
      // Fetch questions, optimization, active scenario, and user settings in parallel
      const [questionsRes, optimizationRes, scenarioRes, settingsRes] = await Promise.all([
        fetch("/api/optimize-portfolio?action=questions"),
        fetch("/api/optimize-portfolio"),
        fetch("/api/scenarios?active=true"),
        fetch("/api/settings"),
      ]);

      const questionsData = await questionsRes.json();
      setQuestions(questionsData.questions || []);

      // Handle active scenario
      if (scenarioRes.ok) {
        const scenarioData = await scenarioRes.json();
        if (scenarioData.data && scenarioData.data.length > 0) {
          setActiveScenario(scenarioData.data[0]);
        }
      }

      // Fetch existing optimization and settings
      const optimizationData = await optimizationRes.json();

      if (optimizationData.settings?.risk_tolerance) {
        setRiskProfile({
          tolerance: optimizationData.settings.risk_tolerance,
          score: optimizationData.settings.risk_score || 50,
          timeHorizon: optimizationData.settings.time_horizon || 10,
        });
      } else {
        // Pre-populate from user profile if no saved optimization exists
        const settingsData = await settingsRes.json();
        if (settingsData.data?.risk_tolerance) {
          setRiskProfile({
            tolerance: settingsData.data.risk_tolerance as RiskTolerance,
            score: 50, // Default score, will be refined with questionnaire
            timeHorizon: 10, // Default time horizon
          });
        }
      }

      if (optimizationData.optimization) {
        setSavedOptimization(optimizationData.optimization);
        setOptimization({
          current_allocation: optimizationData.optimization.current_allocation,
          recommended_allocation: optimizationData.optimization.recommended_allocation,
          base_allocation: optimizationData.optimization.base_allocation || optimizationData.optimization.recommended_allocation,
          market_adjustment: optimizationData.optimization.market_adjustment || null,
          expected_return: optimizationData.optimization.expected_return,
          expected_volatility: optimizationData.optimization.expected_volatility,
          sharpe_ratio: optimizationData.optimization.sharpe_ratio,
          rebalancing_trades: optimizationData.optimization.rebalancing_trades || [],
          total_portfolio_value: optimizationData.optimization.total_portfolio_value || 0,
          market_valuation: optimizationData.optimization.market_valuation,
          rationale: optimizationData.optimization.rationale,
          stock_breakdown: optimizationData.optimization.stock_breakdown,
        });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleQuestionnaireComplete = async (
    answers: { questionId: number; answer: number }[]
  ) => {
    try {
      const response = await fetch("/api/optimize-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "assess_risk", answers }),
      });

      const data = await response.json();

      if (data.success) {
        setRiskProfile(data.result);
        setShowQuestionnaire(false);
        // Auto-run optimization after assessment
        runOptimization(data.result.tolerance, data.result.timeHorizon);
      } else {
        setError(data.error || "Failed to save assessment");
      }
    } catch (err) {
      setError("Failed to save risk assessment");
    }
  };

  const runOptimization = async (tolerance?: RiskTolerance, horizon?: number) => {
    const riskTolerance = tolerance || riskProfile?.tolerance;
    const timeHorizon = horizon || riskProfile?.timeHorizon;

    if (!riskTolerance || !timeHorizon) {
      setShowQuestionnaire(true);
      return;
    }

    setOptimizing(true);
    setError(null);

    try {
      const response = await fetch("/api/optimize-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          risk_tolerance: riskTolerance,
          time_horizon: timeHorizon,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOptimization(data.result);
        setSavedOptimization(data.optimization);
      } else {
        setError(data.error || "Failed to optimize portfolio");
      }
    } catch (err) {
      setError("Failed to run optimization");
    } finally {
      setOptimizing(false);
    }
  };

  const markAsApplied = async () => {
    if (!savedOptimization?.id) return;

    try {
      const response = await fetch("/api/optimize-portfolio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optimization_id: savedOptimization.id }),
      });

      const data = await response.json();

      if (data.success) {
        setSavedOptimization(data.data);
      }
    } catch (err) {
      console.error("Error marking as applied:", err);
    }
  };

  if (loading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-[400px]" />
            <Skeleton className="h-[400px]" />
          </div>
        </div>
      </div>
    );
  }

  // Show questionnaire if needed
  if (showQuestionnaire || (!riskProfile && !optimization)) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900">Portfolio Optimizer</h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Let&apos;s determine your risk profile to provide personalized recommendations
          </p>
        </div>

        {questions.length > 0 ? (
          <RiskQuestionnaire
            questions={questions}
            onComplete={handleQuestionnaireComplete}
          />
        ) : (
          <Card className="bg-white border-2 border-black shadow-sm">
            <CardContent className="py-8 text-center">
              <p className="text-slate-500">Loading questionnaire...</p>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    );
  }

  const getRiskIcon = () => {
    switch (riskProfile?.tolerance) {
      case "conservative":
        return <Shield className="h-5 w-5 text-blue-500" />;
      case "moderate":
        return <Target className="h-5 w-5 text-yellow-500" />;
      case "aggressive":
        return <TrendingUp className="h-5 w-5 text-red-500" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  const getRiskColor = () => {
    switch (riskProfile?.tolerance) {
      case "conservative":
        return "text-blue-500 bg-blue-500/10";
      case "moderate":
        return "text-yellow-500 bg-yellow-500/10";
      case "aggressive":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-slate-500 bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900">Portfolio Optimizer</h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            AI-powered portfolio recommendations based on Modern Portfolio Theory
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowQuestionnaire(true)}
            className="border-2 border-black text-slate-700 hover:bg-slate-100"
          >
            Retake Assessment
          </Button>
          <Button
            onClick={() => runOptimization()}
            disabled={optimizing}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {optimizing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Run Optimization
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Educational Introduction */}
      <Card className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-blue-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Understanding Portfolio Optimization
                </h3>
                <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
                  <p>
                    Portfolio optimization is a systematic approach to constructing an investment portfolio that aims to maximize expected returns for a given level of risk tolerance. This tool leverages <strong><a href="https://www.investopedia.com/terms/m/modernportfoliotheory.asp" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Modern Portfolio Theory (MPT)</a></strong>, a framework developed by Harry Markowitz that demonstrates how diversification across asset classes can reduce overall portfolio volatility while maintaining or improving returns.
                  </p>
                  <p>
                    The core principle is simple yet powerful: different asset classes don&apos;t move in perfect correlation with each other. When stocks decline, bonds may hold steady or even appreciate. When traditional markets struggle, real estate or commodities may provide stability. By strategically allocating your capital across multiple asset classes—stocks, bonds, cash, real estate, and commodities—you create a portfolio that&apos;s more resilient to market turbulence.
                  </p>
                  <p>
                    <strong>Why optimize your current allocation?</strong> Most investors accumulate assets over time without a cohesive strategy, leading to unintentional concentrations in certain areas. You might discover you&apos;re overweight in stocks during a bull market or holding too much cash that&apos;s eroding to inflation. Optimization identifies these imbalances and provides specific, actionable recommendations to realign your portfolio with your risk tolerance and financial goals.
                  </p>
                  <p className="text-slate-600 italic">
                    Think of portfolio optimization as a financial health checkup. Just as you wouldn&apos;t wait until a medical emergency to visit a doctor, you shouldn&apos;t wait for a market crash to examine whether your portfolio is properly diversified. Regular optimization ensures your asset allocation evolves with both market conditions and your changing financial circumstances.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-500">
          {error}
        </div>
      )}

      {/* Risk Profile Card */}
      {riskProfile && (
        <Card className="bg-white border-2 border-black shadow-sm">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", getRiskColor())}>
                  {getRiskIcon()}
                </div>
                <div>
                  <p className="text-sm text-slate-500">Risk Profile</p>
                  <p className="font-semibold capitalize">{riskProfile.tolerance}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500">Risk Score</p>
                <p className="font-semibold">{riskProfile.score}/100</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Time Horizon</p>
                <p className="font-semibold">{riskProfile.timeHorizon} years</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Withdrawal Context from Active Scenario */}
      {activeScenario && activeScenario.annual_withdrawal_requirement > 0 && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-black flex items-center gap-3">
              <TrendingDown className="h-4 w-4 text-emerald-600" />
              Withdrawal Context: {activeScenario.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-slate-500">Annual Withdrawal Need</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(activeScenario.annual_withdrawal_requirement)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Required Portfolio</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(activeScenario.required_net_worth)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Location</p>
                <p className="text-lg font-semibold">
                  {activeScenario.location_city_name}
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-background/50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-slate-500" />
                <p className="text-sm text-slate-500">
                  <strong className="text-foreground">Lower withdrawal needs reduce sequence-of-returns risk.</strong>{" "}
                  A smaller annual withdrawal ({formatPercent(activeScenario.withdrawal_rate)}) means your portfolio
                  can better withstand market downturns in early retirement. This may allow you to either
                  retire earlier with the same risk level, or adopt a more conservative allocation for the same timeline.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {optimization && (
        <>
          {/* Market Valuation & Allocation Breakdown */}
          <div className="grid gap-6 md:grid-cols-2">
            {optimization.market_valuation && (
              <MarketValuationCard valuation={optimization.market_valuation} />
            )}
            {optimization.base_allocation && riskProfile && (
              <AllocationBreakdownCard
                baseAllocation={optimization.base_allocation}
                marketAdjustment={optimization.market_adjustment || null}
                finalAllocation={optimization.recommended_allocation}
                riskTolerance={riskProfile.tolerance}
              />
            )}
          </div>

          {/* Allocation Comparison - Full Width */}
          <Card className="bg-white border-2 border-black shadow-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-2 border-black">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-600" />
                Current vs Recommended Allocation
              </CardTitle>
              <div className="text-sm text-slate-600 mt-2 space-y-2">
                <p>
                  Your asset allocation is the single biggest determinant of your portfolio's long-term returns—more important than individual stock picks or market timing.
                </p>
                <p className="text-xs text-slate-500">
                  Compare your current portfolio with the optimal allocation based on your risk profile. Small adjustments can significantly improve your risk-adjusted returns over time.
                </p>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-4 rounded-xl bg-muted/20 border">
                  <AllocationChart
                    allocation={optimization.current_allocation}
                    title="📊 Current Portfolio"
                    totalValue={optimization.total_portfolio_value}
                  />
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-green-500/5 border border-primary/20">
                  <AllocationChart
                    allocation={optimization.recommended_allocation}
                    title="✨ Recommended Portfolio"
                    totalValue={optimization.total_portfolio_value}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          {isPro ? (
            <Card className="bg-white border-2 border-black shadow-sm">
              <CardHeader>
                <CardTitle className="font-medium text-slate-900">Expected Performance</CardTitle>
                <div className="text-sm text-slate-600 mt-2 space-y-2">
                  <p>
                    These projections aren't guarantees—they're educated estimates based on decades of market history. But they give you realistic expectations for what your money can do.
                  </p>
                  <p className="text-xs text-slate-500">
                    The Sharpe ratio shows your return per unit of risk. Higher is better—it means you're getting more reward for the volatility you're accepting.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <p className="text-2xl font-bold text-emerald-600">
                      {optimization.expected_return}%
                    </p>
                    <p className="text-sm text-slate-500">Expected Return</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <p className="text-2xl font-bold text-amber-600">
                      {optimization.expected_volatility}%
                    </p>
                    <p className="text-sm text-slate-500">Volatility</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {optimization.sharpe_ratio}
                    </p>
                    <p className="text-sm text-slate-500">Sharpe Ratio</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg text-sm border border-2 border-black">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-slate-400" />
                  <span className="text-slate-600">
                    The Sharpe Ratio measures risk-adjusted return. Higher is better.
                    A ratio above 1.0 is considered good, above 2.0 is excellent.
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <LockedModule
              title="Expected Performance"
              description="Based on historical market data and Modern Portfolio Theory"
              icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
              benefits={["Expected Return", "Volatility Analysis", "Sharpe Ratio Calculation"]}
            />
          )}

          {/* Rebalancing Actions */}
          {isPro ? (
            <Card className="bg-white border-2 border-black shadow-sm">
              <CardHeader>
                <CardTitle className="font-medium text-slate-900">Rebalancing Actions</CardTitle>
                <div className="text-sm text-slate-600 mt-2 space-y-2">
                  <p>
                    Rebalancing is counter-intuitive: you sell winners and buy losers. But this disciplined approach is how you "buy low, sell high" systematically instead of emotionally.
                  </p>
                  <p className="text-xs text-slate-500">
                    Most investors should rebalance quarterly or when allocations drift 5+ percentage points from targets. Consider tax implications—do this in tax-advantaged accounts when possible.
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <RebalancingTrades
                  trades={optimization.rebalancing_trades}
                  totalValue={optimization.total_portfolio_value}
                />
              </CardContent>
            </Card>
          ) : (
            <LockedModule
              title="Rebalancing Actions"
              description="Specific trades to align your portfolio with the recommended allocation"
              icon={<RefreshCw className="h-5 w-5 text-emerald-600" />}
              benefits={["Buy/Sell recommendations", "Tax impact estimates", "Track applied changes"]}
            />
          )}

          {/* Stock Breakdown */}
          {optimization.stock_breakdown && optimization.total_portfolio_value > 0 && (
            isPro ? (
              <StockBreakdownCard
                breakdown={optimization.stock_breakdown}
                totalPortfolioValue={optimization.total_portfolio_value}
                stockAllocation={optimization.recommended_allocation.stocks}
              />
            ) : (
              <LockedModule
                title="Stock Allocation Breakdown"
                description="Detailed breakdown of core holdings and factor tilts"
                icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
                benefits={["Core holdings (VTI, VXUS)", "Factor tilt recommendations", "Specific ticker suggestions"]}
              />
            )
          )}

          {/* Tax Location Strategy */}
          {optimization.total_portfolio_value > 0 && (
            isPro ? (
              <TaxLocationStrategyCard
                allocation={optimization.recommended_allocation}
                totalValue={optimization.total_portfolio_value}
              />
            ) : (
              <LockedModule
                title="Tax Location Strategy"
                description="Optimize where you hold each asset class to minimize taxes"
                icon={<Landmark className="h-5 w-5 text-emerald-600" />}
                benefits={["Tax-advantaged vs taxable allocation", "Estimated annual tax savings", "Asset placement rules"]}
              />
            )
          )}

          {/* Allocation Difference Chart */}
          {isPro ? (
            <Card className="bg-white border-2 border-black shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Allocation Difference
                </CardTitle>
                <CardDescription className="text-base text-slate-600" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  How much you need to adjust each asset class
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={Object.keys(optimization.current_allocation).map((key) => ({
                      name: CATEGORY_LABELS[key as keyof Allocation],
                      current: optimization.current_allocation[key as keyof Allocation] * 100,
                      recommended: optimization.recommended_allocation[key as keyof Allocation] * 100,
                      difference:
                        (optimization.recommended_allocation[key as keyof Allocation] -
                          optimization.current_allocation[key as keyof Allocation]) *
                        100,
                    })).sort((a, b) => b.current - a.current)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      tick={{ fill: "#64748b", fontSize: 13, fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 500 }}
                    />
                    <YAxis
                      unit="%"
                      stroke="#64748b"
                      tick={{ fill: "#64748b", fontSize: 13, fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 500 }}
                    />
                    <Tooltip
                      formatter={(value) => `${Number(value).toFixed(1)}%`}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}
                      labelStyle={{ color: "#0f172a", fontWeight: 600, fontFamily: 'system-ui, -apple-system, sans-serif' }}
                    />
                    <Legend
                      wrapperStyle={{
                        paddingTop: "15px",
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        fontSize: 14,
                        fontWeight: 500
                      }}
                    />
                    <Bar dataKey="current" name="Current" fill="#64748b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="recommended" name="Recommended" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : (
            <LockedModule
              title="Allocation Difference"
              description="Visual comparison of current vs recommended allocation"
              icon={<Gauge className="h-5 w-5 text-emerald-600" />}
              benefits={["Bar chart comparison", "Exact percentage differences", "Visual rebalancing guide"]}
            />
          )}

          {/* Feedback Widget */}
          <div className="flex justify-center">
            <FeedbackWidget
              pageName="portfolio-optimizer"
              variant="inline"
              triggerText="How could this be more useful?"
            />
          </div>

          {/* Disclaimer */}
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-600">
                  <p className="font-medium text-slate-900 mb-1">Disclaimer</p>
                  <p>
                    This tool provides suggestions based on historical market data and
                    Modern Portfolio Theory. Past performance does not guarantee future
                    results. This is not financial advice. Please consult with a
                    qualified financial advisor before making investment decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
      </div>
    </div>
  );
}
