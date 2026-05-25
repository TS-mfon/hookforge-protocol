import { ContractActions } from "@/components/contract-actions";
import { EmptyState, Metric, PageShell, Panel, SafetyList } from "@/components/ui";
import { getTerminalState, XLAYER } from "@/lib/xlayer";

export default async function StudioPage() {
  const state = await getTerminalState();

  return (
    <PageShell eyebrow="Studio" title="Adaptive pool builder and operator" copy="Studio now exposes real deployed module state and a clear build path. It does not pretend to deploy new pools until the permission-mined v4 hook flow is added.">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Current live pool config</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Metric label="Pair" value="WOKB/USDC" />
            <Metric label="Modules" value={state.moduleCount} tone="green" />
            <Metric label="Token 0" value={`${XLAYER.wokb.slice(0, 8)}...`} />
            <Metric label="Token 1" value={`${XLAYER.usdc.slice(0, 8)}...`} />
          </div>
          <div className="mt-5 grid gap-3">
            {state.modules.map((module) => (
              <div key={module.key} className="rounded border border-forge-cyan/20 bg-forge-cyan/8 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{module.title}</p>
                  <span className={`rounded border px-2 py-1 text-xs ${module.enabled ? "border-forge-green/30 text-forge-green" : "border-forge-amber/30 text-forge-amber"}`}>{module.enabled ? "enabled" : "not enabled"}</span>
                </div>
                <p className="mt-2 text-sm text-white/52">{module.role}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Builder status</h2>
          <EmptyState title="New v4 pool deployment is not exposed yet" copy="The correct next build is a permission-mined Uniswap v4 hook contract plus pool initialization. Studio will not fake a pool deployer before that exists." />
          <div className="mt-5">
            <SafetyList />
          </div>
        </Panel>
      </div>
      <div className="mt-6">
        <ContractActions hookAddress={state.deployment.hookAddress} />
      </div>
    </PageShell>
  );
}
