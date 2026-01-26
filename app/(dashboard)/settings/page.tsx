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
} from "lucide-react";
import type { UserSettings } from "@/lib/types";

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
    fetchSettings();
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your Google Sheets integration
        </p>
      </div>

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
          <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-orange-500/20">
                  <FileSpreadsheet className="h-6 w-6 text-orange-500" />
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
                className="bg-orange-500 hover:bg-orange-600 whitespace-nowrap"
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
                  className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1 mt-2"
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
                className="text-orange-500 hover:text-orange-600 flex items-center gap-1"
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
    </div>
  );
}
