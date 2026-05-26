"use client";

import { useState } from "react";
import { CheckCircle2, ExternalLink, FlaskConical, Loader2, ShieldAlert, Wallet } from "lucide-react";
import { hookCalldata, hookOperations, type HookOperation } from "@/lib/hook-operations";
import { XLAYER, type ActivityEvent, type HookMetrics } from "@/lib/xlayer";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

export function HookScenarioRunner({ hookAddress }: { hookAddress: string | null }) {
  const [account, setAccount] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [runs, setRuns] = useState<HookRun[]>([]);

  async function connect() {
    if (!window.ethereum) {
      setError("No injected wallet found. Open the site with MetaMask, OKX Wallet, or another EIP-1193 wallet.");
      return;
    }
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];
    setAccount(accounts[0] ?? null);
    try {
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: XLAYER.chainIdHex }] });
    } catch {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: XLAYER.chainIdHex,
          chainName: XLAYER.name,
          nativeCurrency: XLAYER.nativeCurrency,
          rpcUrls: [XLAYER.rpcUrl],
          blockExplorerUrls: [XLAYER.explorer]
        }]
      });
    }
  }

  async function waitForReceipt(hash: string) {
    for (let i = 0; i < 24; i++) {
      const receipt = await window.ethereum?.request({ method: "eth_getTransactionReceipt", params: [hash] }) as { status?: string } | null;
      if (receipt?.status) return receipt.status === "0x1";
      await new Promise((resolve) => setTimeout(resolve, 2500));
    }
    return false;
  }

  async function getMetricsSnapshot() {
    const response = await fetch("/api/hook/state", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not read HookForge state before the transaction.");
    const state = await response.json() as { deployment?: { metrics?: HookMetrics | null } };
    return state.deployment?.metrics ?? null;
  }

  async function getOutput(hash: string) {
    return getOutputForHash(hash);
  }

  async function runOperation(operation: HookOperation) {
    if (!window.ethereum || !account || !hookAddress) return;
    setBusy(operation.title);
    setError(null);
    try {
      const before = await getMetricsSnapshot();
      const hash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: account,
          to: hookAddress,
          data: hookCalldata(operation.key, operation.payload),
          value: "0x0"
        }]
      }) as string;
      setRuns((current) => [{
        label: operation.title,
        checkpoint: operation.key,
        hash,
        status: "submitted" as const,
        before,
        calldata: hookCalldata(operation.key, operation.payload)
      }, ...current].slice(0, 5));
      const confirmed = await waitForReceipt(hash);
      const output = await getOutput(hash);
      const after = output.metricsAfter ?? await getMetricsSnapshot();
      setRuns((current) => current.map((run) => run.hash === hash ? {
        ...run,
        status: confirmed && output.status === "confirmed" ? "confirmed" : output.status,
        after,
        output
      } : run));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed or was rejected.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded border border-forge-cyan/20 bg-black/28 p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-forge-cyan">Hook scenarios</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Use the deployed hook</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/56">
            Each scenario sends a real X Layer transaction to the deployed HookKernel and changes the adaptive pool state shown on this page.
          </p>
        </div>
        <button onClick={connect} className="inline-flex items-center gap-2 rounded border border-forge-cyan/30 bg-forge-cyan/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-forge-cyan/20">
          <Wallet className="h-4 w-4 text-forge-cyan" />
          {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect wallet"}
        </button>
      </div>

      {!hookAddress && (
        <div className="mb-4 flex gap-3 rounded border border-forge-amber/30 bg-forge-amber/10 p-4 text-sm text-white/70">
          <ShieldAlert className="mt-0.5 h-4 w-4 flex-none text-forge-amber" />
          Contract address is not configured. The hook must be deployed before scenarios can run.
        </div>
      )}

      {error && (
        <div className="mb-4 rounded border border-forge-red/30 bg-forge-red/10 p-4 text-sm text-forge-red">{error}</div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {hookOperations.map((operation) => (
          <button
            key={operation.title}
            onClick={() => runOperation(operation)}
            disabled={!account || !hookAddress || busy !== null}
            className="min-h-[126px] rounded border border-white/10 bg-white/[0.045] p-4 text-left transition hover:border-forge-green/40 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="mb-3 flex h-9 w-9 items-center justify-center rounded border border-forge-green/30 bg-forge-green/10">
              {busy === operation.title ? <Loader2 className="h-4 w-4 animate-spin text-forge-green" /> : <FlaskConical className="h-4 w-4 text-forge-green" />}
            </span>
            <span className="block font-semibold text-white">{operation.title}</span>
            <span className="mt-2 block text-sm leading-5 text-white/52">{operation.copy}</span>
          </button>
        ))}
      </div>

      {runs.length > 0 && (
        <div className="mt-5 space-y-4">
          {runs.map((run) => (
            <HookRunOutput key={run.hash} run={run} />
          ))}
        </div>
      )}
    </div>
  );
}

export function TxOutputInspector({ txHash }: { txHash: string }) {
  const [output, setOutput] = useState<HookOutput | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setBusy(true);
    setError(null);
    try {
      setOutput(await getOutputForHash(txHash));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load transaction output.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 rounded border border-white/10 bg-black/24 p-3">
      <button onClick={load} disabled={busy} className="inline-flex items-center gap-2 rounded border border-forge-cyan/25 px-3 py-2 text-xs font-semibold text-forge-cyan transition hover:bg-forge-cyan/10 disabled:opacity-50">
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FlaskConical className="h-3.5 w-3.5" />}
        Load hook output
      </button>
      {error && <p className="mt-3 text-sm text-forge-red">{error}</p>}
      {output && (
        <div className="mt-3 space-y-3">
          <p className="text-sm leading-6 text-white/68">{output.decodedSummary}</p>
          {output.metricsAfter && (
            <div className="grid gap-2 md:grid-cols-3">
              {metricRows.slice(0, 6).map((item) => (
                <div key={item.key} className="rounded border border-white/10 bg-black/30 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-white/42">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-white">{output.metricsAfter?.[item.key]}{item.suffix ?? ""}</p>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-2">
            {output.events.length ? output.events.map((event) => (
              <div key={`${event.txHash}-${event.logIndex}`} className="rounded border border-white/10 bg-black/30 p-3 text-sm">
                <p className="font-semibold text-white">{event.name}</p>
                <p className="mt-1 text-white/50">Block {event.blockNumber}{event.value ? ` - ${event.value}` : ""}</p>
              </div>
            )) : <p className="text-sm text-white/48">No decoded HookForge events found in this receipt.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

type HookOutput = {
  txHash: string;
  status: "confirmed" | "failed" | "pending";
  blockNumber: number | null;
  explorerUrl: string;
  events: ActivityEvent[];
  metricsAfter: HookMetrics | null;
  decodedSummary: string;
  error?: string;
};

type HookRun = {
  label: string;
  checkpoint: string;
  hash: string;
  status: "submitted" | "confirmed" | "failed" | "pending";
  before: HookMetrics | null;
  after?: HookMetrics | null;
  output?: HookOutput;
  calldata: string;
};

async function getOutputForHash(hash: string) {
  const response = await fetch(`/api/hook/output?tx=${hash}`, { cache: "no-store" });
  const payload = await response.json() as HookOutput | { error?: string };
  if (!response.ok) throw new Error(payload.error ?? "Could not decode hook output.");
  return payload as HookOutput;
}

const metricRows: Array<{ key: keyof HookMetrics; label: string; suffix?: string }> = [
  { key: "dynamicFeeBps", label: "Dynamic fee", suffix: " bps" },
  { key: "riskScore", label: "Risk" },
  { key: "whalePressure", label: "Whale" },
  { key: "sentiment", label: "Sentiment" },
  { key: "liquidityHealth", label: "Health", suffix: "%" },
  { key: "questProgress", label: "Activity" }
];

function HookRunOutput({ run }: { run: HookRun }) {
  const after = run.after ?? run.output?.metricsAfter ?? null;
  return (
    <div className="rounded border border-white/10 bg-black/32 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-2 rounded border px-2.5 py-1 text-xs font-semibold ${run.status === "failed" ? "border-forge-red/30 bg-forge-red/10 text-forge-red" : run.status === "confirmed" ? "border-forge-green/30 bg-forge-green/10 text-forge-green" : "border-forge-amber/30 bg-forge-amber/10 text-forge-amber"}`}>
              {run.status === "confirmed" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {run.status}
            </span>
            <p className="font-semibold text-white">{run.label}</p>
          </div>
          <p className="mt-2 text-xs text-white/48">Checkpoint: <span className="font-mono text-forge-cyan">{run.checkpoint}</span></p>
        </div>
        <a href={`${XLAYER.explorer}/tx/${run.hash}`} target="_blank" className="inline-flex items-center gap-2 rounded border border-forge-cyan/25 px-3 py-2 text-xs font-semibold text-forge-cyan transition hover:bg-forge-cyan/10">
          {run.hash.slice(0, 10)}...{run.hash.slice(-6)} <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="mt-4 rounded border border-white/10 bg-white/[0.035] p-3">
        <p className="text-xs uppercase tracking-[0.18em] text-white/42">Decoded hook output</p>
        <p className="mt-2 text-sm leading-6 text-white/70">{run.output?.decodedSummary ?? "Transaction submitted. Waiting for X Layer receipt and decoded HookForge events."}</p>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-3">
        {metricRows.map((item) => {
          const before = run.before?.[item.key];
          const valueAfter = after?.[item.key];
          const delta = typeof before === "number" && typeof valueAfter === "number" ? valueAfter - before : null;
          return (
            <div key={item.key} className="rounded border border-white/10 bg-black/30 p-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/42">{item.label}</p>
              <p className="mt-2 text-sm text-white/68">
                {before ?? "not read"} {"->"} <span className="font-semibold text-white">{valueAfter ?? "pending"}</span>{item.suffix ?? ""}
              </p>
              <p className={`mt-1 text-xs ${delta === null ? "text-white/36" : delta > 0 ? "text-forge-green" : delta < 0 ? "text-forge-red" : "text-white/44"}`}>
                {delta === null ? "Delta pending" : `${delta > 0 ? "+" : ""}${delta}`}
              </p>
            </div>
          );
        })}
      </div>

      <details className="mt-4 rounded border border-white/10 bg-black/24 p-3">
        <summary className="cursor-pointer text-sm font-semibold text-white">Receipt events and calldata</summary>
        <div className="mt-3 space-y-3">
          <div className="rounded bg-black/40 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-white/36">Calldata</p>
            <p className="mt-2 break-all font-mono text-xs text-white/56">{run.calldata}</p>
          </div>
          {(run.output?.events ?? []).length ? run.output!.events.map((event) => (
            <div key={`${event.txHash}-${event.logIndex}`} className="rounded border border-white/10 bg-black/30 p-3 text-sm">
              <p className="font-semibold text-white">{event.name}</p>
              <p className="mt-1 text-white/50">Block {event.blockNumber}{event.value ? ` - ${event.value}` : ""}</p>
            </div>
          )) : (
            <p className="rounded border border-white/10 bg-black/30 p-3 text-sm text-white/50">No decoded HookForge receipt events yet.</p>
          )}
        </div>
      </details>
    </div>
  );
}
