//C:\server\server\app\page.tsx
"use client"; // 必须加，因为 useState/useEffect 只能在客户端组件使用
import { useState, useEffect } from "react";
import Section from "../components/Section/Section";
import ServerLinks from "../components/ServerLinks";
import GlobalSearch from "../components/search/GlobalSearch";
import AirSensors from "../components/air/AirSensors";
import STM32F103C8T6 from "../components/STM32/STM32F103C8T6-01";
import UserMenu from "../components/UserMenu";


export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  return (
    <main className="p-6 bg-gray-100 min-h-screen text-gray-900">
        {/* 右上角按钮 */}
        <div className="absolute top-4 right-4 space-x-2">
        {!userId ? (
          <>
            <a
              href="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              登录
            </a>
            <a
              href="/register"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              注册
            </a>
          </>
        ) : (
          <UserMenu />
        )}
        </div>
      <h1 className="text-2xl font-bold mb-6">设备监控系统</h1>
        {/* ✅ 全局搜索 */}
      <GlobalSearch />

      <ServerLinks />



      {/* 未来模块先保留 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* 温湿度传感器（用 AirSensors 组件显示） */}
        <Section title="温湿度传感器">
          <AirSensors />
        </Section>
        <Section title="STM32">
          <STM32F103C8T6 />
        </Section>
        <Section title="原始传感器数据"/>
        <Section title="土壤温湿度" />
        <Section title="继电器" />
        <Section title="传感器计算后数据" />
        <Section title="限位" />
        <Section title="创建" />
        <Section title="区间温控（带行程保护）" />
        <Section title="摄像头监控（多路）" />
      </div>
    </main>
  );
}
