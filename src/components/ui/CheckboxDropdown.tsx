import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { joinClassNames } from "../wrappers/shared";
import { fallbackInCaseOfSymbol } from "../../helpers/uuid";

type ObjKey = string | number | symbol;

type CheckboxDropdownOption<TValue extends ObjKey> = {
  label: ReactNode;
  value: TValue;
};

type CheckboxDropdownProps<TValue extends ObjKey> = {
  label: string;
  options: Array<CheckboxDropdownOption<TValue>>;
  selectedValues: TValue[];
  onSelectedValuesChange(selectedValues: TValue[]): void;
};

export function CheckboxDropdown<TValue extends ObjKey>({
  label,
  options,
  selectedValues,
  onSelectedValuesChange,
}: CheckboxDropdownProps<TValue>) {
  const dropdownId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

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

  const onOptionChange = (value: TValue, checked: boolean) => {
    if (checked) {
      onSelectedValuesChange([...selectedValues, value]);
      return;
    }

    onSelectedValuesChange(
      selectedValues.filter((selectedValue) => selectedValue !== value),
    );
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
        <span className="numeric rounded-full bg-primary-soft px-2 py-0.5 text-xs text-primary">
          {selectedValues.length}
        </span>
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 z-20 mt-2 max-h-80 w-72 overflow-y-auto rounded-lg border border-border bg-surface p-2 shadow-(--shadow-md) flex flex-col gap-3"
          id={dropdownId}
        >
          {options.map((option) => {
            const checked = selectedValues.includes(option.value);

            return (
              <label
                className={joinClassNames(
                  "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-text transition hover:bg-surface-muted",
                  checked && "bg-primary-soft text-primary",
                )}
                key={fallbackInCaseOfSymbol(option.value)}
              >
                <input
                  checked={checked}
                  className="size-4 accent-primary"
                  onChange={(event) => {
                    onOptionChange(option.value, event.currentTarget.checked);
                  }}
                  type="checkbox"
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
