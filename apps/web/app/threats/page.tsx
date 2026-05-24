import { PageShell, Panel, ThreatMatrix } from "@/components/ui";

export default function ThreatsPage() {
  return (
    <PageShell eyebrow="Threat Detection" title="MEV, whale, volatility, and toxic-flow radar" copy="HookForge surfaces hostile behavior and translates intelligence into bounded defensive action.">
      <Panel>
        <ThreatMatrix />
      </Panel>
    </PageShell>
  );
}
