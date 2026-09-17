import type { AttendanceState, Registrant } from "./ewebinar";

export type Range = "7d" | "30d" | "all";

export function filterByRange(registrants: Registrant[], range: Range): Registrant[] {
  if (range === "all") return registrants;
  const days = range === "7d" ? 7 : 30;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return registrants.filter((r) => new Date(r.registeredTime).getTime() >= cutoff);
}

/** The equal-length window immediately preceding the current range, for comparison. `null` for "all" (no natural prior window). */
export function filterByPreviousRange(registrants: Registrant[], range: Range): Registrant[] | null {
  if (range === "all") return null;
  const days = range === "7d" ? 7 : 30;
  const now = Date.now();
  const start = now - days * 2 * 24 * 60 * 60 * 1000;
  const end = now - days * 24 * 60 * 60 * 1000;
  return registrants.filter((r) => {
    const t = new Date(r.registeredTime).getTime();
    return t >= start && t < end;
  });
}

/** Percent change from previous to current, or null when previous is 0 (undefined/meaningless change). */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

const ATTENDED_STATES: AttendanceState[] = ["Joined", "Watched"];

export type Kpis = {
  totalRegistrants: number;
  totalAttended: number;
  showUpRate: number;
  avgWatchPercent: number;
  activeWebinars: number;
};

export function computeKpis(registrants: Registrant[]): Kpis {
  const totalRegistrants = registrants.length;
  const attended = registrants.filter((r) => ATTENDED_STATES.includes(r.state));
  const totalAttended = attended.length;
  const showUpRate = totalRegistrants === 0 ? 0 : (totalAttended / totalRegistrants) * 100;

  const withWatchData = registrants.filter((r) => typeof r.totalWatchedPercent === "number");
  const avgWatchPercent =
    withWatchData.length === 0
      ? 0
      : withWatchData.reduce((sum, r) => sum + (r.totalWatchedPercent ?? 0), 0) / withWatchData.length;

  const activeWebinars = new Set(registrants.map((r) => r.webinarId)).size;

  return { totalRegistrants, totalAttended, showUpRate, avgWatchPercent, activeWebinars };
}

export type DayCount = { date: string; registrants: number };

export function groupByDay(registrants: Registrant[]): DayCount[] {
  const counts = new Map<string, number>();
  for (const r of registrants) {
    const day = r.registeredTime.slice(0, 10); // YYYY-MM-DD
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, registrants: count }));
}

export type WebinarRow = {
  webinarId: number;
  webinarTitle: string;
  registrants: number;
  attended: number;
  showUpRate: number;
  avgWatchPercent: number;
};

export function groupByWebinar(registrants: Registrant[]): WebinarRow[] {
  const byWebinar = new Map<number, Registrant[]>();
  for (const r of registrants) {
    const list = byWebinar.get(r.webinarId) ?? [];
    list.push(r);
    byWebinar.set(r.webinarId, list);
  }

  return [...byWebinar.entries()]
    .map(([webinarId, list]) => {
      const kpis = computeKpis(list);
      return {
        webinarId,
        webinarTitle: list[0]?.webinarTitle ?? `Webinar ${webinarId}`,
        registrants: kpis.totalRegistrants,
        attended: kpis.totalAttended,
        showUpRate: kpis.showUpRate,
        avgWatchPercent: kpis.avgWatchPercent,
      };
    })
    .sort((a, b) => b.registrants - a.registrants);
}

const STATE_ORDER: AttendanceState[] = ["Watched", "Joined", "NotJoined", "Missed"];

export type StateCount = { state: AttendanceState; count: number; percent: number };

export function groupByState(registrants: Registrant[]): StateCount[] {
  const total = registrants.length;
  const counts = new Map<AttendanceState, number>();
  for (const r of registrants) {
    counts.set(r.state, (counts.get(r.state) ?? 0) + 1);
  }
  return STATE_ORDER.filter((state) => counts.has(state)).map((state) => {
    const count = counts.get(state) ?? 0;
    return { state, count, percent: total === 0 ? 0 : (count / total) * 100 };
  });
}

export type SourceCount = { source: string; count: number };

export function groupByUtmSource(registrants: Registrant[]): SourceCount[] {
  const counts = new Map<string, number>();
  for (const r of registrants) {
    const source = r.utm_source?.trim() || "Direct / Unknown";
    counts.set(source, (counts.get(source) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
}
