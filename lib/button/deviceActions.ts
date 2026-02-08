//C:\Users\one\Documents\neww\lib\button\deviceActions.ts
/*
import fs from "fs";
import path from "path";

const NDJSON_DIR = path.join(process.cwd(), "data", "ndjson");

function readLines(file: string) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf-8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map(l => JSON.parse(l));
}

function writeLines(file: string, lines: any[]) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, lines.map(l => JSON.stringify(l)).join("\n") + "\n", "utf-8");
}

export function moveDevice(device: string, dir: "up" | "down") {
  const file = path.join(NDJSON_DIR, "sort.ndjson");
  const lines = readLines(file);

  // 如果没有该设备，加入末尾
  if (!lines.find(x => x.device === device)) {
    lines.push({ device, order: 9999 });
  }

  const sorted = lines.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
  const index = sorted.findIndex(x => x.device === device);

  if (dir === "up" && index > 0) {
    [sorted[index - 1], sorted[index]] = [sorted[index], sorted[index - 1]];
  }
  if (dir === "down" && index < sorted.length - 1) {
    [sorted[index + 1], sorted[index]] = [sorted[index], sorted[index + 1]];
  }

  // 重新编号
  sorted.forEach((x, i) => (x.order = i + 1));
  writeLines(file, sorted);
}

export function pinDevice(device: string) {
  const file = path.join(NDJSON_DIR, "pin.ndjson");
  const lines = readLines(file);
  if (!lines.find(x => x.device === device)) {
    lines.push({ device, pinned: true });
    writeLines(file, lines);
  }
}

export function renameDevice(device: string, label: string) {
  const file = path.join(NDJSON_DIR, "label.ndjson");
  const lines = readLines(file);
  const idx = lines.findIndex(x => x.device === device);
  if (idx === -1) {
    lines.push({ device, label });
  } else {
    lines[idx].label = label;
  }
  writeLines(file, lines);
}

export function hideDevice(device: string) {
  const file = path.join(NDJSON_DIR, "hidden.ndjson");
  const lines = readLines(file);
  const idx = lines.findIndex(x => x.device === device);
  if (idx === -1) {
    lines.push({ device, hidden: true });
  } else {
    lines[idx].hidden = true;
  }
  writeLines(file, lines);
}
*/

// C:\Users\one\Documents\neww\lib\button\deviceActions.ts
import fs from "fs";
import path from "path";

const NDJSON_DIR = path.join(process.cwd(), "data", "ndjson");

function readLines(file: string) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf-8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map(l => JSON.parse(l));
}

function writeLines(file: string, lines: any[]) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, lines.map(l => JSON.stringify(l)).join("\n") + "\n", "utf-8");
}


function getDeviceDir(deviceNamespace?: string) {
  return deviceNamespace ? path.join(NDJSON_DIR, deviceNamespace) : NDJSON_DIR;
}

export function moveDevice(device: string, dir: "up" | "down", deviceNamespace?: string) {
  const file = path.join(getDeviceDir(deviceNamespace), "sort.ndjson");
  const lines = readLines(file);

  if (!lines.find(x => x.device === device)) {
    lines.push({ device, order: 9999 });
  }

  const sorted = lines.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
  const index = sorted.findIndex(x => x.device === device);

  if (dir === "up" && index > 0) {
    [sorted[index - 1], sorted[index]] = [sorted[index], sorted[index - 1]];
  }
  if (dir === "down" && index < sorted.length - 1) {
    [sorted[index + 1], sorted[index]] = [sorted[index + 1], sorted[index]];
  }

  sorted.forEach((x, i) => (x.order = i + 1));
  writeLines(file, sorted);
}

export function pinDevice(device: string, deviceNamespace?: string) {
  const file = path.join(getDeviceDir(deviceNamespace), "pin.ndjson");
  const lines = readLines(file);
  if (!lines.find(x => x.device === device)) {
    lines.push({ device, pinned: true });
    writeLines(file, lines);
  }
}

export function renameDevice(device: string, label: string, deviceNamespace?: string) {
  const file = path.join(getDeviceDir(deviceNamespace), "label.ndjson");
  const lines = readLines(file);
  const idx = lines.findIndex(x => x.device === device);
  if (idx === -1) {
    lines.push({ device, label });
  } else {
    lines[idx].label = label;
  }
  writeLines(file, lines);
}

export function hideDevice(device: string, deviceNamespace?: string) {
  const file = path.join(getDeviceDir(deviceNamespace), "hidden.ndjson");
  const lines = readLines(file);
  const idx = lines.findIndex(x => x.device === device);
  if (idx === -1) {
    lines.push({ device, hidden: true });
  } else {
    lines[idx].hidden = true;
  }
  writeLines(file, lines);
}
