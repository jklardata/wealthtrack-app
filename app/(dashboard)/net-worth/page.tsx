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
} from "lucide-react";
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
    other_assets: entry?.other_assets || 0,
    total_debts: entry?.total_debts || 0,
    notes: entry?.notes || "",
  });

  const totalAssets =
    Number(formData.stocks) +
    Number(formData.bonds) +
    Number(formData.cash) +
    Number(formData.real_estate) +
    Number(formData.points_value) +
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
      other_assets: Number(formData.other_assets),
      total_debts: Number(formData.total_debts),
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

  const handleExportCSV = () => {
    const headers = [
      "Date",
      "Stocks",
      "Bonds",
      "Cash",
      "Real Estate",
      "Points Value",
      "Other Assets",
      "Total Assets",
      "Total Debts",
      "Net Worth",
      "Notes",
    ];

    const rows = entries.map((entry) => [
      entry.date,
      entry.stocks,
      entry.bonds,
      entry.cash,
      entry.real_estate,
      entry.points_value,
      entry.other_assets,
      entry.total_assets,
      entry.total_debts,
      entry.net_worth,
      entry.notes || "",
    ]);

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

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

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
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV} disabled={entries.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
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
                    <TableHead className="text-right">Other</TableHead>
                    <TableHead className="text-right">Total Assets</TableHead>
                    <TableHead className="text-right">Debts</TableHead>
                    <TableHead className="text-right font-bold">Net Worth</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedEntries.map((entry) => (
                    <TableRow key={entry.id}>
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
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
