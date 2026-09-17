import Link from "next/link";
import type { Range, WebinarRow } from "@/lib/metrics";
import { Card } from "./Card";

function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`;
}

export function WebinarBreakdownTable({ rows, range }: { rows: WebinarRow[]; range: Range }) {
  return (
    <Card title="By webinar" subtitle="Performance broken down per webinar" className="overflow-x-auto">
      {rows.length === 0 ? (
        <p className="text-sm text-text-muted py-10 text-center">No data in this period.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-text-muted border-b border-[var(--gridline)]">
              <th className="py-2 pr-4 font-medium">Webinar</th>
              <th className="py-2 pr-4 font-medium text-right tabular-nums">Registrants</th>
              <th className="py-2 pr-4 font-medium text-right tabular-nums">Attended</th>
              <th className="py-2 pr-4 font-medium text-right tabular-nums">Show-up rate</th>
              <th className="py-2 font-medium text-right tabular-nums">Avg. watch %</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.webinarId} className="border-b border-[var(--gridline)] last:border-0">
                <td className="py-2.5 pr-4 text-text-primary">
                  <Link
                    href={`/webinar/${row.webinarId}?range=${range}`}
                    className="hover:underline hover:text-series-1"
                  >
                    {row.webinarTitle}
                  </Link>
                </td>
                <td className="py-2.5 pr-4 text-right tabular-nums text-text-primary">{row.registrants}</td>
                <td className="py-2.5 pr-4 text-right tabular-nums text-text-secondary">{row.attended}</td>
                <td className="py-2.5 pr-4 text-right tabular-nums text-text-secondary">
                  {formatPercent(row.showUpRate)}
                </td>
                <td className="py-2.5 text-right tabular-nums text-text-secondary">
                  {formatPercent(row.avgWatchPercent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
