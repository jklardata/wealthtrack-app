"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IncomeSourcesForm } from "../lifetime-income/components/IncomeSourcesForm";
import { ExpensesForm } from "../lifetime-income/components/ExpensesForm";
import { User, DollarSign, Calendar, Save, Briefcase, Shield, Users } from "lucide-react";
import type { UserSettings, MaritalStatus, TaxFilingStatus, RiskTolerance } from "@/lib/types";
import {
  MARITAL_STATUS_OPTIONS,
  TAX_FILING_STATUS_OPTIONS,
  RISK_TOLERANCE_OPTIONS,
  US_STATES
} from "@/lib/profile-constants";

export default function ProfilePage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [currentAge, setCurrentAge] = useState("");
  const [desiredRetirementAge, setDesiredRetirementAge] = useState("");

  // New personal information fields
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus | "">("");
  const [numberOfDependents, setNumberOfDependents] = useState("");
  const [stateOfResidence, setStateOfResidence] = useState("");
  const [taxFilingStatus, setTaxFilingStatus] = useState<TaxFilingStatus | "">("");
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance | "">("");
  const [lifeExpectancy, setLifeExpectancy] = useState("95");
  const [employerName, setEmployerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user settings
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (response.ok && data.data) {
        setSettings(data.data);
        setCurrentAge(data.data.current_age?.toString() || "");
        setDesiredRetirementAge(data.data.desired_retirement_age?.toString() || "");
        // New fields
        setFullName(data.data.full_name || "");
        setDateOfBirth(data.data.date_of_birth || "");
        setMaritalStatus(data.data.marital_status || "");
        setNumberOfDependents(data.data.number_of_dependents?.toString() || "");
        setStateOfResidence(data.data.state_of_residence || "");
        setTaxFilingStatus(data.data.tax_filing_status || "");
        setRiskTolerance(data.data.risk_tolerance || "");
        setLifeExpectancy(data.data.life_expectancy_assumption?.toString() || "95");
        setEmployerName(data.data.employer_name || "");
        setPhoneNumber(data.data.phone_number || "");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
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
          // New fields
          full_name: fullName || null,
          date_of_birth: dateOfBirth || null,
          marital_status: maritalStatus || null,
          number_of_dependents: numberOfDependents ? parseInt(numberOfDependents) : null,
          state_of_residence: stateOfResidence || null,
          tax_filing_status: taxFilingStatus || null,
          risk_tolerance: riskTolerance || null,
          life_expectancy_assumption: lifeExpectancy ? parseInt(lifeExpectancy) : null,
          employer_name: employerName || null,
          phone_number: phoneNumber || null,
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

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-black flex items-center gap-3">
          <User className="h-10 w-10 text-emerald-600" />
          Profile
        </h1>
        <p className="text-lg font-semibold text-slate-700 mt-2">
          Manage your personal information and financial projections settings
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-600" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Your personal details help personalize financial planning across all tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_age">Current Age (years)</Label>
                <Input
                  id="current_age"
                  type="number"
                  placeholder="35"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marital_status">Marital Status</Label>
                <Select value={maritalStatus} onValueChange={(v) => setMaritalStatus(v as MaritalStatus)}>
                  <SelectTrigger id="marital_status">
                    <SelectValue placeholder="Select status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MARITAL_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="number_of_dependents">Number of Dependents</Label>
                <Input
                  id="number_of_dependents"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={numberOfDependents}
                  onChange={(e) => setNumberOfDependents(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state_of_residence">State of Residence</Label>
                <Select value={stateOfResidence} onValueChange={setStateOfResidence}>
                  <SelectTrigger id="state_of_residence">
                    <SelectValue placeholder="Select state..." />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employer_name">Employer Name</Label>
                <Input
                  id="employer_name"
                  placeholder="Company Name"
                  value={employerName}
                  onChange={(e) => setEmployerName(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Financial Planning */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Retirement Planning
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
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
              <div className="space-y-2">
                <Label htmlFor="life_expectancy">Life Expectancy Assumption</Label>
                <Input
                  id="life_expectancy"
                  type="number"
                  placeholder="95"
                  value={lifeExpectancy}
                  onChange={(e) => setLifeExpectancy(e.target.value)}
                />
                <p className="text-xs text-slate-500 mt-1">For retirement projections</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="risk_tolerance">Risk Tolerance</Label>
                <Select value={riskTolerance} onValueChange={(v) => setRiskTolerance(v as RiskTolerance)}>
                  <SelectTrigger id="risk_tolerance">
                    <SelectValue placeholder="Select tolerance..." />
                  </SelectTrigger>
                  <SelectContent>
                    {RISK_TOLERANCE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1">Used in Portfolio Optimizer</p>
              </div>
            </div>
          </div>

          {/* Tax Information */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Tax Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tax_filing_status">Tax Filing Status</Label>
                <Select value={taxFilingStatus} onValueChange={(v) => setTaxFilingStatus(v as TaxFilingStatus)}>
                  <SelectTrigger id="tax_filing_status">
                    <SelectValue placeholder="Select status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TAX_FILING_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1">Used in Tax calculators</p>
              </div>
            </div>
          </div>

            {/* Save Button */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save All Settings"}
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
    </div>
  );
}
