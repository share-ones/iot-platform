//C:\server\server\lib\sse\types\global.d.ts

export {};

declare global {
  var __sseSubscribers: Record<
    string,
    Set<ReadableStreamDefaultController>
  >;
}
