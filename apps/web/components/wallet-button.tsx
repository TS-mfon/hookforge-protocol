"use client";

import { useMemo, useState } from "react";
import { PlugZap, RadioTower, Wallet } from "lucide-react";
import { HOOKFORGE_POOL_ID, XLAYER } from "@/lib/xlayer";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

const BEFORE_SWAP_SELECTOR = "0xc376f8e3";

function beforeSwapCalldata() {
  return `${BEFORE_SWAP_SELECTOR}${HOOKFORGE_POOL_ID.slice(2)}${"0".repeat(62)}40${"0".repeat(64)}`;
}

export function WalletButton({ hookAddress }: { hookAddress?: string | null }) {
  const [account, setAccount] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("ready");
  const [txHash, setTxHash] = useState<string | null>(null);

  const short = useMemo(() => account ? `${account.slice(0, 6)}...${account.slice(-4)}` : null, [account]);

  async function connect() {
    if (!window.ethereum) {
      setStatus("wallet not found");
      return;
    }
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];
    setAccount(accounts[0] ?? null);
    await switchToXLayer();
  }

  async function switchToXLayer() {
    if (!window.ethereum) return;
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

  async function runHookCheckpoint() {
    if (!window.ethereum || !account || !hookAddress) {
      setStatus("hook not deployed");
      return;
    }
    try {
      setStatus("sending hook checkpoint");
      const hash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: account,
          to: hookAddress,
          data: beforeSwapCalldata(),
          value: "0x0"
        }]
      }) as string;
      setTxHash(hash);
      setStatus("checkpoint submitted");
    } catch (error) {
      setStatus(error instanceof Error ? error.message.slice(0, 80) : "transaction rejected");
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button onClick={connect} className="inline-flex items-center gap-2 rounded border border-forge-cyan/30 bg-forge-cyan/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-forge-cyan/20">
        <Wallet className="h-4 w-4 text-forge-cyan" />
        {short ?? "Connect wallet"}
      </button>
      {account && (
        <button onClick={runHookCheckpoint} disabled={!hookAddress} className="inline-flex items-center gap-2 rounded bg-forge-green px-3 py-2 text-sm font-semibold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40">
          <PlugZap className="h-4 w-4" />
          Run hook
        </button>
      )}
      <span className="hidden items-center gap-2 text-xs text-white/46 xl:flex">
        <RadioTower className="h-3.5 w-3.5 text-forge-green" />
        {txHash ? <a className="text-forge-cyan" href={`${XLAYER.explorer}/tx/${txHash}`} target="_blank">tx sent</a> : status}
      </span>
    </div>
  );
}
