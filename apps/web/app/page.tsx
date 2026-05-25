import Link from "next/link";
import { ArrowRight, Bot, CandlestickChart, ShieldCheck } from "lucide-react";
import { HookStatus } from "@/components/hook-status";
import { CTA, LivePoolOrganism, Metric, Panel, SecurityBadge } from "@/components/ui";
import { explorerTx, getTerminalState, metricThreat } from "@/lib/xlayer";

export default async function HomePage() {
  const state = await getTerminalState();
  const metrics = state.deployment.metrics;
  const latest = state.activity.slice(0, 4);

  return (
    <main className="grid-surface">
      <section className="mx-auto grid min-h-[calc(100vh-68px)] max-w-7xl items-center gap-10 px-4 py-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <SecurityBadge />
          <h1 className="mt-7 max-w-5xl text-5xl font-semibold tracking-normal text-white md:text-7xl">
            HookForge Terminal
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-white/68">
            A live X Layer control terminal for adaptive hook-protected WOKB/USDC market behavior.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/52">
            Users can inspect the deployed HookKernel, run hook operations, watch module events, track quest progress, and see onchain pool state change after transactions.
          </p>
          <div className="mt-8"><CTA /></div>
        </div>
        <LivePoolOrganism metrics={metrics} large />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <HookStatus />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Registered Pools" value="1" />
          <Metric label="Modules Online" value={state.moduleCount} tone="green" />
          <Metric label="Threat State" value={metricThreat(metrics)} tone={metricThreat(metrics) === "Critical" ? "red" : "green"} />
          <Metric label="Latest Block" value={state.latestBlock || "unavailable"} tone="amber" />
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <Panel>
            <CandlestickChart className="mb-5 h-7 w-7 text-forge-cyan" />
            <h2 className="text-xl font-semibold text-white">Trading Terminal</h2>
            <p className="mt-3 text-sm leading-6 text-white/58">The current build exposes live WOKB/USDC hook state and wallet-driven hook operations. Swap routing remains explicit when unavailable.</p>
          </Panel>
          <Panel>
            <ShieldCheck className="mb-5 h-7 w-7 text-forge-green" />
            <h2 className="text-xl font-semibold text-white">Hook Ops Console</h2>
            <p className="mt-3 text-sm leading-6 text-white/58">Demo Lab and Studio send real X Layer transactions into the deployed HookKernel and refresh the resulting metrics/events.</p>
          </Panel>
          <Panel>
            <Bot className="mb-5 h-7 w-7 text-forge-amber" />
            <h2 className="text-xl font-semibold text-white">Agent Layer</h2>
            <p className="mt-3 text-sm leading-6 text-white/58">Configured backend agents are displayed with real wallet balances. If no server wallet is configured, the app shows user-triggered agent mode only.</p>
          </Panel>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-forge-cyan">Recent X Layer activity</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Hook activity feed</h2>
          </div>
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-forge-green">Open command <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-3">
          {latest.length ? latest.map((event) => (
            <a key={`${event.txHash}-${event.logIndex}`} href={explorerTx(event.txHash)} target="_blank" className="rounded border border-white/10 bg-white/[0.045] p-4 transition hover:border-forge-cyan/40">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-white">{event.name}</p>
                <p className="font-mono text-xs text-forge-cyan">{event.txHash.slice(0, 10)}...{event.txHash.slice(-6)}</p>
              </div>
              <p className="mt-2 text-sm text-white/52">Block {event.blockNumber} {event.value ? `- ${event.value}` : ""}</p>
            </a>
          )) : (
            <Panel><p className="text-white/60">No HookForge events indexed from X Layer yet.</p></Panel>
          )}
        </div>
      </section>
    </main>
  );
}
