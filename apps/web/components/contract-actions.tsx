"use client";

import { useState } from "react";
import { CheckCircle2, FlaskConical, Loader2, ShieldAlert, Wallet } from "lucide-react";
import { hookCalldata, hookOperations, type HookOperation } from "@/lib/hook-operations";
import { XLAYER } from "@/lib/xlayer";

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
  const [txs, setTxs] = useState<Array<{ label: string; hash: string; status: "submitted" | "confirmed" }>>([]);

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

  async function runOperation(operation: HookOperation) {
    if (!window.ethereum || !account || !hookAddress) return;
    setBusy(operation.title);
    setError(null);
    try {
      const hash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: account,
          to: hookAddress,
          data: hookCalldata(operation.key, operation.payload),
          value: "0x0"
        }]
      }) as string;
      setTxs((current) => [{ label: operation.title, hash, status: "submitted" as const }, ...current].slice(0, 5));
      const confirmed = await waitForReceipt(hash);
      setTxs((current) => current.map((tx) => tx.hash === hash ? { ...tx, status: confirmed ? "confirmed" : "submitted" } : tx));
      if (confirmed) window.location.reload();
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

      {txs.length > 0 && (
        <div className="mt-5 space-y-2">
          {txs.map((tx) => (
            <a key={tx.hash} href={`${XLAYER.explorer}/tx/${tx.hash}`} target="_blank" className="flex items-center gap-3 rounded border border-white/10 bg-black/30 p-3 text-sm text-white/68 transition hover:border-forge-cyan/30">
              <CheckCircle2 className="h-4 w-4 text-forge-green" />
              <span className="flex-1">{tx.label} - {tx.status}</span>
              <span className="font-mono text-xs text-forge-cyan">{tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
