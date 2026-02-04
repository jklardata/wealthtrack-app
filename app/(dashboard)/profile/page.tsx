"use client";

import { useState, useEffect } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { LockedModule } from "@/components/locked-module";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IncomeSourcesForm } from "../lifetime-income/components/IncomeSourcesForm";
import { ExpensesForm } from "../lifetime-income/components/ExpensesForm";
import { User, DollarSign, TrendingUp } from "lucide-react";

export default function ProfilePage() {
  const { isPro, isLoading: subLoading } = useSubscription();

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
          Manage your income sources and expenses for financial projections
        </p>
      </div>

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
