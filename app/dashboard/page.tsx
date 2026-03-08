"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  async function bindDevice() {
    const res = await fetch("/api/device/bind", {
      method: "POST",
      body: JSON.stringify({
        userId,
        deviceId,
      }),
    });

    const data = await res.json();
    alert(JSON.stringify(data));
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>我的设备</h1>

      <p>用户ID: {userId}</p>

      <input
        placeholder="输入 deviceId"
        value={deviceId}
        onChange={(e) => setDeviceId(e.target.value)}
      />

      <button onClick={bindDevice}>绑定设备</button>
    </div>
  );
}