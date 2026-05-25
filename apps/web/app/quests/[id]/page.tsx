import { notFound } from "next/navigation";
import { ContractActions } from "@/components/contract-actions";
import { EmptyState, Metric, PageShell, Panel } from "@/components/ui";
import { explorerTx, getTerminalState } from "@/lib/xlayer";

export function generateStaticParams() {
  return [{ id: "wokb-usdc-activity" }];
}

export default async function QuestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id !== "wokb-usdc-activity") notFound();
  const state = await getTerminalState();
  const questEvents = state.activity.filter((event) => event.name === "Quest progressed");
  return (
    <PageShell eyebrow="Quest" title="WOKB/USDC adaptive activity quest" copy="A real quest page backed by QuestProgressed events from the deployed QuestEngine module.">
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Progress" value={state.deployment.metrics?.questProgress ?? "not read"} tone="green" />
        <Metric label="Events" value={questEvents.length} />
        <Metric label="Reward Status" value="not tokenized yet" tone="amber" />
      </div>
      <div className="mt-6">
        <ContractActions hookAddress={state.deployment.hookAddress} />
      </div>
      <Panel className="mt-6">
        <h2 className="mb-5 text-xl font-semibold text-white">Proof of progress</h2>
        <div className="space-y-3">
          {questEvents.length ? questEvents.map((event) => (
            <a key={`${event.txHash}-${event.logIndex}`} href={explorerTx(event.txHash)} target="_blank" className="block rounded border border-white/10 bg-black/24 p-3 transition hover:border-forge-cyan/30">
              <p className="font-semibold text-white">{event.name}</p>
              <p className="mt-1 text-sm text-white/52">Block {event.blockNumber} - progress {event.value}</p>
            </a>
          )) : <EmptyState title="No quest tx yet" copy="Run an afterSwap operation to emit QuestProgressed and update this page." />}
        </div>
      </Panel>
    </PageShell>
  );
}
