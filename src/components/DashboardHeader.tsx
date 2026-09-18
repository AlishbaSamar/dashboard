import { Logo } from "./Logo";
import { LiveStatus } from "./LiveStatus";

export function DashboardHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Logo />
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Webinar Dashboard</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Registrants, attendance, and watch time from eWebinar.
          </p>
        </div>
      </div>
      <LiveStatus />
    </header>
  );
}
