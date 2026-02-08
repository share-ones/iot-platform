//C:\Users\one\Documents\neww\app\components\ui\Button.tsx
"use client";

import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
};

export default function Button({
  children,
  onClick,
  variant = "secondary",
  size = "md",
  disabled,
  
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "rounded-lg font-medium transition select-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",

        size === "sm" ? "px-2 py-1 text-sm" : "px-3 py-1.5 text-sm",

        variant === "primary" &&
          "bg-blue-600 text-white hover:bg-blue-700",

        variant === "secondary" &&
          "bg-gray-200 text-gray-900 hover:bg-gray-300",

        variant === "danger" &&
          "bg-red-600 text-white hover:bg-red-700",

        variant === "ghost" &&
          "bg-transparent text-gray-600 hover:text-gray-900"
      )}
    >
      {children}
    </button>
  );
}
