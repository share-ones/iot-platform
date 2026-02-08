import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

type LabelRow = {
  kind: string;
  device: string;
  label: string;
};

function readLabelFile(file: string): LabelRow[] {
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, "utf-8")
    .split("\n")
    .filter(Boolean)
    .map(l => JSON.parse(l));
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind");

  if (!kind) {
    return NextResponse.json({ error: "missing kind" }, { status: 400 });
  }

  const liveDir = path.join(process.cwd(), "data/live", kind);
  const labelFile = path.join(process.cwd(), "data/ndjson/label.ndjson");

  if (!fs.existsSync(liveDir)) {
    return NextResponse.json({ error: "kind not found" }, { status: 404 });
  }

  // 1️⃣ 读取现有 label
  const labels = readLabelFile(labelFile);
  const map = new Map<string, LabelRow>();

  for (const row of labels) {
    if (row.kind === kind) {
      map.set(row.device, row);
    }
  }

  // 2️⃣ 扫描 live 目录，补全缺失设备
  const files = fs.readdirSync(liveDir).filter(f => f.endsWith(".ndjson"));

  let created = 0;

  for (const f of files) {
    const device = f.replace(".ndjson", "");
    if (map.has(device)) continue;

    const row: LabelRow = {
      kind,
      device,
      label: device
    };

    labels.push(row);
    map.set(device, row);
    created++;
  }

  // 3️⃣ 写回 label.ndjson
  fs.mkdirSync(path.dirname(labelFile), { recursive: true });
  fs.writeFileSync(
    labelFile,
    labels.map(l => JSON.stringify(l)).join("\n") + "\n"
  );

  return NextResponse.json({
    success: true,
    kind,
    created,
    total: labels.filter(l => l.kind === kind).length
  });
}
