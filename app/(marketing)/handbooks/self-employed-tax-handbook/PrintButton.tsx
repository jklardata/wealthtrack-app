"use client";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrintButton() {
  return (
    <Button
      onClick={() => window.print()}
      className="gap-2 bg-[#1a3328] hover:bg-[#122620] text-white border-0 print:hidden"
    >
      <Download className="h-4 w-4" />
      Download PDF
    </Button>
  );
}
