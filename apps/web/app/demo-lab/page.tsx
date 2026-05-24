import { demoScenarios } from "@hookforge/shared";
import { PageShell, Panel, PoolOrganism } from "@/components/ui";
import { pools } from "@hookforge/shared";

export default function DemoLabPage() {
  return (
    <PageShell eyebrow="Demo Lab" title="Run the full adaptive market story" copy="Trigger volatility, MEV-like flow, whale pressure, sentiment shifts, and quest completion to show HookForge reacting end to end.">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <PoolOrganism pool={pools[0]} large />
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Scenario Runner</h2>
          <div className="space-y-3">
            {demoScenarios.map((scenario) => (
              <div key={scenario.key} className="rounded border border-white/10 bg-black/24 p-4">
                <p className="font-semibold text-white">{scenario.title}</p>
                <p className="mt-2 text-sm text-white/52">{scenario.trigger}</p>
                <p className="mt-2 text-sm text-forge-green">{scenario.expected}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
