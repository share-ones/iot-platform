import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { pushSSE } from "@/lib/sse/push";

export async function POST(req: Request) {
  const body = await req.json();
  const { device, temperature, humidity, ts } = body;

  if (
    !device ||
    typeof temperature !== "number" ||
    typeof humidity !== "number"
  ) {
    return NextResponse.json(
      { ok: false, error: "invalid payload" },
      { status: 400 }
    );
  }

  const timestamp = typeof ts === "number" ? ts : Date.now();

  const record = {
    device,
    temperature,
    humidity,
    ts: timestamp,
  };

  // =========================
  // 1️⃣ archive（追加）
  // =========================
  const date = new Date(timestamp).toISOString().slice(0, 10);
  const archiveDir = path.join(
    process.cwd(),
    "data",
    "archive",
    "air",
    date
  );

  fs.mkdirSync(archiveDir, { recursive: true });
  fs.appendFileSync(
    path.join(archiveDir, `${device}.ndjson`),
    JSON.stringify(record) + "\n"
  );

  // =========================
  // 2️⃣ live（覆盖）
  // =========================
  const liveDir = path.join(process.cwd(), "data", "live", "air");
  fs.mkdirSync(liveDir, { recursive: true });
  fs.writeFileSync(
    path.join(liveDir, `${device}.ndjson`),
    JSON.stringify(record) + "\n",
    "utf-8"
  );

  // =========================
  // 3️⃣ SSE 主动推送（关键）
  // =========================
  pushSSE("air", record);

  return NextResponse.json({ ok: true });
}
