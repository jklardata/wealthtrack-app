"use client";

import { useState, useEffect } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { LockedModule } from "@/components/locked-module";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IncomeSourcesForm } from "../lifetime-income/components/IncomeSourcesForm";
import { ExpensesForm } from "../lifetime-income/components/ExpensesForm";
import { User, DollarSign, Calendar, Save } from "lucide-react";
import type { UserSettings } from "@/lib/types";

export default function ProfilePage() {
  const { isPro, isLoading: subLoading } = useSubscription();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [currentAge, setCurrentAge] = useState("");
  const [desiredRetirementAge, setDesiredRetirementAge] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Fetch user settings
  useEffect(() => {
    if (isPro) {
      fetchSettings();
    }
  }, [isPro]);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (response.ok && data.data) {
        setSettings(data.data);
        setCurrentAge(data.data.current_age?.toString() || "");
        setDesiredRetirementAge(data.data.desired_retirement_age?.toString() || "");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_age: currentAge ? parseInt(currentAge) : null,
          desired_retirement_age: desiredRetirementAge ? parseInt(desiredRetirementAge) : null,
        }),
      });

      if (response.ok) {
        setSaveMessage("Settings saved successfully!");
        setTimeout(() => setSaveMessage(""), 3000);
        fetchSettings();
      } else {
        setSaveMessage("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveMessage("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (subLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!isPro) {
    return (
      <LockedModule
        title="Profile & Financial Planning"
        description="Configure your income sources and expenses for lifetime projections"
        icon={<User className="h-5 w-5 text-emerald-600" />}
        benefits={[
          "Track multiple income sources",
          "Manage expense categories",
          "Configure financial assumptions",
          "Used for Net Worth Projected calculations"
        ]}
      />
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User className="h-8 w-8 text-emerald-600" />
          Profile
        </h1>
        <p className="text-slate-600 mt-2">
          Manage your personal information and financial projections settings
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-600" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Set your age and retirement goals. These will auto-populate in planning tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current_age">Age</Label>
              <Input
                id="current_age"
                type="number"
                placeholder="35"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">Used in Net Worth Projected</p>
            </div>
            <div>
              <Label htmlFor="desired_retirement_age">Desired Retirement Age</Label>
              <Input
                id="desired_retirement_age"
                type="number"
                placeholder="65"
                value={desiredRetirementAge}
                onChange={(e) => setDesiredRetirementAge(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">Used in Early Retirement calculator</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
            {saveMessage && (
              <span className={`text-sm ${saveMessage.includes("success") ? "text-emerald-600" : "text-red-600"}`}>
                {saveMessage}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Income & Expenses Forms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            Income & Expenses
          </CardTitle>
          <CardDescription>
            Configure your income sources and expense categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="income" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="income">Income Sources</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>
            <TabsContent value="income" className="mt-4">
              <IncomeSourcesForm />
            </TabsContent>
            <TabsContent value="expenses" className="mt-4">
              <ExpensesForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
