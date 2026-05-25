import { NextResponse } from "next/server";
import { getAgents } from "@/lib/xlayer";

export async function GET() {
  return NextResponse.json({ agents: await getAgents() });
}

