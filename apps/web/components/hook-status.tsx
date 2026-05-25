import { Activity, DatabaseZap, ExternalLink, ShieldCheck } from "lucide-react";
import { getHookDeployment, XLAYER } from "@/lib/xlayer";
import { Metric, Panel } from "@/components/ui";

const evolutionLabels = ["Dormant", "Awakening", "Growth", "Frenzy", "Defensive", "Recovery", "Legendary"];

export async function HookStatus() {
  const deployment = await getHookDeployment();
  const metrics = deployment.metrics;
  const hasAddress = Boolean(deployment.hookAddress);

  return (
    <Panel className="border-forge-cyan/20">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-forge-cyan">X Layer mainnet hook</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{deployment.deployed ? "Contract connected" : "Contract not connected"}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/56">
            The dApp reads this hook directly from X Layer RPC. If deployment is pending, interactive write actions are disabled and the exact missing configuration is shown here.
          </p>
        </div>
        <span className={`inline-flex items-center gap-2 rounded border px-3 py-2 text-sm ${deployment.deployed ? "border-forge-green/30 bg-forge-green/10 text-forge-green" : "border-forge-amber/30 bg-forge-amber/10 text-forge-amber"}`}>
          <ShieldCheck className="h-4 w-4" />
          {deployment.deployed ? `${deployment.codeSize} bytes` : "pending deploy"}
        </span>
      </div>

      {!deployment.deployed && (
        <div className="mb-5 rounded border border-forge-amber/30 bg-forge-amber/10 p-4">
          <p className="font-semibold text-forge-amber">{hasAddress ? "Configured address has no contract code on X Layer." : "Hook deployment address is not configured."}</p>
          <p className="mt-2 text-sm leading-6 text-white/62">
            Set `NEXT_PUBLIC_HOOKFORGE_KERNEL_ADDRESS` after broadcasting the X Layer deployment. The current deployer balance is too low for the core deployment, so the site is intentionally showing a pending state instead of simulated contract data.
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Risk" value={metrics?.riskScore ?? "n/a"} tone={metrics && metrics.riskScore > 70 ? "red" : "green"} />
        <Metric label="Fee" value={metrics ? `${metrics.dynamicFeeBps} bps` : "n/a"} />
        <Metric label="Health" value={metrics ? `${metrics.liquidityHealth}%` : "n/a"} tone="green" />
        <Metric label="Evolution" value={metrics ? evolutionLabels[metrics.evolutionState] ?? metrics.evolutionState : "n/a"} tone="amber" />
      </div>

      <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
        <div className="rounded border border-white/10 bg-black/24 p-3">
          <p className="mb-1 flex items-center gap-2 text-white/52"><Activity className="h-4 w-4 text-forge-cyan" /> Hook address</p>
          {deployment.hookAddress ? <a className="break-all text-forge-cyan" href={`${XLAYER.explorer}/address/${deployment.hookAddress}`} target="_blank">{deployment.hookAddress} <ExternalLink className="inline h-3 w-3" /></a> : <span className="text-forge-amber">{deployment.error}</span>}
        </div>
        <div className="rounded border border-white/10 bg-black/24 p-3">
          <p className="mb-1 flex items-center gap-2 text-white/52"><DatabaseZap className="h-4 w-4 text-forge-green" /> State source</p>
          <span className="break-all text-white/70">{deployment.stateManager ?? (deployment.deployed ? "compact hook local state" : "waiting for deployment")}</span>
        </div>
      </div>
    </Panel>
  );
}
