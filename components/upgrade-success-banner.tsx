"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";

export function UpgradeSuccessBanner() {
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get("success") === "true";
  const [showSuccessBanner, setShowSuccessBanner] = useState(showSuccess);

  if (!showSuccessBanner) return null;

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
        <div>
          <p className="font-medium text-emerald-900">Welcome to Pro!</p>
          <p className="text-sm text-emerald-700">Your subscription is now active. Enjoy full access to all premium features!</p>
        </div>
      </div>
      <button
        onClick={() => setShowSuccessBanner(false)}
        className="text-emerald-600 hover:text-emerald-700"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
