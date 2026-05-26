"use client";

import { useMemo, useState } from "react";
import { RadioTower, Wallet } from "lucide-react";
import { XLAYER } from "@/lib/xlayer";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

export function WalletButton() {
  const [account, setAccount] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("ready");

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

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button onClick={connect} className="inline-flex items-center gap-2 rounded border border-forge-cyan/30 bg-forge-cyan/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-forge-cyan/20">
        <Wallet className="h-4 w-4 text-forge-cyan" />
        {short ?? "Connect wallet"}
      </button>
      <span className="hidden items-center gap-2 text-xs text-white/46 xl:flex">
        <RadioTower className="h-3.5 w-3.5 text-forge-green" />
        {status}
      </span>
    </div>
  );
}
