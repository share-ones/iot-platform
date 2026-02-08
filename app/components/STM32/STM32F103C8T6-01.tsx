"use client";

import { useEffect } from "react";
import { useSearch } from "@/app/components/search/SearchContext";
import DeviceActions from "../device/DeviceActions";
import { isDeviceOnline } from "@/lib/deviceStatus";

// 改造后的 hook，支持 SSE
import { useChannelDeviceList } from "@/lib/device/channelDeviceList";

export default function STM32F103C8T6_01() {
  const { keyword } = useSearch();
  const { list, loading, rename, hide, pin, move } =
    useChannelDeviceList("stm32f103c8t6-01", true); // stream = true

  if (loading && list.length === 0) {
    return <div className="p-3 text-sm text-gray-500">加载中…</div>;
  }

  if (!list.length) {
    return <div className="p-3 text-sm text-gray-400">暂无数据</div>;
  }

  // 搜索过滤
  const filteredList = list.filter(ch =>
    keyword ? (ch.label ?? ch.key).toLowerCase().includes(keyword.toLowerCase()) : true
  );

  return (
    <div className="space-y-3">
      {filteredList.map(ch => {
        const online = isDeviceOnline(ch.ts, { kind: "stm32f103c8t6-01" });

        return (
          <div
            key={ch.key}
            className={`p-3 rounded-lg bg-white border shadow-sm ${
              online ? "" : "opacity-80 border-dashed"
            }`}
          >
            {/* 顶部信息 */}
            <div className="flex justify-between items-center">
              <div className="font-semibold text-sm flex items-center gap-2">
                {ch.label || ch.key}
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    online ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {online ? "在线" : "离线"}
                </span>
              </div>
              <div className="text-xs text-gray-400">
                {new Date(ch.ts).toLocaleTimeString()}
              </div>
            </div>

            {/* 数据展示 */}
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              {ch.raw !== undefined && <Value label="Raw" value={ch.raw} />}
              {ch.temperature !== undefined && <Value label="温度" value={`${ch.temperature} ℃`} />}
              {ch.humidity !== undefined && <Value label="湿度" value={`${ch.humidity} %`} />}
              {ch.illumination !== undefined && <Value label="光照" value={ch.illumination} />}
              {ch.co2 !== undefined && <Value label="CO₂" value={ch.co2} />}
              {ch.o2 !== undefined && <Value label="O₂" value={ch.o2} />}
            </div>

            {/* 操作按钮 */}
            <DeviceActions
              device={ch.key}
              ts={ch.ts}
              onRename={label => rename(ch.key, label)}
              onDelete={() => hide(ch.key)}
              onPin={() => pin(ch.key)}
              onMoveUp={() => move(ch.key, "up")}
              onMoveDown={() => move(ch.key, "down")}
              onHistory={() =>
                window.open(`/stm32f103c8t6-01/${ch.key}`, "_blank")
              }
            />
          </div>
        );
      })}
    </div>
  );
}

function Value({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}
