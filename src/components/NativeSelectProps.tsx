import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  labelClass?:string,
  options: SelectOption[];
  placeholder?: string;
}

export default function NativeSelect({
  label,
  labelClass="",
  options,
  placeholder = "Pilih ",
  className = "",
  ...props
}: Readonly<NativeSelectProps>) {
  return (
    <div className="w-64 text-left">
      {label && (
        <label htmlFor={props.id || props.name} className={`block text-sm font-medium  mb-1  ${labelClass} `}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Elemen Select Bawaan */}
        <select
          {...props}
          className={`block w-full appearance-none rounded-md bg-white px-3 py-2 pr-10 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all cursor-pointer ${className}`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Ikon Panah Kustom (Klik akan menembus ke select karena pointer-events-none) */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}
