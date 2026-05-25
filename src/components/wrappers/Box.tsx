import type { ElementType } from 'react';
import { joinClassNames } from './shared';
import type { WrapperProps } from './shared';

type BoxProps<TElement extends ElementType = 'div'> =
  WrapperProps<TElement>;

export function Box<TElement extends ElementType = 'div'>({
  as,
  children,
  className,
}: BoxProps<TElement>) {
  const Component = as ?? 'div';

  return <Component className={className}>{children}</Component>;
}

export function Surface<TElement extends ElementType = 'div'>({
  as,
  children,
  className,
}: BoxProps<TElement>) {
  const Component = as ?? 'div';

  return (
    <Component
      className={joinClassNames(
        'rounded-[var(--radius-lg)] border border-border bg-surface shadow-sm',
        className,
      )}
    >
      {children}
    </Component>
  );
}
