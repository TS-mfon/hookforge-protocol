import { NextResponse } from "next/server";
import { getModuleRegistryState } from "@/lib/xlayer";

export async function GET() {
  return NextResponse.json(await getModuleRegistryState());
}

