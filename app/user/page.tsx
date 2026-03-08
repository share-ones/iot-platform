"use client";

import { useState, useEffect } from "react";

// 假设你有一个组件显示设备数据
import UserDeviceSection from ".././components/Section/UserDeviceSection";

export default function UserPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        请先登录才能查看个人内容
      </div>
    );
  }

  return (
    <main className="p-6 bg-gray-100 min-h-screen text-gray-900 relative">
      <h1 className="text-2xl font-bold mb-6">我的账户</h1>

      {/* 只显示属于当前用户的设备数据 */}
      <UserDeviceSection userId={userId} />
    </main>
  );
}