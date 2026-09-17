import type { StateCount } from "@/lib/metrics";
import { Card } from "./Card";

const STATE_COLOR: Record<string, string> = {
  Watched: "var(--series-1)",
  Joined: "var(--series-2)",
  NotJoined: "var(--series-3)",
  Missed: "var(--series-4)",
};

const STATE_LABEL: Record<string, string> = {
  Watched: "Watched",
  Joined: "Joined (live)",
  NotJoined: "Registered, didn't join",
  Missed: "Missed",
};

export function AttendanceStateChart({ data }: { data: StateCount[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card title="Attendance breakdown" subtitle="What registrants did after signing up">
      {total === 0 ? (
        <p className="text-sm text-text-muted py-10 text-center">No data in this period.</p>
      ) : (
        <>
          <div className="flex h-6 w-full overflow-hidden rounded gap-0.5">
            {data.map((d) => (
              <div
                key={d.state}
                style={{
                  width: `${(d.count / total) * 100}%`,
                  backgroundColor: STATE_COLOR[d.state],
                }}
                title={`${STATE_LABEL[d.state]}: ${d.count}`}
              />
            ))}
          </div>
          <ul className="mt-4 space-y-2">
            {data.map((d) => (
              <li key={d.state} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-text-secondary">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: STATE_COLOR[d.state] }}
                    aria-hidden
                  />
                  {STATE_LABEL[d.state]}
                </span>
                <span className="tabular-nums text-text-primary font-medium">
                  {d.count} <span className="text-text-muted font-normal">({d.percent.toFixed(1)}%)</span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
