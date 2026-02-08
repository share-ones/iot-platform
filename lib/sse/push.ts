// lib/sse/push.ts
// lib/sse/push.ts
export function pushSSE(kind: string, data: any) {
  const set = globalThis.__sseSubscribers?.[kind];
  if (!set) return;

  for (const controller of Array.from(set)) {
    try {
      controller.enqueue(
        new TextEncoder().encode(
          `event: update\ndata: ${JSON.stringify(data)}\n\n`
        )
      );
    } catch (err) {
      // ❗ controller 已关闭，必须清理
      set.delete(controller);
    }
  }
}
