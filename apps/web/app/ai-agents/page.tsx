import Link from "next/link";
import { Bot } from "lucide-react";
import { ContractActions } from "@/components/contract-actions";
import { Metric, PageShell, Panel } from "@/components/ui";
import { getTerminalState } from "@/lib/xlayer";

export default async function AIAgentsPage() {
  const state = await getTerminalState();
  const ready = state.agents.filter((agent) => agent.status === "ready").length;
  return (
    <PageShell eyebrow="Agents" title="Real agent activity layer" copy="Agents are not profile cards anymore. A server agent appears only if a wallet is configured and funded; otherwise users can manually run agent actions from their wallet.">
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Metric label="Server Agents Ready" value={ready} tone={ready ? "green" : "amber"} />
        <Metric label="User Agent Mode" value="enabled" tone="green" />
        <Metric label="Last Activity" value={state.activity[0] ? `block ${state.activity[0].blockNumber}` : "none"} />
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {state.agents.map((agent) => (
          <Link key={agent.key} href={`/ai-agents/${agent.key}`} className="rounded border border-white/10 bg-white/[0.045] p-5 transition hover:border-forge-cyan/40">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded border border-forge-green/30 bg-forge-green/10">
              <Bot className="h-5 w-5 text-forge-green" />
            </div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">{agent.name}</h2>
              <span className={`rounded border px-2 py-1 text-xs ${agent.status === "ready" ? "border-forge-green/30 text-forge-green" : "border-forge-amber/30 text-forge-amber"}`}>{agent.status}</span>
            </div>
            <p className="text-sm leading-6 text-white/56">{agent.action}</p>
            <p className="mt-4 break-all font-mono text-xs text-white/42">{agent.wallet ?? "user-triggered only"}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <ContractActions hookAddress={state.deployment.hookAddress} />
      </div>
      <div className="mt-6">
        <Panel>
          <h2 className="mb-3 text-xl font-semibold text-white">Backend agent requirement</h2>
          <p className="text-sm leading-6 text-white/60">To enable autonomous server agents, configure server-only agent private keys and fund their public wallets with OKB. Until then, the dApp correctly exposes manual user-agent actions and does not fake autonomous activity.</p>
        </Panel>
      </div>
    </PageShell>
  );
}
