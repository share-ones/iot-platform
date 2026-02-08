// lib/channelList.ts
"use client";

import { useEffect, useState } from "react";

export type Channel = {
  key: string;
  label: string;
  pinned?: boolean;
  order?: number;

  type?: string;
  pin?: string;
  name?: string;
  sensor?: string;

  raw?: number;
  temperature?: number;
  humidity?: number;
  illumination?: number;
  co2?: number;
  o2?: number;

  ts: number;
};

export type ChannelApiResult = {
  ok: boolean;
  data: {
    device: string;
    channels: Channel[];
  };
};

export function useChannelList(device: string) {
  const [data, setData] = useState<ChannelApiResult["data"] | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch(`/api/query/${device}`, { cache: "no-store" });
    const json = await res.json();
    if (json?.ok) setData(json.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [device]);

  return { data, loading, reload: load };
}
