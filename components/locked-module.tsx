"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface LockedModuleProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  benefits?: string[];
}

export function LockedModule({
  title,
  description,
  icon,
  benefits = ["Detailed analysis", "Advanced calculations", "Personalized recommendations"]
}: LockedModuleProps) {
  return (
    <Card className="bg-slate-50 border-2 border-slate-300 relative overflow-hidden">
      {/* Module header - visible and greyed out */}
      <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="opacity-50">{icon}</div>
            <CardTitle className="text-slate-500">{title}</CardTitle>
          </div>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
            Pro
          </span>
        </div>
        {description && <CardDescription className="text-slate-400 mt-1">{description}</CardDescription>}
      </CardHeader>

      {/* Content area with lock overlay */}
      <CardContent className="relative min-h-[200px]">
        {/* Preview content (blurred background) */}
        <div className="opacity-30 space-y-3 py-4">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-slate-300"></div>
              <div className="h-3 bg-slate-300 rounded flex-1"></div>
            </div>
          ))}
        </div>

        {/* Centered upgrade CTA */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6 bg-white/95 rounded-lg shadow-lg border-2 border-slate-200">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-3">
              <Lock className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-2">Pro Feature</h3>
            <p className="text-sm text-slate-600 mb-4 max-w-xs">
              Upgrade to unlock {title.toLowerCase()}
            </p>
            <Link href="/pricing">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
