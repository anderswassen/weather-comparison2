'use client';

import { useState, KeyboardEvent } from 'react';

interface LocationInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  disabled?: boolean;
}

export function LocationInput({
  label,
  placeholder = 'Enter a Swedish location',
  value,
  onChange,
  onSearch,
  disabled = false,
}: LocationInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
      />
    </div>
  );
}
