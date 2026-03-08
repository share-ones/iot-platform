//C:\Users\one\Documents\neww\lib\fileDB.ts
import fs from "fs";
import { PATHS } from "./paths";

export type Kind = "air" | "soil" | "light" | "relay" |"stm32f103c8t6-01";

export function getLiveDir(kind: Kind) {
  return PATHS.live[kind];
}

export function getLivePath(kind: Kind, device: string) {
  return `${getLiveDir(kind)}/${device}.ndjson`;
}

// 排序 / 标签路径
export function getSortPath() {
  return PATHS.ndjson.sort;
}

export function getLabelPath() {
  return PATHS.ndjson.label;
}

// 读取/写入 sort.ndjson
export function readSort() {
  const p = getSortPath();
  if (!fs.existsSync(p)) return [];
  const raw = fs.readFileSync(p, "utf-8").trim();
  if (!raw) return [];
  return raw.split("\n").map((x) => JSON.parse(x));
}

export function writeSort(data: any[]) {
  const p = getSortPath();
  fs.mkdirSync(PATHS.ndjson.root, { recursive: true });
  fs.writeFileSync(p, data.map((x) => JSON.stringify(x)).join("\n"), "utf-8");
}

// 读取/写入 label.ndjson
export function readLabel() {
  const p = getLabelPath();
  if (!fs.existsSync(p)) return {};
  const raw = fs.readFileSync(p, "utf-8").trim();
  if (!raw) return {};
  const obj: Record<string, string> = {};
  raw.split("\n").forEach((line) => {
    const { device, label } = JSON.parse(line);
    obj[device] = label;
  });
  return obj;
}

export function writeLabel(data: Record<string, string>) {
  const p = getLabelPath();
  fs.mkdirSync(PATHS.ndjson.root, { recursive: true });
  const lines = Object.entries(data).map(([device, label]) => JSON.stringify({ device, label }));
  fs.writeFileSync(p, lines.join("\n"), "utf-8");
}



