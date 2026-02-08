// app/api/query/stm32f103c8t6-01/history/route.ts
import { NextResponse } from "next/server";
import { getHistory } from "@/lib/button/history";

/**
 * GET /api/query/stm32f103c8t6-01/history?device=xxx&range=all|day|week
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const device = url.searchParams.get("device");
  const range = url.searchParams.get("range") || "all";

  if (!device) {
    return NextResponse.json(
      { ok: false, error: "missing device" },
      { status: 400 }
    );
  }

  // 复用 getHistory，只需传 kind = "stm32f103c8t6-01"
  const data = await getHistory(device, "stm32f103c8t6-01", range);

  return NextResponse.json({ ok: true, data });
}
