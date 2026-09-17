"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DayCount } from "@/lib/metrics";
import { Card } from "./Card";

const SERIES_COLOR = "var(--series-1)";

function formatDateTick(value: string) {
  const d = new Date(value);
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function TrendTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md bg-surface-1 ring-1 ring-[var(--border-hairline)] px-3 py-2 text-xs shadow-sm">
      <p className="text-text-muted">
        {label ? new Date(label).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) : ""}
      </p>
      <p className="mt-1 font-semibold text-text-primary">{payload[0].value} registrants</p>
    </div>
  );
}

export function RegistrantsTrendChart({ data }: { data: DayCount[] }) {
  if (data.length === 0) {
    return (
      <Card title="Daily registrants" subtitle="Registrations over the selected period">
        <p className="text-sm text-text-muted py-10 text-center">No registrants in this period.</p>
      </Card>
    );
  }

  return (
    <Card title="Daily registrants" subtitle="Registrations over the selected period">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="registrantsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={SERIES_COLOR} stopOpacity={0.1} />
                <stop offset="100%" stopColor={SERIES_COLOR} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--gridline)" strokeWidth={1} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateTick}
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={{ stroke: "var(--baseline)" }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip content={<TrendTooltip />} />
            <Area
              type="monotone"
              dataKey="registrants"
              stroke={SERIES_COLOR}
              strokeWidth={2}
              fill="url(#registrantsFill)"
              dot={false}
              activeDot={{ r: 4, stroke: "var(--surface-1)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
