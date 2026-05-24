import { PageShell, Panel } from "@/components/ui";

const classes = [
  ["Guardian", "Sustains defensive liquidity during stress."],
  ["Alchemist", "Optimizes capital efficiency across ranges."],
  ["Defender", "Participates in high-risk protection windows."],
  ["Strategist", "Completes quests and governance actions."],
  ["Titan", "Long-duration LP with elite contribution score."]
];

export default function LpRpgPage() {
  return (
    <PageShell eyebrow="LP RPG System" title="Liquidity providers become market players" copy="LPs earn classes, badges, boosts, and visible identity through contribution quality, duration, and defense participation.">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {classes.map(([name, copy]) => (
          <Panel key={name}>
            <p className="text-xl font-semibold text-white">{name}</p>
            <p className="mt-3 text-sm leading-6 text-white/56">{copy}</p>
          </Panel>
        ))}
      </div>
    </PageShell>
  );
}
