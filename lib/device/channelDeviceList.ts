"use client";

import { useCallback, useEffect, useState } from "react";
import { Channel } from "@/lib/device/channelList";

export function useChannelDeviceList(device: string, stream = true) {
  const [list, setList] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch(`/api/query/${device}`, { cache: "no-store" });
    const json = await res.json();
    if (json?.ok && Array.isArray(json.data?.channels)) {
      setList(json.data.channels);
    }
    setLoading(false);
  }, [device]);

  useEffect(() => {
    load();

    if (!stream) return;

    const es = new EventSource(`/api/stream/${device}`);
    es.addEventListener("update", (e) => {
      const next: Channel = JSON.parse(e.data);
      setList(prev => {
        const map = new Map(prev.map(ch => [ch.key, ch]));
        map.set(next.key, { ...map.get(next.key), ...next });
        return Array.from(map.values());
      });
    });

    return () => es.close();
  }, [device, stream, load]);

  async function post(action: any) {
    await fetch(`/api/manage/${device}`, {
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
    rename: (key: string, label: string) => post({ action: "rename", key, label }),
    hide: (key: string) => post({ action: "hide", key }),
    pin: (key: string) => post({ action: "pin", key }),
    move: (key: string, dir: "up" | "down") => post({ action: "move", key, dir }),
  };
}
