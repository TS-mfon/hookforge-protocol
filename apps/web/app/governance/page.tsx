import { PageShell, Panel, SafetyList } from "@/components/ui";

export default function GovernancePage() {
  return (
    <PageShell eyebrow="Governance" title="Parameter safety, timelocks, and bounded autonomy" copy="Governance owns the safety envelope that keeps adaptive behavior powerful without becoming reckless.">
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Control Plane</h2>
          <SafetyList />
        </Panel>
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Pending Proposals</h2>
          {["Raise max growth-mode duration", "Add sentiment oracle signer", "Reduce whale-tax cooldown"].map((item) => (
            <div key={item} className="mb-3 rounded border border-white/10 bg-black/24 p-4 text-sm text-white/62">{item}</div>
          ))}
        </Panel>
      </div>
    </PageShell>
  );
}
