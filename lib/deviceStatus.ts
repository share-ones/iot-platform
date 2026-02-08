// lib/deviceStatus.ts

import { DEVICE_KIND_CONFIG, DEFAULT_CONFIG, DeviceKind } from "./deviceConfig";

type OnlineCheckOptions = {
  kind?: DeviceKind;
  now?: number;
};

export function getOfflineThresholdMs(kind?: DeviceKind): number {
  if (!kind) return DEFAULT_CONFIG.offlineAfterMs;
  return (
    DEVICE_KIND_CONFIG[kind]?.offlineAfterMs ??
    DEFAULT_CONFIG.offlineAfterMs
  );
}

export function isDeviceOnline(
  ts: number,
  options?: OnlineCheckOptions
): boolean {
  const now = options?.now ?? Date.now();
  const threshold = getOfflineThresholdMs(options?.kind);
  return now - ts <= threshold;
}
