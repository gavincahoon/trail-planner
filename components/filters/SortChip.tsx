"use client";

import { buildUpdatedQueryString } from "@/lib/trip-filters";
import { DEFAULT_SORT, parseSort, SORT_LABELS, SORT_OPTIONS, SortKey } from "@/lib/sort";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function SortChip() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedSort = parseSort(searchParams);

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

  const updateSort = (sort: SortKey) => {
    const queryString = buildUpdatedQueryString(
      new URLSearchParams(searchParams.toString()),
      { sort }
    );
    // sort is URL-driven; pushing updates reruns server rendering with the new order.
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
    setOpen(false);
  };

  const buttonLabel =
    selectedSort === DEFAULT_SORT ? "Sort" : `Sort: ${SORT_LABELS[selectedSort]}`;

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="h-10 touch-manipulation whitespace-nowrap rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      >
        {buttonLabel}
      </button>

      {open && (
        <div className="absolute left-0 top-12 z-40 min-w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => updateSort(option)}
              className={`block w-full touch-manipulation px-4 py-2 text-left text-sm transition ${
                selectedSort === option
                  ? "bg-slate-900 text-white"
                  : "text-slate-800 hover:bg-slate-50"
              }`}
            >
              {SORT_LABELS[option]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
