"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [justClicked, setJustClicked] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        setJustClicked(true);
        startTransition(() => router.refresh());
        setTimeout(() => setJustClicked(false), 600);
      }}
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
  );
}
