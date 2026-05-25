import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { joinClassNames } from "../wrappers/shared";

type DropdownSelectOption<TValue extends string> = {
  label: ReactNode;
  value: TValue;
};

type DropdownSelectProps<TValue extends string> = {
  label: string;
  options: Array<DropdownSelectOption<TValue>>;
  selectedValue: TValue;
  onSelectedValueChange(selectedValue: TValue): void;
};

export function DropdownSelect<TValue extends string>({
  label,
  options,
  selectedValue,
  onSelectedValueChange,
}: DropdownSelectProps<TValue>) {
  const dropdownId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const onOptionSelect = (value: TValue) => {
    onSelectedValueChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        aria-controls={dropdownId}
        aria-expanded={isOpen}
        className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-border bg-surface px-3.5 py-2 text-sm font-semibold leading-none tracking-normal text-text transition hover:border-border-strong hover:bg-surface-muted"
        onClick={() => {
          setIsOpen((currentIsOpen) => !currentIsOpen);
        }}
        type="button"
      >
        {label}
        <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs text-primary">
          {selectedOption?.label ?? selectedValue}
        </span>
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 z-20 mt-2 flex max-h-80 w-72 flex-col gap-3 overflow-y-auto rounded-lg border border-border bg-surface p-2 shadow-(--shadow-md)"
          id={dropdownId}
          role="listbox"
        >
          {options.map((option) => {
            const selected = option.value === selectedValue;

            return (
              <button
                aria-selected={selected}
                className={joinClassNames(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-text transition hover:bg-surface-muted",
                  selected && "bg-primary-soft text-primary",
                )}
                key={option.value}
                onClick={() => {
                  onOptionSelect(option.value);
                }}
                role="option"
                type="button"
              >
                <span>{option.label}</span>
                {selected ? (
                  <span className="text-xs font-semibold text-primary">
                    Selected
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
