import { NextResponse } from "next/server";
import { getActivity, getHookDeployment } from "@/lib/xlayer";

export async function GET() {
  const [deployment, activity] = await Promise.all([getHookDeployment(), getActivity(50).catch(() => [])]);
  return NextResponse.json({
    quests: [{
      id: "wokb-usdc-activity",
      title: "WOKB/USDC adaptive activity",
      progress: deployment.metrics?.questProgress ?? null,
      source: "QuestProgressed events + PoolStateManager.getMetrics",
      events: activity.filter((event) => event.name === "Quest progressed")
    }]
  });
}
