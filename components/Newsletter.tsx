"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Successfully subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="mt-12 mb-8 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-100 dark:border-blue-900">
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium mb-3">
        <Mail className="w-4 h-4" />
        Join the SoloFI Insider List
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
        Early access + tax optimization insights
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Get notified about new features, tax strategies, and financial independence tips.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-50 text-sm whitespace-nowrap"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {message && (
        <p className={`mt-3 text-sm ${status === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
          {message}
        </p>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
        We respect your inbox. No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
