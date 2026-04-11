"use client";

import { useSavedTrips } from "@/hooks/use-saved-trips";
import { MouseEvent } from "react";

type SaveTripButtonProps = {
  tripId: string;
  variant?: "icon" | "full";
  preventNavigation?: boolean;
  className?: string;
};

function BookmarkIcon({ saved }: { saved: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill={saved ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export function SaveTripButton({
  tripId,
  variant = "icon",
  preventNavigation = false,
  className = "",
}: SaveTripButtonProps) {
  const { isReady, isSaved, toggleSaved } = useSavedTrips();
  const saved = isReady && isSaved(tripId);
  const label = saved ? "Unsave trip" : "Save trip";

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (preventNavigation) {
      event.preventDefault();
      event.stopPropagation();
    }

    toggleSaved(tripId);
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        aria-pressed={saved}
        className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
          saved
            ? "border-black bg-black text-white hover:bg-slate-900"
            : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
        } ${className}`}
      >
        <BookmarkIcon saved={saved} />
        <span>{saved ? "Saved" : "Save Trip"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      aria-pressed={saved}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
        saved
          ? "border-black bg-black text-white"
          : "border-slate-300 bg-white/95 text-slate-700 hover:bg-slate-100"
      } ${className}`}
    >
      <BookmarkIcon saved={saved} />
    </button>
  );
}
