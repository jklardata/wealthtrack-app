"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubscription } from "@/hooks/use-subscription";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Plus,
  Save,
  Trash2,
  Copy,
  Share2,
  Download,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

interface Scenario {
  id: string;
  name: string;
  description?: string;
  currentAge: number;
  retirementAge: number;
  currentPortfolio: number;
  annualContribution: number;
  annualExpenses: number;
  expectedReturn: number;
  inflationRate: number;
  withdrawalRate: number;
  createdAt: Date;
}

interface ProjectionPoint {
  age: number;
  year: number;
  [key: string]: number; // For dynamic scenario keys
}

const PRESET_TEMPLATES = [
  {
    name: "Traditional Retirement",
    description: "Retire at 65 with standard assumptions",
    currentAge: 35,
    retirementAge: 65,
    currentPortfolio: 100000,
    annualContribution: 20000,
    annualExpenses: 60000,
    expectedReturn: 7,
    inflationRate: 3,
    withdrawalRate: 4,
  },
  {
    name: "Early Retirement (FIRE)",
    description: "Aggressive saving, retire at 45",
    currentAge: 30,
    retirementAge: 45,
    currentPortfolio: 150000,
    annualContribution: 50000,
    annualExpenses: 40000,
    expectedReturn: 8,
    inflationRate: 3,
    withdrawalRate: 3.5,
  },
  {
    name: "Coast FIRE",
    description: "Build nest egg, then coast to retirement",
    currentAge: 35,
    retirementAge: 55,
    currentPortfolio: 250000,
    annualContribution: 0,
    annualExpenses: 50000,
    expectedReturn: 7,
    inflationRate: 3,
    withdrawalRate: 4,
  },
  {
    name: "Barista FIRE",
    description: "Semi-retire early with part-time income",
    currentAge: 32,
    retirementAge: 50,
    currentPortfolio: 200000,
    annualContribution: 15000,
    annualExpenses: 45000,
    expectedReturn: 7,
    inflationRate: 3,
    withdrawalRate: 3.5,
  },
];

const COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#8b5cf6", // purple
  "#ef4444", // red
  "#06b6d4", // cyan
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateProjection(scenario: Scenario, endAge: number = 95): number[] {
  const { currentAge, retirementAge, currentPortfolio, annualContribution, expectedReturn, withdrawalRate, annualExpenses } = scenario;
  const realReturn = (expectedReturn - scenario.inflationRate) / 100;

  const projection: number[] = [];
  let portfolio = currentPortfolio;

  for (let age = currentAge; age <= endAge; age++) {
    projection.push(portfolio);

    if (age < retirementAge) {
      // Accumulation phase
      portfolio = portfolio * (1 + realReturn) + annualContribution;
    } else {
      // Withdrawal phase
      const withdrawal = annualExpenses;
      portfolio = portfolio * (1 + realReturn) - withdrawal;
    }

    // Don't let portfolio go negative
    if (portfolio < 0) portfolio = 0;
  }

  return projection;
}

