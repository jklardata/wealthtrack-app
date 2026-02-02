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
    <Card className="bg-white border-2 border-slate-200 relative overflow-hidden">
      {/* Locked overlay */}
      <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-3">
            <Lock className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="font-medium text-slate-900 mb-2">Pro Feature</h3>
          <p className="text-sm text-slate-600 mb-4 max-w-xs">
            Upgrade to unlock this module
          </p>
          <Link href="/upgrade">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              <Sparkles className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
          </Link>
        </div>
      </div>

      {/* Preview content (blurred) */}
      <CardHeader className="opacity-40">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="opacity-40">
        <div className="space-y-3">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="h-4 bg-slate-200 rounded w-3/4"></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
