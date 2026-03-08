//C:\server\server\app\login\page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
//import UserMenu from "../components/UserMenu";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function login() {
    setMessage(null);

    // 1️⃣ 前端校验
    if (!email) {
      setMessage({ type: "error", text: "请输入邮箱" });
      return;
    }
    if (!password) {
      setMessage({ type: "error", text: "请输入密码" });
      return;
    }

    setLoading(true);

    try {
      // 2️⃣ 后端请求
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: "success", text: "登录成功！正在进入系统..." });

  // 保存用户ID
          localStorage.setItem("userId", data.userId);

  // 跳转首页
        setTimeout(() => {
          router.push("/");
        }, 800);
      } else {
        // 2️⃣ 后端返回的错误
        setMessage({
          type: "error",
          text: data.error || "登录失败，请检查邮箱和密码",
        });
      }
    } catch (e) {
      // 3️⃣ 网络异常 / 服务器错误
      setMessage({
        type: "error",
        text: "服务器繁忙，请检查网络或稍后重试",
      });
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">登录</h2>

        <input
          className="w-full p-3 mb-4 border rounded"
          placeholder="邮箱"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-3 mb-4 border rounded"
          placeholder="密码"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          disabled={loading}
          className={`w-full p-3 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "登录中..." : "登录"}
        </button>

        {message && (
          <p
            className={`mt-4 text-center ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}

        <p className="mt-4 text-center text-sm">
          没有账号？{" "}
          <a href="/register" className="text-green-600 hover:underline">
            注册
          </a>
        </p>
      </div>
    </div>
  );
}