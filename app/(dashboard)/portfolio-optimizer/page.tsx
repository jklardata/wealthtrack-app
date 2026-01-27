"use client";

import { useEffect, useState, useCallback } from "react";
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
} from "lucide-react";
import type {
  RiskTolerance,
  Allocation,
  OptimizationResult,
  PortfolioOptimization,
  RebalancingTrade,
  MarketValuation,
  StockBreakdown,
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Risk Assessment
        </CardTitle>
        <CardDescription>
          Question {currentQuestion + 1} of {questions.length}
        </CardDescription>
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <h3 className="text-lg font-medium">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.score}
              onClick={() => handleAnswer(option.score)}
              className={cn(
                "w-full text-left p-4 rounded-lg border-2 transition-all",
                selectedAnswer === option.score
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
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
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="bg-primary hover:bg-primary/90"
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
        <ResponsiveContainer width="100%" height={180}>
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
              innerRadius={55}
              outerRadius={80}
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
                        <div className="text-sm text-muted-foreground">
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
            <div className="text-xs text-muted-foreground">Total</div>
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
                <span className="text-xs text-muted-foreground w-20 text-right">
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
            <span className="text-sm text-muted-foreground">Total Value</span>
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
                  <div className="text-xs text-muted-foreground">
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
          <ArrowRight className="h-6 w-6 text-muted-foreground" />
        </div>
      )}

      {buys.length > 0 && (
        <div>
          <h4 className="font-medium text-green-500 mb-2">Buy</h4>
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
                  <div className="text-xs text-muted-foreground">
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
        return "text-green-500 bg-green-500/10";
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
        <CardTitle className="text-base flex items-center gap-2">
          <Gauge className="h-4 w-4" />
          Market Valuation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">{valuation.cape.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">CAPE Ratio</div>
          </div>
          <div className={cn("px-3 py-1 rounded-full text-sm font-medium", getValuationColor())}>
            {getValuationLabel()}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Historical Average</span>
            <span>{valuation.historicalAvg}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Deviation</span>
            <span className={percentFromAvg > 0 ? "text-red-500" : "text-green-500"}>
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
        <CardTitle className="text-base flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Allocation Breakdown
        </CardTitle>
        <CardDescription>How your allocation was calculated</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header Row */}
          <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground">
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
              <div className="text-muted-foreground">Market Adj (CAPE)</div>
              <div className={cn("text-right", marketAdjustment.stocks < 0 ? "text-red-500" : marketAdjustment.stocks > 0 ? "text-green-500" : "")}>
                {formatAdj(marketAdjustment.stocks)}
              </div>
              <div className={cn("text-right", marketAdjustment.bonds < 0 ? "text-red-500" : marketAdjustment.bonds > 0 ? "text-green-500" : "")}>
                {formatAdj(marketAdjustment.bonds)}
              </div>
              <div className={cn("text-right", marketAdjustment.cash < 0 ? "text-red-500" : marketAdjustment.cash > 0 ? "text-green-500" : "")}>
                {formatAdj(marketAdjustment.cash)}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-dashed" />

          {/* Final Recommendation */}
          <div className="grid grid-cols-4 text-sm font-bold">
            <div>Final</div>
            <div className="text-right text-primary">{formatPct(finalAllocation.stocks)}</div>
            <div className="text-right text-blue-500">{formatPct(finalAllocation.bonds)}</div>
            <div className="text-right text-green-500">{formatPct(finalAllocation.cash)}</div>
          </div>
        </div>

        {/* Rationale */}
        {marketAdjustment && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
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
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
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
                <div className="text-xs text-muted-foreground">VTI</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{(breakdown.coreHoldings.usTotalMarket.allocation * 100).toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">{formatCurrency(breakdown.coreHoldings.usTotalMarket.amount)}</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium">Total Intl Stock Market</div>
                <div className="text-xs text-muted-foreground">VXUS</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{(breakdown.coreHoldings.intlTotalMarket.allocation * 100).toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">{formatCurrency(breakdown.coreHoldings.intlTotalMarket.amount)}</div>
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
                    tilt.status === "recommended" ? "text-green-500" : tilt.status === "reduced" ? "text-yellow-500" : "text-muted-foreground"
                  )}>
                    {tilt.status === "recommended" ? <Check className="h-4 w-4" /> : tilt.status === "reduced" ? <Minus className="h-4 w-4" /> : <div className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="font-medium">{tilt.name}</div>
                    <div className="text-xs text-muted-foreground">{tilt.ticker}</div>
                    <div className="text-xs text-muted-foreground mt-1">{tilt.reason}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-medium">{(tilt.allocation * 100).toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">{formatCurrency(tilt.dollarAmount)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Note */}
        <div className="p-3 bg-blue-500/10 rounded-lg text-sm">
          <div className="font-medium text-blue-500 mb-1">Compared to 100% VTI:</div>
          <ul className="text-muted-foreground space-y-1">
            <li>• Expected return: Similar (factor premiums offset expensive market)</li>
            <li>• Expected volatility: Lower due to value tilt</li>
            <li>• Downside protection: Better in market corrections</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Page Component
export default function PortfolioOptimizerPage() {
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

  const fetchData = useCallback(async () => {
    try {
      // Fetch questions
      const questionsRes = await fetch("/api/optimize-portfolio?action=questions");
      const questionsData = await questionsRes.json();
      setQuestions(questionsData.questions || []);

      // Fetch existing optimization and settings
      const optimizationRes = await fetch("/api/optimize-portfolio");
      const optimizationData = await optimizationRes.json();

      if (optimizationData.settings?.risk_tolerance) {
        setRiskProfile({
          tolerance: optimizationData.settings.risk_tolerance,
          score: optimizationData.settings.risk_score || 50,
          timeHorizon: optimizationData.settings.time_horizon || 10,
        });
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

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  // Show questionnaire if needed
  if (showQuestionnaire || (!riskProfile && !optimization)) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Optimizer</h1>
          <p className="text-muted-foreground">
            Let&apos;s determine your risk profile to provide personalized recommendations
          </p>
        </div>

        {questions.length > 0 ? (
          <RiskQuestionnaire
            questions={questions}
            onComplete={handleQuestionnaireComplete}
          />
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Loading questionnaire...</p>
            </CardContent>
          </Card>
        )}
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
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Optimizer</h1>
          <p className="text-muted-foreground">
            AI-powered portfolio recommendations based on Modern Portfolio Theory
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowQuestionnaire(true)}
          >
            Retake Assessment
          </Button>
          <Button
            onClick={() => runOptimization()}
            disabled={optimizing}
            className="bg-primary hover:bg-primary/90"
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

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}

      {/* Risk Profile Card */}
      {riskProfile && (
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", getRiskColor())}>
                  {getRiskIcon()}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Risk Profile</p>
                  <p className="font-semibold capitalize">{riskProfile.tolerance}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <p className="font-semibold">{riskProfile.score}/100</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Horizon</p>
                <p className="font-semibold">{riskProfile.timeHorizon} years</p>
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
          <Card>
            <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-b">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Current vs Recommended Allocation
              </CardTitle>
              <CardDescription>
                Compare your current portfolio with the optimal allocation based on your risk profile
              </CardDescription>
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
          <Card>
              <CardHeader>
                <CardTitle>Expected Performance</CardTitle>
                <CardDescription>
                  Based on historical market data and Modern Portfolio Theory
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-green-500">
                      {optimization.expected_return}%
                    </p>
                    <p className="text-sm text-muted-foreground">Expected Return</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-500">
                      {optimization.expected_volatility}%
                    </p>
                    <p className="text-sm text-muted-foreground">Volatility</p>
                  </div>
                  <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-blue-500">
                      {optimization.sharpe_ratio}
                    </p>
                    <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg text-sm">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    The Sharpe Ratio measures risk-adjusted return. Higher is better.
                    A ratio above 1.0 is considered good, above 2.0 is excellent.
                  </span>
                </div>
              </CardContent>
            </Card>

          {/* Rebalancing Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Rebalancing Actions</CardTitle>
              <CardDescription>
                Specific trades to align your portfolio with the recommended allocation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RebalancingTrades
                trades={optimization.rebalancing_trades}
                totalValue={optimization.total_portfolio_value}
              />

              {optimization.rebalancing_trades.length > 0 && (
                <div className="mt-6 flex justify-end">
                  {savedOptimization?.applied ? (
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Marked as applied on {new Date(savedOptimization.applied_date!).toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <Button onClick={markAsApplied} variant="outline">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark as Applied
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stock Breakdown */}
          {optimization.stock_breakdown && optimization.total_portfolio_value > 0 && (
            <StockBreakdownCard
              breakdown={optimization.stock_breakdown}
              totalPortfolioValue={optimization.total_portfolio_value}
              stockAllocation={optimization.recommended_allocation.stocks}
            />
          )}

          {/* Allocation Difference Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Allocation Difference</CardTitle>
              <CardDescription>
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
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis unit="%" className="text-xs" />
                  <Tooltip
                    formatter={(value) => `${Number(value).toFixed(1)}%`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="current" name="Current" fill="#6b7280" />
                  <Bar dataKey="recommended" name="Recommended" fill="#a3e635" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Disclaimer</p>
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
  );
}
