"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, AlertCircle, Loader2 } from "lucide-react";

interface EmailCaptureCardProps {
  toolName: string;
  resultsSummary?: string;
  className?: string;
}

export function EmailCaptureCard({
  toolName,
  resultsSummary,
  className = ""
}: EmailCaptureCardProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus("error");
      setMessage("Please enter your email");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: `tool-${toolName}`,
          metadata: {
            tool: toolName,
            results: resultsSummary,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Check your email! We sent your results.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to subscribe. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <Card className={`bg-green-50 border-2 border-green-400 ${className}`}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-500 rounded-full">
              <Check className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-green-900 mb-1">
                Success! Check your inbox.
              </h3>
              <p className="text-sm text-green-800">
                We sent your {toolName} results to <strong>{email}</strong>
              </p>
              <p className="text-xs text-green-700 mt-2">
                You'll also get weekly tax tips for self-employed professionals. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-emerald-50 border-2 border-emerald-400 ${className}`}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
              💾 Save These Results
            </h3>
            <p className="text-sm text-slate-700">
              Get your personalized {toolName.toLowerCase()} report emailed to you + weekly tax tips for self-employed professionals.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={status === "loading"}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Email Me"
                )}
              </Button>
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {message}
              </div>
            )}

            <p className="text-xs text-slate-500">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
