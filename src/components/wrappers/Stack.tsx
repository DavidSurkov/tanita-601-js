import type { ElementType } from 'react';
import { joinClassNames } from './shared';
import type { WrapperProps } from './shared';

type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type StackAlign = 'start' | 'center' | 'end' | 'stretch';
type StackJustify = 'start' | 'center' | 'end' | 'between';

type StackProps<TElement extends ElementType = 'div'> =
  WrapperProps<TElement> & {
    align?: StackAlign;
    gap?: StackGap;
    justify?: StackJustify;
  };

const alignClassNames: Record<StackAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const gapClassNames: Record<StackGap, string> = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
};

const justifyClassNames: Record<StackJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};

export function Stack<TElement extends ElementType = 'div'>({
  align = 'stretch',
  as,
  children,
  className,
  gap = 'md',
  justify = 'start',
}: StackProps<TElement>) {
  const Component = as ?? 'div';

  return (
    <Component
      className={joinClassNames(
        'flex flex-col',
        alignClassNames[align],
        gapClassNames[gap],
        justifyClassNames[justify],
        className,
      )}
    >
      {children}
    </Component>
  );
}
