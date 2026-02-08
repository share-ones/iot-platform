// C:\Users\one\Documents\neww\app\api\query\raw\route.ts
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { readNdjson } from "@/lib/ndjson";
import { rawListeners } from "process";

/** 读取控制文件 → Map(device => value) */
function loadMap(file: string, key: string) {
  if (!fs.existsSync(file)) return new Map();
  const lines = fs.readFileSync(file, "utf-8").split("\n").filter(Boolean);
  const map = new Map();
  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      map.set(obj[key], obj);
    } catch (e) {}
  }
  return map;
}

export async function GET() {
  const kind = "raw";
  const liveDir = path.join(process.cwd(), "data/live", kind);

  if (!fs.existsSync(liveDir)) {
    return NextResponse.json({ ok: true, data: [] });
  }

  // 控制文件
  const sortMap = loadMap("data/ndjson/sort.ndjson", "device");
  const labelMap = loadMap("data/ndjson/label.ndjson", "device");
  const pinMap = loadMap("data/ndjson/pin.ndjson", "device");
  const hiddenMap = loadMap("data/ndjson/hidden.ndjson", "device");

  // 遍历设备文件夹
  const devices = fs.readdirSync(liveDir).filter((d) =>
    fs.statSync(path.join(liveDir, d)).isDirectory()
  );

  const allDevices: any[] = [];

  for (const device of devices) {
    const deviceDir = path.join(liveDir, device);
    const files = fs.readdirSync(deviceDir).filter((f) => f.endsWith(".ndjson"));

    const outputs: any[] = [];

    for (const file of files) {
      const filePath = path.join(deviceDir, file);
      const rows = await readNdjson(filePath);
      if (!rows.length) continue;

      const last = rows.at(-1);
      // key 用文件名去掉 .ndjson
       if (!last) continue; // 🔹 额外保护
      outputs.push({
        key: file.replace(".ndjson", ""),
        type: last.type,
        pin: last.pin,
        name: last.name,
        sensor: last.sensor,
        temperature: last.temperature,
        humidity: last.humidity,
        illumination: last.illumination,
        co2: last.co2,
        o2: last.o2,
        raw: last.raw,
        ts: last.ts,
      });
    }

    if (!outputs.length) continue;

    allDevices.push({
      device,
      outputs,
      order: sortMap.get(device)?.order ?? 9999,
      pinned: !!pinMap.get(device),
      label: labelMap.get(device)?.label ?? device,
      hidden: hiddenMap.get(device)?.hidden ?? false,
    });
  }

  // 过滤 hidden
  const visible = allDevices.filter((d) => !d.hidden);

  // 排序：pinned → order
  visible.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return (a.order ?? 9999) - (b.order ?? 9999);
  });

  return NextResponse.json({ ok: true, data: visible });
}
