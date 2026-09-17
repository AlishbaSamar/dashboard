import type { Kpis } from "@/lib/metrics";
import { Card } from "./Card";

function formatCompact(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(n);
}

function StatTile({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <Card>
      <p className="text-xs font-medium text-text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-text-primary">
        {value}
        {suffix && <span className="text-lg font-medium text-text-secondary">{suffix}</span>}
      </p>
    </Card>
  );
}

export function KpiCards({ kpis }: { kpis: Kpis }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatTile label="Total registrants" value={formatCompact(kpis.totalRegistrants)} />
      <StatTile
        label="Show-up rate"
        value={formatCompact(kpis.showUpRate)}
        suffix="%"
      />
      <StatTile
        label="Avg. watch time"
        value={formatCompact(kpis.avgWatchPercent)}
        suffix="%"
      />
      <StatTile label="Active webinars" value={formatCompact(kpis.activeWebinars)} />
    </div>
  );
}
