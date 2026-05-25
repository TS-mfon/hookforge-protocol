import { notFound } from "next/navigation";
import { Metric, PageShell, Panel } from "@/components/ui";
import { explorerAddress, getTerminalState, MODULES } from "@/lib/xlayer";

export const dynamic = "force-dynamic";

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const state = await getTerminalState();
  const module = state.modules.find((item) => item.key === slug);
  if (!module) notFound();
  const events = state.activity.filter((event) => event.contract.toLowerCase() === module.address.toLowerCase());

  return (
    <PageShell eyebrow="Live Module" title={module.title} copy={module.role}>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel>
          <div className="grid gap-3">
            <Metric label="Bytecode" value={module.hasCode ? "deployed" : "missing"} tone={module.hasCode ? "green" : "red"} />
            <Metric label="Registry" value={module.enabled ? "enabled" : "not enabled"} tone={module.enabled ? "green" : "amber"} />
            <Metric label="Gas Limit" value={module.gasLimit || "not read"} tone="amber" />
            <Metric label="Order" value={module.order} />
          </div>
          <a href={explorerAddress(module.address)} target="_blank" className="mt-5 block break-all rounded border border-white/10 bg-black/24 p-3 font-mono text-xs text-forge-cyan">{module.address}</a>
        </Panel>
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Module events</h2>
          <div className="space-y-3">
            {events.length ? events.map((event) => (
              <div key={`${event.txHash}-${event.logIndex}`} className="rounded border border-white/10 bg-black/24 p-4">
                <p className="font-semibold text-white">{event.name}</p>
                <p className="mt-2 text-sm text-white/52">Block {event.blockNumber}{event.value ? ` - ${event.value}` : ""}</p>
              </div>
            )) : <p className="text-sm text-white/54">No module-specific events indexed yet. Run a related hook action in Demo Lab to create activity.</p>}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
