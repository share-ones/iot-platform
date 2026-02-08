//C:\Users\one\Documents\neww\app\air\[device]\page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AirHistoryPage() {
  const { device } = useParams();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"1h" | "24h" | "7d">("24h");


  useEffect(() => {
    if (!device) return;
    setLoading(true);
    fetch(`/api/query/air/history?device=${device}&range=${range}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) setData(j.data);
        else setData([]);
      })
      .finally(() => setLoading(false));
  }, [device, range]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        设备 {device} 历史温度（{range}）
      </h1>
      <div className="flex gap-2 mb-4">
        {[
        { key: "1h", label: "1 小时" },
        { key: "24h", label: "24 小时" },
        { key: "7d", label: "7 天" },
        ].map((item) => (
        <button
        key={item.key}
        onClick={() => setRange(item.key as any)}
        className={`px-3 py-1 rounded text-sm border
            ${
            range === item.key
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
        >
        {item.label}
        </button>
        ))}
        </div>


      <div className="w-full h-[400px] bg-white rounded-lg p-4 shadow-sm">
        {loading ? (
          <div className="text-gray-500">加载中…</div>
        ) : data.length === 0 ? (
          <div className="text-gray-500">暂无数据</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                {/* X 轴：时间 */}
                <XAxis
                dataKey="ts"
                tickFormatter={(v) => new Date(v).toLocaleTimeString()}
                />

                {/* 左 Y 轴：温度 */}
                <YAxis
                yAxisId="temp"
                orientation="left"
                tickFormatter={(v) => `${v}℃`}
                />

                {/* 右 Y 轴：湿度 */}
                <YAxis
                yAxisId="hum"
                orientation="right"
                tickFormatter={(v) => `${v}%`}
                domain={[0, 100]}
                />

                {/* 提示框 */}
                <Tooltip
                labelFormatter={(v) => new Date(v).toLocaleString()}
                formatter={(value, name) => {
                    if (name === "temperature") return [`${value} ℃`, "温度"];
                    if (name === "humidity") return [`${value} %`, "湿度"];
                    return value;
                }}
                />

                {/* 温度折线 */}
                <Line
                yAxisId="temp"
                type="monotone"
                dataKey="temperature"
                stroke="#ef4444"
                dot={false}
                name="temperature"
                />

                {/* 湿度折线 */}
                <Line
                yAxisId="hum"
                type="monotone"
                dataKey="humidity"
                stroke="#3b82f6"
                dot={false}
                name="humidity"
                />
                </LineChart>
            </ResponsiveContainer>

        )}
      </div>
    </div>
  );
}
