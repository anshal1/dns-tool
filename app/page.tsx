"use client";
import React, { useEffect, useState } from "react";
import { dnsLookup } from "./server/dns";
import dns from "node:dns";
import {
  ArrowUpRight,
  CircleHelp,
  Globe2,
  Loader,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import DNSCard from "@/components/dns-card";

export default function Home() {
  const [aRecords, setARecords] = useState<string[]>([]);
  const [aaaRecords, setAAARecords] = useState<string[]>([]);
  const [cnameRecords, setCnameRecords] = useState<string[]>([]);
  const [mxRecords, setMxRecords] = useState<dns.MxRecord[]>([]);
  const [nsRecords, setNsRecords] = useState<string[]>([]);
  const [txtRecords, setTxtRecords] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState("example.com");
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const domain = formData.get("domain") as string;
    if (!domain) return alert("Domain is required");
    setLoading(true);
    setDomain(domain);
    const errors: string[] = [];
    setErrors(errors);
    const results = await Promise.allSettled([
      dnsLookup<string[]>(domain, "A"),
      dnsLookup<string[]>(domain, "AAAA"),
      dnsLookup<string[]>(domain, "CNAME"),
      dnsLookup<dns.MxRecord[]>(domain, "MX"),
      dnsLookup<string[]>(domain, "NS"),
      dnsLookup<string[][]>(domain, "TXT"),
    ]);

    const [a, aaa, cname, mx, ns, txt] = results;

    if (a.status === "fulfilled") setARecords(a.value);
    else errors.push("A: " + a.reason);

    if (aaa.status === "fulfilled") setAAARecords(aaa.value);
    else errors.push("AAAA: " + aaa.reason);

    if (cname.status === "fulfilled") setCnameRecords(cname.value);
    else errors.push("CNAME: " + cname.reason);

    if (mx.status === "fulfilled") setMxRecords(mx.value);
    else errors.push("MX: " + mx.reason);

    if (ns.status === "fulfilled") setNsRecords(ns.value);
    else errors.push("NS: " + ns.reason);

    if (txt.status === "fulfilled") setTxtRecords(txt.value);
    else errors.push("TXT: " + txt.reason);
    setErrors(errors);
    setLoading(false);
  };
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#17191d]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#17191d] text-white shadow-sm">
            <Globe2 className="size-4" />
          </div>
          <span className="text-[15px] font-semibold tracking-[-0.02em]">
            dnslookup<span className="text-[#a3a8b1]">.tools</span>
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-10 pt-12 md:px-8 md:pt-20">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs font-semibold text-[#6f757e] shadow-sm">
            <Sparkles className="size-3.5 text-[#7c5cff]" />
            DNS, without the guesswork
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.06] tracking-[-0.055em] md:text-6xl">
            See what&apos;s behind any domain.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#737983] md:text-lg">
            A fast, readable view of the records that connect a domain to the
            rest of the internet.
          </p>
        </div>

        <form
          className="mt-10 flex max-w-3xl flex-col gap-2 rounded-2xl border border-[#e1e4e8] bg-white p-2 shadow-[0_12px_40px_rgba(29,36,49,0.06)] sm:flex-row"
          onSubmit={handleSubmit}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
            <Search className="size-5 shrink-0 text-[#a4aab4]" />
            <input
              aria-label="Domain name"
              placeholder="Enter a domain, e.g. example.com"
              className="min-w-0 flex-1 bg-transparent py-3 text-[15px] outline-none placeholder:text-[#a4aab4]"
              name="domain"
            />
          </div>
          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#17191d] px-6 text-sm font-semibold text-white transition hover:bg-[#30343b] disabled:cursor-wait disabled:opacity-70"
            type="submit"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            {loading ? "Looking up…" : "Lookup domain"}
          </button>
        </form>
        {errors.length > 0 && (
          <>
            {errors.map((error, index) => (
              <p
                key={index}
                role="alert"
                className="mt-3 text-sm font-medium text-[#c2414b]"
              >
                {error}
              </p>
            ))}
          </>
        )}

        {loading ? (
          <div className="w-full mt-16 flex flex-col items-center justify-between gap-4 pb-5 min-h-20">
            <Loader2 className="size-4 animate-spin" />
          </div>
        ) : (
          <>
            <div className="mt-16 flex flex-col gap-4 border-b border-[#e3e6ea] pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold tracking-[-0.03em]">
                    Records for{" "}
                    <span className="font-mono text-[19px]">{domain}</span>
                  </h2>
                  <span className="rounded-full bg-[#e9f8ef] px-2.5 py-1 text-[11px] font-semibold text-[#27824b]">
                    {/*{foundCount} types found*/}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#858b94]">
                  Resolved just now · TTL values shown in seconds
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#8a9099]">
                <ShieldCheck className="size-4 text-[#40a56a]" />
                Looked up server-side
              </span>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <DNSCard
                label="IPv4 addresses"
                description="Points a domain to an IPv4 address."
                recordsValue={aRecords}
                type="A"
              />
              <DNSCard
                label="IPv6 addresses"
                description="Points a domain to an IPv6 address."
                recordsValue={aaaRecords}
                type="AAAA"
                tone="red"
              />
              <DNSCard
                label="CNAME records"
                description="Points a domain to a canonical name."
                recordsValue={cnameRecords}
                type="CNAME"
                tone="blue"
              />
              <DNSCard
                label="MX records"
                description="Points a domain to a mail server."
                recordsValue={mxRecords.flatMap((r) => r.exchange)}
                type="MX"
              />
              <DNSCard
                label="NS records"
                description="Points a domain to a name server."
                recordsValue={nsRecords}
                type="NS"
                tone="violet"
              />
              <DNSCard
                label="TXT records"
                description="Points a domain to a text record."
                recordsValue={txtRecords.flat()}
                type="TXT"
                tone="green"
              />
            </div>
          </>
        )}

        <footer className="mt-12 flex flex-col justify-between gap-3 border-t border-[#e3e6ea] py-6 text-xs text-[#9ba0a8] sm:flex-row">
          <span>Queries resolve through Node&apos;s DNS resolver.</span>
        </footer>
      </section>
    </main>
  );
}
