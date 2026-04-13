"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const showBack = pathname !== "/";
  const navLinkClass =
    "rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-md items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          {showBack && (
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              Back
            </button>
          )}
          <Link
            href="/"
            className={navLinkClass}
          >
            Trail Planner
          </Link>
          <Link href="/saved-trips" className={navLinkClass}>
            Saved
          </Link>
        </div>
      </div>
    </header>
  );
}
