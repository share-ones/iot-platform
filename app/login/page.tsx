
//C:\server\server\app\login\page.tsx

"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">IoT 平台登录</h1>

        <input
          className="border p-2 w-full mb-4 rounded"
          placeholder="用户名"
          onChange={e => setUser(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-4 rounded"
          type="password"
          placeholder="密码"
          onChange={e => setPass(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
          onClick={() =>
            signIn("credentials", {
              username: user,
              password: pass,
              callbackUrl: "/",
            })
          }
        >
          登录
        </button>
      </div>
    </div>
  );
}
