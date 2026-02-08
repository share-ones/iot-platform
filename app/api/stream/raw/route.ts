// app/api/stream/air/route.ts

export const runtime = "nodejs";

import { createSSEStream } from "@/lib/sse/stream";

export async function GET() {
  return createSSEStream("raw");
}
