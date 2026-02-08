// lib/deviceList.ts
"use client";

import { useCallback, useEffect, useState } from "react";

export type Device = {
  device: string;
  label?: string;
  pinned?: boolean;
  hidden?: boolean;
  ts: number;
  [key: string]: any;
};

export function useDeviceList<T extends Device>(kind: string, stream = false) {
  const [list, setList] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch(`/api/query/${kind}`, { cache: "no-store" });
    const json = await res.json();
    if (json?.ok && Array.isArray(json.data)) {
      setList(json.data);
    }
    setLoading(false);
  }, [kind]);

  useEffect(() => {
    load();

    if (!stream) return;

    const es = new EventSource(`/api/stream/${kind}`);
    es.addEventListener("update", (e) => {
      const next = JSON.parse(e.data);
      setList((prev: any[]) => {
        const map = new Map(prev.map((i) => [i.device, i]));
        map.set(next.device, { ...map.get(next.device), ...next });
        return Array.from(map.values());
      });
    });

    return () => es.close();
  }, [kind, stream, load]);

  async function post(action: any) {
    await fetch(`/api/manage/${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action),
    });
    await load();
  }

  return {
    list,
    loading,
    reload: load,
    rename: (device: string, label: string) => post({ action: "rename", device, label }),
    hide: (device: string) => post({ action: "hide", device }),
    pin: (device: string) => post({ action: "pin", device }),
    move: (device: string, dir: "up" | "down") => post({ action: "move", device, dir }),
  };
}
