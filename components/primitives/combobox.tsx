"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClass } from "./input";

export type ComboboxOption = { value: string; label: string; group?: string };

export type ComboboxProps = {
  id: string;
  label: string;
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  emptyText?: string;
  /** Hidden input name so a plain <form> posts the selected value. */
  name?: string;
  error?: string;
  disabled?: boolean;
  /** Visually hide the label (it stays as the accessible name). */
  hideLabel?: boolean;
  className?: string;
};

/**
 * ARIA 1.2 combobox with list autocomplete: type to filter, ↑/↓ to move, Enter to pick,
 * Esc to close (or clear when closed), Alt+↓ opens. Grouped options get a visual header.
 */
export function Combobox({
  id,
  label,
  options,
  value,
  defaultValue = null,
  onValueChange,
  placeholder,
  emptyText = "No matches",
  name,
  error,
  disabled,
  hideLabel,
  className,
}: ComboboxProps) {
  const [inner, setInner] = React.useState<string | null>(defaultValue);
  const selectedValue = value !== undefined ? value : inner;
  const selected = options.find((o) => o.value === selectedValue) ?? null;
  const [query, setQuery] = React.useState<string | null>(null); // null = show selected label
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const listRef = React.useRef<HTMLUListElement>(null);

  const listId = `${id}-listbox`;
  const errorId = `${id}-error`;
  const text = query ?? selected?.label ?? "";
  const q = (query ?? "").trim().toLowerCase();
  const filtered = q
    ? options.filter((o) => o.label.toLowerCase().includes(q) || o.group?.toLowerCase().includes(q))
    : options;

  const commit = (opt: ComboboxOption | null) => {
    if (value === undefined) setInner(opt?.value ?? null);
    onValueChange?.(opt?.value ?? null);
    setQuery(null);
    setOpen(false);
    setActive(-1);
  };

  const move = (to: number) => {
    if (!filtered.length) return;
    const i = (to + filtered.length) % filtered.length;
    setActive(i);
    listRef.current?.querySelector(`#${CSS.escape(`${id}-opt-${i}`)}`)?.scrollIntoView({ block: "nearest" });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) setOpen(true);
        if (!e.altKey) move(active + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) setOpen(true);
        move(active - 1);
        break;
      case "Enter":
        if (open && active >= 0 && filtered[active]) {
          e.preventDefault();
          commit(filtered[active]);
        }
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
          setQuery(null);
          setActive(-1);
        } else if (selected) {
          e.preventDefault();
          commit(null);
        }
        break;
      case "Tab":
        setOpen(false);
        setQuery(null);
        break;
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className={cn("text-sm font-semibold text-ink", hideLabel && "sr-only")}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && active >= 0 ? `${id}-opt-${active}` : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          disabled={disabled}
          placeholder={placeholder}
          value={text}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            setOpen(false);
            setQuery(null);
          }}
          className={cn(inputClass, "pr-10")}
        />
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-text" />
        {name && <input type="hidden" name={name} value={selected?.value ?? ""} />}
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          hidden={!open}
          className="absolute inset-x-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-input border border-line-soft bg-surface p-1 shadow-card-hover"
        >
          {filtered.length === 0 && <li className="px-3 py-2.5 type-meta">{emptyText}</li>}
          {filtered.map((o, i) => {
            const header = o.group && o.group !== filtered[i - 1]?.group ? o.group : null;
            const isSelected = o.value === selected?.value;
            return (
              <React.Fragment key={o.value}>
                {header && (
                  <li role="presentation" className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-muted-text uppercase">
                    {header}
                  </li>
                )}
                <li
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => commit(o)}
                  onMouseMove={() => setActive(i)}
                  className={cn(
                    "flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-md px-3 text-sm text-ink",
                    i === active && "bg-brand-tint",
                  )}
                >
                  {o.label}
                  {isSelected && <Check aria-hidden className="size-4" />}
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </div>
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
