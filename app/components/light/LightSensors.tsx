"use client";

import { useDeviceList, Device } from "@/lib/device/deviceList";
import DeviceActions from "../device/DeviceActions";
import { useSearch } from "../search/SearchContext";
import { isDeviceOnline } from "@/lib/deviceStatus";

export type LightData = Device;

export default function AirSensors() {
  const { list, loading, rename, hide, pin, move } =
    useDeviceList<LightData>("light", true);

  const { keyword } = useSearch();

  if (loading && list.length === 0) {
    return <div className="loading-text">正在加载传感器数据…</div>;
  }

  if (!list.length) {
    return <div className="empty-text">暂无传感器数据</div>;
  }

  return (
    <div className="device-list">
      {list
        .filter(d =>
          keyword ? (d.label ?? d.device).includes(keyword) : true
        )
        .map(data => {
          const online = isDeviceOnline(data.ts, { kind: "air" });

          return (
            <div
              key={data.device}
              className={`device-card ${
                online ? "" : "device-card-offline"
              }`}
            >
              {/* 顶部 */}
              <div className="device-header">
                <div className="device-title">
                  {data.label ?? data.device}

                  <span
                    className={`device-status ${
                      online ? "status-online" : "status-offline"
                    }`}
                  >
                    {online ? "在线" : "离线"}
                  </span>
                </div>

                <div className="device-time">
                  {new Date(data.ts).toLocaleString()}
                </div>
              </div>

              {/* 数据 */}
              <div className="device-grid">
                <Value label="温度" value={`${data.temperature} ℃`} />
                <Value label="湿度" value={`${data.humidity} %`} />
                <Value label="光照" value={`${data.lux ?? "--"} lx`} />
              </div>

              {/* 操作 */}
              <DeviceActions
                device={data.device}
                ts={data.ts}
                onMoveUp={() => move(data.device, "up")}
                onMoveDown={() => move(data.device, "down")}
                onPin={() => pin(data.device)}
                onRename={label => rename(data.device, label)}
                onDelete={() => hide(data.device)}
                onHistory={() =>
                  window.open(`/air/${data.device}`, "_blank")
                }
              />
            </div>
          );
        })}
    </div>
  );
}

function Value({
  label,
  value
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="device-item">
      <span className="device-label">{label}</span>
      <span className="device-value">{value}</span>
    </div>
  );
}