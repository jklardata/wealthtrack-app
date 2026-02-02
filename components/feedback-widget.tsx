"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, CheckCircle2 } from "lucide-react";

interface FeedbackWidgetProps {
  pageName: string;
  variant?: "floating" | "inline";
  triggerText?: string;
}

export function FeedbackWidget({
  pageName,
  variant = "floating",
  triggerText = "One question?"
}: FeedbackWidgetProps) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedback_text: feedback,
          page_or_tool_name: pageName,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFeedback("");
        setTimeout(() => {
          setOpen(false);
          setSubmitted(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const TriggerButton = variant === "floating" ? (
    <Button
      variant="outline"
      size="sm"
      className="fixed bottom-6 right-6 shadow-lg border-emerald-200 bg-white hover:bg-emerald-50 z-50"
    >
      <MessageSquare className="h-4 w-4 mr-2 text-emerald-600" />
      {triggerText}
    </Button>
  ) : (
    <Button variant="outline" size="sm" className="border-emerald-200">
      <MessageSquare className="h-4 w-4 mr-2 text-emerald-600" />
      {triggerText}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {TriggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-slate-900">
            Quick feedback
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            What decision are you trying to make right now that Solofi didn't fully answer?
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 mb-3" />
            <p className="text-slate-900 font-medium mb-1">
              Thanks — we read every one.
            </p>
            <p className="text-sm text-slate-500">
              This directly shapes what we build next.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Textarea
              placeholder="One sentence is perfect. Confusion, missing features, or 'I expected X' are all helpful."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!feedback.trim() || isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting ? "Sending..." : "Send feedback"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
