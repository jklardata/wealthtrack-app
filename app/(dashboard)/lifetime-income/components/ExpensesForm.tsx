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
import { Textarea } from "@/components/ui/textarea";
import { AgeInput } from "@/components/ui/age-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Repeat, Calendar, Heart, Building2 } from "lucide-react";
import type { ExpenseCategory, ExpenseCategoryType } from "@/lib/types";
import { formatAgeMonths } from "@/lib/age-utils";

interface ExpensesFormProps {
  onUpdate?: () => void;
}

export function ExpensesForm({ onUpdate }: ExpensesFormProps) {
  const [expenses, setExpenses] = useState<ExpenseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/expenses");
      const data = await response.json();
      if (response.ok) {
        setExpenses(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleExpenseAdded = () => {
    fetchExpenses();
    onUpdate?.();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchExpenses();
        onUpdate?.();
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const getExpensesByType = (type: ExpenseCategoryType) =>
    expenses.filter((e) => e.category_type === type);

  return (
    <div className="space-y-6">
      {/* Recurring Expenses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Repeat className="h-5 w-5 text-slate-600" />
              <CardTitle>Recurring Expenses</CardTitle>
            </div>
            <ExpenseDialog type="recurring" onSuccess={handleExpenseAdded} />
          </div>
          <CardDescription>Monthly expenses throughout lifetime</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseList
            expenses={getExpensesByType("recurring")}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* One-Time Expenses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-600" />
              <CardTitle>One-Time Expenses</CardTitle>
            </div>
            <ExpenseDialog type="onetime" onSuccess={handleExpenseAdded} />
          </div>
          <CardDescription>Large purchases or expenses within age range</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseList
            expenses={getExpensesByType("onetime")}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Medical Pre-65 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600" />
              <CardTitle>Medical Expenses (Pre-65)</CardTitle>
            </div>
            <ExpenseDialog type="medical_pre65" onSuccess={handleExpenseAdded} />
          </div>
          <CardDescription>Healthcare costs before Medicare eligibility</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseList
            expenses={getExpensesByType("medical_pre65")}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Medicare */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-green-600" />
              <CardTitle>Medicare Expenses (65+)</CardTitle>
            </div>
            <ExpenseDialog type="medicare" onSuccess={handleExpenseAdded} />
          </div>
          <CardDescription>Medicare premiums and healthcare costs after 65</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseList
            expenses={getExpensesByType("medicare")}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function ExpenseList({
  expenses,
  onDelete,
}: {
  expenses: ExpenseCategory[];
  onDelete: (id: string) => void;
}) {
  if (expenses.length === 0) {
    return <p className="text-sm text-slate-500">No expenses added yet</p>;
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between p-3 border border-slate-200 rounded-md"
        >
          <div>
            <p className="font-medium">{expense.name}</p>
            <p className="text-sm text-slate-600">
              ${expense.monthly_amount.toLocaleString()}/month
              {expense.start_age_months && expense.end_age_months && (
                <span className="ml-2">
                  from {formatAgeMonths(expense.start_age_months)} to{" "}
                  {formatAgeMonths(expense.end_age_months)}
                </span>
              )}
            </p>
            {expense.notes && (
              <p className="text-xs text-slate-500 mt-1">{expense.notes}</p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => onDelete(expense.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

function ExpenseDialog({
  type,
  onSuccess,
}: {
  type: ExpenseCategoryType;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    monthly_amount: "",
    start_age_months: null as number | null,
    end_age_months: null as number | null,
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_type: type,
          name: formData.name,
          monthly_amount: parseFloat(formData.monthly_amount),
          start_age_months: formData.start_age_months,
          end_age_months: formData.end_age_months,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        setOpen(false);
        setFormData({
          name: "",
          monthly_amount: "",
          start_age_months: null,
          end_age_months: null,
          notes: "",
        });
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  };

  const getDialogConfig = () => {
    switch (type) {
      case "recurring":
        return {
          title: "Add Recurring Expense",
          buttonClass: "bg-slate-600 hover:bg-slate-700",
          showAgeRange: false,
        };
      case "onetime":
        return {
          title: "Add One-Time Expense",
          buttonClass: "bg-amber-600 hover:bg-amber-700",
          showAgeRange: true,
        };
      case "medical_pre65":
        return {
          title: "Add Medical Expense (Pre-65)",
          buttonClass: "bg-red-600 hover:bg-red-700",
          showAgeRange: false,
        };
      case "medicare":
        return {
          title: "Add Medicare Expense",
          buttonClass: "bg-green-600 hover:bg-green-700",
          showAgeRange: false,
        };
    }
  };

  const config = getDialogConfig();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className={config.buttonClass}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Expense Name</Label>
              <Input
                id="name"
                placeholder="e.g., Health insurance"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="monthly_amount">Monthly Amount</Label>
              <Input
                id="monthly_amount"
                type="number"
                placeholder="500"
                value={formData.monthly_amount}
                onChange={(e) =>
                  setFormData({ ...formData, monthly_amount: e.target.value })
                }
                required
              />
            </div>
            {config.showAgeRange && (
              <>
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
                  <Label htmlFor="end_age">End Age</Label>
                  <AgeInput
                    id="end_age"
                    value={formData.end_age_months || undefined}
                    onChange={(ageMonths) =>
                      setFormData({ ...formData, end_age_months: ageMonths })
                    }
                  />
                </div>
              </>
            )}
          </div>
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional details..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
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
