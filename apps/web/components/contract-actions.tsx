"use client";

import { useState } from "react";
import { Activity, CheckCircle2, FlaskConical, Loader2, ShieldAlert, Wallet } from "lucide-react";
import { HOOKFORGE_POOL_ID, XLAYER } from "@/lib/xlayer";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

const selectors = {
  beforeSwap: "0xc376f8e3",
  afterSwap: "0xd7773101",
  beforeAddLiquidity: "0xe30620e9",
  afterAddLiquidity: "0xfd8e5e6b",
  beforeRemoveLiquidity: "0x716fff6d"
} as const;

const operations = [
  {
    key: "beforeSwap",
    title: "Trigger volatility defense",
    copy: "Runs the swap pre-checkpoint through dynamic fees, anti-MEV, TWAP, whale, and evolution modules."
  },
  {
    key: "afterSwap",
    title: "Progress quest after swap",
    copy: "Runs the post-swap checkpoint and advances the onchain quest engine."
  },
  {
    key: "beforeAddLiquidity",
    title: "LP safety preflight",
    copy: "Runs the add-liquidity guard before capital enters the adaptive pool."
  },
  {
    key: "afterAddLiquidity",
    title: "Update LP profile",
    copy: "Runs LP RPG, rewards, rebalancing, and quest accounting after liquidity is added."
  },
  {
    key: "beforeRemoveLiquidity",
    title: "Liquidity exit defense",
    copy: "Runs the defensive checkpoint before liquidity leaves the pool."
  }
] satisfies Array<{ key: keyof typeof selectors; title: string; copy: string }>;

function checkpointCalldata(selector: string) {
  return `${selector}${HOOKFORGE_POOL_ID.slice(2)}${"0".repeat(62)}40${"0".repeat(64)}`;
}

export function ContractActions({ hookAddress }: { hookAddress: string | null }) {
  const [account, setAccount] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [txs, setTxs] = useState<Array<{ label: string; hash: string }>>([]);

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

  async function runOperation(key: keyof typeof selectors, title: string) {
    if (!window.ethereum || !account || !hookAddress) return;
    setBusy(key);
    setError(null);
    try {
      const hash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: account,
          to: hookAddress,
          data: checkpointCalldata(selectors[key]),
          value: "0x0"
        }]
      }) as string;
      setTxs((current) => [{ label: title, hash }, ...current].slice(0, 5));
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
          <p className="text-xs uppercase tracking-[0.24em] text-forge-cyan">Live contract controls</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Run HookForge operations</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/56">
            These actions send real X Layer transactions to the deployed HookKernel and mutate the pool state read by the site.
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
          Contract address is not configured. Deployment must be completed before write actions can run.
        </div>
      )}

      {error && (
        <div className="mb-4 rounded border border-forge-red/30 bg-forge-red/10 p-4 text-sm text-forge-red">{error}</div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {operations.map((operation) => (
          <button
            key={operation.key}
            onClick={() => runOperation(operation.key, operation.title)}
            disabled={!account || !hookAddress || busy !== null}
            className="min-h-[126px] rounded border border-white/10 bg-white/[0.045] p-4 text-left transition hover:border-forge-green/40 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="mb-3 flex h-9 w-9 items-center justify-center rounded border border-forge-green/30 bg-forge-green/10">
              {busy === operation.key ? <Loader2 className="h-4 w-4 animate-spin text-forge-green" /> : <FlaskConical className="h-4 w-4 text-forge-green" />}
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
              <span className="flex-1">{tx.label}</span>
              <span className="font-mono text-xs text-forge-cyan">{tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

