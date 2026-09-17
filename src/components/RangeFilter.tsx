import Link from "next/link";
import type { Range } from "@/lib/metrics";

const OPTIONS: { value: Range; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "all", label: "All time" },
];

export function RangeFilter({ active }: { active: Range }) {
  return (
    <div className="inline-flex items-center rounded-lg bg-page-plane ring-1 ring-[var(--border-hairline)] p-1">
      {OPTIONS.map((opt) => {
        const isActive = opt.value === active;
        return (
          <Link
            key={opt.value}
            href={`/?range=${opt.value}`}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? "bg-surface-1 text-text-primary shadow-sm ring-1 ring-[var(--border-hairline)]"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}
