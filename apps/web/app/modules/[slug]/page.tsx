import { notFound } from "next/navigation";
import { modules } from "@hookforge/shared";
import { Metric, PageShell, Panel } from "@/components/ui";

export function generateStaticParams() {
  return modules.map((module) => ({ slug: module.key }));
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const module = modules.find((item) => item.key === slug);
  if (!module) notFound();
  return (
    <PageShell eyebrow="HookForge Module" title={module.title} copy={module.description}>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel>
          <p className="text-xl text-forge-green">{module.tagline}</p>
          <div className="mt-6 grid gap-3">
            <Metric label="Execution" value="Kernel routed" />
            <Metric label="Autonomy" value="Bounded" tone="green" />
            <Metric label="Safety" value="Capped" tone="amber" />
          </div>
        </Panel>
        <div className="grid gap-4 md:grid-cols-3">
          <Panel>
            <h2 className="mb-4 text-lg font-semibold text-white">Metrics</h2>
            {module.metrics.map((item) => <p key={item} className="border-b border-white/10 py-3 text-sm text-white/62">{item}</p>)}
          </Panel>
          <Panel>
            <h2 className="mb-4 text-lg font-semibold text-white">Actions</h2>
            {module.actions.map((item) => <p key={item} className="border-b border-white/10 py-3 text-sm text-white/62">{item}</p>)}
          </Panel>
          <Panel>
            <h2 className="mb-4 text-lg font-semibold text-white">Guardrails</h2>
            {module.guardrails.map((item) => <p key={item} className="border-b border-white/10 py-3 text-sm text-white/62">{item}</p>)}
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}
