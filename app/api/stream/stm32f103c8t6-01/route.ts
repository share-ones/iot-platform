
//C:\server\server\app\api\stream\stmf103c8t6-01\route.ts
export const runtime = "nodejs";

import { createSSEStream } from "@/lib/sse/stream";

export async function GET() {
  return createSSEStream("stm32f103c8t6-01");
}
