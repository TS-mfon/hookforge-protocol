import { AIStream, PageShell } from "@/components/ui";

export default function AIFeedPage() {
  return (
    <PageShell eyebrow="AI Feed" title="Live intelligence stream" copy="A continuous feed of market-agent recommendations, bounded actions, threats, pool evolutions, and quest events.">
      <AIStream />
    </PageShell>
  );
}
