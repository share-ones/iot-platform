//C:\Users\one\Documents\neww\app\api\query\[kind]\route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { readNdjson } from "@/lib/ndjson";

export async function GET(
  req: Request,
  context: { params: Promise<{ kind: string }> }
) {
  try {
    // ✅ 关键点：await params
    const { kind } = await context.params;

    const file = path.join(
      process.cwd(),
      "data",
      "view",
      `${kind}.ndjson`
    );

    if (!fs.existsSync(file)) {
      return NextResponse.json({ ok: true, data: [] });
    }

    const data = await readNdjson(file);

    return NextResponse.json({
      ok: true,
      data,
    });
  } catch (err) {
    console.error("latest-all error:", err);
    return NextResponse.json(
      { ok: false, error: "internal error" },
      { status: 500 }
    );
  }
}