export default function RetirementScenariosPage() {
  const { isPro, isLoading: subscriptionLoading } = useSubscription();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const canCreateScenario = isPro || scenarios.length === 0;

  // Form state for new scenario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    currentAge: 35,
    retirementAge: 65,
    currentPortfolio: 100000,
    annualContribution: 20000,
    annualExpenses: 60000,
    expectedReturn: 7,
    inflationRate: 3,
    withdrawalRate: 4,
  });

  // Load scenarios from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("retirementScenarios");
    if (saved) {
      const parsed = JSON.parse(saved);
      setScenarios(parsed.map((s: any) => ({ ...s, createdAt: new Date(s.createdAt) })));
    }
  }, []);

  // Save scenarios to localStorage
  const saveScenarios = (newScenarios: Scenario[]) => {
    localStorage.setItem("retirementScenarios", JSON.stringify(newScenarios));
    setScenarios(newScenarios);
  };

  const createScenario = () => {
    const newScenario: Scenario = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date(),
    };

    const updated = [...scenarios, newScenario];
    saveScenarios(updated);
    setSelectedScenarios([...selectedScenarios, newScenario.id]);
    setIsCreateDialogOpen(false);

    // Reset form
    setFormData({
      name: "",
      description: "",
      currentAge: 35,
      retirementAge: 65,
      currentPortfolio: 100000,
      annualContribution: 20000,
      annualExpenses: 60000,
      expectedReturn: 7,
      inflationRate: 3,
      withdrawalRate: 4,
    });
  };

  const deleteScenario = (id: string) => {
    const updated = scenarios.filter((s) => s.id !== id);
    saveScenarios(updated);
    setSelectedScenarios(selectedScenarios.filter((sid) => sid !== id));
  };

  const loadTemplate = (template: typeof PRESET_TEMPLATES[0]) => {
    setFormData({
      name: template.name,
      description: template.description,
      currentAge: template.currentAge,
      retirementAge: template.retirementAge,
      currentPortfolio: template.currentPortfolio,
      annualContribution: template.annualContribution,
      annualExpenses: template.annualExpenses,
      expectedReturn: template.expectedReturn,
      inflationRate: template.inflationRate,
      withdrawalRate: template.withdrawalRate,
    });
  };

  const toggleScenario = (id: string) => {
    if (selectedScenarios.includes(id)) {
      setSelectedScenarios(selectedScenarios.filter((sid) => sid !== id));
    } else {
      setSelectedScenarios([...selectedScenarios, id]);
    }
  };

  const shareScenario = (scenario: Scenario) => {
    const url = `${window.location.origin}/retirement-scenarios?scenario=${encodeURIComponent(JSON.stringify(scenario))}`;
    navigator.clipboard.writeText(url);
    alert("Scenario link copied to clipboard!");
  };

  // Prepare chart data
  const chartData: ProjectionPoint[] = [];
  if (selectedScenarios.length > 0) {
    const maxAge = 95;
    const minAge = Math.min(...scenarios.filter(s => selectedScenarios.includes(s.id)).map(s => s.currentAge));

    for (let age = minAge; age <= maxAge; age++) {
      const point: ProjectionPoint = { age, year: new Date().getFullYear() + (age - minAge) };

      selectedScenarios.forEach((scenarioId) => {
        const scenario = scenarios.find((s) => s.id === scenarioId);
        if (scenario) {
          const projection = calculateProjection(scenario, maxAge);
          const index = age - scenario.currentAge;
          if (index >= 0 && index < projection.length) {
            point[scenario.name] = projection[index];
          }
        }
      });

      chartData.push(point);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Retirement Scenario Planner</h1>
            <p className="text-slate-600 mt-2">
              Model multiple retirement paths side-by-side. Compare outcomes, test assumptions, and find your optimal strategy.
              {!isPro && (
                <span className="block mt-1 text-sm text-amber-600 font-medium">
                  Free plan: 1 scenario • <Link href="/pricing" className="underline hover:text-amber-700">Upgrade to Pro</Link> for unlimited scenarios
                </span>
              )}
            </p>
          </div>

          {!canCreateScenario ? (
            <Link href="/pricing">
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="h-4 w-4 mr-2" />
                Upgrade to Create More Scenarios
              </Button>
            </Link>
          ) : (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Scenario
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Scenario</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Template Selection */}
                <div>
                  <Label>Start from Template (Optional)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {PRESET_TEMPLATES.map((template) => (
                      <Button
                        key={template.name}
                        variant="outline"
                        size="sm"
                        onClick={() => loadTemplate(template)}
                        className="text-left h-auto py-2"
                      >
                        <div>
                          <div className="font-medium text-sm">{template.name}</div>
                          <div className="text-xs text-slate-500">{template.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Scenario Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="name">Scenario Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="My Retirement Plan"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Optional description"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentAge">Current Age</Label>
                    <Input
                      id="currentAge"
                      type="number"
                      value={formData.currentAge}
                      onChange={(e) => setFormData({ ...formData, currentAge: parseInt(e.target.value) })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="retirementAge">Retirement Age</Label>
                    <Input
                      id="retirementAge"
                      type="number"
                      value={formData.retirementAge}
                      onChange={(e) => setFormData({ ...formData, retirementAge: parseInt(e.target.value) })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentPortfolio">Current Portfolio</Label>
                    <Input
                      id="currentPortfolio"
                      type="number"
                      value={formData.currentPortfolio}
                      onChange={(e) => setFormData({ ...formData, currentPortfolio: parseInt(e.target.value) })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="annualContribution">Annual Contribution</Label>
                    <Input
                      id="annualContribution"
                      type="number"
                      value={formData.annualContribution}
                      onChange={(e) => setFormData({ ...formData, annualContribution: parseInt(e.target.value) })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="annualExpenses">Annual Expenses in Retirement</Label>
                    <Input
                      id="annualExpenses"
                      type="number"
                      value={formData.annualExpenses}
                      onChange={(e) => setFormData({ ...formData, annualExpenses: parseInt(e.target.value) })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="expectedReturn">Expected Return (%)</Label>
                    <Input
                      id="expectedReturn"
                      type="number"
                      step="0.1"
                      value={formData.expectedReturn}
                      onChange={(e) => setFormData({ ...formData, expectedReturn: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                    <Input
                      id="inflationRate"
                      type="number"
                      step="0.1"
                      value={formData.inflationRate}
                      onChange={(e) => setFormData({ ...formData, inflationRate: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="withdrawalRate">Withdrawal Rate (%)</Label>
                    <Input
                      id="withdrawalRate"
                      type="number"
                      step="0.1"
                      value={formData.withdrawalRate}
                      onChange={(e) => setFormData({ ...formData, withdrawalRate: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={createScenario} disabled={!formData.name} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Scenario
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          )}
        </div>

        {/* Scenarios List */}
        {scenarios.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scenarios.map((scenario, index) => (
                  <div
                    key={scenario.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedScenarios.includes(scenario.id)
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => toggleScenario(scenario.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <h3 className="font-semibold text-slate-900">{scenario.name}</h3>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            shareScenario(scenario);
                          }}
                        >
                          <Share2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteScenario(scenario.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    </div>

                    {scenario.description && (
                      <p className="text-sm text-slate-600 mb-3">{scenario.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div>Retire: Age {scenario.retirementAge}</div>
                      <div>Portfolio: {formatCurrency(scenario.currentPortfolio)}</div>
                      <div>Contribute: {formatCurrency(scenario.annualContribution)}/yr</div>
                      <div>Spend: {formatCurrency(scenario.annualExpenses)}/yr</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {scenarios.length === 0 && (
          <Card className="border-2 border-dashed">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Scenarios Yet</h3>
              <p className="text-slate-600 mb-4 max-w-md mx-auto">
                Create your first retirement scenario to start modeling your financial future. Use preset templates or customize your own.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Scenario
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Visualization */}
        {selectedScenarios.length > 0 && (
          <>
            {/* Chart View */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Scenario Comparison - Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[600px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="age"
                        stroke="#64748b"
                        label={{ value: "Age", position: "insideBottom", offset: -5, style: { fontSize: 14, fontWeight: 600 } }}
                        style={{ fontSize: 12 }}
                      />
                      <YAxis
                        stroke="#64748b"
                        tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                        label={{ value: "Portfolio Value", angle: -90, position: "insideLeft", style: { fontSize: 14, fontWeight: 600 } }}
                        style={{ fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          fontSize: 12,
                        }}
                        formatter={(value) => formatCurrency(value as number)}
                        labelFormatter={(age) => `Age ${age}`}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: 14, fontWeight: 500 }}
                        iconType="line"
                      />
                      {selectedScenarios.map((scenarioId, index) => {
                        const scenario = scenarios.find((s) => s.id === scenarioId);
                        if (!scenario) return null;

                        return (
                          <Line
                            key={scenarioId}
                            type="monotone"
                            dataKey={scenario.name}
                            stroke={COLORS[scenarios.indexOf(scenario) % COLORS.length]}
                            strokeWidth={3}
                            dot={false}
                            name={scenario.name}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Table View */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Scenario Comparison - Table</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Metric</th>
                        {scenarios
                          .filter((s) => selectedScenarios.includes(s.id))
                          .map((scenario, index) => (
                            <th key={scenario.id} className="text-left p-3 font-semibold" style={{ color: COLORS[scenarios.indexOf(scenario) % COLORS.length] }}>
                              {scenario.name}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-slate-50">
                        <td className="p-3 font-medium">Retirement Age</td>
                        {scenarios
                          .filter((s) => selectedScenarios.includes(s.id))
                          .map((scenario) => (
                            <td key={scenario.id} className="p-3">{scenario.retirementAge}</td>
                          ))}
                      </tr>
                      <tr className="border-b hover:bg-slate-50">
                        <td className="p-3 font-medium">Current Portfolio</td>
                        {scenarios
                          .filter((s) => selectedScenarios.includes(s.id))
                          .map((scenario) => (
                            <td key={scenario.id} className="p-3">{formatCurrency(scenario.currentPortfolio)}</td>
                          ))}
                      </tr>
                      <tr className="border-b hover:bg-slate-50">
                        <td className="p-3 font-medium">Annual Contribution</td>
                        {scenarios
                          .filter((s) => selectedScenarios.includes(s.id))
                          .map((scenario) => (
                            <td key={scenario.id} className="p-3">{formatCurrency(scenario.annualContribution)}</td>
                          ))}
                      </tr>
                      <tr className="border-b hover:bg-slate-50">
                        <td className="p-3 font-medium">Annual Expenses</td>
                        {scenarios
                          .filter((s) => selectedScenarios.includes(s.id))
                          .map((scenario) => (
                            <td key={scenario.id} className="p-3">{formatCurrency(scenario.annualExpenses)}</td>
                          ))}
                      </tr>
                      <tr className="border-b hover:bg-slate-50">
                        <td className="p-3 font-medium">Expected Return</td>
                        {scenarios
                          .filter((s) => selectedScenarios.includes(s.id))
                          .map((scenario) => (
                            <td key={scenario.id} className="p-3">{scenario.expectedReturn}%</td>
                          ))}
                      </tr>
                      <tr className="border-b hover:bg-slate-50">
                        <td className="p-3 font-medium">Portfolio at Age 65</td>
                        {scenarios
                          .filter((s) => selectedScenarios.includes(s.id))
                          .map((scenario) => {
                            const projection = calculateProjection(scenario);
                            const valueAt65 = projection[65 - scenario.currentAge] || 0;
                            return (
                              <td key={scenario.id} className="p-3 font-semibold">{formatCurrency(valueAt65)}</td>
                            );
                          })}
                      </tr>
                      <tr className="border-b hover:bg-slate-50">
                        <td className="p-3 font-medium">Portfolio at Age 95</td>
                        {scenarios
                          .filter((s) => selectedScenarios.includes(s.id))
                          .map((scenario) => {
                            const projection = calculateProjection(scenario);
                            const valueAt95 = projection[95 - scenario.currentAge] || 0;
                            return (
                              <td key={scenario.id} className="p-3 font-semibold">{formatCurrency(valueAt95)}</td>
                            );
                          })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Quick Links */}
        <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-emerald-200">
          <CardContent className="py-6">
            <h3 className="font-semibold text-slate-900 mb-4">Related Tools</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/early-retirement">
                <Button variant="outline" className="w-full bg-white hover:bg-slate-50">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Early Retirement Calculator
                </Button>
              </Link>
              <Link href="/tax-calculator">
                <Button variant="outline" className="w-full bg-white hover:bg-slate-50">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Tax Calculator
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
