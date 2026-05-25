import type { ElementType } from 'react';
import { joinClassNames } from './shared';
import type { WrapperProps } from './shared';

type InlineGap = 'none' | 'xs' | 'sm' | 'md' | 'lg';
type InlineAlign = 'start' | 'center' | 'end' | 'stretch';
type InlineJustify = 'start' | 'center' | 'end' | 'between';
type InlineWrap = 'wrap' | 'nowrap';

type InlineProps<TElement extends ElementType = 'div'> =
  WrapperProps<TElement> & {
    align?: InlineAlign;
    gap?: InlineGap;
    justify?: InlineJustify;
    wrap?: InlineWrap;
  };

const alignClassNames: Record<InlineAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const gapClassNames: Record<InlineGap, string> = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
};

const justifyClassNames: Record<InlineJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};

const wrapClassNames: Record<InlineWrap, string> = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap',
};

export function Inline<TElement extends ElementType = 'div'>({
  align = 'center',
  as,
  children,
  className,
  gap = 'sm',
  justify = 'start',
  wrap = 'wrap',
}: InlineProps<TElement>) {
  const Component = as ?? 'div';

  return (
    <Component
      className={joinClassNames(
        'flex flex-row',
        alignClassNames[align],
        gapClassNames[gap],
        justifyClassNames[justify],
        wrapClassNames[wrap],
        className,
      )}
    >
      {children}
    </Component>
  );
}
