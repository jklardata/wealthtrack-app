"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Circle,
  Printer,
  Building2,
  Landmark,
  Receipt,
  PiggyBank,
  Shield,
  FileSignature,
  Calendar,
  AlertCircle,
  ClipboardList,
  CloudIcon,
  CheckCheck,
} from "lucide-react";

interface ChecklistItem {
  task: string;
  details: string;
  priority: "high" | "medium" | "low";
}

interface ChecklistSection {
  title: string;
  icon: React.ReactNode;
  description: string;
  items: ChecklistItem[];
}

const CHECKLIST_SECTIONS: ChecklistSection[] = [
  {
    title: "Business Structure",
    icon: <Building2 className="h-5 w-5" />,
    description: "Set up your business legally",
    items: [
      { task: "Choose your business structure", details: "Sole proprietorship is simplest to start. Consider LLC for liability protection ($50–500 depending on state).", priority: "high" },
      { task: "Register your business name", details: "File a DBA (Doing Business As) if using a name other than your own. Check your state's requirements.", priority: "medium" },
      { task: "Get an EIN from the IRS", details: "Free at irs.gov. Takes 5 minutes. You'll need this for business banking and taxes.", priority: "high" },
      { task: "Check local business licenses", details: "Some cities/counties require business licenses. Check with your local clerk's office.", priority: "medium" },
    ],
  },
  {
    title: "Banking & Finances",
    icon: <Landmark className="h-5 w-5" />,
    description: "Separate business and personal",
    items: [
      { task: "Open a business checking account", details: "Keep business income separate from personal. Many banks offer free business checking.", priority: "high" },
      { task: "Get a business credit card", details: "Build business credit and earn rewards. Keep business expenses separate.", priority: "medium" },
      { task: "Set up an accounting system", details: "Use QuickBooks Self-Employed, Wave (free), or a simple spreadsheet. Track from day one.", priority: "high" },
      { task: "Create an invoice template", details: "Include your business name, EIN, payment terms, and accepted payment methods.", priority: "high" },
    ],
  },
  {
    title: "Tax Setup",
    icon: <Receipt className="h-5 w-5" />,
    description: "Avoid surprises at tax time",
    items: [
      { task: "Understand self-employment tax", details: "You'll pay 15.3% SE tax on top of income tax. Budget 25–35% of income for taxes.", priority: "high" },
      { task: "Set up quarterly estimated taxes", details: "Due dates: April 15, June 15, Sept 15, Jan 15. Use IRS Form 1040-ES.", priority: "high" },
      { task: "Create a tax savings account", details: "Transfer 25–35% of each payment to a separate savings account for taxes.", priority: "high" },
      { task: "Track deductible expenses", details: "Home office, equipment, software, travel, meals (50%), health insurance, education.", priority: "high" },
      { task: "Learn about QBI deduction", details: "You may be able to deduct 20% of business income. Huge tax saver.", priority: "medium" },
    ],
  },
  {
    title: "Retirement Accounts",
    icon: <PiggyBank className="h-5 w-5" />,
    description: "Start saving tax-advantaged",
    items: [
      { task: "Open a Solo 401(k) or SEP IRA", details: "Solo 401(k) allows up to $69K/year contributions. SEP IRA is simpler but less flexible.", priority: "medium" },
      { task: "Set up automatic contributions", details: "Even $500/month adds up. Contributions reduce your taxable income.", priority: "medium" },
      { task: "Consider a Roth IRA", details: "$7,000/year limit. Grows tax-free. Good if you expect higher taxes later.", priority: "low" },
      { task: "Open an HSA if eligible", details: "Triple tax-advantaged. $4,300/year (individual). Requires high-deductible health plan.", priority: "medium" },
    ],
  },
  {
    title: "Insurance",
    icon: <Shield className="h-5 w-5" />,
    description: "Protect yourself and your business",
    items: [
      { task: "Get health insurance", details: "Healthcare.gov marketplace, spouse's plan, or professional association plans. Premiums are tax-deductible.", priority: "high" },
      { task: "Consider liability insurance", details: "Professional liability (E&O) protects against client claims. ~$500–1,500/year for most.", priority: "medium" },
      { task: "Review disability insurance", details: "Your income depends on your ability to work. Consider short and long-term disability.", priority: "low" },
      { task: "Life insurance if you have dependents", details: "Term life is affordable. 10–12x your income is a common recommendation.", priority: "low" },
    ],
  },
  {
    title: "Contracts & Legal",
    icon: <FileSignature className="h-5 w-5" />,
    description: "Protect your work and get paid",
    items: [
      { task: "Create a standard contract template", details: "Include scope, timeline, payment terms, revision limits, ownership/IP rights, cancellation policy.", priority: "high" },
      { task: "Define your payment terms", details: "50% upfront is common. Net 15 or Net 30 for ongoing clients. Late fees for overdue invoices.", priority: "high" },
      { task: "Set up a payment system", details: "Stripe, PayPal, or bank transfers. Make it easy for clients to pay you.", priority: "high" },
      { task: "Consider an LLC operating agreement", details: "Even single-member LLCs should have one. Documents your business structure.", priority: "low" },
    ],
  },
  {
    title: "First 90 Days",
    icon: <Calendar className="h-5 w-5" />,
    description: "Build momentum",
    items: [
      { task: "Calculate your minimum viable income", details: "What's the minimum you need monthly to cover expenses? This is your first target.", priority: "high" },
      { task: "Set your rates", details: "Research market rates. Start with hourly, consider moving to project-based. Don't undercharge.", priority: "high" },
      { task: "Build an emergency fund", details: "3–6 months of expenses. Income will be irregular—prepare for it.", priority: "medium" },
      { task: "Track your net worth monthly", details: "Monitor your financial progress. Adjust spending and rates as needed.", priority: "medium" },
      { task: "Network and market yourself", details: "LinkedIn, referrals, content marketing. Consistent visibility = consistent leads.", priority: "medium" },
    ],
  },
];

