import type { ElementType } from 'react';
import { joinClassNames } from './shared';
import type { WrapperProps } from './shared';

type ContainerSize = 'sm' | 'md' | 'lg';

type ContainerProps<TElement extends ElementType = 'div'> =
  WrapperProps<TElement> & {
    size?: ContainerSize;
  };

const sizeClassNames: Record<ContainerSize, string> = {
  sm: 'max-w-xl',
  md: 'max-w-3xl',
  lg: 'max-w-[1280px]',
};

export function Container<TElement extends ElementType = 'div'>({
  as,
  children,
  className,
  size = 'md',
}: ContainerProps<TElement>) {
  const Component = as ?? 'div';

  return (
    <Component
      className={joinClassNames(
        'mx-auto w-full',
        sizeClassNames[size],
        className,
      )}
    >
      {children}
    </Component>
  );
}
