import { modules } from "@hookforge/shared";
import { ModuleCard, PageShell } from "@/components/ui";

export default function ModulesPage() {
  return (
    <PageShell eyebrow="Module Library" title="Composable behavior for every pool" copy="Each module owns one adaptive capability and plugs into the Hook Kernel with explicit guardrails.">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => <ModuleCard key={module.key} module={module} />)}
      </div>
    </PageShell>
  );
}
