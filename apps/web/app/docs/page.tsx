import { modules } from "@hookforge/shared";
import { PageShell, Panel, SafetyList } from "@/components/ui";

export default function DocsPage() {
  return (
    <PageShell eyebrow="Developer Docs" title="Build adaptive markets with HookForge" copy="Kernel architecture, module SDK shape, safety model, event surfaces, and deployment assumptions for Uniswap v4 hooks.">
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Hook Checkpoints</h2>
          {["beforeInitialize", "afterInitialize", "beforeSwap", "afterSwap", "beforeAddLiquidity", "afterAddLiquidity", "beforeRemoveLiquidity", "afterRemoveLiquidity", "beforeDonate", "afterDonate"].map((hook) => (
            <p key={hook} className="border-b border-white/10 py-2 text-sm text-white/62">{hook}</p>
          ))}
        </Panel>
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Module SDK</h2>
          {modules.map((module) => (
            <p key={module.key} className="border-b border-white/10 py-2 text-sm text-white/62">{module.title}</p>
          ))}
        </Panel>
      </div>
      <div className="mt-6"><SafetyList /></div>
    </PageShell>
  );
}
