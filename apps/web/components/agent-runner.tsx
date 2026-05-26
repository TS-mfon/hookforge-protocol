"use client";

import { useState } from "react";
import { Bot, CheckCircle2, Loader2, RadioTower, ShieldAlert } from "lucide-react";
import { hookOperations } from "@/lib/hook-operations";
import { XLAYER } from "@/lib/xlayer";

export function AgentRunner({ agent }: { agent?: string }) {
  const operations = agent ? hookOperations.filter((operation) => operation.agent === agent) : hookOperations;
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ operation: string; hash: string; wallet: string; blockNumber: string } | null>(null);

  async function run(operation: string) {
    setBusy(operation);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ operation })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Agent transaction failed.");
      setResult(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Agent transaction failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded border border-forge-green/20 bg-black/24 p-5">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid h-10 w-10 place-items-center rounded border border-forge-green/30 bg-forge-green/10">
          <Bot className="h-5 w-5 text-forge-green" />
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-forge-green">Server agents</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Run agent transaction</h2>
          <p className="mt-2 text-sm leading-6 text-white/56">These buttons use configured server wallets to submit real X Layer transactions. If keys are missing or unfunded, the error is shown directly.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex gap-3 rounded border border-forge-red/30 bg-forge-red/10 p-4 text-sm text-forge-red">
          <ShieldAlert className="mt-0.5 h-4 w-4 flex-none" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <a href={`${XLAYER.explorer}/tx/${result.hash}`} target="_blank" className="mb-4 flex gap-3 rounded border border-forge-green/30 bg-forge-green/10 p-4 text-sm text-white/72 transition hover:border-forge-green/60">
          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-forge-green" />
          <span className="min-w-0">
            <span className="block font-semibold text-white">{result.operation} confirmed at block {result.blockNumber}</span>
            <span className="mt-1 block break-all font-mono text-xs text-forge-cyan">{result.hash}</span>
          </span>
        </a>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {operations.map((operation) => (
          <button key={operation.title} onClick={() => run(operation.title)} disabled={busy !== null} className="min-h-[118px] rounded border border-white/10 bg-white/[0.045] p-4 text-left transition hover:border-forge-green/40 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50">
            <span className="mb-3 flex h-9 w-9 items-center justify-center rounded border border-forge-green/30 bg-forge-green/10">
              {busy === operation.title ? <Loader2 className="h-4 w-4 animate-spin text-forge-green" /> : <RadioTower className="h-4 w-4 text-forge-green" />}
            </span>
            <span className="block font-semibold text-white">{operation.title}</span>
            <span className="mt-2 block text-sm leading-5 text-white/52">{operation.copy}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
