import { NextResponse } from "next/server";
import { getTerminalState } from "@/lib/xlayer";

export async function GET() {
  return NextResponse.json(await getTerminalState());
}

