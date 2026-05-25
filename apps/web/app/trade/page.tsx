import { ContractActions } from "@/components/contract-actions";
import { EmptyState, LivePoolOrganism, Metric, PageShell, Panel } from "@/components/ui";
import { getTerminalState, XLAYER } from "@/lib/xlayer";

export default async function TradePage() {
  const state = await getTerminalState();
  const metrics = state.deployment.metrics;
  return (
    <PageShell eyebrow="Trade" title="Hook-protected WOKB/USDC terminal" copy="A trading terminal must use real quotes and real routing. Until the permission-mined Uniswap v4 hook pool is deployed, this page exposes live hook operations and refuses to fake swaps.">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <h2 className="mb-5 text-xl font-semibold text-white">Swap execution</h2>
          <EmptyState title="Swap route unavailable" copy="Universal Router swap execution is disabled until the proper Uniswap v4 HookForge pool exists. This app will not fake quotes, prices, routes, TVL, or successful swaps." />
          <div className="mt-5 grid gap-3">
            <Metric label="Input Token" value="WOKB" />
            <Metric label="Output Token" value="USDC" />
            <Metric label="Router" value="not configured" tone="amber" />
          </div>
          <p className="mt-5 break-all font-mono text-xs text-white/42">WOKB {XLAYER.wokb}</p>
          <p className="mt-2 break-all font-mono text-xs text-white/42">USDC {XLAYER.usdc}</p>
        </Panel>
        <LivePoolOrganism metrics={metrics} large />
      </div>
      <div className="mt-6">
        <ContractActions hookAddress={state.deployment.hookAddress} />
      </div>
    </PageShell>
  );
}

