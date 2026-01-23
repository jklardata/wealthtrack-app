"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, ExternalLink, Check, AlertCircle } from "lucide-react";
import type { UserSettings } from "@/lib/types";

const SERVICE_ACCOUNT_EMAIL = process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL || "wealthtrack@your-project.iam.gserviceaccount.com";

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [sheetId, setSheetId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const result = await response.json();
          setSettings(result.data);
          setSheetId(result.data?.google_sheet_id || "");
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
        body: JSON.stringify({ google_sheet_id: sheetId || null }),
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

  const extractSheetId = (input: string): string => {
    // If it's a full URL, extract the ID
    const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : input;
  };

  const handleSheetIdChange = (value: string) => {
    setSheetId(extractSheetId(value));
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
          {/* Setup Instructions */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium">Setup Instructions:</h4>
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
                <code className="text-xs bg-muted px-1 py-0.5 rounded break-all">
                  {SERVICE_ACCOUNT_EMAIL}
                </code>
              </li>
              <li>Copy the Sheet ID from the URL and paste it below</li>
            </ol>
          </div>

          {/* Template Link */}
          <div className="flex items-center gap-2">
            <a
              href="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/copy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1"
            >
              <ExternalLink className="h-4 w-4" />
              Use our template spreadsheet
            </a>
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
            className="bg-orange-500 hover:bg-orange-600"
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
