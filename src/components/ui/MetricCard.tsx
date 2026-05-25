import { joinClassNames } from '../wrappers/shared';

type MetricCardProps = {
  className?: string;
  delta?: string;
  label: string;
  measuredAt?: string;
  trend?: string;
  unit?: string;
  value: string;
};

export function MetricCard({
  className,
  delta,
  label,
  measuredAt,
  trend,
  unit,
  value,
}: MetricCardProps) {
  const unitClassName = unit === '%' ? 'text-sm' : 'ml-1 text-sm';

  return (
    <article
      className={joinClassNames(
        'rounded-[var(--radius-lg)] border border-border bg-surface p-4 shadow-[var(--shadow-sm)]',
        className,
      )}
    >
      <p className="text-[13px] font-semibold tracking-normal text-text-muted">
        {label}
      </p>
      <p className="numeric mt-2 text-[30px] font-bold tracking-[-0.03em] text-text">
        {value}
        {unit === undefined || unit === '' ? null : (
          <span
            className={joinClassNames(
              unitClassName,
              'font-semibold text-text-muted',
            )}
          >
            {unit}
          </span>
        )}
      </p>
      {delta === undefined ? null : (
        <p className="mt-2 text-[13px] font-medium text-text-muted">
          {delta}
        </p>
      )}
      {measuredAt === undefined && trend === undefined ? null : (
        <dl className="mt-4 grid gap-1 border-t border-border pt-3 text-[13px]">
          {measuredAt === undefined ? null : (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-text-muted">Last measured</dt>
              <dd className="numeric font-medium text-text">{measuredAt}</dd>
            </div>
          )}
          {trend === undefined ? null : (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-text-muted">Trend</dt>
              <dd className="font-medium text-text">{trend}</dd>
            </div>
          )}
        </dl>
      )}
    </article>
  );
}
