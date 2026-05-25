import { NextResponse } from "next/server";
import { getActivity } from "@/lib/xlayer";

export async function GET() {
  return NextResponse.json({ activity: await getActivity(50) });
}

