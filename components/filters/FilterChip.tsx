"use client";

import { useEffect, useRef, useState } from "react";

type FilterChipProps<T extends string> = {
  label: string;
  selectedValue: T;
  isActive: boolean;
  options: readonly T[];
  onSelect: (value: T) => void;
};

export function FilterChip<T extends string>({
  label,
  selectedValue,
  isActive,
  options,
  onSelect,
}: FilterChipProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const displayLabel = isActive ? `${label}: ${selectedValue}` : label;

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`h-10 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
          isActive
            ? "border-black bg-black text-white"
            : "border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
        }`}
      >
        {displayLabel}
      </button>

      {open && (
        <div className="absolute left-0 top-12 z-40 min-w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onSelect(option);
                setOpen(false);
              }}
              className={`block w-full px-4 py-2 text-left text-sm transition ${
                selectedValue === option
                  ? "bg-slate-900 text-white"
                  : "text-slate-800 hover:bg-slate-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
