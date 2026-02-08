//C:\Users\one\Documents\neww\app\api\manage\[kind]\route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(
  req: Request,
  context: { params: Promise<{ kind: string }> }
) {
  // ✅ 正确解包 params
  const { kind } = await context.params;

  if (!kind) {
    return NextResponse.json(
      { ok: false, error: "missing kind" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { device, ...data } = body;

  if (!device) {
    return NextResponse.json(
      { ok: false, error: "missing device" },
      { status: 400 }
    );
  }

  const ts = Date.now();
  const record = { ...data, ts };

  /* ===== live ===== */
  const liveDir = path.join(process.cwd(), "data", "live", kind);
  fs.mkdirSync(liveDir, { recursive: true });

  fs.appendFileSync(
    path.join(liveDir, `${device}.ndjson`),
    JSON.stringify(record) + "\n"
  );

  /* ===== archive（按天） ===== */
  const day = new Date().toISOString().slice(0, 10);
  const archiveDir = path.join(process.cwd(), "data", "archive", kind, day);
  fs.mkdirSync(archiveDir, { recursive: true });

  fs.appendFileSync(
    path.join(archiveDir, `${device}.ndjson`),
    JSON.stringify(record) + "\n"
  );

  return NextResponse.json({ ok: true });
}
