// C:\server\server\app\api\ingest\stm32f103c8t6-01\[device]\route.ts
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { pushSSE } from "@/lib/sse/push";

/**
 * 返回 YYYY-MM-DD
 */
function today(ts?: number) {
  const d = ts ? new Date(ts) : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function POST(req: Request) {
  // ✅ 从 URL 获取 device，而不是 params
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const device = segments[segments.length - 1];
  if (!device) {
    return NextResponse.json({ ok: false, msg: "device missing" }, { status: 400 });
  }

  // ⚠️ 用 text()，STM32 有时会拼坏 JSON
  const bodyText = await req.text();

  let record: any;
  try {
    record = JSON.parse(bodyText);
  } catch (e) {
    console.error("JSON parse error:", e, "body:", bodyText);
    return NextResponse.json({ ok: false, msg: "invalid JSON" }, { status: 400 });
  }

  const ts = typeof record.ts === "number" ? record.ts : Date.now();
  const finalRecord = { ...record, device, ts };

  /* ================= live ================= */
  const liveDir = path.join(process.cwd(), "data/live/stm32f103c8t6-01");
  fs.mkdirSync(liveDir, { recursive: true });
  fs.writeFileSync(path.join(liveDir, `${device}.ndjson`), JSON.stringify(finalRecord) + "\n", "utf-8");

  /* ================= archive ================= */
  const date = today(ts);
  const archiveDir = path.join(process.cwd(), "data/archive/stm32f103c8t6-01", date);
  fs.mkdirSync(archiveDir, { recursive: true });
  fs.appendFileSync(path.join(archiveDir, `${device}.ndjson`), JSON.stringify(finalRecord) + "\n", "utf-8");

  /* ================= SSE ================= */
  pushSSE("stm32f103c8t6-01", finalRecord);

  return NextResponse.json({ ok: true });
}
