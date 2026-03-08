//C:\server\server\app\components\air\AirSensors.tsx

"use client";

import { useDeviceList, Device } from "@/lib/device/deviceList";
import DeviceActions from "../device/DeviceActions";
import { useSearch } from "../search/SearchContext";
import { isDeviceOnline } from "@/lib/deviceStatus";

export type AirData = Device;

export default function AirSensors() {
  const { list, loading, rename, hide, pin, move } = useDeviceList<AirData>("air", true);
  const { keyword } = useSearch();

  if (loading && list.length === 0) {
    return <div className="p-3 text-sm text-gray-500">正在加载传感器数据…</div>;
  }

  if (!list.length) {
    return <div className="p-3 text-sm text-gray-500">暂无传感器数据</div>;
  }

  return (
    <div className="space-y-3">
      {list
        .filter(d => (keyword ? (d.label ?? d.device).includes(keyword) : true))
        .map(data => {
          const online = isDeviceOnline(data.ts, { kind: "air" });
          return (
            <div
              key={data.device}
              className={`p-3 border rounded-lg bg-white ${online ? "" : "opacity-80 border-dashed"}`}
            >
              <div className="flex justify-between items-center">
                <div className="font-bold flex items-center gap-2">
                  {data.label ?? data.device}
                  <span className={`text-xs px-2 py-0.5 rounded ${online ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                    {online ? "在线" : "离线"}
                  </span>
                </div>
                <div className="text-xs text-gray-500">{new Date(data.ts).toLocaleString()}</div>
              </div>

              <div className="mt-2">🌡 温度：{data.temperature} ℃</div>
              <div>💧 湿度：{data.humidity} %</div>
              

              <DeviceActions
                device={data.device}
                ts={data.ts}
                onMoveUp={() => move(data.device, "up")}
                onMoveDown={() => move(data.device, "down")}
                onPin={() => pin(data.device)}
                onRename={label => rename(data.device, label)}
                onDelete={() => hide(data.device)}
                onHistory={() => window.open(`/air/${data.device}`, "_blank")}
              />
            </div>
          );
        })}
    </div>
  );
}
