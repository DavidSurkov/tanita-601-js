import type { ReactNode } from 'react';
import { joinClassNames } from '../wrappers/shared';

type BadgeTone = 'good' | 'warning' | 'danger' | 'info';

type BadgeProps = {
  children: ReactNode;
  className?: string;
  tone?: BadgeTone;
};

const toneClassNames: Record<BadgeTone, string> = {
  good: 'bg-success-soft text-success-text',
  warning: 'bg-warning-soft text-warning-text',
  danger: 'bg-danger-soft text-danger-text',
  info: 'bg-primary-soft text-primary',
};

export function Badge({
  children,
  className,
  tone = 'info',
}: BadgeProps) {
  return (
    <span
      className={joinClassNames(
        'inline-flex w-fit items-center gap-1 self-start rounded-full px-2 py-1 text-xs font-semibold leading-tight tracking-normal',
        toneClassNames[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
