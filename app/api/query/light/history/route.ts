import { NextResponse } from "next/server";
import { getHistory } from "@/lib/button/history";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const device = url.searchParams.get("device");
  const range = url.searchParams.get("range") || "all";

  if (!device) {
    return NextResponse.json({ ok: false, error: "missing device" }, { status: 400 });
  }

  const data = await getHistory(device, "air", range);

  return NextResponse.json({ ok: true, data });
}
