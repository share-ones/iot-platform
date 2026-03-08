// lib/deviceConfig.ts

export type DeviceKind = "air" | "light" | "stm32f103c8t6-01" | "soil" | "relay";

export type DeviceStatusConfig = {
  offlineAfterMs: number;
};

export const DEFAULT_CONFIG: DeviceStatusConfig = {
  offlineAfterMs: 5 * 60 * 1000, // 默认 5 分钟
};

export const DEVICE_KIND_CONFIG: Partial<
  Record<DeviceKind, DeviceStatusConfig>
> = {
  air: {
    offlineAfterMs: 5 * 60 * 1000,
  },
  "stm32f103c8t6-01": {
    offlineAfterMs: 10 * 60 * 1000,
  },
  soil: {
    offlineAfterMs: 15 * 60 * 1000, // 土壤变化慢
  },
  relay: {
    offlineAfterMs: 60 * 60 * 1000, // 继电器可能几小时不动
  },
};
