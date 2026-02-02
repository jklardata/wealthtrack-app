"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  ExternalLink,
  Check,
  AlertCircle,
  Plus,
  Loader2,
  FileSpreadsheet,
  CreditCard,
  Sparkles,
  Crown,
  Upload,
  FileText,
  Trash2,
} from "lucide-react";
import type { UserSettings, EntitlementTier, TaxReturn } from "@/lib/types";
import { PRICING_TIERS } from "@/lib/stripe-config";
import Link from "next/link";

const SERVICE_ACCOUNT_EMAIL = "wealthtrack-sheets@wealth-tracker-485215.iam.gserviceaccount.com";

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [sheetId, setSheetId] = useState("");
  const [creditCardsSheetId, setCreditCardsSheetId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [creatingCreditCards, setCreatingCreditCards] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [creditCardsMessage, setCreditCardsMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [createdSheetUrl, setCreatedSheetUrl] = useState<string | null>(null);
  const [createdCreditCardsSheetUrl, setCreatedCreditCardsSheetUrl] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<{
    entitlement_tier: EntitlementTier;
    status: string;
    current_period_end: string | null;
  } | null>(null);

  // Tax Returns state
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>([]);
  const [taxFile, setTaxFile] = useState<File | null>(null);
  const [taxPreview, setTaxPreview] = useState<Partial<TaxReturn>[] | null>(null);
  const [uploadingTax, setUploadingTax] = useState(false);
  const [taxMessage, setTaxMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const result = await response.json();
          setSettings(result.data);
          setSheetId(result.data?.google_sheet_id || "");
          setCreditCardsSheetId(result.data?.credit_cards_sheet_id || "");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchSubscription() {
      try {
        const response = await fetch("/api/stripe/subscription");
        if (response.ok) {
          const data = await response.json();
          setSubscription(data);
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      }
    }

    async function fetchTaxReturns() {
      try {
        const response = await fetch("/api/tax-returns");
        if (response.ok) {
          const result = await response.json();
          setTaxReturns(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching tax returns:", error);
      }
    }

    fetchSettings();
    fetchSubscription();
    fetchTaxReturns();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          google_sheet_id: sheetId || null,
          credit_cards_sheet_id: creditCardsSheetId || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      const result = await response.json();
      setSettings(result.data);
      setMessage({ type: "success", text: "Settings saved successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to save" });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateTemplate = async () => {
    setCreating(true);
    setMessage(null);
    setCreatedSheetUrl(null);

    try {
      const response = await fetch("/api/create-sheet", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create spreadsheet");
      }

      setSheetId(result.spreadsheetId);
      setCreatedSheetUrl(result.spreadsheetUrl);
      setMessage({
        type: "success",
        text: "Template created and connected! Check your email for access."
      });

      // Refresh settings
      const settingsResponse = await fetch("/api/settings");
      if (settingsResponse.ok) {
        const settingsResult = await settingsResponse.json();
        setSettings(settingsResult.data);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to create spreadsheet"
      });
    } finally {
      setCreating(false);
    }
  };

  const handleCreateCreditCardsTemplate = async () => {
    setCreatingCreditCards(true);
    setCreditCardsMessage(null);
    setCreatedCreditCardsSheetUrl(null);

    try {
      const response = await fetch("/api/create-credit-cards-sheet", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create spreadsheet");
      }

      setCreditCardsSheetId(result.spreadsheetId);
      setCreatedCreditCardsSheetUrl(result.spreadsheetUrl);
      setCreditCardsMessage({
        type: "success",
        text: "Credit Cards template created and connected! Check your email for access."
      });

      // Refresh settings
      const settingsResponse = await fetch("/api/settings");
      if (settingsResponse.ok) {
        const settingsResult = await settingsResponse.json();
        setSettings(settingsResult.data);
        setCreditCardsSheetId(settingsResult.data?.credit_cards_sheet_id || "");
      }
    } catch (error) {
      setCreditCardsMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to create spreadsheet"
      });
    } finally {
      setCreatingCreditCards(false);
    }
  };

  const handleTaxFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTaxFile(file);
    setTaxMessage(null);

    // Parse CSV and show preview
    try {
      const text = await file.text();
      const lines = text.trim().split("\n");
      if (lines.length < 2) {
        setTaxMessage({ type: "error", text: "CSV file is empty or has no data rows" });
        return;
      }

      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      const records: Partial<TaxReturn>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",");
        const record: Record<string, string> = {};
        headers.forEach((header, index) => {
          record[header] = values[index]?.trim() || "";
        });
        records.push(record as unknown as Partial<TaxReturn>);
      }

      setTaxPreview(records);
    } catch (error) {
      setTaxMessage({ type: "error", text: "Failed to parse CSV file" });
    }
  };

  const handleTaxUpload = async () => {
    if (!taxPreview || taxPreview.length === 0) return;

    setUploadingTax(true);
    setTaxMessage(null);

    try {
      const response = await fetch("/api/tax-returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taxPreview),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload tax returns");
      }

      setTaxMessage({
        type: "success",
        text: `Successfully imported ${result.imported} tax return(s)${result.errors?.length ? `. ${result.errors.length} error(s).` : ""}`,
      });

      // Refresh tax returns list
      const refreshResponse = await fetch("/api/tax-returns");
      if (refreshResponse.ok) {
        const refreshResult = await refreshResponse.json();
        setTaxReturns(refreshResult.data || []);
      }

      // Clear preview
      setTaxPreview(null);
      setTaxFile(null);
    } catch (error) {
      setTaxMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to upload",
      });
    } finally {
      setUploadingTax(false);
    }
  };

  const handleDeleteTaxReturn = async (id: string, year: number) => {
    if (!confirm(`Delete tax return for ${year || "this record"}?`)) return;

    try {
      // Use bulk delete API with ID
      const response = await fetch("/api/tax-returns", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete tax return");
      }

      setTaxReturns(taxReturns.filter(t => t.id !== id));
      setTaxMessage({ type: "success", text: `Deleted tax return${year ? ` for ${year}` : ""}` });
    } catch (error) {
      setTaxMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to delete",
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const extractSheetId = (input: string): string => {
    // If it's a full URL, extract the ID
    const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : input;
  };

  const handleSheetIdChange = (value: string) => {
    setSheetId(extractSheetId(value));
  };

  const handleCreditCardsSheetIdChange = (value: string) => {
    setCreditCardsSheetId(extractSheetId(value));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-base text-muted-foreground mt-1">
          Configure your account and integrations
        </p>
      </div>

      {/* Subscription Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {subscription?.entitlement_tier === "premium" ? (
              <Crown className="h-5 w-5 text-yellow-500" />
            ) : subscription?.entitlement_tier === "pro" ? (
              <Sparkles className="h-5 w-5 text-primary" />
            ) : (
              <Sparkles className="h-5 w-5 text-muted-foreground" />
            )}
            Subscription
          </CardTitle>
          <CardDescription>
            Manage your SoloFI subscription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                Current Plan:{" "}
                <span className={
                  subscription?.entitlement_tier === "premium"
                    ? "text-yellow-500"
                    : subscription?.entitlement_tier === "pro"
                    ? "text-primary"
                    : "text-muted-foreground"
                }>
                  {subscription?.entitlement_tier
                    ? PRICING_TIERS[subscription.entitlement_tier].name
                    : "Free"}
                </span>
              </p>
              {subscription?.current_period_end && subscription.entitlement_tier !== "free" && (
                <p className="text-sm text-muted-foreground">
                  Renews on {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              )}
            </div>
            <Link href="/upgrade">
              <Button variant={subscription?.entitlement_tier === "free" ? "default" : "outline"}>
                {subscription?.entitlement_tier === "free" ? "Upgrade" : "Manage Plan"}
              </Button>
            </Link>
          </div>
          {subscription?.entitlement_tier && subscription.entitlement_tier !== "free" && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground mb-2">Your plan includes:</p>
              <ul className="text-sm space-y-1">
                {PRICING_TIERS[subscription.entitlement_tier].features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sheet className="h-5 w-5 text-green-600" />
            Google Sheets Integration
          </CardTitle>
          <CardDescription>
            Connect a Google Sheet to sync your net worth data automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Create Template Button - Prominent CTA */}
          <div className="bg-gradient-to-r from-primary/10 to-yellow-500/10 border border-primary/20 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <FileSpreadsheet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Quick Start</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a pre-configured Google Sheet template with all the right columns.
                    It will be automatically shared and connected.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleCreateTemplate}
                disabled={creating}
                className="bg-primary hover:bg-primary/90 whitespace-nowrap"
                size="lg"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template Sheet
                  </>
                )}
              </Button>
            </div>
            {createdSheetUrl && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-500 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Sheet created successfully!
                </p>
                <a
                  href={createdSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 mt-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open your new spreadsheet
                </a>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or connect existing sheet
              </span>
            </div>
          </div>

          {/* Manual Setup Instructions */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium">Manual Setup:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>
                Create a Google Sheet with these columns in row 1:
                <br />
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  Date | Stocks | Bonds | Cash | Real Estate | Points Value | Other Assets | Total Debts | Notes
                </code>
              </li>
              <li>Add your data starting from row 2</li>
              <li>
                Share the sheet with this email (Viewer access):
                <br />
                <code className="text-xs bg-muted px-1 py-0.5 rounded break-all select-all">
                  {SERVICE_ACCOUNT_EMAIL}
                </code>
              </li>
              <li>Copy the Sheet ID from the URL and paste it below</li>
            </ol>
          </div>

          {/* Sheet ID Input */}
          <div className="space-y-2">
            <Label htmlFor="sheetId">Google Sheet ID or URL</Label>
            <Input
              id="sheetId"
              placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              value={sheetId}
              onChange={(e) => handleSheetIdChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              You can paste the full URL or just the Sheet ID
            </p>
          </div>

          {/* Connected Sheet Info */}
          {sheetId && (
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">Connected to sheet:</span>
              <a
                href={`https://docs.google.com/spreadsheets/d/${sheetId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 flex items-center gap-1"
              >
                Open Sheet
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {/* Last Sync Info */}
          {settings?.last_sync_at && (
            <p className="text-sm text-muted-foreground">
              Last synced: {new Date(settings.last_sync_at).toLocaleString()}
            </p>
          )}

          {/* Message */}
          {message && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                message.type === "success"
                  ? "bg-green-500/10 text-green-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {message.type === "success" ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {message.text}
            </div>
          )}

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            variant="outline"
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>

      {/* Credit Cards Sheet Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            Credit Cards Google Sheet
          </CardTitle>
          <CardDescription>
            Connect a Google Sheet to sync your credit card data automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Create Template Button - Prominent CTA */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-purple-500/20">
                  <FileSpreadsheet className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Credit Cards Template</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a pre-configured Google Sheet for tracking credit cards, bonuses, and spending.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleCreateCreditCardsTemplate}
                disabled={creatingCreditCards}
                className="bg-purple-500 hover:bg-purple-600 whitespace-nowrap"
                size="lg"
              >
                {creatingCreditCards ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Credit Cards Sheet
                  </>
                )}
              </Button>
            </div>
            {createdCreditCardsSheetUrl && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-500 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Sheet created successfully!
                </p>
                <a
                  href={createdCreditCardsSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-500 hover:text-purple-600 flex items-center gap-1 mt-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open your new spreadsheet
                </a>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or connect existing sheet
              </span>
            </div>
          </div>

          {/* Manual Setup Instructions */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium">Manual Setup:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>
                Create a Google Sheet with these columns in row 1:
                <br />
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  Card Name | Last 4 | Status | Signup Bonus | SUB Requirement | Current Spend | SUB Deadline | Got Bonus | Annual Fee | Signup Date | Annual Fee Date | Close Date | Notes
                </code>
              </li>
              <li>Name the sheet tab &quot;Credit Cards&quot;</li>
              <li>Add your data starting from row 2</li>
              <li>
                Share the sheet with this email (Viewer access):
                <br />
                <code className="text-xs bg-muted px-1 py-0.5 rounded break-all select-all">
                  {SERVICE_ACCOUNT_EMAIL}
                </code>
              </li>
              <li>Copy the Sheet ID from the URL and paste it below</li>
            </ol>
          </div>

          {/* Sheet ID Input */}
          <div className="space-y-2">
            <Label htmlFor="creditCardsSheetId">Credit Cards Sheet ID or URL</Label>
            <Input
              id="creditCardsSheetId"
              placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              value={creditCardsSheetId}
              onChange={(e) => handleCreditCardsSheetIdChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              You can paste the full URL or just the Sheet ID
            </p>
          </div>

          {/* Connected Sheet Info */}
          {creditCardsSheetId && (
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">Connected to sheet:</span>
              <a
                href={`https://docs.google.com/spreadsheets/d/${creditCardsSheetId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-500 hover:text-purple-600 flex items-center gap-1"
              >
                Open Sheet
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {/* Last Sync Info */}
          {settings?.credit_cards_last_sync_at && (
            <p className="text-sm text-muted-foreground">
              Last synced: {new Date(settings.credit_cards_last_sync_at).toLocaleString()}
            </p>
          )}

          {/* Message */}
          {creditCardsMessage && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                creditCardsMessage.type === "success"
                  ? "bg-green-500/10 text-green-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {creditCardsMessage.type === "success" ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {creditCardsMessage.text}
            </div>
          )}

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            variant="outline"
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>

      {/* Tax Returns Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Tax Returns
          </CardTitle>
          <CardDescription>
            Upload tax return data from TurboTax PDF parser CSV export
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <Upload className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Upload Tax Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload the CSV file generated by the TurboTax PDF parser script.
                  </p>
                </div>
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleTaxFileChange}
                  className="hidden"
                />
                <div className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Select CSV File
                </div>
              </label>
            </div>

            {taxFile && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Selected: {taxFile.name}
                </p>
              </div>
            )}
          </div>

          {/* Preview Section */}
          {taxPreview && taxPreview.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Preview ({taxPreview.length} record(s))</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 py-2 text-left">Year</th>
                      <th className="px-3 py-2 text-left">Filing Status</th>
                      <th className="px-3 py-2 text-right">AGI</th>
                      <th className="px-3 py-2 text-right">Total Tax</th>
                      <th className="px-3 py-2 text-right">Refund</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxPreview.map((record, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-3 py-2">{record.tax_year}</td>
                        <td className="px-3 py-2 capitalize">{String(record.filing_status).replace(/_/g, " ")}</td>
                        <td className="px-3 py-2 text-right">{formatCurrency(Number(record.agi) || 0)}</td>
                        <td className="px-3 py-2 text-right">{formatCurrency(Number(record.total_tax) || 0)}</td>
                        <td className="px-3 py-2 text-right">{formatCurrency(Number(record.refund_amount) || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button
                onClick={handleTaxUpload}
                disabled={uploadingTax}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {uploadingTax ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Tax Returns
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Message */}
          {taxMessage && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${
                taxMessage.type === "success"
                  ? "bg-green-500/10 text-green-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {taxMessage.type === "success" ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {taxMessage.text}
            </div>
          )}

          {/* Existing Tax Returns */}
          {taxReturns.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Uploaded Tax Returns</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 py-2 text-left">Year</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-right">Wages</th>
                      <th className="px-3 py-2 text-right">AGI</th>
                      <th className="px-3 py-2 text-right">Total Tax</th>
                      <th className="px-3 py-2 text-right">Eff. Rate</th>
                      <th className="px-3 py-2 text-right">Refund/Owed</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxReturns.map((tr) => (
                      <tr key={tr.id} className="border-t">
                        <td className="px-3 py-2 font-medium">{tr.tax_year}</td>
                        <td className="px-3 py-2 capitalize">{tr.filing_status.replace(/_/g, " ")}</td>
                        <td className="px-3 py-2 text-right">{formatCurrency(tr.wages)}</td>
                        <td className="px-3 py-2 text-right">{formatCurrency(tr.agi)}</td>
                        <td className="px-3 py-2 text-right">{formatCurrency(tr.total_tax)}</td>
                        <td className="px-3 py-2 text-right">{(tr.effective_tax_rate * 100).toFixed(1)}%</td>
                        <td className="px-3 py-2 text-right">
                          {tr.refund_amount > 0 ? (
                            <span className="text-green-500">+{formatCurrency(tr.refund_amount)}</span>
                          ) : tr.amount_owed > 0 ? (
                            <span className="text-red-500">-{formatCurrency(tr.amount_owed)}</span>
                          ) : (
                            "$0"
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTaxReturn(tr.id, tr.tax_year)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-4">
            <h4 className="font-medium">How to Create and Upload Your Tax Data CSV</h4>

            {/* Privacy Notice */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-sm text-green-700 dark:text-green-400">
                <strong>Privacy First:</strong> The Python script runs entirely on your computer.
                Your tax return PDF never leaves your machine. The script extracts only financial figures
                (no SSN, addresses, or other PII) into a CSV that you can review before uploading.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Step 1: Install Python Dependencies</p>
              <p className="text-xs text-muted-foreground mb-2">
                Open Terminal (Mac) or Command Prompt (Windows) and run:
              </p>
              <div className="bg-muted rounded-lg p-3">
                <code className="text-xs block">pip install pdfplumber pandas</code>
              </div>
              <p className="text-xs text-muted-foreground">
                If that doesn&apos;t work, try: <code className="bg-muted px-1 rounded">python3 -m pip install pdfplumber pandas</code>
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Step 2: Download the Parser Script</p>
              <p className="text-xs text-muted-foreground">
                Download <code className="bg-muted px-1 rounded">turbotax_parser.py</code> and save it in the <strong>same folder</strong> as your TurboTax PDF file(s).
              </p>
              <a
                href="https://github.com/jklardata/wealthtrack-app/blob/main/scripts/turbotax_parser.py"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Download turbotax_parser.py from GitHub
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Step 3: Run the Parser on Your Tax Return PDF</p>
              <p className="text-xs text-muted-foreground mb-2">
                Open Terminal, navigate to the folder containing both the script and your PDF, then run:
              </p>
              <div className="bg-muted rounded-lg p-3 space-y-2">
                <code className="text-xs block"># Navigate to the folder with your files</code>
                <code className="text-xs block">cd ~/Downloads</code>
                <code className="text-xs block mt-2"># Parse your TurboTax PDF</code>
                <code className="text-xs block">python3 turbotax_parser.py 2023_TaxReturn.pdf -o tax_data.csv</code>
                <code className="text-xs block mt-2"># Parse multiple years into one file</code>
                <code className="text-xs block">python3 turbotax_parser.py 2022_TaxReturn.pdf 2023_TaxReturn.pdf -o tax_data.csv</code>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This creates a <code className="bg-muted px-1 rounded">tax_data.csv</code> file in the same folder with only the financial data — no personal information.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Step 4: Review and Upload</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Open <code className="bg-muted px-1 rounded">tax_data.csv</code> to verify it contains only numbers (no SSN, no addresses)</li>
                <li>Click &quot;Select CSV File&quot; above and choose your CSV</li>
                <li>Review the preview table</li>
                <li>Click &quot;Upload Tax Returns&quot; to import</li>
              </ol>
            </div>

            <details className="text-sm">
              <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">
                Advanced: Manual CSV Format
              </summary>
              <div className="mt-3 space-y-2">
                <p className="text-xs text-muted-foreground">
                  If you prefer to create the CSV manually, use these column headers:
                </p>
                <div className="bg-muted rounded-lg p-3 overflow-x-auto">
                  <code className="text-xs break-all">
                    tax_year, filing_status, wages, interest_income, dividend_income, qualified_dividends, capital_gains, ira_distributions, pension_income, social_security, business_income, other_income, total_income, agi, adjustments, deduction_type, deduction_amount, qbi_deduction, taxable_income, total_tax, federal_withheld, estimated_payments, refund_amount, amount_owed, effective_tax_rate, se_income, se_tax, se_deduction, notes
                  </code>
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong>filing_status:</strong> single, married_filing_jointly, married_filing_separately, head_of_household, qualifying_widow
                </p>
              </div>
            </details>
          </div>

          {/* Link to Tax Optimization */}
          {taxReturns.length > 0 && (
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-green-500/20">
                    <Sparkles className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">View Tax Optimization Insights</h3>
                    <p className="text-sm text-muted-foreground">
                      Analyze your tax health, deduction efficiency, S-Corp break-even, and quarterly estimates.
                    </p>
                  </div>
                </div>
                <Link href="/tax-optimization">
                  <Button className="bg-green-500 hover:bg-green-600 whitespace-nowrap">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Tax Optimization Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
