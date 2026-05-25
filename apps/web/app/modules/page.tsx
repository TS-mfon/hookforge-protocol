import Link from "next/link";
import { Cpu } from "lucide-react";
import { PageShell, Panel } from "@/components/ui";
import { explorerAddress, getTerminalState } from "@/lib/xlayer";

export default async function ModulesPage() {
  const state = await getTerminalState();
  return (
    <PageShell eyebrow="Modules" title="Live deployed module registry" copy="Every module listed here has a deployed X Layer address. Enabled state comes from ModuleRegistry, not static UI data.">
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Panel><p className="text-sm text-white/44">Registry count</p><p className="mt-2 text-3xl font-semibold text-forge-cyan">{state.moduleCount}</p></Panel>
        <Panel><p className="text-sm text-white/44">Expected modules</p><p className="mt-2 text-3xl font-semibold text-forge-green">10</p></Panel>
        <Panel><p className="text-sm text-white/44">Source</p><p className="mt-2 text-lg font-semibold text-white">ModuleRegistry.modules</p></Panel>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {state.modules.map((module) => (
          <Link key={module.key} href={`/modules/${module.key}`} className="rounded border border-white/10 bg-white/[0.045] p-5 transition hover:border-forge-green/40 hover:bg-white/[0.07]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded border border-forge-cyan/30 bg-forge-cyan/10">
              <Cpu className="h-5 w-5 text-forge-cyan" />
            </div>
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-xl font-semibold text-white">{module.title}</h3>
              <span className={`rounded border px-2 py-1 text-xs ${module.enabled && module.hasCode ? "border-forge-green/30 text-forge-green" : "border-forge-amber/30 text-forge-amber"}`}>
                {module.enabled && module.hasCode ? "live" : "check"}
              </span>
            </div>
            <p className="text-sm leading-6 text-white/58">{module.role}</p>
            <p className="mt-4 break-all font-mono text-xs text-forge-cyan">{module.address}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Panel>
          <h2 className="mb-3 text-xl font-semibold text-white">Registry contract</h2>
          <a className="break-all font-mono text-sm text-forge-cyan" href={explorerAddress(state.deployment.registry ?? "")} target="_blank">{state.deployment.registry}</a>
        </Panel>
      </div>
    </PageShell>
  );
}
