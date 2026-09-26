import React, { useState } from 'react';
import { Database, Table, HelpCircle, FileText, CheckCircle, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export default function NotionSheetsBlueprint() {
  const [activeTab, setActiveTab] = useState<'notion' | 'sheets'>('notion');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const notionBlueprints = [
    {
      title: "Database 1: 🌌 Horizon Goals DB",
      description: "Holds multi-generational family milestones, goal figures, and computes direct visually rendered progress gauges.",
      columns: [
        { name: "Goal Name", type: "Title", detail: "e.g. Kids University Fund" },
        { name: "Category", type: "Select", detail: "Legacy Fund, Education, Real Estate, Experiences" },
        { name: "Target Amount", type: "Number", detail: "Format as Currency ($)" },
        { name: "Current Amount", type: "Number", detail: "Format as Currency ($)" },
        { name: "Target Date", type: "Date", detail: "YYYY-MM" },
        { name: "Progress Gauge", type: "Formula", detail: "let(pct, prop(\"Current Amount\") / prop(\"Target Amount\"), repeat(\"◆\", clamp(round(pct * 10), 0, 10)) + repeat(\"◇\", clamp(10 - round(pct * 10), 0, 10)) + \" \" + round(clamp(pct * 100, 0, 100)) + \"%\")" }
      ]
    },
    {
      title: "Database 2: 🪙 Contribution & Allowance DB",
      description: "Logs discrete task entries with associated payouts, to be approved by parent relations.",
      columns: [
        { name: "Task/Chore", type: "Title", detail: "e.g. Read 1 Finance Book" },
        { name: "Assigned To", type: "Relation", detail: "Linked to 'Family Members DB'" },
        { name: "Value ($)", type: "Number", detail: "Format as Currency ($)" },
        { name: "Status", type: "Select", detail: "Pending, Completed, Approved" },
        { name: "Category", type: "Select", detail: "Learning & Growth, Family Contribution, Entrepreneurship" }
      ]
    },
    {
      title: "Database 3: 👥 Family Members DB",
      description: "Maintains member profiles (Kids/Parents) and aggregates verified allowance payouts directly via relation rollups.",
      columns: [
        { name: "Member Name", type: "Title", detail: "e.g. Leo, Sophia" },
        { name: "Role", type: "Select", detail: "Parent, Child" },
        { name: "Contributions", type: "Relation", detail: "Linked back to 'Contribution & Allowance DB' (Two-way relation)" },
        { name: "Accumulated Payout", type: "Rollup / Formula", detail: "Relation: Contributions | Property: Value | Calculate: Sum\nFormula 2.0 version: prop(\"Contributions\").filter(current.prop(\"Status\") == \"Approved\").map(current.prop(\"Value\")).sum()" }
      ]
    }
  ];

  const sheetsBlueprints = [
    {
      title: "Sheet 1: 🌌 Horizon Tracker Table",
      description: "Tracks multi-generational goals dynamically utilizing cell-based sparklines.",
      headers: ["Goal Name (Col A)", "Target Date (Col B)", "Current Amount (Col C)", "Target Amount (Col D)", "Percentage (Col E)", "In-Cell Sparkline (Col F)"],
      formula: "=C2/D2  (Formatted as %)",
      sparklineFormula: "=SPARKLINE(C2, {\"charttype\",\"bar\"; \"max\",D2; \"color1\",\"#00FFA3\"})",
      explain: "Displays an immediate, elegant color-filled progress bar straight inside the spreadsheet cell."
    },
    {
      title: "Sheet 2: 🪙 Contribution Ledger & SUMIFS",
      description: "A continuous ledger tracking child chores, completed statuses, and dynamically aggregated sibling pay calculations.",
      headers: ["Chore Name (Col A)", "Category (Col B)", "Value ($) (Col C)", "Assigned To (Col D)", "Status (Col E)"],
      ledgerFormula: "=SUMIFS(C:C, D:D, \"Leo\", E:E, \"Approved\")",
      explain: "Sum all chores in Column C where assigned member matches \"Leo\" in Column D and Status matches \"Approved\" in Column E. Duplicate this formula for Sophia, Maya, etc."
    },
    {
      title: "Sheet 3: 📈 Generational Compounding Calc (FV)",
      description: "Standard model mapping expected compound interest projections using the native financial Future Value Excel/Sheets function.",
      headers: ["Initial Capital (Col A)", "Monthly Deposit (Col B)", "Annual Yield % (Col C)", "Horizon Years (Col D)", "Future Portfolio Value (Col E)"],
      fvFormula: "=FV(C2/12, D2*12, -B2, -A2)",
      explain: "Uses native FV logic compounding monthly: Interest compound portion (C2/12), number of periods (D2*12), standard payment monthly (-B2), and initial offset (-A2)."
    }
  ];

  return (
    <div id="notion-sheets-blueprint-container" className="rounded-2xl border border-[#EBE8E4] bg-white p-8 shadow-sm text-[#2D2D2D]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 border-b border-[#EBE8E4] pb-6">
        <div>
          <h2 className="text-xl font-light tracking-tight text-[#1A1A1A] flex items-center gap-2">
            <Database className="w-5 h-5 text-[#8A9A5B]" />
            <span>Notion & Sheets Blueprint</span>
          </h2>
          <p className="text-xs text-[#8C8C8C] mt-1 max-w-xl">
            Copy-pasteable schemas, exact column types, database properties, and formulas to build these tables in your personal tools.
          </p>
        </div>

        {/* Tab Selection buttons */}
        <div className="flex bg-[#F7F5F2] border border-[#EBE8E4] p-1 rounded-xl self-end sm:self-center">
          <button
            id="tab-notion"
            onClick={() => setActiveTab('notion')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${activeTab === 'notion' ? 'bg-[#8A9A5B] text-white shadow-sm' : 'text-[#8C8C8C] hover:text-[#2D2D2D]'}`}
          >
            Notion Setup
          </button>
          <button
            id="tab-sheets"
            onClick={() => setActiveTab('sheets')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${activeTab === 'sheets' ? 'bg-[#8A9A5B] text-white shadow-sm' : 'text-[#8C8C8C] hover:text-[#2D2D2D]'}`}
          >
            Sheets Setup
          </button>
        </div>
      </div>

      {activeTab === 'notion' ? (
        <div className="space-y-6">
          {notionBlueprints.map((db, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-[#FDFCFB] border border-[#EBE8E4]">
              <div className="mb-4">
                <h3 className="text-xs font-bold text-[#1A1A1A] font-mono uppercase tracking-wide flex items-center gap-2">
                  <span>{db.title}</span>
                </h3>
                <p className="text-xs text-[#8C8C8C] mt-1">
                  {db.description}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EBE8E4] text-[#8C8C8C] font-mono text-[9px] uppercase">
                      <th className="pb-2">Property Name</th>
                      <th className="pb-2">Notion Type</th>
                      <th className="pb-2">Config Spec / Value Guide</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBE8E4]/50">
                    {db.columns.map((col, cIdx) => (
                      <tr key={cIdx} className="hover:bg-white/[0.2]">
                        <td className="py-2.5 font-mono text-[#8A9A5B] font-medium">{col.name}</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded bg-[#8A9A5B]/10 text-[#8A9A5B] border border-[#8A9A5B]/10 font-mono text-[9px]">
                            {col.type}
                          </span>
                        </td>
                        <td className="py-2.5 text-[#2D2D2D] font-mono text-[10px] leading-relaxed break-all max-w-sm sm:max-w-md">
                          {col.detail}
                          {col.type === "Formula" && (
                            <button
                              onClick={() => handleCopy(col.detail, `not_form_${idx}_${cIdx}`)}
                              className="ml-2 inline-flex items-center gap-1 text-[9px] text-[#8A9A5B] hover:text-[#7a8a4f] transition cursor-pointer"
                              title="Copy Formula Syntax"
                            >
                              {copiedText === `not_form_${idx}_${cIdx}` ? <Check className="w-3 h-3 text-[#8A9A5B]" /> : <Copy className="w-3 h-3" />}
                              <span>Copy Code</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Relation Walkthrough and parent instructions */}
          <div className="p-5 rounded-xl bg-[#8A9A5B]/5 border border-[#8A9A5B]/15 flex gap-4 text-[#2D2D2D]">
            <div className="p-2 bg-[#8A9A5B]/10 text-[#8A9A5B] rounded-lg h-fit">
              <Table className="w-5 h-5 animate-bounce-slow" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1A1A1A]">How Parents Map Notion Relations:</h4>
              <ul className="text-xs text-[#8C8C8C] list-disc pl-4 mt-2 space-y-1.5 leading-relaxed">
                <li>Create the <strong className="text-[#2D2D2D]">Family Members DB</strong> and the <strong className="text-[#2D2D2D]">Contribution Ledger DB</strong> as separate databases.</li>
                <li>In either database, add a new property, select <strong className="text-[#8A9A5B]">Relation</strong>, and choose the other database. Enable the toggle to show relations on both databases.</li>
                <li>When a child completes a chore entry, select their name in their relation column.</li>
                <li>In your Members DB, the Payout Rollup automatically calculates their balance using the Formula 2.0 filter code above.</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {sheetsBlueprints.map((sheet, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-[#FDFCFB] border border-[#EBE8E4]">
              <div className="mb-4">
                <h3 className="text-xs font-bold text-[#1A1A1A] font-mono uppercase tracking-wide">
                  {sheet.title}
                </h3>
                <p className="text-xs text-[#8C8C8C] mt-1">
                  {sheet.description}
                </p>
              </div>

              {/* Header mappings */}
              <div className="mb-3">
                <div className="text-[9px] uppercase font-mono text-[#8C8C8C] mb-1.5">Column Layout Order</div>
                <div className="flex flex-wrap gap-2">
                  {sheet.headers.map((h, hIdx) => (
                    <span key={hIdx} className="px-2.5 py-1 rounded-lg bg-[#F7F5F2] border border-[#EBE8E4] text-[10px] font-mono text-[#8A9A5B]">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Exact Formula details */}
              <div className="space-y-3 mt-4">
                {sheet.formula && (
                  <div className="p-3 bg-white border border-[#EBE8E4] rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-mono text-[#8C8C8C] uppercase">Math Formula (E2)</span>
                      <button
                        onClick={() => handleCopy(sheet.formula!, `sh_f1_${idx}`)}
                        className="text-[#8C8C8C] hover:text-[#2D2D2D] flex items-center gap-1 text-[9px] transition cursor-pointer"
                      >
                        {copiedText === `sh_f1_${idx}` ? <Check className="w-3.5 h-3.5 text-[#8A9A5B]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <code className="text-xs font-mono text-[#8A9A5B] block select-all">{sheet.formula}</code>
                  </div>
                )}

                {sheet.sparklineFormula && (
                  <div className="p-3 bg-white border border-[#EBE8E4] rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-mono text-[#8C8C8C] uppercase">Sparkline Progress Bar (F2)</span>
                      <button
                        onClick={() => handleCopy(sheet.sparklineFormula!, `sh_spark_${idx}`)}
                        className="text-[#8C8C8C] hover:text-[#2D2D2D] flex items-center gap-1 text-[9px] transition cursor-pointer"
                      >
                        {copiedText === `sh_spark_${idx}` ? <Check className="w-3.5 h-3.5 text-[#8A9A5B]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <code className="text-xs font-mono text-[#8A9A5B] block select-all">{sheet.sparklineFormula}</code>
                  </div>
                )}

                {sheet.ledgerFormula && (
                  <div className="p-3 bg-white border border-[#EBE8E4] rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-mono text-[#8C8C8C] uppercase">Rolling Sum Formula</span>
                      <button
                        onClick={() => handleCopy(sheet.ledgerFormula!, `sh_ledg_${idx}`)}
                        className="text-[#8C8C8C] hover:text-[#2D2D2D] flex items-center gap-1 text-[9px] transition cursor-pointer"
                      >
                        {copiedText === `sh_ledg_${idx}` ? <Check className="w-3.5 h-3.5 text-[#8A9A5B]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <code className="text-xs font-mono text-[#8A9A5B] block select-all">{sheet.ledgerFormula}</code>
                  </div>
                )}

                {sheet.fvFormula && (
                  <div className="p-3 bg-white border border-[#EBE8E4] rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-mono text-[#8C8C8C] uppercase">Compound Interest Formula (E2)</span>
                      <button
                        onClick={() => handleCopy(sheet.fvFormula!, `sh_fv_${idx}`)}
                        className="text-[#8C8C8C] hover:text-[#2D2D2D] flex items-center gap-1 text-[9px] transition cursor-pointer"
                      >
                        {copiedText === `sh_fv_${idx}` ? <Check className="w-3.5 h-3.5 text-[#8A9A5B]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <code className="text-xs font-mono text-[#8A9A5B] block select-all">{sheet.fvFormula}</code>
                  </div>
                )}

                <p className="text-[10px] italic text-[#8C8C8C] pl-1 font-mono leading-relaxed mt-2 select-none">
                  💡 {sheet.explain}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
