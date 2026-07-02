"use client";

import { useState, useCallback } from "react";

export default function SearchBar({
  onSearch,
  placeholder = "Search markets...",
}: {
  onSearch: (query: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setValue(v);
      onSearch(v);
    },
    [onSearch]
  );

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-bg-card border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue/50 transition-colors"
      />
    </div>
  );
}
