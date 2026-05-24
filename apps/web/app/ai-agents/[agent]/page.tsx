import { notFound } from "next/navigation";
import { agents, recommendations } from "@hookforge/shared";
import { Metric, PageShell, Panel, SafetyList } from "@/components/ui";

export function generateStaticParams() {
  return agents.map((agent) => ({ agent: agent.key }));
}

export default async function AgentPage({ params }: { params: Promise<{ agent: string }> }) {
  const { agent: key } = await params;
  const agent = agents.find((item) => item.key === key);
  if (!agent) notFound();
  const recs = recommendations.filter((rec) => rec.agent === agent.key);
  return (
    <PageShell eyebrow="AI Agent" title={agent.name} copy={agent.role}>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel>
          <Metric label="Confidence" value={`${agent.confidence}%`} />
          <p className="mt-5 text-sm leading-6 text-white/58">{agent.lastAction}</p>
        </Panel>
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Signed Recommendations</h2>
          <div className="space-y-3">
            {recs.length ? recs.map((rec) => (
              <div key={rec.id} className="rounded border border-white/10 bg-black/24 p-4">
                <p className="font-semibold text-white">{rec.title}</p>
                <p className="mt-2 text-sm text-white/56">{rec.rationale}</p>
              </div>
            )) : <p className="text-white/54">No active recommendation. Agent is monitoring.</p>}
          </div>
        </Panel>
      </div>
      <div className="mt-6"><SafetyList /></div>
    </PageShell>
  );
}
