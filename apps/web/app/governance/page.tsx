import { Metric, PageShell, Panel, SafetyList } from "@/components/ui";
import { CONTRACTS, explorerAddress, getTerminalState } from "@/lib/xlayer";

export const dynamic = "force-dynamic";

export default async function GovernancePage() {
  const state = await getTerminalState();
  return (
    <PageShell eyebrow="Governance" title="Safety and parameter control" copy="Governance proposals are not faked. This page exposes current deployed safety contracts and explains which controls are live.">
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Control plane</h2>
          <SafetyList />
        </Panel>
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Deployed safety contracts</h2>
          <div className="space-y-3">
            {[
              ["ParameterManager", CONTRACTS.parameterManager],
              ["EmergencyController", CONTRACTS.emergencyController],
              ["ModuleRegistry", state.deployment.registry]
            ].map(([label, address]) => (
              <a key={label} href={address ? explorerAddress(address) : "#"} target="_blank" className="block rounded border border-white/10 bg-black/24 p-3">
                <p className="text-white/44">{label}</p>
                <p className="mt-1 break-all font-mono text-forge-cyan">{address}</p>
              </a>
            ))}
          </div>
        </Panel>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Metric label="Module Allowlist" value={`${state.moduleCount} live`} tone="green" />
        <Metric label="Emergency Pause" value="contract live" tone="amber" />
        <Metric label="Proposals" value="not implemented" tone="amber" />
      </div>
    </PageShell>
  );
}
