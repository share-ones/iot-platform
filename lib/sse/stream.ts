// lib/sse/stream.ts
export function createSSEStream(kind: string) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      globalThis.__sseSubscribers ??= {};
      globalThis.__sseSubscribers[kind] ??= new Set();

      const set = globalThis.__sseSubscribers[kind];
      set.add(controller);

      controller.enqueue(
        encoder.encode(`event: hello\ndata: ${kind} connected\n\n`)
      );
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
