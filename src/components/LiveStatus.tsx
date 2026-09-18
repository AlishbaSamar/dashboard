"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export function LiveStatus() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [justClicked, setJustClicked] = useState(false);
  // null until mounted, so the initial SSR render (in the server's timezone)
  // never gets shown — this always reflects the visitor's own local time.
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  const timeLabel = lastUpdated?.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  function refresh() {
    setJustClicked(true);
    startTransition(() => router.refresh());
    setLastUpdated(new Date());
    setTimeout(() => setJustClicked(false), 600);
  }

  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-page-plane ring-1 ring-[var(--border-hairline)] px-2.5 py-1 text-xs font-medium text-text-secondary">
        <span className="h-1.5 w-1.5 rounded-full bg-status-good" aria-hidden />
        {timeLabel ? <>Live &middot; updated {timeLabel}</> : "Live"}
      </span>
      <button
        type="button"
        onClick={refresh}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-md ring-1 ring-[var(--border-hairline)] px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-page-plane transition-colors disabled:opacity-60"
      >
        <svg
          className={`h-3.5 w-3.5 ${isPending || justClicked ? "animate-spin" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-2.64-6.36" />
          <path d="M21 3v6h-6" />
        </svg>
        Refresh
      </button>
    </div>
  );
}
