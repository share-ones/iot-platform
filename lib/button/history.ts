import fs from "fs";
import path from "path";
import { DATA_DIR } from "../paths";
import { readNdjson } from "../ndjson";
/*
export async function getHistory(device: string, kind: string, range: string) {
  const now = Date.now();
  let since = 0;

  if (range === "1h") since = now - 1 * 60 * 60 * 1000;
  if (range === "24h") since = now - 24 * 60 * 60 * 1000;
  if (range === "7d") since = now - 7 * 24 * 60 * 60 * 1000;

  const baseDir = path.join(DATA_DIR, "archive", kind);

  if (!fs.existsSync(baseDir)) return [];

  const days = fs
    .readdirSync(baseDir)
    .filter((d) => fs.statSync(path.join(baseDir, d)).isDirectory())
    .sort();

  const needDays =
    since > 0
      ? days.filter((d) => {
          const dayTs = new Date(`${d}T00:00:00`).getTime();
          const nextDayTs = dayTs + 24 * 60 * 60 * 1000;
          return nextDayTs >= since;
        })
      : days;

  const all: any[] = [];

  for (const day of needDays) {
    const file = path.join(baseDir, day, `${device}.ndjson`);
    if (!fs.existsSync(file)) continue;
    const rows = await readNdjson(file); 
    all.push(...rows);
  }

  const filtered = since > 0 ? all.filter((r) => r.ts >= since) : all;
  filtered.sort((a, b) => a.ts - b.ts);

  return filtered;
}
*/
export async function getHistory(device: string, kind: string, range: string) {
  const now = Date.now();

  const RANGE_MAP: Record<string, number> = {
    "1h": 1 * 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
  };

  const since = RANGE_MAP[range] ? now - RANGE_MAP[range] : 0;

  const baseDir = path.join(DATA_DIR, "archive", kind);
  if (!fs.existsSync(baseDir)) return [];

  const days = fs.readdirSync(baseDir).filter((d) => {
    return fs.statSync(path.join(baseDir, d)).isDirectory();
  });

  const needDays = since
    ? days.filter((d) => {
        const dayTs = Date.parse(d);
        if (Number.isNaN(dayTs)) return false;
        return dayTs + 86400000 >= since;
      })
    : days;

  const all: any[] = [];

  for (const day of needDays) {
    const file = path.join(baseDir, day, `${device}.ndjson`);
    if (!fs.existsSync(file)) continue;

    const rows = await readNdjson(file);
    if (Array.isArray(rows)) {
      all.push(...rows);
    }
  }

  const filtered = since
    ? all.filter((r) => typeof r.ts === "number" && r.ts >= since)
    : all.filter((r) => typeof r.ts === "number");

  filtered.sort((a, b) => a.ts - b.ts);

  return filtered;
}
