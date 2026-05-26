import { NextResponse } from "next/server";
import { getHookLabState } from "@/lib/xlayer";

export async function GET() {
  return NextResponse.json(await getHookLabState());
}
