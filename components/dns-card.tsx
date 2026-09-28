"use client";
import { Check, ChevronRight, Copy } from "lucide-react";
import { useState } from "react";

interface DNSCardProps {
  label: string;
  description: string;
  recordsValue: string[];
  type: string;
  tone?: "orange" | "violet" | "blue" | "green" | "red";
}

export default function DNSCard({
  label,
  description,
  recordsValue,
  type,
  tone = "orange",
}: DNSCardProps) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copyValue(value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    window.setTimeout(() => setCopied(null), 1400);
  }
  return (
    <section className="rounded-2xl border border-[#e3e6ea] bg-white p-5 shadow-[0_3px_16px_rgba(29,36,49,0.025)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex size-9 items-center justify-center rounded-xl text-xs font-bold ${tone === "orange" ? "bg-[#fff0dc] text-[#d57410]" : tone === "violet" ? "bg-[#f0ebff] text-[#7251d6]" : tone === "blue" ? "bg-[#e5f2ff] text-[#317dba]" : tone === "green" ? "bg-[#e6f8ed] text-[#2e9260]" : "bg-[#ffebf1] text-[#c74b75]"}`}
          >
            {type}
          </span>
          <div>
            <h3 className="text-sm font-semibold">{label}</h3>
            <p className="mt-0.5 text-xs text-[#9298a1]">{description}</p>
          </div>
        </div>
        <span className="rounded-full bg-[#f4f5f6] px-2 py-1 text-[11px] font-medium text-[#8a9099]">
          {recordsValue.length}{" "}
          {recordsValue.length === 1 ? "record" : "records"}
        </span>
      </div>
      {recordsValue.length ? (
        <div className="mt-5 flex flex-col gap-2">
          {recordsValue.map((record, index) => (
            <div
              key={`${record}-${index}`}
              className="group/row flex items-center justify-between gap-3 rounded-xl border border-[#eceef1] bg-[#fbfcfc] px-3.5 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {/*{record.priority !== undefined && (
                    <span className="shrink-0 font-mono text-[11px] text-[#979da6]">
                      {record.priority}
                    </span>
                  )}*/}
                  <span className="truncate font-mono text-[13px] text-[#343941]">
                    {record ? record : "Got empty string"}
                  </span>
                </div>
                {/*<span className="mt-1 block font-mono text-[10px] text-[#a5aab2]">
                  TTL {record.ttl.toLocaleString()}s
                </span>*/}
              </div>
              <button
                aria-label={`Copy ${record}`}
                onClick={() => copyValue(record)}
                className="shrink-0 rounded-lg p-2 text-[#adb2b9] opacity-0 transition hover:bg-white hover:text-[#5c6470] group-hover/row:opacity-100 focus:opacity-100"
                type="button"
              >
                {copied === record ? (
                  <Check className="size-4 text-[#39a267]" />
                ) : (
                  <Copy className="size-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-dashed border-[#e4e7ea] px-3.5 py-4 text-xs text-[#a0a5ad]">
          No records found for this type{" "}
          <ChevronRight className="ml-auto size-3.5" />
        </div>
      )}
    </section>
  );
}
