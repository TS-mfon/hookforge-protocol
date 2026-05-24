import { AgentGrid, PageShell } from "@/components/ui";

export default function AIAgentsPage() {
  return (
    <PageShell eyebrow="Market AI Agents" title="Specialized agents for autonomous market intelligence" copy="Agents monitor MEV, volatility, liquidity health, sentiment, quests, growth, and governance risk.">
      <AgentGrid />
    </PageShell>
  );
}
