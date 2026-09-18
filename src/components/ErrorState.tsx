"use client";

import { useRouter } from "next/navigation";
import { Logo } from "./Logo";

export function ErrorState({
  message,
  onRetry,
  backHref,
}: {
  message: string;
  onRetry?: () => void;
  backHref?: string;
}) {
  const router = useRouter();
  const handleRetry = onRetry ?? (() => router.refresh());

  return (
    <div className="mx-auto min-w-0 max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <Logo />
        <h1 className="text-xl font-semibold text-text-primary">Webinar Dashboard</h1>
      </div>

      <div className="mx-auto max-w-md rounded-xl bg-surface-1 ring-1 ring-[var(--border-hairline)] p-8 text-center">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-page-plane">
          <svg
            className="h-5 w-5 text-status-critical"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          </svg>
        </div>
        <h2 className="text-sm font-semibold text-text-primary">Couldn&apos;t load dashboard data</h2>
        <p className="mt-2 text-sm text-text-secondary">{message}</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-md bg-series-1 px-4 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
          {backHref && (
            <a
              href={backHref}
              className="rounded-md ring-1 ring-[var(--border-hairline)] px-4 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-page-plane transition-colors"
            >
              Back to dashboard
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
