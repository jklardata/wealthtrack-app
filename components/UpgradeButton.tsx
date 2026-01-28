"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface UpgradeButtonProps {
  priceId: string;
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
}

export function UpgradeButton({
  priceId,
  children,
  variant = "default",
  className,
  disabled = false,
}: UpgradeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    console.log("Upgrade clicked, priceId:", priceId);

    if (!priceId) {
      console.error("No priceId provided");
      alert("Error: No price ID. Please refresh the page.");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Fetching checkout session...");

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (data.url) {
        console.log("Redirecting to:", data.url);
        window.location.href = data.url;
      } else {
        console.error("Failed to create checkout session:", data.error);
        alert("Error: " + (data.error || "Failed to create checkout session"));
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Error: " + (error instanceof Error ? error.message : "Unknown error"));
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleUpgrade}
      disabled={isLoading || disabled}
      variant={variant}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
