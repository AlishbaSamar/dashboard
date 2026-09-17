"use client";

import { useMemo, useState } from "react";
import type { AttendanceState, Registrant } from "@/lib/ewebinar";
import { Card } from "./Card";

const STATE_LABEL: Record<AttendanceState, string> = {
  Watched: "Watched",
  Joined: "Joined (live)",
  NotJoined: "Didn't join",
  Missed: "Missed",
};

const PAGE_SIZE = 15;

type SortKey = "name" | "registeredTime" | "totalWatchedPercent";
type SortDir = "asc" | "desc";

function registrantName(r: Registrant): string {
  const name = r.name?.trim() || [r.firstName, r.lastName].filter(Boolean).join(" ").trim();
  return name || "(no name)";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function csvCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadRegistrantsCsv(registrants: Registrant[], showWebinarColumn: boolean) {
  const headers = ["Name", "Email", ...(showWebinarColumn ? ["Webinar"] : []), "Registered", "State", "Watched %"];
  const rows = registrants.map((r) => [
    registrantName(r),
    r.email,
    ...(showWebinarColumn ? [r.webinarTitle] : []),
    r.registeredTime,
    STATE_LABEL[r.state] ?? r.state,
    typeof r.totalWatchedPercent === "number" ? String(r.totalWatchedPercent) : "",
  ]);
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "registrants.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function SortButton({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 font-medium hover:text-text-primary"
    >
      {label}
      {active && <span className="text-text-muted">{dir === "asc" ? "↑" : "↓"}</span>}
    </button>
  );
}

export function RegistrantsTable({
  registrants,
  showWebinarColumn = true,
}: {
  registrants: Registrant[];
  showWebinarColumn?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("registeredTime");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return registrants;
    return registrants.filter(
      (r) => registrantName(r).toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
    );
  }, [registrants, query]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") {
        cmp = registrantName(a).localeCompare(registrantName(b));
      } else if (sortKey === "registeredTime") {
        cmp = new Date(a.registeredTime).getTime() - new Date(b.registeredTime).getTime();
      } else {
        cmp = (a.totalWatchedPercent ?? -1) - (b.totalWatchedPercent ?? -1);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [filtered, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pageRows = sorted.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
    setPage(0);
  }

  return (
    <Card title="Registrants" subtitle={`${registrants.length} people in this period`} className="overflow-x-auto">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          placeholder="Search by name or email"
          className="w-full sm:max-w-sm rounded-md ring-1 ring-[var(--border-hairline)] bg-page-plane px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-[var(--series-1)]"
        />
        <button
          type="button"
          onClick={() => downloadRegistrantsCsv(sorted, showWebinarColumn)}
          disabled={sorted.length === 0}
          className="inline-flex items-center gap-1.5 rounded-md ring-1 ring-[var(--border-hairline)] px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-page-plane transition-colors disabled:opacity-40"
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v12" />
            <path d="M7 10l5 5 5-5" />
            <path d="M4 19h16" />
          </svg>
          Export CSV
        </button>
      </div>

      {pageRows.length === 0 ? (
        <p className="text-sm text-text-muted py-10 text-center">No registrants match.</p>
      ) : (
        <>
          <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="text-left text-xs text-text-muted border-b border-[var(--gridline)]">
                <th className="py-2 pr-4">
                  <SortButton
                    label="Name"
                    active={sortKey === "name"}
                    dir={sortDir}
                    onClick={() => toggleSort("name")}
                  />
                </th>
                <th className="py-2 pr-4 font-medium">Email</th>
                {showWebinarColumn && <th className="py-2 pr-4 font-medium">Webinar</th>}
                <th className="py-2 pr-4">
                  <SortButton
                    label="Registered"
                    active={sortKey === "registeredTime"}
                    dir={sortDir}
                    onClick={() => toggleSort("registeredTime")}
                  />
                </th>
                <th className="py-2 pr-4 font-medium">State</th>
                <th className="py-2 text-right">
                  <SortButton
                    label="Watched %"
                    active={sortKey === "totalWatchedPercent"}
                    dir={sortDir}
                    onClick={() => toggleSort("totalWatchedPercent")}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r) => (
                <tr key={r.id} className="border-b border-[var(--gridline)] last:border-0">
                  <td className="py-2.5 pr-4 text-text-primary">{registrantName(r)}</td>
                  <td className="py-2.5 pr-4 text-text-secondary">{r.email}</td>
                  {showWebinarColumn && (
                    <td className="py-2.5 pr-4 text-text-secondary">{r.webinarTitle}</td>
                  )}
                  <td className="py-2.5 pr-4 tabular-nums text-text-secondary">
                    {formatDate(r.registeredTime)}
                  </td>
                  <td className="py-2.5 pr-4 text-text-secondary">{STATE_LABEL[r.state] ?? r.state}</td>
                  <td className="py-2.5 text-right tabular-nums text-text-primary">
                    {typeof r.totalWatchedPercent === "number" ? `${r.totalWatchedPercent}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
            <span>
              Page {currentPage + 1} of {pageCount} &middot; {sorted.length} results
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="rounded-md ring-1 ring-[var(--border-hairline)] px-2.5 py-1 disabled:opacity-40 hover:text-text-primary"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={currentPage >= pageCount - 1}
                className="rounded-md ring-1 ring-[var(--border-hairline)] px-2.5 py-1 disabled:opacity-40 hover:text-text-primary"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