const TOTAL_ITEMS = CHECKLIST_SECTIONS.reduce((sum, s) => sum + s.items.length, 0);

export default function FreelanceChecklistPage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [loading, setLoading] = useState(true);

  // Load saved progress on mount
  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch("/api/checklist");
        const data = await res.json();
        if (Array.isArray(data.data)) {
          setCheckedItems(new Set(data.data));
        }
      } catch (e) {
        console.error("Failed to load checklist progress:", e);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, []);

  // Debounced save to server
  const saveProgress = useCallback(async (items: Set<string>) => {
    setSaveStatus("saving");
    try {
      await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkedItems: Array.from(items) }),
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (e) {
      console.error("Failed to save checklist:", e);
      setSaveStatus("idle");
    }
  }, []);

  const toggleItem = (sectionTitle: string, task: string) => {
    const key = `${sectionTitle}-${task}`;
    const newChecked = new Set(checkedItems);
    if (newChecked.has(key)) {
      newChecked.delete(key);
    } else {
      newChecked.add(key);
    }
    setCheckedItems(newChecked);
    saveProgress(newChecked);
  };

  const completedItems = checkedItems.size;
  const progressPct = Math.round((completedItems / TOTAL_ITEMS) * 100);

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-emerald-600" />
            First-Year Freelancer Financial Checklist
          </h1>
          <p className="text-base text-slate-500 mt-1">
            30+ tasks to set up your finances when going self-employed. Progress saves automatically.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === "saving" && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <CloudIcon className="h-3 w-3 animate-pulse" /> Saving...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-xs text-emerald-600 flex items-center gap-1">
              <CheckCheck className="h-3 w-3" /> Saved
            </span>
          )}
          <Button variant="outline" size="sm" onClick={() => window.print()} className="print:hidden">
            <Printer className="h-4 w-4 mr-2" />
            Print / PDF
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="bg-white border border-slate-200">
        <CardContent className="py-4">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span className="font-medium">Overall Progress</span>
            <span className={completedItems === TOTAL_ITEMS ? "text-emerald-600 font-semibold" : ""}>
              {completedItems} of {TOTAL_ITEMS} complete
              {completedItems === TOTAL_ITEMS && " 🎉"}
            </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-400">{progressPct}% complete</span>
            <span className="text-xs text-slate-400">
              {CHECKLIST_SECTIONS.length} categories
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Section summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 print:hidden">
        {CHECKLIST_SECTIONS.map((section) => {
          const done = section.items.filter(i => checkedItems.has(`${section.title}-${i.task}`)).length;
          const all = section.items.length;
          const pct = Math.round((done / all) * 100);
          return (
            <div key={section.title} className="bg-white border border-slate-200 rounded-lg p-2 text-center">
              <div className="text-emerald-600 flex justify-center mb-1">{section.icon}</div>
              <p className="text-xs font-medium text-slate-700 leading-tight mb-1">{section.title}</p>
              <p className="text-xs text-slate-400">{done}/{all}</p>
              <div className="h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Checklist Sections */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading your progress...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-1 print:gap-4">
          {CHECKLIST_SECTIONS.map((section) => {
            const sectionDone = section.items.filter(i => checkedItems.has(`${section.title}-${i.task}`)).length;
            return (
              <Card key={section.title} className="bg-white border border-slate-200 shadow-sm print:shadow-none">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        {section.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-900">{section.title}</CardTitle>
                        <p className="text-sm text-slate-500 mt-0.5">{section.description}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      sectionDone === section.items.length
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {sectionDone}/{section.items.length}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {section.items.map((item) => {
                    const key = `${section.title}-${item.task}`;
                    const isChecked = checkedItems.has(key);
                    return (
                      <div
                        key={item.task}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-150 print:cursor-default ${
                          isChecked
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30"
                        }`}
                        onClick={() => toggleItem(section.title, item.task)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex-shrink-0 print:hidden">
                            {isChecked ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-slate-300" />
                            )}
                          </div>
                          <div className="hidden print:block mt-0.5 flex-shrink-0">
                            <div className="w-4 h-4 border-2 border-slate-400 rounded" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`font-medium text-base ${isChecked ? "line-through text-slate-400" : "text-slate-900"}`}>
                                {item.task}
                              </p>
                              {item.priority === "high" && !isChecked && (
                                <span className="text-xs bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.5 rounded font-medium">
                                  Important
                                </span>
                              )}
                            </div>
                            <p className={`text-sm mt-1 leading-relaxed ${isChecked ? "text-slate-400" : "text-slate-500"}`}>
                              {item.details}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      <Card className="border-amber-200 bg-amber-50 print:bg-amber-50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900 text-base">Important Note</p>
              <p className="text-sm text-amber-800 mt-1">
                This checklist provides general guidance. Tax laws and requirements vary by state and situation.
                Consult with a CPA or tax professional for advice specific to your circumstances.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
        }
      `}</style>
    </div>
  );
}
