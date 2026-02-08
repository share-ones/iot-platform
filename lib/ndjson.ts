//C:\Users\one\Documents\neww\lib\ndjson.ts
import fs from "fs";
import readline from "readline";

export type NDJSONItem = Record<string, any>;

export async function appendNdjson(filePath: string, item: NDJSONItem) {
  const line = JSON.stringify(item);
  await fs.promises.mkdir(require("path").dirname(filePath), { recursive: true });
  await fs.promises.appendFile(filePath, line + "\n");
}

export async function readNdjson(filePath: string) {
  if (!fs.existsSync(filePath)) return [];

  const stream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  const items: NDJSONItem[] = [];
  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      items.push(JSON.parse(line));
    } catch (e) {
      // 忽略坏数据
    }
  }
  return items;
}
