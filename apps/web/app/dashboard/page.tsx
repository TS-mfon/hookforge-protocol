import { ContractActions } from "@/components/contract-actions";
import { EmptyState, LivePoolOrganism, Metric, PageShell, Panel } from "@/components/ui";
import { explorerAddress, explorerTx, getTerminalState, metricThreat } from "@/lib/xlayer";

export default async function DashboardPage() {
  const state = await getTerminalState();
  const metrics = state.deployment.metrics;
  const threat = metricThreat(metrics);

  return (
    <PageShell eyebrow="Command Center" title="Live HookForge operations" copy="One real command surface for deployed contracts, current pool metrics, module health, agent status, and X Layer activity.">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Kernel" value={state.deployment.deployed ? "live" : "offline"} tone={state.deployment.deployed ? "green" : "red"} />
        <Metric label="Modules" value={`${state.moduleCount}/10`} tone={state.moduleCount === 10 ? "green" : "amber"} />
        <Metric label="Dynamic Fee" value={metrics ? `${metrics.dynamicFeeBps} bps` : "not read"} />
        <Metric label="Threat" value={threat} tone={threat === "Critical" ? "red" : threat === "Elevated" ? "amber" : "green"} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <LivePoolOrganism metrics={metrics} large />
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Deployed contracts</h2>
          <div className="space-y-3 text-sm">
            {[
              ["HookKernel", state.deployment.hookAddress],
              ["PoolStateManager", state.deployment.stateManager],
              ["ModuleRegistry", state.deployment.registry]
            ].map(([name, address]) => (
              <a key={name} href={address ? explorerAddress(address) : "#"} target="_blank" className="block rounded border border-white/10 bg-black/24 p-3 transition hover:border-forge-cyan/30">
                <p className="text-white/44">{name}</p>
                <p className="mt-1 break-all font-mono text-forge-cyan">{address ?? "not configured"}</p>
              </a>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <ContractActions hookAddress={state.deployment.hookAddress} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Latest onchain activity</h2>
          <div className="space-y-3">
            {state.activity.length ? state.activity.slice(0, 12).map((event) => (
              <a key={`${event.txHash}-${event.logIndex}`} href={explorerTx(event.txHash)} target="_blank" className="block rounded border border-white/10 bg-black/24 p-4 transition hover:border-forge-cyan/30">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold text-white">{event.name}</p>
                  <p className="font-mono text-xs text-forge-cyan">{event.txHash.slice(0, 10)}...{event.txHash.slice(-6)}</p>
                </div>
                <p className="mt-2 text-sm text-white/50">Block {event.blockNumber}{event.value ? ` - ${event.value}` : ""}</p>
              </a>
            )) : <EmptyState title="No indexed activity" copy="No HookForge logs were returned by X Layer RPC for the indexed deployment range." />}
          </div>
        </Panel>

        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Agent status</h2>
          <div className="space-y-3">
            {state.agents.map((agent) => (
              <div key={agent.key} className="rounded border border-white/10 bg-black/24 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{agent.name}</p>
                  <span className={`rounded border px-2 py-1 text-xs ${agent.status === "ready" ? "border-forge-green/30 text-forge-green" : "border-forge-amber/30 text-forge-amber"}`}>{agent.status}</span>
                </div>
                <p className="mt-2 text-sm text-white/52">{agent.action}</p>
                <p className="mt-2 break-all font-mono text-xs text-white/42">{agent.wallet ?? "No server wallet configured; users can run this action manually."}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
