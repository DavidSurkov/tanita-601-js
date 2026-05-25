import type { ElementType } from 'react';
import { joinClassNames } from './shared';
import type { WrapperProps } from './shared';

type HeadingSize = 'sm' | 'md' | 'lg';

type HeadingProps<TElement extends ElementType = 'h2'> =
  WrapperProps<TElement> & {
    size?: HeadingSize;
  };

const sizeClassNames: Record<HeadingSize, string> = {
  sm: 'text-lg font-semibold',
  md: 'text-xl font-bold',
  lg: 'text-2xl font-bold',
};

export function Heading<TElement extends ElementType = 'h2'>({
  as,
  children,
  className,
  size = 'md',
}: HeadingProps<TElement>) {
  const Component = as ?? 'h2';

  return (
    <Component
      className={joinClassNames(sizeClassNames[size], 'text-text', className)}
    >
      {children}
    </Component>
  );
}
