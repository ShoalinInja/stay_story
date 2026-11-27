import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.ComponentProps<"input"> & {
  /** Required: wires label, hint and error together. */
  id: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  /** Error message; sets aria-invalid and links via aria-describedby. */
  error?: React.ReactNode;
  wrapperClassName?: string;
};

export const inputClass =
  "h-11 w-full rounded-input border border-line bg-surface px-3 type-body text-ink placeholder:text-muted-text hover:border-ink-2 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:opacity-60 aria-invalid:border-destructive focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring";

export function Input({ id, label, hint, error, className, wrapperClassName, ...props }: InputProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [props["aria-describedby"], hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <input
        id={id}
        {...props}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={describedBy}
        className={cn(inputClass, className)}
      />
      {hint && (
        <p id={hintId} className="type-meta">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="animate-enter-up text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
