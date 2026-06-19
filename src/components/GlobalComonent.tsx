"use client";

import React from "react";

interface SwitchButtonProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export default function SwitchButton({
  checked,
  onChange,
  label,
  disabled = false,
}: Readonly<SwitchButtonProps>) {
  return (
    <label 
      className={`inline-flex items-center gap-3 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } select-none`}
    >
      {/* Tombol Kapsul Luar */}
      <button
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 ${
          checked ? "bg-indigo-600" : "bg-gray-200"
        }`}
      >
        {/* Bulatan Putih Dalam */}
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>

      {/* Label Teks (Jika Dioper dari Props) */}
      {label && (
        <span className="text-sm font-medium text-gray-700">
          {label}
        </span>
      )}
    </label>
  );
}
