import type { Kpis } from "@/lib/metrics";
import { Card } from "./Card";

function formatCompact(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(n);
}

type Delta = { value: number; kind: "count" | "points" } | null | undefined;

function DeltaBadge({ delta, periodLabel }: { delta: Delta; periodLabel: string }) {
  if (!delta) return null;
  const rounded = Math.round(delta.value * 10) / 10;
  if (rounded === 0) {
    return <p className="mt-1.5 text-xs text-text-muted">Flat vs {periodLabel}</p>;
  }
  const isUp = rounded > 0;
  const colorClass = isUp ? "text-success-text" : "text-status-critical";
  const arrow = isUp ? "↑" : "↓";
  const magnitude =
    delta.kind === "points"
      ? `${Math.abs(rounded)} pts`
      : formatCompact(Math.abs(rounded));
  return (
    <p className={`mt-1.5 text-xs font-medium ${colorClass}`}>
      {arrow} {magnitude}
      <span className="text-text-muted font-normal"> vs {periodLabel}</span>
    </p>
  );
}

function StatTile({
  label,
  value,
  suffix,
  delta,
  periodLabel,
}: {
  label: string;
  value: string;
  suffix?: string;
  delta?: Delta;
  periodLabel?: string;
}) {
  return (
    <Card>
      <p className="text-xs font-medium text-text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-text-primary">
        {value}
        {suffix && <span className="text-lg font-medium text-text-secondary">{suffix}</span>}
      </p>
      {delta !== undefined && periodLabel && <DeltaBadge delta={delta} periodLabel={periodLabel} />}
    </Card>
  );
}

// Below this many registrants in the comparison period, percentage-based deltas
// swing wildly on tiny denominators and do more harm than good — skip them.
const MIN_COMPARISON_SAMPLE = 5;

export function KpiCards({
  kpis,
  previousKpis,
  periodLabel,
}: {
  kpis: Kpis;
  previousKpis?: Kpis | null;
  periodLabel?: string;
}) {
  const hasReliableComparison =
    !!previousKpis && !!periodLabel && previousKpis.totalRegistrants >= MIN_COMPARISON_SAMPLE;

  // Raw count difference — unlike a percentage, it stays meaningful even when the
  // comparison period had very few registrants, so this one always shows.
  const registrantsDelta: Delta =
    previousKpis && periodLabel
      ? { value: kpis.totalRegistrants - previousKpis.totalRegistrants, kind: "count" }
      : undefined;

  const showUpDelta: Delta = hasReliableComparison
    ? { value: kpis.showUpRate - previousKpis!.showUpRate, kind: "points" }
    : previousKpis && periodLabel
      ? null
      : undefined;

  const watchDelta: Delta = hasReliableComparison
    ? { value: kpis.avgWatchPercent - previousKpis!.avgWatchPercent, kind: "points" }
    : previousKpis && periodLabel
      ? null
      : undefined;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatTile
        label="Total registrants"
        value={formatCompact(kpis.totalRegistrants)}
        delta={registrantsDelta}
        periodLabel={periodLabel}
      />
      <StatTile
        label="Show-up rate"
        value={formatCompact(kpis.showUpRate)}
        suffix="%"
        delta={showUpDelta}
        periodLabel={periodLabel}
      />
      <StatTile
        label="Avg. watch time"
        value={formatCompact(kpis.avgWatchPercent)}
        suffix="%"
        delta={watchDelta}
        periodLabel={periodLabel}
      />
      <StatTile label="Active webinars" value={formatCompact(kpis.activeWebinars)} />
    </div>
  );
}
