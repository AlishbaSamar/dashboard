import type { ReactNode } from "react";

export function Card({
  title,
  subtitle,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl bg-surface-1 ring-1 ring-[var(--border-hairline)] p-5 ${className}`}
    >
      {title && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
          {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
