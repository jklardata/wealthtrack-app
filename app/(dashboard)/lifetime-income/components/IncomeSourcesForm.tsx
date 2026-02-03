"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AgeInput } from "@/components/ui/age-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Briefcase, DollarSign, PiggyBank, Gift } from "lucide-react";
import type { IncomeSource, IncomeSourceType } from "@/lib/types";
import { estimateSocialSecurityBenefit } from "@/lib/projection-calculator";
import { formatAgeMonths } from "@/lib/age-utils";

interface IncomeSourcesFormProps {
  onUpdate?: () => void;
}

export function IncomeSourcesForm({ onUpdate }: IncomeSourcesFormProps) {
  const [sources, setSources] = useState<IncomeSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch income sources
  const fetchSources = async () => {
    try {
      const response = await fetch("/api/income-sources");
      const data = await response.json();
      if (response.ok) {
        setSources(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching income sources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleSourceAdded = () => {
    fetchSources();
    onUpdate?.();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this income source?")) return;

    try {
      const response = await fetch(`/api/income-sources/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchSources();
        onUpdate?.();
      }
    } catch (error) {
      console.error("Error deleting income source:", error);
    }
  };

  const getSourcesByType = (type: IncomeSourceType) =>
    sources.filter((s) => s.source_type === type);

  return (
    <div className="space-y-6">
      {/* Work Income */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-emerald-600" />
              <CardTitle>Work Income</CardTitle>
            </div>
            <WorkIncomeDialog onSuccess={handleSourceAdded} />
          </div>
          <CardDescription>Salary, wages, and earned income</CardDescription>
        </CardHeader>
        <CardContent>
          <SourceList
            sources={getSourcesByType("work")}
            onEdit={handleSourceAdded}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Social Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <CardTitle>Social Security</CardTitle>
            </div>
            <SocialSecurityDialog onSuccess={handleSourceAdded} />
          </div>
          <CardDescription>Retirement benefits from Social Security</CardDescription>
        </CardHeader>
        <CardContent>
          <SourceList
            sources={getSourcesByType("social_security")}
            onEdit={handleSourceAdded}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Passive Income */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-purple-600" />
              <CardTitle>Passive Income</CardTitle>
            </div>
            <PassiveIncomeDialog onSuccess={handleSourceAdded} />
          </div>
          <CardDescription>Rental income, dividends, royalties</CardDescription>
        </CardHeader>
        <CardContent>
          <SourceList
            sources={getSourcesByType("passive")}
            onEdit={handleSourceAdded}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Windfalls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-orange-600" />
              <CardTitle>Windfalls</CardTitle>
            </div>
            <WindfallDialog onSuccess={handleSourceAdded} />
          </div>
          <CardDescription>One-time payments, inheritance, bonuses</CardDescription>
        </CardHeader>
        <CardContent>
          <SourceList
            sources={getSourcesByType("windfall")}
            onEdit={handleSourceAdded}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function SourceList({
  sources,
  onEdit,
  onDelete,
}: {
  sources: IncomeSource[];
  onEdit: () => void;
  onDelete: (id: string) => void;
}) {
  if (sources.length === 0) {
    return <p className="text-sm text-slate-500">No income sources added yet</p>;
  }

  return (
    <div className="space-y-2">
      {sources.map((source) => (
        <div
          key={source.id}
          className="flex items-center justify-between p-3 border border-slate-200 rounded-md"
        >
          <div>
            <p className="font-medium">{source.name}</p>
            <p className="text-sm text-slate-600">
              ${source.annual_amount.toLocaleString()}/year
              {source.start_age_months && (
                <span className="ml-2">
                  from age {formatAgeMonths(source.start_age_months)}
                </span>
              )}
              {source.stop_age_months && (
                <span className="ml-2">
                  to age {formatAgeMonths(source.stop_age_months)}
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onDelete.bind(null, source.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkIncomeDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    annual_amount: "",
    start_age_months: null as number | null,
    stop_age_months: null as number | null,
    growth_rate: "",
    pretax_deductions: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/income-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_type: "work",
          name: formData.name,
          annual_amount: parseFloat(formData.annual_amount),
          start_age_months: formData.start_age_months,
          stop_age_months: formData.stop_age_months,
          growth_rate: formData.growth_rate ? parseFloat(formData.growth_rate) / 100 : null,
          pretax_deductions: formData.pretax_deductions
            ? parseFloat(formData.pretax_deductions)
            : 0,
        }),
      });

      if (response.ok) {
        setOpen(false);
        setFormData({
          name: "",
          annual_amount: "",
          start_age_months: null,
          stop_age_months: null,
          growth_rate: "",
          pretax_deductions: "",
        });
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating income source:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Work Income
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Work Income</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Income Source Name</Label>
              <Input
                id="name"
                placeholder="e.g., Full-time job"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="annual_amount">Annual Income</Label>
              <Input
                id="annual_amount"
                type="number"
                placeholder="120000"
                value={formData.annual_amount}
                onChange={(e) => setFormData({ ...formData, annual_amount: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="start_age">Start Age</Label>
              <AgeInput
                id="start_age"
                value={formData.start_age_months || undefined}
                onChange={(ageMonths) =>
                  setFormData({ ...formData, start_age_months: ageMonths })
                }
              />
            </div>
            <div>
              <Label htmlFor="stop_age">Stop Age</Label>
              <AgeInput
                id="stop_age"
                value={formData.stop_age_months || undefined}
                onChange={(ageMonths) => setFormData({ ...formData, stop_age_months: ageMonths })}
              />
            </div>
            <div>
              <Label htmlFor="growth_rate">Annual Growth Rate (%)</Label>
              <Input
                id="growth_rate"
                type="number"
                step="0.1"
                placeholder="3.0"
                value={formData.growth_rate}
                onChange={(e) => setFormData({ ...formData, growth_rate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="pretax_deductions">Pre-tax Deductions (Annual)</Label>
              <Input
                id="pretax_deductions"
                type="number"
                placeholder="20000"
                value={formData.pretax_deductions}
                onChange={(e) =>
                  setFormData({ ...formData, pretax_deductions: e.target.value })
                }
              />
              <p className="text-xs text-slate-500 mt-1">401k, HSA, IRA contributions</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SocialSecurityDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [autoEstimate, setAutoEstimate] = useState(false);
  const [currentIncome, setCurrentIncome] = useState("");
  const [formData, setFormData] = useState({
    name: "Social Security",
    annual_amount: "",
    claiming_age_months: 67 * 12, // Default to 67 years
  });

  const handleAutoEstimate = () => {
    if (currentIncome) {
      const estimated = estimateSocialSecurityBenefit(parseFloat(currentIncome));
      setFormData({ ...formData, annual_amount: estimated.toFixed(0) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/income-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_type: "social_security",
          name: formData.name,
          annual_amount: parseFloat(formData.annual_amount),
          claiming_age_months: formData.claiming_age_months,
          auto_estimate: autoEstimate,
          estimated_benefit: parseFloat(formData.annual_amount),
        }),
      });

      if (response.ok) {
        setOpen(false);
        setFormData({
          name: "Social Security",
          annual_amount: "",
          claiming_age_months: 67 * 12,
        });
        setAutoEstimate(false);
        setCurrentIncome("");
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating income source:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Social Security
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Social Security Benefit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="auto_estimate"
              checked={autoEstimate}
              onChange={(e) => setAutoEstimate(e.target.checked)}
            />
            <Label htmlFor="auto_estimate">Auto-estimate based on current income</Label>
          </div>

          {autoEstimate && (
            <div className="space-y-2">
              <Label htmlFor="current_income">Current Annual Income</Label>
              <div className="flex gap-2">
                <Input
                  id="current_income"
                  type="number"
                  placeholder="120000"
                  value={currentIncome}
                  onChange={(e) => setCurrentIncome(e.target.value)}
                />
                <Button type="button" onClick={handleAutoEstimate}>
                  Estimate
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="annual_benefit">Annual Benefit</Label>
              <Input
                id="annual_benefit"
                type="number"
                placeholder="30000"
                value={formData.annual_amount}
                onChange={(e) => setFormData({ ...formData, annual_amount: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="claiming_age">Claiming Age</Label>
              <AgeInput
                id="claiming_age"
                value={formData.claiming_age_months}
                onChange={(ageMonths) =>
                  setFormData({ ...formData, claiming_age_months: ageMonths || 67 * 12 })
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PassiveIncomeDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    annual_amount: "",
    start_age_months: null as number | null,
    stop_age_months: null as number | null,
    growth_rate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/income-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_type: "passive",
          name: formData.name,
          annual_amount: parseFloat(formData.annual_amount),
          start_age_months: formData.start_age_months,
          stop_age_months: formData.stop_age_months,
          growth_rate: formData.growth_rate ? parseFloat(formData.growth_rate) / 100 : null,
        }),
      });

      if (response.ok) {
        setOpen(false);
        setFormData({
          name: "",
          annual_amount: "",
          start_age_months: null,
          stop_age_months: null,
          growth_rate: "",
        });
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating income source:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Passive Income
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Passive Income</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Income Source Name</Label>
              <Input
                id="name"
                placeholder="e.g., Rental property"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="annual_amount">Annual Income</Label>
              <Input
                id="annual_amount"
                type="number"
                placeholder="24000"
                value={formData.annual_amount}
                onChange={(e) => setFormData({ ...formData, annual_amount: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="start_age">Start Age</Label>
              <AgeInput
                id="start_age"
                value={formData.start_age_months || undefined}
                onChange={(ageMonths) =>
                  setFormData({ ...formData, start_age_months: ageMonths })
                }
              />
            </div>
            <div>
              <Label htmlFor="stop_age">Stop Age (optional)</Label>
              <AgeInput
                id="stop_age"
                value={formData.stop_age_months || undefined}
                onChange={(ageMonths) => setFormData({ ...formData, stop_age_months: ageMonths })}
              />
            </div>
            <div>
              <Label htmlFor="growth_rate">Annual Growth Rate (%)</Label>
              <Input
                id="growth_rate"
                type="number"
                step="0.1"
                placeholder="2.0"
                value={formData.growth_rate}
                onChange={(e) => setFormData({ ...formData, growth_rate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function WindfallDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    annual_amount: "",
    windfall_year: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/income-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_type: "windfall",
          name: formData.name,
          annual_amount: parseFloat(formData.annual_amount),
          windfall_year: parseInt(formData.windfall_year),
        }),
      });

      if (response.ok) {
        setOpen(false);
        setFormData({
          name: "",
          annual_amount: "",
          windfall_year: "",
        });
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating income source:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Windfall
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Windfall Income</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Windfall Name</Label>
              <Input
                id="name"
                placeholder="e.g., Inheritance"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="annual_amount">Amount</Label>
              <Input
                id="annual_amount"
                type="number"
                placeholder="50000"
                value={formData.annual_amount}
                onChange={(e) => setFormData({ ...formData, annual_amount: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="windfall_year">Year (from now)</Label>
              <Input
                id="windfall_year"
                type="number"
                placeholder="5"
                value={formData.windfall_year}
                onChange={(e) => setFormData({ ...formData, windfall_year: e.target.value })}
                required
              />
              <p className="text-xs text-slate-500 mt-1">Years from today</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
