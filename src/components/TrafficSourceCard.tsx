import type { SourceCount } from "@/lib/metrics";
import { Card } from "./Card";

export function TrafficSourceCard({ data }: { data: SourceCount[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const top = data.slice(0, 6);

  return (
    <Card title="Traffic sources" subtitle="Registrants by UTM source">
      {top.length === 0 ? (
        <p className="text-sm text-text-muted py-10 text-center">No data in this period.</p>
      ) : (
        <ul className="space-y-3">
          {top.map((d) => (
            <li key={d.source}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-text-secondary truncate pr-2">{d.source}</span>
                <span className="tabular-nums text-text-primary font-medium shrink-0">{d.count}</span>
              </div>
              <div className="h-2 w-full rounded bg-page-plane overflow-hidden">
                <div
                  className="h-full rounded"
                  style={{
                    width: `${(d.count / max) * 100}%`,
                    backgroundColor: "var(--series-1)",
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
