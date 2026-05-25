import Link from "next/link";
import { ContractActions } from "@/components/contract-actions";
import { EmptyState, Metric, PageShell, Panel } from "@/components/ui";
import { explorerTx, getTerminalState } from "@/lib/xlayer";

export const dynamic = "force-dynamic";

export default async function QuestsPage() {
  const state = await getTerminalState();
  const metrics = state.deployment.metrics;
  const questEvents = state.activity.filter((event) => event.name === "Quest progressed");
  return (
    <PageShell eyebrow="Quests" title="Real quest progress from HookForge events" copy="Quest progress comes from QuestProgressed events and PoolStateManager metrics. No fake community goals are shown.">
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Quest Progress" value={metrics?.questProgress ?? "not read"} tone="green" />
        <Metric label="Quest Events" value={questEvents.length} />
        <Metric label="Source" value="QuestEngine" tone="amber" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Active onchain quest</h2>
          <p className="font-semibold text-white">Progress WOKB/USDC adaptive activity</p>
          <p className="mt-2 text-sm leading-6 text-white/56">Run post-swap or liquidity checkpoints. Confirmed events increment quest progress in the deployed QuestEngine module.</p>
          <div className="mt-5">
            <Link href="/quests/wokb-usdc-activity" className="rounded bg-forge-cyan px-4 py-2 text-sm font-semibold text-black">Open quest page</Link>
          </div>
        </Panel>
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Quest event evidence</h2>
          <div className="space-y-3">
            {questEvents.length ? questEvents.map((event) => (
              <a key={`${event.txHash}-${event.logIndex}`} href={explorerTx(event.txHash)} target="_blank" className="block rounded border border-white/10 bg-black/24 p-3 transition hover:border-forge-cyan/30">
                <p className="font-semibold text-white">{event.name}</p>
                <p className="mt-1 text-sm text-white/52">Block {event.blockNumber} - progress {event.value}</p>
              </a>
            )) : <EmptyState title="No quest events yet" copy="Run the Demo Lab 'Progress quest after swap' operation to create a real QuestProgressed event." />}
          </div>
        </Panel>
      </div>
      <div className="mt-6">
        <ContractActions hookAddress={state.deployment.hookAddress} />
      </div>
    </PageShell>
  );
}
