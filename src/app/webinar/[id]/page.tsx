import Link from "next/link";
import { notFound } from "next/navigation";
import { EwebinarApiError, getAllRegistrants, getWebinars, type Registrant, type Webinar } from "@/lib/ewebinar";
import {
  computeKpis,
  filterByPreviousRange,
  filterByRange,
  groupByDay,
  groupByState,
  type Range,
} from "@/lib/metrics";
import { Logo } from "@/components/Logo";
import { RangeFilter } from "@/components/RangeFilter";
import { KpiCards } from "@/components/KpiCards";
import { RegistrantsTrendChart } from "@/components/RegistrantsTrendChart";
import { AttendanceStateChart } from "@/components/AttendanceStateChart";
import { RegistrantsTable } from "@/components/RegistrantsTable";
import { ErrorState } from "@/components/ErrorState";

const PERIOD_LABEL: Record<Range, string | undefined> = {
  "7d": "previous 7 days",
  "30d": "previous 30 days",
  all: undefined,
};

function parseRange(value: string | string[] | undefined): Range {
  if (value === "7d" || value === "30d" || value === "all") return value;
  return "30d";
}

function formatDuration(secs: number): string {
  const mins = Math.round(secs / 60);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default async function WebinarDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const range = parseRange(query.range);
  const webinarId = Number(id);

  let allRegistrants: Registrant[];
  let webinars: Webinar[];
  try {
    [allRegistrants, webinars] = await Promise.all([getAllRegistrants(), getWebinars()]);
  } catch (err) {
    const message =
      err instanceof EwebinarApiError
        ? err.message
        : "Something went wrong loading data from eWebinar. Please try again.";
    return <ErrorState message={message} backHref="/" />;
  }

  const webinar = webinars.find((w) => Number(w.id) === webinarId);
  const registrants = filterByRange(allRegistrants, range).filter((r) => r.webinarId === webinarId);

  if (!webinar && registrants.length === 0) {
    notFound();
  }

  const kpis = computeKpis(registrants);
  const previousWindow = filterByPreviousRange(allRegistrants, range)?.filter(
    (r) => r.webinarId === webinarId
  );
  const previousKpis = previousWindow ? computeKpis(previousWindow) : null;
  const periodLabel = PERIOD_LABEL[range];
  const daily = groupByDay(registrants);
  const byState = groupByState(registrants);
  const title = webinar?.title ?? registrants[0]?.webinarTitle ?? `Webinar ${id}`;

  return (
    <div className="mx-auto min-w-0 max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center gap-3">
        <Logo />
        <div>
          <Link href="/" className="text-xs font-medium text-text-secondary hover:text-text-primary">
            &larr; Back to dashboard
          </Link>
          <h1 className="text-xl font-semibold text-text-primary mt-1">{title}</h1>
          {webinar && (
            <p className="text-sm text-text-secondary mt-0.5">
              Hosted by {webinar.moderator.name} &middot; {formatDuration(webinar.durationSecs)}
            </p>
          )}
        </div>
      </div>

      <RangeFilter active={range} basePath={`/webinar/${id}`} />

      <KpiCards kpis={kpis} previousKpis={previousKpis} periodLabel={periodLabel} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RegistrantsTrendChart data={daily} />
        </div>
        <AttendanceStateChart data={byState} />
      </div>

      <RegistrantsTable registrants={registrants} showWebinarColumn={false} />
    </div>
  );
}
