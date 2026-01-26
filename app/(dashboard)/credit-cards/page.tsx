"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  CreditCard as CreditCardIcon,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Sheet,
} from "lucide-react";
import type { CreditCard, CreditCardFormData, CreditCardStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

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

function getDaysUntil(dateString: string | null): number | null {
  if (!dateString) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getStatusColor(status: CreditCardStatus): string {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "pending":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "closed":
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
}

function getProgressColor(progress: number, gotBonus: boolean): string {
  if (gotBonus) return "bg-green-500";
  if (progress >= 100) return "bg-green-500";
  if (progress >= 75) return "bg-yellow-500";
  return "bg-orange-500";
}

interface CardFormProps {
  card?: CreditCard;
  onSubmit: (data: CreditCardFormData) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

function CardForm({ card, onSubmit, onClose, isSubmitting }: CardFormProps) {
  const [formData, setFormData] = useState<CreditCardFormData>({
    card_name: card?.card_name || "",
    last_four: card?.last_four || "",
    status: card?.status || "active",
    signup_bonus: card?.signup_bonus || "",
    sub_requirement: card?.sub_requirement || undefined,
    current_spend: card?.current_spend || 0,
    sub_deadline: card?.sub_deadline || "",
    got_bonus: card?.got_bonus || false,
    annual_fee: card?.annual_fee || 0,
    signup_date: card?.signup_date || "",
    annual_fee_date: card?.annual_fee_date || "",
    close_date: card?.close_date || "",
    notes: card?.notes || "",
  });

  const handleChange = (field: keyof CreditCardFormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      sub_requirement: formData.sub_requirement ? Number(formData.sub_requirement) : undefined,
      current_spend: Number(formData.current_spend) || 0,
      annual_fee: Number(formData.annual_fee) || 0,
    });
  };

  const progress = formData.sub_requirement && formData.sub_requirement > 0
    ? Math.min(100, (Number(formData.current_spend) / formData.sub_requirement) * 100)
    : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label htmlFor="card_name">Card Name *</Label>
          <Input
            id="card_name"
            value={formData.card_name}
            onChange={(e) => handleChange("card_name", e.target.value)}
            placeholder="Chase Sapphire Preferred"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_four">Last 4 Digits</Label>
          <Input
            id="last_four"
            value={formData.last_four || ""}
            onChange={(e) => handleChange("last_four", e.target.value.slice(0, 4))}
            placeholder="1234"
            maxLength={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(v) => handleChange("status", v as CreditCardStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <h4 className="font-medium mb-3">Sign-up Bonus</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="signup_bonus">Bonus Description</Label>
            <Input
              id="signup_bonus"
              value={formData.signup_bonus || ""}
              onChange={(e) => handleChange("signup_bonus", e.target.value)}
              placeholder="120,000 points"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sub_requirement">Spend Requirement ($)</Label>
            <Input
              id="sub_requirement"
              type="number"
              value={formData.sub_requirement || ""}
              onChange={(e) => handleChange("sub_requirement", e.target.value)}
              placeholder="8000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_spend">Current Spend ($)</Label>
            <Input
              id="current_spend"
              type="number"
              value={formData.current_spend || ""}
              onChange={(e) => handleChange("current_spend", e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sub_deadline">Deadline</Label>
            <Input
              id="sub_deadline"
              type="date"
              value={formData.sub_deadline || ""}
              onChange={(e) => handleChange("sub_deadline", e.target.value)}
            />
          </div>

          <div className="space-y-2 flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.got_bonus || false}
                onChange={(e) => handleChange("got_bonus", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">Got Bonus</span>
            </label>
          </div>
        </div>

        {formData.sub_requirement && formData.sub_requirement > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className={progress >= 100 ? "text-green-500" : ""}>
                {formatCurrency(Number(formData.current_spend))} / {formatCurrency(formData.sub_requirement)}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>

      <div className="border-t pt-4 mt-4">
        <h4 className="font-medium mb-3">Dates & Fees</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="signup_date">Sign-up Date</Label>
            <Input
              id="signup_date"
              type="date"
              value={formData.signup_date || ""}
              onChange={(e) => handleChange("signup_date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annual_fee">Annual Fee ($)</Label>
            <Input
              id="annual_fee"
              type="number"
              value={formData.annual_fee || ""}
              onChange={(e) => handleChange("annual_fee", e.target.value)}
              placeholder="95"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annual_fee_date">Annual Fee Date</Label>
            <Input
              id="annual_fee_date"
              type="date"
              value={formData.annual_fee_date || ""}
              onChange={(e) => handleChange("annual_fee_date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="close_date">Close Date</Label>
            <Input
              id="close_date"
              type="date"
              value={formData.close_date || ""}
              onChange={(e) => handleChange("close_date", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          value={formData.notes || ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Any notes about this card..."
        />
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
          {isSubmitting ? "Saving..." : card ? "Update Card" : "Add Card"}
        </Button>
      </div>
    </form>
  );
}

function CreditCardItem({
  card,
  onEdit,
  onDelete,
}: {
  card: CreditCard;
  onEdit: (card: CreditCard) => void;
  onDelete: (id: string) => void;
}) {
  const progress = card.sub_requirement && card.sub_requirement > 0
    ? Math.min(100, (card.current_spend / card.sub_requirement) * 100)
    : 0;

  const daysUntilDeadline = getDaysUntil(card.sub_deadline);
  const daysUntilAnnualFee = getDaysUntil(card.annual_fee_date);
  const isComplete = card.got_bonus || progress >= 100;
  const isUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 30 && !isComplete;
  const remaining = card.sub_requirement ? card.sub_requirement - card.current_spend : 0;

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all hover:shadow-lg",
      isComplete && "border-green-500/30",
      isUrgent && "border-red-500/30"
    )}>
      {/* Celebration effect for completed */}
      {isComplete && (
        <div className="absolute top-2 right-2">
          <Sparkles className="h-5 w-5 text-green-500 animate-pulse" />
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              isComplete ? "bg-green-500/10" : "bg-orange-500/10"
            )}>
              <CreditCardIcon className={cn(
                "h-5 w-5",
                isComplete ? "text-green-500" : "text-orange-500"
              )} />
            </div>
            <div>
              <CardTitle className="text-base">{card.card_name}</CardTitle>
              {card.last_four && (
                <p className="text-xs text-muted-foreground">•••• {card.last_four}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-xs px-2 py-1 rounded-full border capitalize",
              getStatusColor(card.status)
            )}>
              {card.status}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(card)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(card.id)}
                  className="text-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Signup Bonus */}
        {card.signup_bonus && (
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{card.signup_bonus}</span>
            {isComplete && <CheckCircle2 className="h-4 w-4 text-green-500" />}
          </div>
        )}

        {/* Progress Bar */}
        {card.sub_requirement && card.sub_requirement > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">
                {formatCurrency(card.current_spend)} / {formatCurrency(card.sub_requirement)}
              </span>
              <span className={cn(
                "font-medium",
                isComplete ? "text-green-500" : ""
              )}>
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  getProgressColor(progress, card.got_bonus)
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            {!isComplete && remaining > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(remaining)} left to spend
              </p>
            )}
          </div>
        )}

        {/* Deadline Alert */}
        {daysUntilDeadline !== null && !isComplete && (
          <div className={cn(
            "flex items-center gap-2 text-sm p-2 rounded-lg",
            daysUntilDeadline <= 14 ? "bg-red-500/10 text-red-500" :
            daysUntilDeadline <= 30 ? "bg-yellow-500/10 text-yellow-500" :
            "bg-muted text-muted-foreground"
          )}>
            {daysUntilDeadline <= 14 ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
            <span>
              {daysUntilDeadline < 0
                ? `Deadline passed ${Math.abs(daysUntilDeadline)} days ago`
                : daysUntilDeadline === 0
                ? "Deadline is today!"
                : `${daysUntilDeadline} days until deadline`}
            </span>
          </div>
        )}

        {/* Annual Fee Alert */}
        {daysUntilAnnualFee !== null && daysUntilAnnualFee > 0 && daysUntilAnnualFee <= 90 && (
          <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
            <Calendar className="h-4 w-4" />
            <span>
              {formatCurrency(card.annual_fee)} annual fee in {daysUntilAnnualFee} days
            </span>
          </div>
        )}

        {/* Got Bonus Badge */}
        {card.got_bonus && (
          <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-green-500/10 text-green-500">
            <CheckCircle2 className="h-4 w-4" />
            <span>Bonus earned!</span>
          </div>
        )}

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          {card.signup_date && (
            <span>Opened {formatDate(card.signup_date)}</span>
          )}
          {card.annual_fee > 0 && (
            <span>{formatCurrency(card.annual_fee)}/yr</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CreditCardsPage() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [hasSheetConnected, setHasSheetConnected] = useState(false);

  const fetchCards = useCallback(async () => {
    try {
      const response = await fetch("/api/credit-cards");
      if (!response.ok) {
        throw new Error("Failed to fetch credit cards");
      }
      const result = await response.json();
      setCards(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  const checkSheetConnection = useCallback(async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const result = await response.json();
        setHasSheetConnected(!!result.data?.credit_cards_sheet_id);
      }
    } catch {
      // Ignore errors
    }
  }, []);

  useEffect(() => {
    fetchCards();
    checkSheetConnection();
  }, [fetchCards, checkSheetConnection]);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);

    try {
      const response = await fetch("/api/credit-cards/sync", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to sync");
      }

      setCards(result.data || []);
      setSyncMessage({
        type: "success",
        text: `Synced ${result.syncedCount} cards from Google Sheets`
      });
    } catch (err) {
      setSyncMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to sync"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSubmit = async (data: CreditCardFormData) => {
    setIsSubmitting(true);
    try {
      const url = editingCard
        ? `/api/credit-cards/${editingCard.id}`
        : "/api/credit-cards";
      const method = editingCard ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save card");
      }

      await fetchCards();
      setIsDialogOpen(false);
      setEditingCard(undefined);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save card");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this card?")) return;

    try {
      const response = await fetch(`/api/credit-cards/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete card");
      }

      await fetchCards();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete card");
    }
  };

  const handleEdit = (card: CreditCard) => {
    setEditingCard(card);
    setIsDialogOpen(true);
  };

  // Stats
  const activeCards = cards.filter((c) => c.status === "active");
  const totalAnnualFees = activeCards.reduce((sum, c) => sum + c.annual_fee, 0);
  const cardsInProgress = activeCards.filter(
    (c) => c.sub_requirement && c.current_spend < c.sub_requirement && !c.got_bonus
  );
  const bonusesEarned = cards.filter((c) => c.got_bonus).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
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
      {/* Sync Message */}
      {syncMessage && (
        <div
          className={cn(
            "flex items-center gap-2 p-3 rounded-lg",
            syncMessage.type === "success"
              ? "bg-green-500/10 text-green-500 border border-green-500/20"
              : "bg-red-500/10 text-red-500 border border-red-500/20"
          )}
        >
          {syncMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {syncMessage.text}
          <button
            onClick={() => setSyncMessage(null)}
            className="ml-auto text-current hover:opacity-70"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Credit Cards</h1>
          <p className="text-muted-foreground">
            Track your cards and sign-up bonus progress
          </p>
        </div>
        <div className="flex gap-2">
          {hasSheetConnected && (
            <Button
              variant="outline"
              onClick={handleSync}
              disabled={isSyncing}
              className="border-purple-500/30 hover:bg-purple-500/10"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Sheet className="h-4 w-4 mr-2" />
                  Sync from Sheets
                </>
              )}
            </Button>
          )}
          <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingCard(undefined);
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Card
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCard ? "Edit Card" : "Add Credit Card"}
              </DialogTitle>
            </DialogHeader>
            <CardForm
              card={editingCard}
              onSubmit={handleSubmit}
              onClose={() => {
                setIsDialogOpen(false);
                setEditingCard(undefined);
              }}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{activeCards.length}</div>
            <p className="text-sm text-muted-foreground">Active Cards</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-500">{cardsInProgress.length}</div>
            <p className="text-sm text-muted-foreground">SUBs In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-500">{bonusesEarned}</div>
            <p className="text-sm text-muted-foreground">Bonuses Earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{formatCurrency(totalAnnualFees)}</div>
            <p className="text-sm text-muted-foreground">Total Annual Fees</p>
          </CardContent>
        </Card>
      </div>

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCardIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No credit cards added yet. Add your first card to start tracking!
            </p>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Card
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <CreditCardItem
              key={card.id}
              card={card}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
