import { getAllRegistrants } from "@/lib/ewebinar";
import {
  computeKpis,
  filterByPreviousRange,
  filterByRange,
  groupByDay,
  groupByState,
  groupByUtmSource,
  groupByWebinar,
  type Range,
} from "@/lib/metrics";
import { DashboardHeader } from "@/components/DashboardHeader";
import { RangeFilter } from "@/components/RangeFilter";
import { KpiCards } from "@/components/KpiCards";
import { RegistrantsTrendChart } from "@/components/RegistrantsTrendChart";
import { WebinarBreakdownTable } from "@/components/WebinarBreakdownTable";
import { AttendanceStateChart } from "@/components/AttendanceStateChart";
import { TrafficSourceCard } from "@/components/TrafficSourceCard";
import { RegistrantsTable } from "@/components/RegistrantsTable";

function parseRange(value: string | string[] | undefined): Range {
  if (value === "7d" || value === "30d" || value === "all") return value;
  return "30d";
}

const PERIOD_LABEL: Record<Range, string | undefined> = {
  "7d": "previous 7 days",
  "30d": "previous 30 days",
  all: undefined,
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const range = parseRange(params.range);

  const allRegistrants = await getAllRegistrants();
  const registrants = filterByRange(allRegistrants, range);

  const kpis = computeKpis(registrants);
  const previousWindow = filterByPreviousRange(allRegistrants, range);
  const previousKpis = previousWindow ? computeKpis(previousWindow) : null;
  const periodLabel = PERIOD_LABEL[range];
  const daily = groupByDay(registrants);
  const byWebinar = groupByWebinar(registrants);
  const byState = groupByState(registrants);
  const bySource = groupByUtmSource(registrants);

  return (
    <div className="mx-auto min-w-0 max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <DashboardHeader />

      <RangeFilter active={range} />

      <KpiCards kpis={kpis} previousKpis={previousKpis} periodLabel={periodLabel} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RegistrantsTrendChart data={daily} />
        </div>
        <AttendanceStateChart data={byState} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WebinarBreakdownTable rows={byWebinar} range={range} />
        </div>
        <TrafficSourceCard data={bySource} />
      </div>

      <RegistrantsTable registrants={registrants} showWebinarColumn />
    </div>
  );
}
