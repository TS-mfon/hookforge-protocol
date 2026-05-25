import { ContractActions } from "@/components/contract-actions";
import { EmptyState, Metric, PageShell, Panel } from "@/components/ui";
import { getTerminalState } from "@/lib/xlayer";

export const dynamic = "force-dynamic";

export default async function LpRpgPage() {
  const state = await getTerminalState();
  const lpEvents = state.activity.filter((event) => event.name.includes("Hook checkpoint 5") || event.name.includes("Hook checkpoint 7"));
  return (
    <PageShell eyebrow="LP Console" title="Real LP hook activity" copy="LP profile data appears only when liquidity hook events exist. No fake classes or badges are shown.">
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="LP Events" value={lpEvents.length} />
        <Metric label="Liquidity Health" value={state.deployment.metrics ? `${state.deployment.metrics.liquidityHealth}%` : "not read"} tone="green" />
        <Metric label="LP Rewards" value="not tokenized yet" tone="amber" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <ContractActions hookAddress={state.deployment.hookAddress} />
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">LP event evidence</h2>
          {lpEvents.length ? lpEvents.map((event) => (
            <div key={`${event.txHash}-${event.logIndex}`} className="mb-3 rounded border border-white/10 bg-black/24 p-4">
              <p className="font-semibold text-white">{event.name}</p>
              <p className="mt-1 text-sm text-white/52">Block {event.blockNumber}</p>
            </div>
          )) : <EmptyState title="No LP activity yet" copy="Run add-liquidity or remove-liquidity checkpoints to create real LP events." />}
        </Panel>
      </div>
    </PageShell>
  );
}
