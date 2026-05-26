import { CheckCircle2, CircleDashed } from "lucide-react";
import { PageShell, Panel } from "@/components/ui";
import { XLAYER, getHookLabState } from "@/lib/xlayer";

export const dynamic = "force-dynamic";

export default async function V4RoutePage() {
  const state = await getHookLabState();
  const liveItems = [
    ["Hook behavior contract", state.deployment.hookAddress ?? "not configured"],
    ["Pool state storage", state.deployment.stateManager ?? "not configured"],
    ["Readable proof surface", "Use hook and Proof pages decode live outputs"]
  ] as const;
  const remainingItems = [
    ["Permission-mine hook address", "Mine an address whose low bits match the exact Uniswap v4 hook permissions."],
    ["Deploy v4 hook wrapper", "Deploy the hook at that address so PoolManager can call the real v4 hook entrypoints."],
    ["Initialize PoolKey", `Use WOKB ${XLAYER.wokb} and USDC ${XLAYER.usdc} with the mined hook address.`],
    ["Seed liquidity", "Add liquidity through the v4 PositionManager so real swaps have executable depth."],
    ["Route swaps", "Switch from direct HookKernel scenario calls to Universal Router or PoolManager swap calls."]
  ] as const;

  return (
    <PageShell
      eyebrow="v4 route"
      title="The honest path from hook proof to routed Uniswap v4 swaps."
      copy="The current dApp proves HookForge hook behavior with deployed X Layer contracts. Full routed swapping requires a permission-mined v4 hook address and an initialized Uniswap v4 pool."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <p className="text-xs uppercase tracking-[0.24em] text-forge-green">Live now</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">What users can use today</h2>
          <div className="mt-6 grid gap-3">
            {liveItems.map(([title, copy]) => (
              <div key={title} className="flex gap-3 rounded border border-white/10 bg-black/24 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-forge-green" />
                <div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="mt-1 break-all text-sm text-white/52">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <p className="text-xs uppercase tracking-[0.24em] text-forge-amber">Required for routed swaps</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">What turns this into a real v4 swap route</h2>
          <div className="mt-6 grid gap-3">
            {remainingItems.map(([title, copy], index) => (
              <div key={title} className="flex gap-3 rounded border border-white/10 bg-black/24 p-4">
                <span className="grid h-8 w-8 flex-none place-items-center rounded border border-forge-amber/30 bg-forge-amber/10 text-sm font-semibold text-forge-amber">{index + 1}</span>
                <div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-white/52">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel className="mt-6">
        <div className="grid gap-4 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-forge-cyan">Boundary</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">No fake routed swap claim</h2>
          </div>
          <div className="flex gap-3 rounded border border-white/10 bg-black/24 p-4">
            <CircleDashed className="mt-0.5 h-5 w-5 flex-none text-forge-cyan" />
            <p className="text-sm leading-6 text-white/60">
              Until the mined v4 hook address and initialized PoolManager pool exist, HookForge exposes direct hook scenario transactions. That still gives users and judges a real dApp interaction: wallet call, hook execution, receipt decoding, and state changes from X Layer.
            </p>
          </div>
        </div>
      </Panel>
    </PageShell>
  );
}
