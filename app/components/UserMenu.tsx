"use client";

import { useState, useEffect } from "react";

export default function UserMenu() {
  const [userId, setUserId] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("userId");
    if (stored) setUserId(stored);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
    window.location.href = "/"; // 登出后刷新首页
  };

  if (!userId) return null; // 未登录不显示头像

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold hover:bg-blue-700"
      >
        U
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2">
          <a
            href="/dashboard"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            我的设备
          </a>

          <a
            href="/user"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            我的账户
          </a>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            登出
          </button>
        </div>
      )}
    </div>
  );
}