import { AIStream, PageShell, Panel, PoolOrganism, QuestList, SystemStrip, ThreatMatrix } from "@/components/ui";
import { pools } from "@hookforge/shared";

export default function DashboardPage() {
  return (
    <PageShell eyebrow="Command Center" title="Adaptive market operations" copy="Watch pool organisms, AI recommendations, threat posture, quests, and live protocol health from one professional command surface.">
      <SystemStrip />
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <PoolOrganism pool={pools[0]} large />
        <AIStream />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Threat Matrix</h2>
          <ThreatMatrix />
        </Panel>
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Active Market Quests</h2>
          <QuestList />
        </Panel>
      </div>
    </PageShell>
  );
}
