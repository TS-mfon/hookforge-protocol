import { EmptyState, PageShell, Panel } from "@/components/ui";
import { explorerTx, getTerminalState } from "@/lib/xlayer";

export default async function AIFeedPage() {
  const state = await getTerminalState();
  return (
    <PageShell eyebrow="Activity Feed" title="Real HookForge intelligence stream" copy="This feed is no longer fake AI copy. It shows X Layer events emitted by HookForge contracts and modules.">
      <Panel>
        <div className="space-y-3">
          {state.activity.length ? state.activity.map((event) => (
            <a key={`${event.txHash}-${event.logIndex}`} href={explorerTx(event.txHash)} target="_blank" className="block rounded border border-white/10 bg-black/24 p-4 transition hover:border-forge-cyan/30">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-white">{event.name}</p>
                <p className="font-mono text-xs text-forge-cyan">{event.txHash.slice(0, 10)}...{event.txHash.slice(-6)}</p>
              </div>
              <p className="mt-2 text-sm text-white/52">Block {event.blockNumber}{event.actor ? ` - actor ${event.actor}` : ""}{event.value ? ` - ${event.value}` : ""}</p>
            </a>
          )) : <EmptyState title="No live feed yet" copy="Run a Demo Lab transaction or configure a backend agent to produce live HookForge events." />}
        </div>
      </Panel>
    </PageShell>
  );
}
