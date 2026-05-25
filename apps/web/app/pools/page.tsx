import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LivePoolOrganism, Metric, PageShell, Panel } from "@/components/ui";
import { CONTRACTS, explorerAddress, getTerminalState, metricThreat, XLAYER } from "@/lib/xlayer";

export const dynamic = "force-dynamic";

export default async function PoolsPage() {
  const state = await getTerminalState();
  const metrics = state.deployment.metrics;
  return (
    <PageShell eyebrow="Pools" title="Registered HookForge pools" copy="This page only shows pools backed by deployed HookForge contracts. No fake TVL, no fake volume, no fake extra pools.">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <LivePoolOrganism metrics={metrics} large />
        <Panel>
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xl font-semibold text-white">WOKB/USDC HookForge Pool</p>
              <p className="mt-2 break-all font-mono text-xs text-white/46">{state.pool.id}</p>
            </div>
            <Link href="/pools/wokb-usdc" className="inline-flex items-center gap-2 rounded bg-forge-cyan px-4 py-2 text-sm font-semibold text-black">
              Open pool <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Metric label="Dynamic Fee" value={metrics ? `${metrics.dynamicFeeBps} bps` : "not read"} />
            <Metric label="Liquidity Health" value={metrics ? `${metrics.liquidityHealth}%` : "not read"} tone="green" />
            <Metric label="Quest Progress" value={metrics ? `${metrics.questProgress}` : "not read"} tone="amber" />
            <Metric label="Threat" value={metricThreat(metrics)} tone={metricThreat(metrics) === "Critical" ? "red" : "green"} />
          </div>
          <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
            <a href={explorerAddress(XLAYER.wokb)} target="_blank" className="rounded border border-white/10 bg-black/24 p-3">
              <p className="text-white/44">Token 0</p>
              <p className="mt-1 break-all font-mono text-forge-cyan">{XLAYER.wokb}</p>
            </a>
            <a href={explorerAddress(XLAYER.usdc)} target="_blank" className="rounded border border-white/10 bg-black/24 p-3">
              <p className="text-white/44">Token 1</p>
              <p className="mt-1 break-all font-mono text-forge-cyan">{XLAYER.usdc}</p>
            </a>
            <a href={explorerAddress(CONTRACTS.hookKernel)} target="_blank" className="rounded border border-white/10 bg-black/24 p-3 md:col-span-2">
              <p className="text-white/44">Hook behavior kernel</p>
              <p className="mt-1 break-all font-mono text-forge-cyan">{CONTRACTS.hookKernel}</p>
            </a>
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
