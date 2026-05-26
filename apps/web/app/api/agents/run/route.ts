import { NextResponse } from "next/server";
import { createWalletClient, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hookCalldata, hookOperations } from "@/lib/hook-operations";
import { CONTRACTS, XLAYER } from "@/lib/xlayer";

export const dynamic = "force-dynamic";

const chain = {
  id: XLAYER.chainId,
  name: XLAYER.name,
  nativeCurrency: XLAYER.nativeCurrency,
  rpcUrls: { default: { http: [XLAYER.rpcUrl] } }
} as const;

function privateKeyFor(agent: string) {
  const envByAgent: Record<string, string | undefined> = {
    "mev-defense": process.env.HOOKFORGE_AGENT_MEV_PRIVATE_KEY,
    volatility: process.env.HOOKFORGE_AGENT_VOLATILITY_PRIVATE_KEY,
    liquidity: process.env.HOOKFORGE_AGENT_LIQUIDITY_PRIVATE_KEY,
    growth: process.env.HOOKFORGE_AGENT_GROWTH_PRIVATE_KEY
  };
  return envByAgent[agent] ?? process.env.HOOKFORGE_AGENT_PRIVATE_KEY ?? process.env.HOOKFORGE_DEPLOYER_PRIVATE_KEY;
}

function normalizePrivateKey(value: string) {
  return (value.startsWith("0x") ? value : `0x${value}`) as `0x${string}`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { operation?: string; agent?: string };
  const operation = hookOperations.find((item) => item.title === body.operation || item.agent === body.agent || item.key === body.operation);
  if (!operation) return NextResponse.json({ error: "Unknown HookForge agent operation." }, { status: 400 });

  const privateKey = privateKeyFor(operation.agent);
  if (!privateKey) {
    return NextResponse.json({
      error: "No server agent key is configured for this operation. Connect a wallet and run the same operation manually."
    }, { status: 503 });
  }

  try {
    const account = privateKeyToAccount(normalizePrivateKey(privateKey));
    const client = createWalletClient({
      account,
      chain,
      transport: http(XLAYER.rpcUrl)
    }).extend(publicActions);
    const hash = await client.sendTransaction({
      account,
      to: CONTRACTS.hookKernel as `0x${string}`,
      data: hookCalldata(operation.key, operation.payload) as `0x${string}`,
      value: 0n
    });
    const receipt = await client.waitForTransactionReceipt({ hash, confirmations: 1 });
    return NextResponse.json({
      operation: operation.title,
      agent: operation.agent,
      wallet: account.address,
      hash,
      blockNumber: receipt.blockNumber.toString(),
      status: receipt.status
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Agent transaction failed."
    }, { status: 500 });
  }
}
