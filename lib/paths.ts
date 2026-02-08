//C:\Users\one\Documents\neww\lib\paths.ts
import path from "path";

export const DATA_ROOT = path.join(process.cwd(), "data");

export const PATHS = {
  live: {
    root: path.join(DATA_ROOT, "live"),
    air: path.join(DATA_ROOT, "live", "air"),
      "stm32f103c8t6-01": path.join(DATA_ROOT, "live", "stm32f103c8t6-01"),
    soil: path.join(DATA_ROOT, "live", "soil"),
    relay: path.join(DATA_ROOT, "live", "relay"),
  },
  archive: {
    root: path.join(DATA_ROOT, "archive"),
    air: path.join(DATA_ROOT, "archive", "air"),
    soil: path.join(DATA_ROOT, "archive", "soil"),
    relay: path.join(DATA_ROOT, "archive", "relay"),
      "stm32f103c8t6-01": path.join(DATA_ROOT, "archive", "stm32f103c8t6-01"),
  },
  ndjson: {
    root: path.join(DATA_ROOT, "ndjson"),
    sort: path.join(DATA_ROOT, "ndjson", "sort.ndjson"),
    label: path.join(DATA_ROOT, "ndjson", "label.ndjson"),
    "stm32f103c8t6-01": path.join(DATA_ROOT, "ndjson", "stm32f103c8t6-01.ndjson"),
  },
} as const;

import { fileURLToPath } from "url";

/**
 * 由于 Next.js 的 App Router 是 ESM 环境，
 * 所以 __dirname 不能直接用，需要用下面方式计算
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 项目根目录
 * 你现在的结构是：
 * neww/
 *   ├ app/
 *   ├ data/
 *   ├ lib/
 */
export const ROOT_DIR = path.join(__dirname, "..");

/**
 * data 目录
 */
export const DATA_DIR = path.join(ROOT_DIR, "data");

