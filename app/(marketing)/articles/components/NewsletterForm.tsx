"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "article_page",
        }),
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
    } catch (error) {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 text-center">
      <h2 className="text-2xl font-medium mb-4 text-slate-900">
        Get more insights like this
      </h2>
      <p className="text-slate-600 mb-8">
        Join 10,000+ self-employed professionals getting weekly tips on taxes, investing, and building wealth.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
          className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <Button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Subscribe"}
        </Button>
      </form>
      {message && (
        <p className={`text-sm mt-4 ${status === "error" ? "text-red-600" : "text-emerald-600"}`}>
          {message}
        </p>
      )}
      <p className="text-xs text-slate-500 mt-4">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
