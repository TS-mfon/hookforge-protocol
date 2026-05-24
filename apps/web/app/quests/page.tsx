import { PageShell, QuestList } from "@/components/ui";

export default function QuestsPage() {
  return (
    <PageShell eyebrow="Market Quest Engine" title="Community objectives for adaptive liquidity" copy="Quests coordinate liquidity providers around durable, healthy, and defensible market behavior.">
      <QuestList />
    </PageShell>
  );
}
