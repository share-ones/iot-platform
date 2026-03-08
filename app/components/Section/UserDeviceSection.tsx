"use client";

import { useEffect, useState } from "react";

type Device = {
  id: string;
  deviceId: string;
  name?: string;
};

export default function UserDeviceSection({ userId }: { userId: string }) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDevices() {
      try {
        const res = await fetch(`/api/devices?userId=${userId}`);
        const data = await res.json();
        setDevices(data.devices || []);
      } catch (err) {
        console.error("获取用户设备失败", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDevices();
  }, [userId]);

  if (loading) return <p>加载中...</p>;

  if (!devices.length) return <p>暂无设备数据</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {devices.map((device) => (
        <div key={device.id} className="p-4 bg-white rounded shadow">
          <h3 className="font-bold">{device.name || device.deviceId}</h3>
          <p>设备ID: {device.deviceId}</p>
        </div>
      ))}
    </div>
  );
}