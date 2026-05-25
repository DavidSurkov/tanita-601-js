import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { joinClassNames } from '../wrappers/shared';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    'border-primary-hover bg-primary text-text-inverted hover:bg-primary-hover active:bg-primary-active',
  secondary:
    'border-border bg-surface text-text hover:border-border-strong hover:bg-surface-muted',
  ghost:
    'border-transparent bg-transparent text-primary hover:bg-primary-soft',
};

export function Button({
  children,
  className,
  type = 'button',
  variant = 'secondary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={joinClassNames(
        'inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-[10px] border px-3.5 py-2 text-sm font-semibold leading-none tracking-normal transition duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0',
        variantClassNames[variant],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
