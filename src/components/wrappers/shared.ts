import type { ElementType, ReactNode } from 'react';

export type WrapperProps<TElement extends ElementType> = {
  as?: TElement;
  children?: ReactNode;
  className?: string;
};

export function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(' ');
}
