"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Download,
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowUpDown,
  RefreshCw,
  Settings,
  X,
  AlertTriangle,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import type { NetWorthEntry, NetWorthFormData } from "@/lib/types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDefaultDate(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

interface EntryFormProps {
  entry?: NetWorthEntry;
  onSubmit: (data: NetWorthFormData) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

function EntryForm({ entry, onSubmit, onClose, isSubmitting }: EntryFormProps) {
  const [formData, setFormData] = useState<NetWorthFormData>({
    date: entry?.date || getDefaultDate(),
    stocks: entry?.stocks || 0,
    bonds: entry?.bonds || 0,
    cash: entry?.cash || 0,
    real_estate: entry?.real_estate || 0,
    points_value: entry?.points_value || 0,
    commodities: entry?.commodities || 0,
    other_assets: entry?.other_assets || 0,
    total_debts: entry?.total_debts || 0,
    pre_tax_income: entry?.pre_tax_income || 0,
    monthly_expenses: entry?.monthly_expenses || 0,
    notes: entry?.notes || "",
  });

  const totalAssets =
    Number(formData.stocks) +
    Number(formData.bonds) +
    Number(formData.cash) +
    Number(formData.real_estate) +
    Number(formData.points_value) +
    Number(formData.commodities) +
    Number(formData.other_assets);

  const netWorth = totalAssets - Number(formData.total_debts);

  const handleChange = (field: keyof NetWorthFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      stocks: Number(formData.stocks),
      bonds: Number(formData.bonds),
      cash: Number(formData.cash),
      real_estate: Number(formData.real_estate),
      points_value: Number(formData.points_value),
      commodities: Number(formData.commodities),
      other_assets: Number(formData.other_assets),
      total_debts: Number(formData.total_debts),
      pre_tax_income: Number(formData.pre_tax_income),
      monthly_expenses: Number(formData.monthly_expenses),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stocks">Stocks</Label>
          <Input
            id="stocks"
            type="number"
            step="0.01"
            value={formData.stocks}
            onChange={(e) => handleChange("stocks", e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bonds">Bonds</Label>
          <Input
            id="bonds"
            type="number"
            step="0.01"
            value={formData.bonds}
            onChange={(e) => handleChange("bonds", e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cash">Cash</Label>
          <Input
            id="cash"
            type="number"
            step="0.01"
            value={formData.cash}
            onChange={(e) => handleChange("cash", e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="real_estate">Real Estate</Label>
          <Input
            id="real_estate"
            type="number"
            step="0.01"
            value={formData.real_estate}
            onChange={(e) => handleChange("real_estate", e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="points_value">Points Value</Label>
          <Input
            id="points_value"
            type="number"
            step="0.01"
            value={formData.points_value}
            onChange={(e) => handleChange("points_value", e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="commodities">Commodities</Label>
          <Input
            id="commodities"
            type="number"
            step="0.01"
            value={formData.commodities}
            onChange={(e) => handleChange("commodities", e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="other_assets">Other Assets</Label>
          <Input
            id="other_assets"
            type="number"
            step="0.01"
            value={formData.other_assets}
            onChange={(e) => handleChange("other_assets", e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="total_debts">Total Debts</Label>
        <Input
          id="total_debts"
          type="number"
          step="0.01"
          value={formData.total_debts}
          onChange={(e) => handleChange("total_debts", e.target.value)}
          placeholder="0"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pre_tax_income">Pre-tax Monthly Income</Label>
          <Input
            id="pre_tax_income"
            type="number"
            step="0.01"
            value={formData.pre_tax_income}
            onChange={(e) => handleChange("pre_tax_income", e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthly_expenses">Monthly Expenses</Label>
          <Input
            id="monthly_expenses"
            type="number"
            step="0.01"
            value={formData.monthly_expenses}
            onChange={(e) => handleChange("monthly_expenses", e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input
          id="notes"
          type="text"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Any notes about this entry..."
        />
      </div>

      <div className="pt-4 border-t space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Assets</span>
          <span className="font-medium">{formatCurrency(totalAssets)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Debts</span>
          <span className="font-medium text-red-500">
            -{formatCurrency(Number(formData.total_debts))}
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t">
          <span>Net Worth</span>
          <span className={netWorth >= 0 ? "text-green-500" : "text-red-500"}>
            {formatCurrency(netWorth)}
          </span>
        </div>
        {(Number(formData.pre_tax_income) > 0 || Number(formData.monthly_expenses) > 0) && (
          <>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="text-muted-foreground">Monthly Net Profit</span>
              <span className={Number(formData.pre_tax_income) - Number(formData.monthly_expenses) >= 0 ? "text-green-500" : "text-red-500"}>
                {formatCurrency(Number(formData.pre_tax_income) - Number(formData.monthly_expenses))}
              </span>
            </div>
            {Number(formData.pre_tax_income) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Savings Rate</span>
                <span className="font-medium">
                  {(((Number(formData.pre_tax_income) - Number(formData.monthly_expenses)) / Number(formData.pre_tax_income)) * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-orange-500 hover:bg-orange-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : entry ? "Update Entry" : "Add Entry"}
        </Button>
      </div>
    </form>
  );
}

export default function NetWorthPage() {
  const [entries, setEntries] = useState<NetWorthEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<NetWorthEntry | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isRemoveAllDialogOpen, setIsRemoveAllDialogOpen] = useState(false);

  const fetchEntries = useCallback(async () => {
    try {
      const response = await fetch("/api/net-worth");
      if (!response.ok) {
        throw new Error("Failed to fetch entries");
      }
      const result = await response.json();
      setEntries(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleSubmit = async (data: NetWorthFormData) => {
    setIsSubmitting(true);
    try {
      const url = editingEntry
        ? `/api/net-worth/${editingEntry.id}`
        : "/api/net-worth";
      const method = editingEntry ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save entry");
      }

      await fetchEntries();
      setIsDialogOpen(false);
      setEditingEntry(undefined);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const response = await fetch(`/api/net-worth/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }

      await fetchEntries();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete entry");
    }
  };

  const handleEdit = (entry: NetWorthEntry) => {
    setEditingEntry(entry);
    setIsDialogOpen(true);
  };

  // Calculate metrics for each entry
  const getMetricsForEntry = (entry: NetWorthEntry, index: number, allEntries: NetWorthEntry[]) => {
    const sortedByDate = [...allEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const entryIndex = sortedByDate.findIndex(e => e.id === entry.id);
    const previousEntry = entryIndex > 0 ? sortedByDate[entryIndex - 1] : null;

    // Find entry from ~1 year ago
    const entryDate = new Date(entry.date);
    const oneYearAgo = new Date(entryDate);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const yearAgoEntry = sortedByDate.reduce((closest, e) => {
      const eDate = new Date(e.date);
      if (eDate > entryDate) return closest;
      if (!closest) return e;
      const closestDiff = Math.abs(new Date(closest.date).getTime() - oneYearAgo.getTime());
      const eDiff = Math.abs(eDate.getTime() - oneYearAgo.getTime());
      return eDiff < closestDiff ? e : closest;
    }, null as NetWorthEntry | null);

    const monthlyNetProfit = (entry.pre_tax_income || 0) - (entry.monthly_expenses || 0);
    const savingsRate = (entry.pre_tax_income || 0) > 0
      ? (monthlyNetProfit / (entry.pre_tax_income || 1)) * 100
      : 0;

    const netWorthGrowth = previousEntry ? entry.net_worth - previousEntry.net_worth : 0;
    const netWorthGrowthPercent = previousEntry && previousEntry.net_worth !== 0
      ? ((entry.net_worth - previousEntry.net_worth) / previousEntry.net_worth) * 100
      : 0;

    const rolling1YearGrowth = yearAgoEntry && yearAgoEntry.id !== entry.id
      ? entry.net_worth - yearAgoEntry.net_worth
      : 0;
    const rolling1YearGrowthPercent = yearAgoEntry && yearAgoEntry.id !== entry.id && yearAgoEntry.net_worth !== 0
      ? ((entry.net_worth - yearAgoEntry.net_worth) / yearAgoEntry.net_worth) * 100
      : 0;

    return {
      monthlyNetProfit,
      savingsRate,
      netWorthGrowth,
      netWorthGrowthPercent,
      rolling1YearGrowth,
      rolling1YearGrowthPercent,
    };
  };

  const handleExportCSV = () => {
    const headers = [
      "Date",
      "Stocks",
      "Bonds",
      "Cash",
      "Real Estate",
      "Points Value",
      "Commodities",
      "Other Assets",
      "Total Assets",
      "Total Debts",
      "Net Worth",
      "Pre-tax Income",
      "Monthly Expenses",
      "Monthly Net Profit",
      "Savings Rate %",
      "NW Growth $",
      "NW Growth %",
      "1Y Rolling Growth $",
      "1Y Rolling Growth %",
      "Notes",
    ];

    const rows = entries.map((entry, index) => {
      const metrics = getMetricsForEntry(entry, index, entries);
      return [
        entry.date,
        entry.stocks,
        entry.bonds,
        entry.cash,
        entry.real_estate,
        entry.points_value,
        entry.commodities || 0,
        entry.other_assets,
        entry.total_assets,
        entry.total_debts,
        entry.net_worth,
        entry.pre_tax_income || 0,
        entry.monthly_expenses || 0,
        metrics.monthlyNetProfit,
        metrics.savingsRate.toFixed(1),
        metrics.netWorthGrowth,
        metrics.netWorthGrowthPercent.toFixed(1),
        metrics.rolling1YearGrowth,
        metrics.rolling1YearGrowthPercent.toFixed(1),
        entry.notes || "",
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `net-worth-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage(null);

    try {
      const response = await fetch("/api/sync", { method: "POST" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to sync");
      }

      await fetchEntries();
      setSyncMessage({
        type: "success",
        text: `Synced ${result.synced} entries from "${result.sheetTitle}"`,
      });
    } catch (err) {
      setSyncMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to sync",
      });
    } finally {
      setSyncing(false);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(entries.map((e) => e.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    setIsBulkDeleting(true);
    try {
      const response = await fetch("/api/net-worth", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete entries");
      }

      const result = await response.json();
      setSelectedIds(new Set());
      setIsDeleteDialogOpen(false);
      await fetchEntries();
      setSyncMessage({
        type: "success",
        text: `Successfully deleted ${result.deleted} entries`,
      });
    } catch (err) {
      setSyncMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to delete entries",
      });
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleRemoveAll = async () => {
    if (entries.length === 0) return;

    setIsBulkDeleting(true);
    try {
      const allIds = entries.map((e) => e.id);
      const response = await fetch("/api/net-worth", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: allIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete entries");
      }

      const result = await response.json();
      setSelectedIds(new Set());
      setIsRemoveAllDialogOpen(false);
      await fetchEntries();
      setSyncMessage({
        type: "success",
        text: `Successfully deleted all ${result.deleted} entries`,
      });
    } catch (err) {
      setSyncMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to delete entries",
      });
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const isAllSelected = entries.length > 0 && selectedIds.size === entries.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < entries.length;

  const sortedEntries = [...entries].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Net Worth Timeline</h1>
          <p className="text-muted-foreground">
            Track your net worth over time
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleSync}
            disabled={syncing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync from Sheet"}
          </Button>
          <Button variant="outline" onClick={handleExportCSV} disabled={entries.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsRemoveAllDialogOpen(true)}
            disabled={entries.length === 0}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove All
          </Button>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) setEditingEntry(undefined);
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEntry ? "Edit Entry" : "Add Net Worth Entry"}
                </DialogTitle>
              </DialogHeader>
              <EntryForm
                entry={editingEntry}
                onSubmit={handleSubmit}
                onClose={() => {
                  setIsDialogOpen(false);
                  setEditingEntry(undefined);
                }}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">
              {selectedIds.size} {selectedIds.size === 1 ? "entry" : "entries"} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete {selectedIds.size}{" "}
              {selectedIds.size === 1 ? "entry" : "entries"}? This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isBulkDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
            >
              {isBulkDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove All Confirmation Dialog */}
      <Dialog open={isRemoveAllDialogOpen} onOpenChange={setIsRemoveAllDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Remove All Entries
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete <span className="font-bold text-foreground">all {entries.length} entries</span>?
              This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsRemoveAllDialogOpen(false)}
              disabled={isBulkDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleRemoveAll}
              disabled={isBulkDeleting}
            >
              {isBulkDeleting ? "Deleting..." : "Remove All"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sync Message */}
      {syncMessage && (
        <div
          className={`flex items-center justify-between p-3 rounded-lg ${
            syncMessage.type === "success"
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          <span>{syncMessage.text}</span>
          {syncMessage.type === "error" && syncMessage.text.includes("No Google Sheet") && (
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Configure
              </Button>
            </Link>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No entries yet. Add your first net worth entry to get started.
              </p>
              <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Entry
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={isSomeSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSortOrder}
                        className="-ml-3"
                      >
                        Date
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Stocks</TableHead>
                    <TableHead className="text-right">Bonds</TableHead>
                    <TableHead className="text-right">Cash</TableHead>
                    <TableHead className="text-right">Real Estate</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                    <TableHead className="text-right">Commodities</TableHead>
                    <TableHead className="text-right">Other</TableHead>
                    <TableHead className="text-right">Total Assets</TableHead>
                    <TableHead className="text-right">Debts</TableHead>
                    <TableHead className="text-right font-bold">Net Worth</TableHead>
                    <TableHead className="text-right">Income</TableHead>
                    <TableHead className="text-right">Expenses</TableHead>
                    <TableHead className="text-right">Net Profit</TableHead>
                    <TableHead className="text-right">Savings %</TableHead>
                    <TableHead className="text-right">NW Growth</TableHead>
                    <TableHead className="text-right">NW Growth %</TableHead>
                    <TableHead className="text-right">1Y Growth</TableHead>
                    <TableHead className="text-right">1Y Growth %</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedEntries.map((entry, index) => {
                    const metrics = getMetricsForEntry(entry, index, entries);
                    return (
                    <TableRow key={entry.id} className={selectedIds.has(entry.id) ? "bg-orange-500/5" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(entry.id)}
                          onChange={(e) => handleSelectOne(entry.id, e.target.checked)}
                          aria-label={`Select entry from ${formatDate(entry.date)}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatDate(entry.date)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(entry.stocks)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(entry.bonds)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(entry.cash)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(entry.real_estate)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(entry.points_value)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(entry.commodities || 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(entry.other_assets)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(entry.total_assets)}
                      </TableCell>
                      <TableCell className="text-right text-red-500">
                        {formatCurrency(entry.total_debts)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-bold ${
                          entry.net_worth >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {formatCurrency(entry.net_worth)}
                      </TableCell>
                      <TableCell className="text-right">
                        {(entry.pre_tax_income || 0) > 0 ? formatCurrency(entry.pre_tax_income || 0) : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {(entry.monthly_expenses || 0) > 0 ? formatCurrency(entry.monthly_expenses || 0) : "-"}
                      </TableCell>
                      <TableCell className={`text-right ${metrics.monthlyNetProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {(entry.pre_tax_income || 0) > 0 || (entry.monthly_expenses || 0) > 0 ? formatCurrency(metrics.monthlyNetProfit) : "-"}
                      </TableCell>
                      <TableCell className={`text-right ${metrics.savingsRate >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {(entry.pre_tax_income || 0) > 0 ? metrics.savingsRate.toFixed(1) + "%" : "-"}
                      </TableCell>
                      <TableCell className={`text-right ${metrics.netWorthGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {metrics.netWorthGrowth !== 0 ? (metrics.netWorthGrowth >= 0 ? "+" : "") + formatCurrency(metrics.netWorthGrowth) : "-"}
                      </TableCell>
                      <TableCell className={`text-right ${metrics.netWorthGrowthPercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {metrics.netWorthGrowthPercent !== 0 ? (metrics.netWorthGrowthPercent >= 0 ? "+" : "") + metrics.netWorthGrowthPercent.toFixed(1) + "%" : "-"}
                      </TableCell>
                      <TableCell className={`text-right ${metrics.rolling1YearGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {metrics.rolling1YearGrowth !== 0 ? (metrics.rolling1YearGrowth >= 0 ? "+" : "") + formatCurrency(metrics.rolling1YearGrowth) : "-"}
                      </TableCell>
                      <TableCell className={`text-right ${metrics.rolling1YearGrowthPercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {metrics.rolling1YearGrowthPercent !== 0 ? (metrics.rolling1YearGrowthPercent >= 0 ? "+" : "") + metrics.rolling1YearGrowthPercent.toFixed(1) + "%" : "-"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(entry)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(entry.id)}
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
