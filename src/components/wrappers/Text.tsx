import type { ElementType } from 'react';
import { joinClassNames } from './shared';
import type { WrapperProps } from './shared';

type TextTone = 'default' | 'muted' | 'accent';
type TextSize = 'sm' | 'md' | 'lg';

type TextProps<TElement extends ElementType = 'p'> =
  WrapperProps<TElement> & {
    size?: TextSize;
    tone?: TextTone;
  };

const sizeClassNames: Record<TextSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg leading-8',
};

const toneClassNames: Record<TextTone, string> = {
  default: 'text-text',
  muted: 'text-text-muted',
  accent: 'text-primary',
};

export function Text<TElement extends ElementType = 'p'>({
  as,
  children,
  className,
  size = 'md',
  tone = 'default',
}: TextProps<TElement>) {
  const Component = as ?? 'p';

  return (
    <Component
      className={joinClassNames(
        sizeClassNames[size],
        toneClassNames[tone],
        className,
      )}
    >
      {children}
    </Component>
  );
}
