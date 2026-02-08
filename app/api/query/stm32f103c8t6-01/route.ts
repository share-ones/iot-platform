//C:\server\server\app\api\query\stm32f103c8t6-01\route.ts

import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { readNdjson } from "@/lib/ndjson";

const DEVICE_NS = "stm32f103c8t6"; // 命名空间，对应 ndjson 子目录

/** 读取控制 ndjson → Map(key => obj) */
function loadMap(file: string, key: string) {
  if (!fs.existsSync(file)) return new Map<string, any>();
  const lines = fs.readFileSync(file, "utf-8").split("\n").filter(Boolean);
  const map = new Map<string, any>();
  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      map.set(obj[key], obj);
    } catch {}
  }
  return map;
}

/** 自动保证设备/通道存在 ndjson 控制文件 */
function ensureDeviceEntry(key: string) {
  const ndjsonDir = path.join(process.cwd(), "data/ndjson", DEVICE_NS);
  fs.mkdirSync(ndjsonDir, { recursive: true });

  const sortFile = path.join(ndjsonDir, "sort.ndjson");
  const pinFile = path.join(ndjsonDir, "pin.ndjson");
  const labelFile = path.join(ndjsonDir, "label.ndjson");
  const hiddenFile = path.join(ndjsonDir, "hidden.ndjson");

  const files = [
    { file: sortFile, default: { device: key, order: 9999 } },
    { file: pinFile, default: { device: key, pinned: false } },
    { file: labelFile, default: { device: key, label: "" } },
    { file: hiddenFile, default: { device: key, hidden: false } },
  ];

  for (const { file, default: def } of files) {
    const lines = fs.existsSync(file)
      ? fs.readFileSync(file, "utf-8")
          .split("\n")
          .filter(Boolean)
          .map(l => JSON.parse(l))
      : [];
    if (!lines.find(x => x.device === key)) {
      lines.push(def);
      fs.writeFileSync(file, lines.map(l => JSON.stringify(l)).join("\n") + "\n", "utf-8");
    }
  }
}

export async function GET() {
  const device = "stm32f103c8t6-01";

  /** live 数据目录 */
  const deviceDir = path.join(process.cwd(), "data/live", device);

  if (!fs.existsSync(deviceDir)) {
    return NextResponse.json({ ok: true, data: { device, channels: [] } });
  }

  /** 读取控制文件 */
  const ctrlDir = path.join(process.cwd(), "data/ndjson", DEVICE_NS);
  const sortMap = loadMap(path.join(ctrlDir, "sort.ndjson"), "device");
  const labelMap = loadMap(path.join(ctrlDir, "label.ndjson"), "device");
  const pinMap = loadMap(path.join(ctrlDir, "pin.ndjson"), "device");
  const hiddenMap = loadMap(path.join(ctrlDir, "hidden.ndjson"), "device");

  /** 读取所有通道 */
  const files = fs.readdirSync(deviceDir).filter(f => f.endsWith(".ndjson"));
  const channels: any[] = [];

  for (const file of files) {
    const filePath = path.join(deviceDir, file);
    const rows = await readNdjson(filePath);
    if (!rows.length) continue;

    // 只取最后一条 type === "data" 的行
    const lastData = [...rows].reverse().find(r => r.type === "data");
    if (!lastData) continue;

    const key = file.replace(".ndjson", "");

    ensureDeviceEntry(key);

    if (hiddenMap.get(key)?.hidden) continue;

    channels.push({
      key,
      label: labelMap.get(key)?.label ?? `${lastData.type}-${lastData.pin}`,
      pinned: !!pinMap.get(key),
      order: sortMap.get(key)?.order ?? 9999,
      type: lastData.type,
      pin: lastData.pin,
      name: lastData.name,
      sensor: lastData.sensor,
      raw: lastData.raw,
      temperature: lastData.temperature,
      humidity: lastData.humidity,
      illumination: lastData.illumination,
      co2: lastData.co2,
      o2: lastData.o2,
      ts: lastData.ts,
    });
  }

  /** 排序：pinned → order */
  channels.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return a.order - b.order;
  });

  return NextResponse.json({ ok: true, data: { device, channels } });
}
