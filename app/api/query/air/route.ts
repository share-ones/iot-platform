// app/api/query/air/route.ts
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { readNdjson } from "@/lib/ndjson";

function loadMap(file: string, key: string) {
  if (!fs.existsSync(file)) return new Map();
  return new Map(
    fs.readFileSync(file, "utf-8")
      .split("\n")
      .filter(Boolean)
      .map(l => JSON.parse(l))
      .map(v => [v[key], v])
  );
}



export async function GET() {
  const kind = "air";

  const liveDir = path.join(process.cwd(), "data/live", kind);

  if (!fs.existsSync(liveDir)) {
    return NextResponse.json({ ok: true, data: [] });
  }

  const sortMap = loadMap("data/ndjson/sort.ndjson", "device");
  const labelMap = loadMap("data/ndjson/label.ndjson", "device");
  const pinMap = loadMap("data/ndjson/pin.ndjson", "device");
  const hiddenMap = loadMap("data/ndjson/hidden.ndjson", "device");

  const files = fs.readdirSync(liveDir).filter(f => f.endsWith(".ndjson"));

  const rows: any[] = [];

  for (const f of files) {
    const device = f.replace(".ndjson", "");
    const data = await readNdjson(path.join(liveDir, f));
    if (!data.length) continue;

    rows.push({
      device,
      ...data.at(-1),

      // 额外信息来自 ndjson
      order: sortMap.get(device)?.order ?? 9999,
      pinned: !!pinMap.get(device),
      label: labelMap.get(device)?.label ?? device,
      hidden: hiddenMap.get(device)?.hidden ?? false,
    });
  }

  // 过滤 hidden
  const visible = rows.filter(r => !r.hidden);

  // 先按 order 排序，再把 pinned 放前面
  visible.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return (a.order ?? 9999) - (b.order ?? 9999);
  });

  return NextResponse.json({ ok: true, data: visible });
}
