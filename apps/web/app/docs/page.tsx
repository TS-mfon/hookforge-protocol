import { PageShell, Panel, SafetyList } from "@/components/ui";
import { MODULES } from "@/lib/xlayer";

export default function DocsPage() {
  return (
    <PageShell eyebrow="Developer Docs" title="HookForge live integration notes" copy="Documentation for the deployed kernel/module system and the remaining requirement for a permission-mined Uniswap v4 hook pool.">
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Live kernel checkpoints</h2>
          {["beforeSwap(bytes32,bytes)", "afterSwap(bytes32,bytes)", "beforeAddLiquidity(bytes32,bytes)", "afterAddLiquidity(bytes32,bytes)", "beforeRemoveLiquidity(bytes32,bytes)"].map((hook) => (
            <p key={hook} className="border-b border-white/10 py-2 text-sm text-white/62">{hook}</p>
          ))}
        </Panel>
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Deployed modules</h2>
          {MODULES.map((module) => (
            <p key={module.key} className="border-b border-white/10 py-2 text-sm text-white/62">{module.title}</p>
          ))}
        </Panel>
      </div>
      <div className="mt-6">
        <Panel>
          <h2 className="mb-3 text-xl font-semibold text-white">Important v4 status</h2>
          <p className="text-sm leading-6 text-white/60">
            The deployed HookKernel is a live behavior kernel. Full Uniswap v4 pool integration still requires a permission-mined hook address with the selected callback flags encoded in the address. Until that deployment exists, the app exposes real HookForge operations and does not fake Universal Router swaps.
          </p>
        </Panel>
      </div>
      <div className="mt-6"><SafetyList /></div>
    </PageShell>
  );
}
