//C:\server\server\app\register\page.tsx

"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function register() {
  setMessage(null);

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
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      setMessage({ type: "success", text: "注册成功！" });

      // ✅ 这里拿到用户 ID
      console.log("注册成功，用户 ID:", data.userId);

      // 可以直接存到 localStorage，或者后续自动登录
      localStorage.setItem("userId", data.userId);

      // 可选：自动跳转到登录页面
      window.location.href = "/login";

    } else {
      setMessage({ type: "error", text: data.error || "注册失败，请重试" });
    }
  } catch (e) {
    setMessage({ type: "error", text: "服务器繁忙，请检查网络或稍后重试" });
  }

  setLoading(false);
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">注册</h2>

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
          onClick={register}
          disabled={loading}
          className={`w-full p-3 rounded text-white ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
        >
          {loading ? "注册中..." : "注册"}
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
          已有账号？{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            登录
          </a>
        </p>
      </div>
    </div>
  );
}