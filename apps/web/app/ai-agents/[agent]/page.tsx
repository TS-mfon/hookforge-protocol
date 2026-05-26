import { notFound } from "next/navigation";
import { AgentRunner } from "@/components/agent-runner";
import { ContractActions } from "@/components/contract-actions";
import { Metric, PageShell, Panel } from "@/components/ui";
import { getTerminalState } from "@/lib/xlayer";

export const dynamic = "force-dynamic";

export default async function AgentPage({ params }: { params: Promise<{ agent: string }> }) {
  const { agent: key } = await params;
  const state = await getTerminalState();
  const agent = state.agents.find((item) => item.key === key);
  if (!agent) notFound();
  return (
    <PageShell eyebrow="Agent" title={agent.name} copy={agent.action}>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel>
          <Metric label="Mode" value={agent.mode} />
          <Metric label="Status" value={agent.status} tone={agent.status === "ready" ? "green" : "amber"} />
          <Metric label="OKB Balance" value={agent.balanceOkb ?? "not configured"} tone="amber" />
          <p className="mt-5 break-all font-mono text-xs text-white/46">{agent.wallet ?? "No server wallet configured for this agent."}</p>
        </Panel>
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Real use</h2>
          <p className="text-sm leading-6 text-white/60">This agent submits bounded HookKernel actions, waits for receipts, and changes the pool metrics that every page reads from X Layer.</p>
          <div className="mt-5 grid gap-5">
            <AgentRunner agent={agent.key} />
            <ContractActions hookAddress={state.deployment.hookAddress} />
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
