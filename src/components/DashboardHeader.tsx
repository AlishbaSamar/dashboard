import { RefreshButton } from "./RefreshButton";

export function DashboardHeader({ lastUpdated }: { lastUpdated: Date }) {
  const timeLabel = lastUpdated.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Webinar Dashboard</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Registrants, attendance, and watch time from eWebinar.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-page-plane ring-1 ring-[var(--border-hairline)] px-2.5 py-1 text-xs font-medium text-text-secondary">
          <span
            className="h-1.5 w-1.5 rounded-full bg-status-good"
            aria-hidden
          />
          Live &middot; updated {timeLabel}
        </span>
        <RefreshButton />
      </div>
    </header>
  );
}
