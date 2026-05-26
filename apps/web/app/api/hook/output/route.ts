import { NextResponse } from "next/server";
import { getHookTxOutput } from "@/lib/xlayer";

export async function GET(request: Request) {
  const tx = new URL(request.url).searchParams.get("tx");
  if (!tx) {
    return NextResponse.json({ error: "Missing tx query parameter." }, { status: 400 });
  }

  try {
    return NextResponse.json(await getHookTxOutput(tx));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not decode hook output." },
      { status: 400 }
    );
  }
}
