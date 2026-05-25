import { ContractActions } from "@/components/contract-actions";
import { Metric, PageShell, Panel } from "@/components/ui";
import { getTerminalState, metricThreat } from "@/lib/xlayer";

export default async function ThreatsPage() {
  const state = await getTerminalState();
  const metrics = state.deployment.metrics;
  const threat = metricThreat(metrics);
  const rows = [
    ["Risk score", metrics?.riskScore ?? "not read"],
    ["Fee memory", metrics?.feeMemory ?? "not read"],
    ["Volatility", metrics?.volatility ?? "not read"],
    ["Whale pressure", metrics?.whalePressure ?? "not read"],
    ["Dynamic fee", metrics ? `${metrics.dynamicFeeBps} bps` : "not read"]
  ];
  return (
    <PageShell eyebrow="Threats" title="Live HookForge risk radar" copy="Threats are derived from PoolStateManager metrics. No fake MEV, whale, or sentiment alarms are displayed.">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Threat State" value={threat} tone={threat === "Critical" ? "red" : threat === "Elevated" ? "amber" : "green"} />
        <Metric label="Risk" value={metrics?.riskScore ?? "not read"} />
        <Metric label="Fee Memory" value={metrics?.feeMemory ?? "not read"} />
        <Metric label="Activity Events" value={state.activity.length} tone="green" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Risk inputs</h2>
          <div className="space-y-3">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded border border-white/10 bg-black/24 p-4 text-sm">
                <span className="text-white/58">{label}</span>
                <span className="font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>
        </Panel>
        <ContractActions hookAddress={state.deployment.hookAddress} />
      </div>
    </PageShell>
  );
}
