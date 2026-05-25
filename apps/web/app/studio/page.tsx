import { modules } from "@hookforge/shared";
import { PageShell, Panel, SafetyList } from "@/components/ui";
import { ContractActions } from "@/components/contract-actions";
import { getHookDeployment } from "@/lib/xlayer";

export default async function StudioPage() {
  const deployment = await getHookDeployment();

  return (
    <PageShell eyebrow="HookForge Studio" title="No-code adaptive pool builder" copy="Compose modules, configure caps, preview behavior, and generate deployable pool configuration for programmable markets.">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Module Composer</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {modules.map((module) => (
              <div key={module.key} className="rounded border border-forge-cyan/20 bg-forge-cyan/8 p-4">
                <p className="font-semibold text-white">{module.title}</p>
                <p className="mt-2 text-sm text-white/52">{module.tagline}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Safety Envelope</h2>
          <SafetyList />
        </Panel>
      </div>
      <div className="mt-6">
        <ContractActions hookAddress={deployment.hookAddress} />
      </div>
    </PageShell>
  );
}
